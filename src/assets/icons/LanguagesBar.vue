<script setup>
const props = defineProps({
    width: {
        type: Number,
        required: false,
        default: 75
    }
})
</script>
<template>
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" :width="width" >
        <defs>
            <clipPath id="clip-0">
                <path
                    d="M 316.4151 364.6801 L 316.4151 364.6531 L 316.8363 364.4473 L 316.4151 364.2415 L 316.4151 58.4613 L 246.4638 58.4613 L 246.4638 57.8705 L 175.9151 57.8705 L 175.9151 364.2029 L 175.415 364.4473 L 246.1256 399 L 316.3599 364.6801 L 316.4151 364.6801 Z"
                    style="fill: rgb(7, 252, 101);" class="side right"></path>
            </clipPath>
        </defs>
        <g class="barToClip" style="clip-path: url(#clip-0);">
            <g transform="matrix(1, 0, 0, 1, 116.6098175, 198.23768616)" style="" class="barToAnimate">
                <rect x="59.0787" y="166.332" width="70.5487" height="306.4303" style="fill: #CFCFCF;"
                    class="side left"></rect>
                <rect x="129.0787" y="165.9527" width="70.5" height="306.2188" style="fill: #e4e4e4;"
                    class="side right"></rect>
                <rect x="157.4025" y="62.089" width="78.7013" height="62.089" style="fill: #DADADA;"
                    transform="matrix(0.89846949, 0.43903597, -1.13885876, 0.55650197, 58.57852554, 27.97485161)"
                    class="top"></rect>
            </g>
        </g>
    </svg>
</template>