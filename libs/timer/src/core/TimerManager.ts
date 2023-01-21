import type { TimerEntry } from "../types";
import { TimerStatus } from "../enums";
import { Timer } from "./Timer"
import { DataService } from "../../../persistence/src/DataService"

export class TimerManager {

    private static instance: TimerManager;

    private entries: Map<String, TimerEntry> = new Map();
    private selectedEntry: TimerEntry;
    private timerStatus: TimerStatus = TimerStatus.DISABLED;

    private timer: Timer = null

    private constructor() {
        console.log("TimeManager - Start SaveDataJob");
        
        const saveInterval: NodeJS.Timer = setInterval(() => {
            console.log("SaveDataJob - Execute")
            const data: TimerEntry[] = []

            for(let entry of this.entries.values()) {
                data.push(entry)
            }

            DataService.saveData(data);
            console.log("SaveDataJob - Done")
        }, 5 * 60 * 1000)
    };

    public static getInstance(): TimerManager {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }


    public getEntries(): Map<String, TimerEntry> {
        return this.entries;
    }

    public addEntry(entry: TimerEntry) {
        this.entries.set(entry.id, entry);
    }

    public removeEntry(id: String) {
        this.entries.delete(id);
    }

    public getSelectedEntry(): TimerEntry {
        return this.selectedEntry;
    }

    public setSelectedEntry(id: string): TimerEntry {
        const foundEntry = this.entries.get(id);
        if(foundEntry === undefined || foundEntry === null) {
            this.setTimerStatus(TimerStatus.DISABLED)
            return null
        }

        this.selectedEntry = foundEntry;
        this.setTimerStatus(TimerStatus.STOPPED)
        return foundEntry
    }

    public setTimerStatus(status: TimerStatus) {
        this.timerStatus = status;

        if(status === TimerStatus.RUNNING) {
            this.timer = new Timer(this.selectedEntry)
            this.timer.start()
        } else if(status === TimerStatus.STOPPED || status === TimerStatus.DISABLED) {
            if(this.timer !== null) {
                this.timer.stop()
                this.timer = null
            }
        }
    }

    public getTimerStatus(): TimerStatus {
        return this.timerStatus;
    }
}