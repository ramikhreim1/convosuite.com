import { makeObservable, action } from "mobx";
import { AppStore } from "./AppStore";


export class ChartStore {
    appStore;
    constructor(appStore: AppStore) {
        this.appStore = appStore;
        makeObservable(this);
    }
}
