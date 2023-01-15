<script setup lang="ts">

</script>

<template>
    <div class="windowBar flex bg-blue-700 items-center pl-2">
        <label class="overflow-hidden whitespace-nowrap">Time Manager</label>
        <div class="windowBtn hover:bg-red-500 h-full px-3 ml-auto" @click="$emit('close')">
            <font-awesome-icon icon="xmark" size="lg" />
        </div>
    </div>
</template>

<style>

</style>
