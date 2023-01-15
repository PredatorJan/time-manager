import { readFileSync, writeFile, mkdirSync } from "node:fs";
import { TimerEntry } from "../../../../src/types/TimerTypes";
import { Convert } from "./DataConverter";

export class DataService {

    private static dataDirPath: string = process.cwd() + '\\data';
    private static dataFileName: string = 'data.json';

    public static async saveData(entries: TimerEntry[]) {
        const json = Convert.timerEntriesToJson(entries);

        mkdirSync(DataService.dataDirPath, {
            recursive: true
        })

        await writeFile(DataService.dataDirPath + '\\' + DataService.dataFileName, json, 'utf8', () => {
            console.log("Write data to path '%s' successful", DataService.dataDirPath + '\\' + DataService.dataFileName);
        });
    }

    public static loadData(): TimerEntry[] {
        const json = readFileSync(DataService.dataDirPath + '\\' + DataService.dataFileName, 'utf8');

        return Convert.toTimerEntries(json);
    }
}