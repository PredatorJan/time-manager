import { TimerStatus } from "./types/Enums"
import { TimerEntry } from "./types/TimerTypes"
import { BrowserWindowOptions } from "./types/UtilityTypes"

export interface IElectronAPI {
    node: () => string,
    chrome: () => string,
    electron: () => string,

    save: (data: string) => string,
}

export interface IWindowAPI {
    close: () => void,
    openWindow: (subWindowName: string, options: BrowserWindowOptions) => void
}

export interface ITimerAPI {
    getEntries: () => Promise<TimerEntry[]>,
    addEntry: (entry: TimerEntry) => Promise<TimerEntry>,
    removeEntry: (id: string) => void,
    setSelectedEntry: (id: string) => Promise<TimerEntry>,
    getSelectedEntry: () => Promise<TimerEntry>,
    setTimerStatus: (status: TimerStatus) => void,
    getTimerStatus: () => Promise<TimerStatus>,

    addSelectedEntryEventCallback: (callback: Function) => void
    addChangedTimerStatusEventCallback: (callback: Function) => void
}

export interface IDataAPI {
    loadData: () => TimerEntry[],
    saveData: () => void,
}

declare global {
    interface Window {
        windowApi: IWindowAPI,
        timerApi: ITimerAPI,
        dataApi: IDataAPI
    }
}