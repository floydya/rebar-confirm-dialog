<template>
    <div
        class="pointer-events-none flex h-screen w-screen flex-col items-center justify-end p-4"
        :class="confirmDialogOptions && 'bg-gradient-to-t from-slate-900/75 to-transparent'"
    >
        <Transition name="confirmAppear" appear>
            <div v-if="confirmDialogOptions">
                <div class="flex items-center justify-center text-white">
                    <div class="flex flex-col gap-4 p-4">
                        <div class="flex flex-col gap-0.5">
                            <div class="text-xl font-semibold">{{ confirmDialogOptions.title }}</div>
                            <div class="text-base">{{ confirmDialogOptions.message }}</div>
                            <div class="relative h-1 w-full bg-slate-900">
                                <div
                                    class="absolute bottom-0 left-0 right-0 top-0 h-full bg-slate-200 transition-all"
                                    :style="`width: ${progressBarWidth}`"
                                ></div>
                            </div>
                        </div>
                        <div class="flex gap-8">
                            <div class="flex items-center gap-4">
                                <button class="rounded-lg bg-white px-4 py-2 text-black shadow-lg">Y</button>
                                <span>Accept</span>
                            </div>
                            <div class="flex items-center gap-4">
                                <button class="rounded-lg bg-white px-4 py-2 text-black shadow-lg">N</button>
                                <span>Decline</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEvents } from '@Composables/useEvents';
import { ConfirmDialog, ConfirmDialogEvents } from '../shared';

const events = useEvents();
const confirmDialogOptions = ref<ConfirmDialog | null>(null);
const interval = ref<NodeJS.Timeout | null>(null);
const timeLeft = ref<number>(0);
onMounted(() => {
    events.on(ConfirmDialogEvents.toWebview.create, (options: ConfirmDialog) => {
        confirmDialogOptions.value = options;
        timeLeft.value = options.showTime as number;
        interval.value = setInterval(() => {
            timeLeft.value -= 50;
            if (timeLeft.value <= 0 && interval.value) {
                clearInterval(interval.value as NodeJS.Timeout);
            }
        }, 50);
    });

    events.on(ConfirmDialogEvents.toWebview.destroy, () => {
        confirmDialogOptions.value = null;
        if (interval.value) clearInterval(interval.value as NodeJS.Timeout);
        timeLeft.value = 0;
    });
});

const progressBarWidth = computed(() => {
    return `${(timeLeft.value / (confirmDialogOptions.value?.showTime as number)) * 100}%`;
});
</script>

<style scoped>
.confirmAppear-enter-active,
.confirmAppear-leave-active {
    transition:
        transform 0.4s cubic-bezier(0.5, 0, 0.5, 1),
        opacity 0.4s linear;
}

.confirmAppear-enter-from,
.confirmAppear-leave-to {
    opacity: 0;
    transform: scale(0.3) translateY(-50%);
}
</style>
