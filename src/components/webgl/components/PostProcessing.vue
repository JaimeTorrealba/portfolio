<script setup>
import { shallowRef, watch, onUnmounted, reactive, onMounted } from 'vue'
import { useLoop, useTresContext } from '@tresjs/core'
import { PostProcessing } from 'three/webgpu'
import { pass, uniform, uv, length, smoothstep, mix, vec4 } from 'three/tsl'
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js'
import { usePaneStore } from '@/stores/pane'

const { render } = useLoop()
const { renderer, scene, camera } = useTresContext()
const store = usePaneStore()

const postProcessing = shallowRef(null)
const focusDistanceUniform = shallowRef(null)
const focalLengthUniform = shallowRef(null)
const bokehScaleUniform = shallowRef(null)
const vignetteOffsetUniform = shallowRef(null)
const vignetteSoftnessUniform = shallowRef(null)
const vignetteDarknessUniform = shallowRef(null)

const dofOptions = reactive({
  focusDistance: 33.0,
  focalLength: 27.0,
  bokehScale: 1.5,
})

const vignetteOptions = reactive({
  offset: 0.45,
  softness: 0.25,
  darkness: 1.0,
})

onMounted(() => {
  if (!window.location.href.includes('#debug')) return
  const pane = store.pane
  const folder = pane.addFolder({ title: 'Post Processing', expanded: false })
  const dofFolder = folder.addFolder({ title: 'Depth Of Field' })
  dofFolder.addBinding(dofOptions, 'focusDistance', { min: 1, max: 100, step: 0.5 })
  dofFolder.addBinding(dofOptions, 'focalLength', { min: 0.1, max: 50, step: 0.1 })
  dofFolder.addBinding(dofOptions, 'bokehScale', { min: 0, max: 5, step: 0.05 })
  const vignetteFolder = folder.addFolder({ title: 'Vignette' })
  vignetteFolder.addBinding(vignetteOptions, 'offset', { min: 0, max: 1, step: 0.01 })
  vignetteFolder.addBinding(vignetteOptions, 'softness', { min: 0, max: 1, step: 0.01 })
  vignetteFolder.addBinding(vignetteOptions, 'darkness', { min: 0, max: 1, step: 0.01 })
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

  const vignetteOffset = uniform(vignetteOptions.offset)
  const vignetteSoftness = uniform(vignetteOptions.softness)
  const vignetteDarkness = uniform(vignetteOptions.darkness)

  const viewZ = scenePass.getViewZNode()
  const dofPass = dof(sceneColor, viewZ, focusDistance, focalLength, bokehScale)

  const dist = length(uv().sub(0.5))
  const vignette = smoothstep(vignetteOffset, vignetteOffset.add(vignetteSoftness), dist)
  const vignetteStrength = vignette.mul(vignetteDarkness)

  postProcessingInstance.outputNode = mix(dofPass, vec4(0, 0, 0, 1), vignetteStrength)
  postProcessingInstance.needsUpdate = true

  postProcessing.value = postProcessingInstance
  focusDistanceUniform.value = focusDistance
  focalLengthUniform.value = focalLength
  bokehScaleUniform.value = bokehScale
  vignetteOffsetUniform.value = vignetteOffset
  vignetteSoftnessUniform.value = vignetteSoftness
  vignetteDarknessUniform.value = vignetteDarkness
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
  () => [vignetteOptions.offset, vignetteOptions.softness, vignetteOptions.darkness],
  ([offset, softness, darkness]) => {
    if (vignetteOffsetUniform.value) vignetteOffsetUniform.value.value = offset
    if (vignetteSoftnessUniform.value) vignetteSoftnessUniform.value.value = softness
    if (vignetteDarknessUniform.value) vignetteDarknessUniform.value.value = darkness
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