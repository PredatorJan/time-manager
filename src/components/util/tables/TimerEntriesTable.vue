<script setup lang="ts">
import { TimerEntry } from 'src/types/TimerTypes';
import { computed } from 'vue';

const props = defineProps<{
    entries?: TimerEntry[]
}>()

const showEntries = computed(() => {
    if(props.entries === undefined) {
        return false
    }
    if(props.entries.length < 1) {
        return false
    }

    return true
})

function removeEntry(id: string) {
    window.timerApi.removeEntry(id)
}

function selectEntry(id: string) {
    window.timerApi.setSelectedEntry(id).then(entry => {
        console.log("selected entry: " + entry.id + " - " + entry.name);
        window.close()
    })
}

</script>

<template>
    <div class="overflow-y-auto h-[200px]">
        <table class="w-full">
            <thead class="sticky top-0 z-0">
                <tr>
                    <th class="rounded-tl-md">ID</th>
                    <th>Name</th>
                    <th>Time</th>
                    <th class="rounded-tr-md">Actions</th>
                </tr>
            </thead>
            <tbody class="">
                <tr v-if="showEntries" v-for="entry in entries">
                    <td>{{ entry.id }}</td>
                    <td>{{ entry.name }}</td>
                    <td>{{ entry.times.hours.toLocaleString("de-DE", { "minimumIntegerDigits": 2 }) + ":" +
                            entry.times.minutes.toLocaleString("de-DE", { "minimumIntegerDigits": 2 }) + ":" +
                            entry.times.seconds.toLocaleString("de-DE", { "minimumIntegerDigits": 2 })
                    }}</td>
                    <td>
                        <div class="flex flex-row gap-2 items-center">
                            <!--<font-awesome-icon class="actionBtn" icon="pen" />-->
                            <font-awesome-icon class="actionBtn" icon="minus"
                                @click="removeEntry(entry.id)" />
                            <font-awesome-icon class="actionBtn" icon="caret-right"
                                @click="selectEntry(entry.id)" />
                        </div>
                    </td>
                </tr>
                <tr v-if="!showEntries">
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
.actionBtn {
    @apply w-6 py-1 rounded-sm cursor-pointer shadow-md shadow-gray-900 bg-yellow-300 text-black
}

th, td {
    @apply py-1 px-2 text-left
}

th {
    @apply bg-yellow-300 text-black
}

tr:nth-child(even) {
    @apply bg-gray-700
}

tr:last-child td:first-child {
    @apply rounded-bl-md
}

tr:last-child td:last-child {
    @apply rounded-br-md
}
</style>
