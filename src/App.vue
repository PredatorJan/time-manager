<script setup lang="ts">
import TimeManaging from './components/TimeManaging.vue'
import WindowTitleBar from './components/util/WindowTitleBar.vue';

function closeApplication() {
    window.windowApi.close();
}

</script>

<template>
    <div class="flex flex-col h-screen">
        <WindowTitleBar @close="closeApplication"></WindowTitleBar>

        <div class="flex p-2 h-full gap-3 items-center">
            <TimeManaging />
        </div>
    </div>

</template>

<style>

</style>
