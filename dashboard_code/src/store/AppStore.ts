import { makeObservable, observable, action } from "mobx";
import axios from "axios";
import config from "../config";
import ProfileStore from "./Profile";
import UsersStore from "./Users";
import { BrainStore } from "./BrainStore";

export const api = axios.create({
    baseURL: config.baseURL,
    withCredentials: true,
});

export const docQueryApi = axios.create({
    baseURL: config.brainURL,
});

export class AppStore {
    api = api;
    docQueryApi = docQueryApi;
    config = config;
    @observable redirect = "";
    @observable navigate = "";
    profile = new ProfileStore(this);
    users = new UsersStore(this);
    brain = new BrainStore(this);

    constructor() {
        makeObservable(this);
    }
    init() {
        this.docQueryApi.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true
                    await this.profile.refreshToken()
                    return this.docQueryApi(originalRequest)
                }
                return Promise.reject(error);
            }
        );
    }
    async setToken(token: string) {
        this.api.defaults.headers.common["x-access-token"] = token;
        this.setDocQueryApiToken(token)
    }
    setDocQueryApiToken(token: string) {
        this.docQueryApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    @action redirectTo(path: string) {
        this.redirect = path;
    }
    @action navigateTo(path: string) {
        this.navigate = path;
    }
}

const store = new AppStore();
export default store;
