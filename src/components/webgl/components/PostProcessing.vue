<script setup>
import { shallowRef, ref, watch, onUnmounted, reactive, onMounted } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import { PostProcessing } from 'three/webgpu'
import { pass, uniform, uv, mix, vec4, vec2, vec3, dot, fract, sin, time } from 'three/tsl'
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js'
import { usePaneStore } from '@/stores/pane'
import { useMainStore } from '@/stores'

const { render } = useLoop()
const { renderer, scene, camera } = useTresContext()

const mainStore = useMainStore()
const gpuTier = ref(null)
const postProcessing = shallowRef(null)
const focusDistanceUniform = shallowRef(null)
const focalLengthUniform = shallowRef(null)
const bokehScaleUniform = shallowRef(null)
const grainIntensityUniform = shallowRef(null)
const desatAmountUniform = shallowRef(null)

const grainOptions = reactive({ enabled: true, intensity: 0.025 })
const gradeOptions = reactive({ enabled: true, desaturation: 0.7 })

const dofOptions = reactive({
  enabled: true,
  focusDistance: 33.0,
  focalLength: 27.0,
  bokehScale: 1.5,
})


onMounted(async () => {
  if (window.location.href.includes('#debug')) {
    const store = usePaneStore()
    const pane = store.pane
    const folder = pane.addFolder({ title: 'Post Processing', expanded: false })
    const dofFolder = folder.addFolder({ title: 'Depth Of Field' })
    dofFolder.addBinding(dofOptions, 'enabled', { label: 'enabled' })
    dofFolder.addBinding(dofOptions, 'focusDistance', { min: 1, max: 100, step: 0.5 })
    dofFolder.addBinding(dofOptions, 'focalLength', { min: 0.1, max: 50, step: 0.1 })
    dofFolder.addBinding(dofOptions, 'bokehScale', { min: 0, max: 5, step: 0.05 })
    const grainFolder = folder.addFolder({ title: 'Film Grain' })
    grainFolder.addBinding(grainOptions, 'enabled', { label: 'enabled' })
    grainFolder.addBinding(grainOptions, 'intensity', { min: 0, max: 0.3, step: 0.005 })
    const gradeFolder = folder.addFolder({ title: 'Color Grade' })
    gradeFolder.addBinding(gradeOptions, 'enabled', { label: 'enabled' })
    gradeFolder.addBinding(gradeOptions, 'desaturation', { min: 0, max: 1, step: 0.01 })
  }

  const result = await mainStore.resolveGPUTier()
  const tier = result.tier

  if (tier <= 0) {
    dofOptions.enabled = false
    grainOptions.enabled = false
    gradeOptions.enabled = false
  } else if (tier <= 2) {
    dofOptions.enabled = false
    grainOptions.enabled = false
    gradeOptions.enabled = true
  } else if (tier === 3) {
    dofOptions.enabled = true
    grainOptions.enabled = false
    gradeOptions.enabled = true
  } else {
    dofOptions.enabled = true
    grainOptions.enabled = true
    gradeOptions.enabled = true
  }

  gpuTier.value = tier

  if (renderer.isInitialized.value && camera.activeCamera.value) {
    setupPostProcessing()
  }
})

const setupPostProcessing = () => {
  if (gpuTier.value === null) return
  if (gpuTier.value <= 0) {
    if (postProcessing.value?.dispose) postProcessing.value.dispose()
    postProcessing.value = null
    return
  }
  if (!renderer.isInitialized.value || !camera.activeCamera.value) return

  if (postProcessing.value?.dispose) {
    postProcessing.value.dispose()
  }

  const postProcessingInstance = new PostProcessing(renderer.instance)
  const scenePass = pass(scene.value, camera.activeCamera.value)
  const sceneColor = scenePass.getTextureNode('output')

  const focusDistance = uniform(dofOptions.focusDistance)
  const focalLength = uniform(dofOptions.focalLength)
  const bokehScale = uniform(dofOptions.bokehScale)

  const grainIntensity = uniform(grainOptions.intensity)
  const desatAmount = uniform(gradeOptions.desaturation)

  const viewZ = scenePass.getViewZNode()
  const afterDof = dofOptions.enabled
    ? dof(sceneColor, viewZ, focusDistance, focalLength, bokehScale)
    : sceneColor

  // Color grading: mild desaturation
  const luma = dot(afterDof.rgb, vec3(0.299, 0.587, 0.114))
  const desaturated = mix(afterDof.rgb, vec3(luma), desatAmount)
  const afterGrade = gradeOptions.enabled ? vec4(desaturated, afterDof.a) : afterDof

  // Film grain: animated hash noise centered on 0
  const grainSeed = uv().add(fract(time))
  const grain = fract(sin(dot(grainSeed, vec2(12.9898, 78.233))).mul(43758.5453)).sub(0.5)
  const afterGrain = grainOptions.enabled
    ? vec4(afterGrade.rgb.add(grain.mul(grainIntensity)), afterGrade.a)
    : afterGrade

  postProcessingInstance.outputNode = afterGrain
  postProcessingInstance.needsUpdate = true

  postProcessing.value = postProcessingInstance
  focusDistanceUniform.value = focusDistance
  focalLengthUniform.value = focalLength
  bokehScaleUniform.value = bokehScale
  grainIntensityUniform.value = grainIntensity
  desatAmountUniform.value = desatAmount
}

watch(
  () => renderer.isInitialized.value,
  (isReady) => {
    if (isReady && gpuTier.value !== null) setupPostProcessing()
  },
  { immediate: true }
)

watch(
  () => camera.activeCamera.value,
  (activeCamera) => {
    if (activeCamera && gpuTier.value !== null) setupPostProcessing()
  }
)

watch(
  () => [dofOptions.enabled, grainOptions.enabled, gradeOptions.enabled],
  () => setupPostProcessing()
)

watch(
  () => [dofOptions.focusDistance, dofOptions.focalLength, dofOptions.bokehScale],
  ([focusDistance, focalLength, bokehScale]) => {
    if (focusDistanceUniform.value) focusDistanceUniform.value.value = focusDistance
    if (focalLengthUniform.value) focalLengthUniform.value.value = focalLength
    if (bokehScaleUniform.value) bokehScaleUniform.value.value = bokehScale
    if (postProcessing.value) postProcessing.value.needsUpdate = true
  }
)

watch(
  () => grainOptions.intensity,
  (intensity) => {
    if (grainIntensityUniform.value) grainIntensityUniform.value.value = intensity
    if (postProcessing.value) postProcessing.value.needsUpdate = true
  }
)

watch(
  () => gradeOptions.desaturation,
  (desat) => {
    if (desatAmountUniform.value) desatAmountUniform.value.value = desat
    if (postProcessing.value) postProcessing.value.needsUpdate = true
  }
)

onUnmounted(() => {
  if (postProcessing.value?.dispose) {
    postProcessing.value.dispose()
  }
})

// Take over the render loop with custom logic
render((notifySuccess) => {
  if (camera.activeCamera.value) {
    if (postProcessing.value) {
      postProcessing.value.render()
    } else {
      renderer.instance.render(scene.value, camera.activeCamera.value)
    }

    // IMPORTANT: Call notifySuccess() to indicate the frame was rendered successfully
    notifySuccess()
  }
})

</script>
<template>
   <TresGroup />
</template>