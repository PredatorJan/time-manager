<script setup lang="ts">
import { TimerEntry } from '../../../libs/timer/src/types';
import { reactive, ref } from 'vue';
import WindowTitleBar from '../../components/util/WindowTitleBar.vue'

const timerName = ref("")


function closeWindow() {
    window.close();
}

function add() {
    const newEntry: TimerEntry = { 
        id: window.crypto.randomUUID(),
        name: timerName.value,
        times: {
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    }
    window.timerApi.addEntry(newEntry).then(entry => {
        console.log("added entry: " + entry.id + " - " + entry.name);
        window.close()
    })
}

</script>

<template>
    <div class="flex flex-col">
        <WindowTitleBar @close="closeWindow"></WindowTitleBar>
        <h1 class="px-4 py-2 underline">Create new Timer</h1>
        <div class="p-4">
            <div class="flex items-center">
                <label for="nameInput">Name:</label>
                <div class="w-full ml-6">
                    <input id="nameInput" type="text" placeholder="Name of the Timer" v-model="timerName" class="w-full py-1 px-3 rounded-md bg-gray-700 text-white shadow-md focus: outline-black"/>
                </div>
            </div>
            <div class="flex justify-center mt-5">
                <button class="btn" @click="add">Add</button>
            </div>
        </div>
    </div>
</template>

<style>
</style>
