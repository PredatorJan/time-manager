<script setup lang="ts">
import TimerEntriesTable from '../../components/util/tables/TimerEntriesTable.vue';
import { TimerEntry } from '../../types/TimerTypes';
import WindowTitleBar from '../../components/util/WindowTitleBar.vue';
import { reactive } from 'vue';
import { BrowserWindowOptions } from 'src/types/UtilityTypes';

let updateInterval: NodeJS.Timer = null
let data = reactive({
    entries: [] as TimerEntry[]
})

updateInterval = setInterval(() => {
    window.timerApi.getEntries().then((resolved) => {
        data.entries = resolved
    })
}, 500)

function closeWindow() {
    window.close();
}

function addNewEntry() {    
    const windowOptions: BrowserWindowOptions = {
        width: 300,
        height: 200,
        minWidth: 300,
        minHeight: 200,
        modal: true
    }
    window.windowApi.openWindow("addEntryDialog", windowOptions)
}

function removeAllEntries() {
    // clear entries
}

async function refreshEntries() {
    window.timerApi.getEntries().then((resolved) => {
        data.entries = resolved
    })
}

function saveData() {    
    window.dataApi.saveData()
}

function loadData() {    
    window.dataApi.loadData()
}

</script>

<template>
    <div class="flex flex-col">
        <WindowTitleBar class="fixed w-full" @close="closeWindow"></WindowTitleBar>

        <div class="flex flex-col p-2 gap-3 mt-[2rem]">
            <div class="flex gap-2 w-full">
                <button class="btn" @click="addNewEntry">
                    <font-awesome-icon class="text-yellow-300 mr-1 " icon="plus" size="lg"/>
                    Add
                </button>
                <!--<button class="btn">
                    <font-awesome-icon class="text-yellow-300 mr-1 " icon="trash-can" size="lg"/>
                    Clear
                </button>-->
                <!--<button class="btn" @click="refreshEntries">
                    <font-awesome-icon class="text-yellow-300 mr-1 " icon="rotate-right" size="lg"/>
                    Refresh
                </button>-->
                <button id="exportButton" class="btn z-10 ml-auto">
                    Export
                    <font-awesome-icon class="text-yellow-300 ml-3" icon="caret-down" size="lg"/>
                    <div id="exportButtonDiv">
                        <button @click="saveData">Save</button>
                        <button @click="loadData">Load</button>
                        <!--<button>Export to CSV</button>-->
                    </div>
                </button>
            </div>
            <TimerEntriesTable class="shadow-md" :entries="data.entries"></TimerEntriesTable>
        </div>
    </div>

</template>

<style>
#exportButtonDiv {
    @apply hidden w-fit h-fit right-0 rounded-b-md absolute whitespace-nowrap shadow-lg
}

#exportButtonDiv > button:last-child {
    @apply rounded-b-md
}

#exportButtonDiv > button {
    @apply bg-gray-700 py-1 px-3 text-white text-left hover:brightness-150
}

#exportButton:hover > div {
    @apply flex flex-col
}

#exportButton:hover {
    @apply brightness-100
}
</style>
