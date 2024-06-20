<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'radix-vue'

defineProps({
    Text: {
        type: String,
        required: true,
    },
})

</script>

<template>
    <TooltipProvider :delayDuration="250">
        <TooltipRoot>
            <TooltipTrigger>
                <slot />
            </TooltipTrigger>
            <TooltipPortal>
                <TooltipContent as-child :side-offset="1">
                    <span class="helper-tooltip">{{ Text }}</span>
                </TooltipContent>
            </TooltipPortal>
        </TooltipRoot>
    </TooltipProvider>
</template>
<style scoped>
.helper-tooltip {
    color: var(--gold);
    background-color: rgba(1, 1, 1);
    border-radius: 0.25rem;
    padding: 0.5rem;
}
</style>