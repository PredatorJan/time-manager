import type { Time, TimerEntry } from "../types";

export class Timer {

    private entry: TimerEntry;
    private interval: NodeJS.Timer

    public constructor(entry) { this.entry = entry };


    public start(): void {
        this.interval = setInterval(() => {
            this.entry.times.seconds++;

            if(this.entry.times.seconds === 60) {
                this.entry.times.minutes++
                this.entry.times.seconds = 0
            }
            if(this.entry.times.minutes === 60) {
                this.entry.times.hours++
                this.entry.times.minutes = 0
            }
        }, 1000)
    }

    public stop(): void {
        clearInterval(this.interval)
        this.interval = null
    }

    public getEntry(): TimerEntry {
        return this.entry
    }
}