<script setup>
import { shallowRef, watch, onUnmounted, reactive, onMounted } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import { PostProcessing } from 'three/webgpu'
import { pass, uniform, uv, mix, vec4, vec2, vec3, dot, fract, sin, time } from 'three/tsl'
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js'
import { usePaneStore } from '@/stores/pane'

const { render } = useLoop()
const { renderer, scene, camera } = useTresContext()

const postProcessing = shallowRef(null)
const focusDistanceUniform = shallowRef(null)
const focalLengthUniform = shallowRef(null)
const bokehScaleUniform = shallowRef(null)
const grainIntensityUniform = shallowRef(null)
const desatAmountUniform = shallowRef(null)
const warmAmountUniform = shallowRef(null)

const grainOptions = reactive({ intensity: 0.075 })
const gradeOptions = reactive({ desaturation: 0.7, warmth: 0.0 })

const dofOptions = reactive({
  focusDistance: 33.0,
  focalLength: 27.0,
  bokehScale: 1.5,
})


onMounted(() => {
  if (!window.location.href.includes('#debug')) return
  const store = usePaneStore()
  const pane = store.pane
  const folder = pane.addFolder({ title: 'Post Processing', expanded: false })
  const dofFolder = folder.addFolder({ title: 'Depth Of Field' })
  dofFolder.addBinding(dofOptions, 'focusDistance', { min: 1, max: 100, step: 0.5 })
  dofFolder.addBinding(dofOptions, 'focalLength', { min: 0.1, max: 50, step: 0.1 })
  dofFolder.addBinding(dofOptions, 'bokehScale', { min: 0, max: 5, step: 0.05 })
  const grainFolder = folder.addFolder({ title: 'Film Grain' })
  grainFolder.addBinding(grainOptions, 'intensity', { min: 0, max: 0.3, step: 0.005 })
  const gradeFolder = folder.addFolder({ title: 'Color Grade' })
  gradeFolder.addBinding(gradeOptions, 'desaturation', { min: 0, max: 1, step: 0.01 })
  gradeFolder.addBinding(gradeOptions, 'warmth', { min: 0, max: 0.1, step: 0.001 })
})

const setupPostProcessing = () => {
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
  const warmAmount = uniform(gradeOptions.warmth)

  const viewZ = scenePass.getViewZNode()
  const dofPass = dof(sceneColor, viewZ, focusDistance, focalLength, bokehScale)

  // Color grading: mild desaturation + warm tint
  const luma = dot(dofPass.rgb, vec3(0.299, 0.587, 0.114))
  const desaturated = mix(dofPass.rgb, vec3(luma), desatAmount)
  const warmTint = vec3(warmAmount, 0.0, warmAmount.negate().mul(0.5))
  const graded = vec4(desaturated.add(warmTint), dofPass.a)

  // Film grain: animated hash noise centered on 0
  const grainTime = time
  const grainSeed = uv().add(fract(grainTime))
  const grain = fract(sin(dot(grainSeed, vec2(12.9898, 78.233))).mul(43758.5453)).sub(0.5)
  const grained = vec4(graded.rgb.add(grain.mul(grainIntensity)), graded.a)

  postProcessingInstance.outputNode = grained
  postProcessingInstance.needsUpdate = true

  postProcessing.value = postProcessingInstance
  focusDistanceUniform.value = focusDistance
  focalLengthUniform.value = focalLength
  bokehScaleUniform.value = bokehScale
  grainIntensityUniform.value = grainIntensity
  desatAmountUniform.value = desatAmount
  warmAmountUniform.value = warmAmount
}

watch(
  () => renderer.isInitialized.value,
  (isReady) => {
    if (isReady) setupPostProcessing()
  },
  { immediate: true }
)

watch(
  () => camera.activeCamera.value,
  (activeCamera) => {
    if (activeCamera) setupPostProcessing()
  }
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
  () => [gradeOptions.desaturation, gradeOptions.warmth],
  ([desat, warmth]) => {
    if (desatAmountUniform.value) desatAmountUniform.value.value = desat
    if (warmAmountUniform.value) warmAmountUniform.value.value = warmth
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