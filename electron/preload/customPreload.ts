import { contextBridge, ipcRenderer } from "electron";
import { TimerStatus } from "../../src/types/Enums";
import { TimerEntry } from '../../src/types/TimerTypes'
import { BrowserWindowOptions } from "../../src/types/UtilityTypes";

contextBridge.exposeInMainWorld('windowApi', {
  close: () => ipcRenderer.send("windowApi:close"),
  openWindow: (subWindowName: string, windowOptions: BrowserWindowOptions) => ipcRenderer.invoke("open-win", subWindowName, windowOptions)
})

let selectedEntryEventCallback: Function = null
let changedTimerStatusEventCallback: Function = null
ipcRenderer.on("timerApi:selectedEntryEvent", (event, entry)=> {
  selectedEntryEventCallback(entry)
})
ipcRenderer.on("timerApi:changedTimerStatusEvent", (event, status)=> {
  changedTimerStatusEventCallback(status)
})
contextBridge.exposeInMainWorld('timerApi', {
  getEntries: () => ipcRenderer.invoke("timerApi:getEntries").then(entries => { return entries }),
  addEntry: (entry: TimerEntry) => ipcRenderer.invoke("timerApi:addEntry", entry).then(entry => { return entry }),
  removeEntry: (entry: TimerEntry) => ipcRenderer.send("timerApi:removeEntry", entry),
  setSelectedEntry: (id: String) => ipcRenderer.invoke("timerApi:setSelectedEntry", id).then(entry => { return entry }),
  getSelectedEntry: () => ipcRenderer.invoke("timerApi:getSelectedEntry").then(entry => { return entry }),
  setTimerStatus: (status: TimerStatus) => ipcRenderer.send("timerApi:setTimerStatus", status),
  getTimerStatus: () => ipcRenderer.invoke("timerApi:getTimerStatus"),

  addSelectedEntryEventCallback: (callback: Function) => selectedEntryEventCallback = callback,
  addChangedTimerStatusEventCallback: (callback: Function) => changedTimerStatusEventCallback = callback,
})

contextBridge.exposeInMainWorld('dataApi', {
  loadData: () => ipcRenderer.invoke("dataApi:loadData").then(entries => { return entries }),
  saveData: () => ipcRenderer.send("dataApi:saveData")
})

contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})