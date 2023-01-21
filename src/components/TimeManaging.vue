<script setup lang="ts">
import { BrowserWindowOptions } from '../../libs/util/src/UtilityTypes';
import { reactive } from 'vue';
import { TimerStatus } from '../../libs/timer/src/enums';
import { Time, TimerEntry } from '../../libs/timer/src/types';


let updateInterval: NodeJS.Timer
const timer = reactive({
    entry: {
        id: "-",
        name: "-",
        times: {
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    } as TimerEntry,
    status: TimerStatus.DISABLED as TimerStatus
});


window.timerApi.getSelectedEntry().then(entry => {
    timer.entry = entry
}).catch(rejection => {
    console.log(rejection);
})
window.timerApi.getTimerStatus().then(currStatus => {
    timer.status = currStatus
}).catch(rejection => {
    console.log(rejection);
})

window.timerApi.addSelectedEntryEventCallback((entry: TimerEntry) => {
    timer.entry = entry
})
window.timerApi.addChangedTimerStatusEventCallback((status: TimerStatus) => {    
    timer.status = status
})


function startTimer() {
    window.timerApi.setTimerStatus(TimerStatus.RUNNING);
    updateInterval = setInterval(() => {
        window.timerApi.getSelectedEntry().then(currEntry => {
            timer.entry = currEntry
        })
    }, 500)
}

function stopTimer() {
    window.timerApi.setTimerStatus(TimerStatus.STOPPED);
    clearInterval(updateInterval)
}

function openTimerOverview() {    
    const windowOptions: BrowserWindowOptions = {
        width: 650,
        height: 300,
        minWidth: 500,
        minHeight: 300,
        modal: true
    }
    window.windowApi.openWindow("overview", windowOptions);
}
</script>

<template>
    <div class="flex items-center gap-3 w-full h-full">
        <div class="flex items-right h-full w-full border-0 rounded-md shadow-md">
            <div v-if="true" class="p-2 min-w-fit w-full rounded-l-md cursor-pointer bg-gray-700 hover:brightness-75"
                @click="openTimerOverview">
                {{ timer.entry.name }}
            </div>

            <div class="relative h-full w-9 min-w-[2.25rem]">
                <Transition>
                    <button v-if="timer.status === TimerStatus.RUNNING" @click="stopTimer"
                        class="timerButton absolute flex justify-center items-center ml-auto h-full w-9 min-w-[2.25rem] rounded-r-md bg-red-600 p-1 px-2 cursor-pointer">
                        <font-awesome-icon class="fa text-black" icon="circle-stop" size="lg" />
                    </button>
                </Transition>
                <Transition>
                    <button v-if="timer.status === TimerStatus.STOPPED || timer.status === TimerStatus.DISABLED"
                        v-bind:disabled="timer.status === TimerStatus.DISABLED" @click="startTimer"
                        class="timerButton absolute flex justify-center items-center ml-auto h-full w-9 min-w-[2.25rem] rounded-r-md bg-yellow-300 p-1 cursor-pointer">
                        <font-awesome-icon class="fa text-black" icon="play" size="lg" />
                    </button>
                </Transition>
            </div>
        </div>

        <label>
            {{ timer.entry.times.hours.toLocaleString("de-DE", { "minimumIntegerDigits": 2 }) + ":" +
                    timer.entry.times.minutes.toLocaleString("de-DE", { "minimumIntegerDigits": 2 }) + ":" +
                    timer.entry.times.seconds.toLocaleString("de-DE", { "minimumIntegerDigits": 2 })
            }}
        </label>
    </div>
</template>

<style scoped>
.timerButton>.fa {
    transition: transform 0.4s;
}

.timerButton:hover>.fa {
    transform: scale(1.3);
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.timerButton:disabled {
    @apply bg-gray-500
}
</style>