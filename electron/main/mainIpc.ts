import { app, BrowserWindow, ipcMain } from "electron";
import { TimerEntry } from "../../src/types/TimerTypes";
import { BrowserWindowOptions } from "../../src/types/UtilityTypes";
import { TimerManager } from "./core/TimerManager";
import { DataService } from "./core/util/DataService";
import { join } from 'path'
import { Timer } from "./core/Timer";

export function init(mainWin: BrowserWindow) {
    const preload = join(__dirname, '../preload/index.js')
    const overViewHtml = join(process.env.DIST, 'index.html')
    const url = process.env.VITE_DEV_SERVER_URL
    // Window API

    ipcMain.on("windowApi:close", () => {
        app.quit();
    })
    ipcMain.handle('open-win', (event, subWindowName: string, windowOptions: BrowserWindowOptions) => {
        console.log("Open new window: " + subWindowName)        

        const parent = BrowserWindow.getAllWindows().find(w => w.webContents.id === event.sender.id)

        let modal = new BrowserWindow({
            icon: join(process.env.PUBLIC, 'favicon.ico'),
            width: windowOptions.width,
            height: windowOptions.height,
            minWidth: windowOptions.minWidth ? windowOptions.minWidth : 0,
            minHeight: windowOptions.minHeight ? windowOptions.minHeight : 0,
            resizable: windowOptions.resizable ? windowOptions.resizable : true,
            alwaysOnTop: windowOptions.alwaysOnTop ? windowOptions.alwaysOnTop : false,
            center: true,
            autoHideMenuBar: true,
            frame: false,
            titleBarStyle: 'hidden',
            show: false,
            parent: windowOptions.modal ? parent : null,
            modal: windowOptions.modal ? windowOptions.modal : false,
            webPreferences: {
                preload,
                nodeIntegration: false,
                contextIsolation: true,
                devTools: true,
            },
        })

        modal.webContents.on('did-finish-load', () => {
            modal.show()
        })

        if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
            modal.loadURL(join(url, "src", "subWindows", subWindowName, subWindowName + ".html"))
            modal.webContents.openDevTools()
        } else {
            modal.loadFile(overViewHtml)
        }
    })


    // Timer API
    ipcMain.handle("timerApi:getEntries", (event) => {
        return Array.from(TimerManager.getInstance().getEntries().values())
    })
    ipcMain.handle("timerApi:addEntry", (event, entry: TimerEntry) => {
        console.log("add new entry");
        TimerManager.getInstance().addEntry(entry)

        return entry
    })
    ipcMain.on("timerApi:removeEntry", (event, id: string) => {
        TimerManager.getInstance().removeEntry(id)
        console.log("removed entry");
    })
    ipcMain.handle("timerApi:setSelectedEntry", (event, id: string) => {
        TimerManager.getInstance().setSelectedEntry(id)
        console.log("select entry");

        const selectedEntry: TimerEntry = TimerManager.getInstance().getSelectedEntry()

        mainWin.webContents.send("timerApi:selectedEntryEvent", selectedEntry);
        mainWin.webContents.send("timerApi:changedTimerStatusEvent", TimerManager.getInstance().getTimerStatus());
        return selectedEntry
    })
    ipcMain.handle("timerApi:getSelectedEntry", (event) => {
        console.log("get selected entry");

        const selectedEntry: TimerEntry = TimerManager.getInstance().getSelectedEntry()
        if(selectedEntry === undefined || selectedEntry === null) {
            return Promise.reject("No selection")
        }
        return selectedEntry
    })
    ipcMain.on("timerApi:setTimerStatus", (event, status) => {
        console.log("set timer status");

        TimerManager.getInstance().setTimerStatus(status);
        mainWin.webContents.send("timerApi:changedTimerStatusEvent", TimerManager.getInstance().getTimerStatus());
    })
    ipcMain.handle("timerApi:getTimerStatus", (event) => {
        console.log("get timer status");

        return TimerManager.getInstance().getTimerStatus();
    })



    // Data API
    ipcMain.handle("dataApi:loadData", () => {
        const data: TimerEntry[] = DataService.loadData();
        for(let entry of data) {
            TimerManager.getInstance().addEntry(entry)
        }
    })
    ipcMain.on("dataApi:saveData", (event) => {
        const entries: Map<String, TimerEntry> = TimerManager.getInstance().getEntries()
        const data: TimerEntry[] = []

        for(let entry of entries.values()) {
            data.push(entry)
        }

        DataService.saveData(data);
    })
}