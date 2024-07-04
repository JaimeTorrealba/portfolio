<script setup>

</script>
<template>
        <TresAmbientLight color="#F5EBD4" :intensity="0.025" />
        <TresSpotLight ref="spotLightRef" cast-shadow color="#F5EBD4" :intensity="12" :penumbra="1" :angle="Math.PI * 0.4"
        :decay="1.25" :position="[-4, 10, 4]" />
</template>