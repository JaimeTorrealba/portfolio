<script setup>
import { useRenderLoop } from '@tresjs/core'
import { Vector4, Color, Matrix4, Vector3 } from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

const props = defineProps(['texture'])

const fireShader = {
    defines: {
        ITERATIONS: '20',
        OCTIVES: '3'
    },
    uniforms: {
        fireTex: { type: 't', value: props.texture },
        color: { type: 'c', value: new Color(0xeeeeee) },
        time: { type: 'f', value: 0.0 },
        seed: { type: 'f', value: Math.random() * 19.19 },
        invModelMatrix: { type: 'm4', value: new Matrix4() },
        scale: { type: 'v3', value: new Vector3(1, 1, 1) },
        noiseScale: { type: 'v4', value: new Vector4(1, 2, 1, 0.3) },
        magnitude: { type: 'f', value: 2.3 },
        lacunarity: { type: 'f', value: 1.0 },
        gain: { type: 'f', value: 1.0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: false
}

const { onLoop } = useRenderLoop()

onLoop(() => {
    fireShader.uniforms.time.value += 0.01
})
</script>
<template>
    <TresMesh :position="[-0.18, -0.5, 0]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresShaderMaterial v-bind="fireShader" />
    </TresMesh>
</template>
