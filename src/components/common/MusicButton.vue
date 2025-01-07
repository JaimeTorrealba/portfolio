<script setup>
import { useMainStore } from '@/stores'
import MusicOn from '@/assets/icons/MusicOn.vue'
import MusicOff from '@/assets/icons/MusicOff.vue'

const store = useMainStore()

const handleMusic = () => {
    if (store.musicInstance.isPlaying) {
        store.musicInstance.pause()
    } else {
        store.musicInstance.play()
    }
}

</script>
<template>
    <button class="music-button" @click="handleMusic">
        <MusicOn v-if="!store.musicInstance?.isPlaying" />
        <MusicOff v-else />
    </button>
</template>
<style scoped>
.music-button {
    position: fixed;
    top: 1%;
    right: 1%;
    z-index: 100;
    cursor: pointer;
    transform: all 0.3s;
    background-color: #e4e4e4;
    box-shadow: inset 0 0 4px 1.5px rgba(1, 1, 1, 0.5);
    fill: #111;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
}

music-button:hover {
    transform: scale(1.1);
}
</style>