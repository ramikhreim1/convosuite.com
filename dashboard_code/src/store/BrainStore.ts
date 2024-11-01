import { makeObservable, observable, action } from "mobx";
import { AppStore } from "./AppStore";
import { AxiosResponse } from "axios";

export interface Brain {
    id: string; // UUID
    user_id: string;
    brain_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface Document {
    id: string; // UUID
    is_private: boolean;
    brain_id: string; // UUID
    title: string;
    status: 'processing' | 'processed' | 'errored';
    file_type: string;
    error_reason?: string;
    file_sha1: string;
    file_size: number;
    chunk_size: number;
    chunk_overlap: number;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}
export class BrainStore {
    appStore: AppStore
    @observable.deep brains: Brain[] = []
    @observable.deep documents: Document[] = []
    constructor(appStore: AppStore) {
        this.appStore = appStore
        makeObservable(this);
    }
    @action init() {
        this.getBrains()
        this.getDocuments()
    }
    @action async getBrains(): Promise<AxiosResponse<any, any>> {
        try {
            const response = await this.appStore.docQueryApi.get('/brains');
            this.brains = response.data.brains as any
            return response
        } catch (error) {
            throw error
        }
    }
    @action async getDocuments(): Promise<AxiosResponse<any, any>> {
        try {
            const response = await this.appStore.docQueryApi.get('/documents');
            this.documents = response.data.documents as any
            return response
        } catch (error) {
            throw error
        }
    }
    @action async getDocumentById(id: string): Promise<AxiosResponse<any, any>> {
        try {
            const response = await this.appStore.docQueryApi.get(`/documents?document_id=${id}`);
            return response
        } catch (error) {
            throw error
        }
    }
    @action async getDocumentByBrainId(id: string): Promise<AxiosResponse<any, any>> {
        try {
            const response = await this.appStore.docQueryApi.get(`/documents?brain_id=${id}`);
            return response
        } catch (error) {
            throw error
        }
    }
    @action async uploadDocument(brain_id: string, file: File): Promise<AxiosResponse<any, any>> {
        try {
            const formdata = new FormData()
            formdata.append("file", file)
            const response = await this.appStore.docQueryApi.post(`/upload?brain_id=${brain_id}`, formdata, {
                headers: {
                    "Content-Type": "Multipart/Form-Data"
                }
            });
            return response
        } catch (error) {
            throw error
        }
    }
    @action async uploadURL(brain_id: string, URL: string): Promise<AxiosResponse<any, any>> {
        try {
            const response = await this.appStore.docQueryApi.post(`/crawl?brain_id=${brain_id}`, {
                "url": URL,
                "js": false,
                "depth": 1,
                "max_pages": 100,
                "max_time": 60
            });
            return response
        } catch (error) {
            throw error
        }
    }
    @action async createABrain(brain_name: string): Promise<AxiosResponse<any, any>> {
        try {
            const response = await this.appStore.docQueryApi.post(`/brain?brain_name=${brain_name}`);
            this.brains.unshift(response.data.brain)
            return response
        } catch (error) {
            throw error
        }
    }
    @action async deleteABrain(id: string): Promise<AxiosResponse<any, any>> {
        try {
            const response = await this.appStore.docQueryApi.delete(`/brain?brain_id=${id}`);
            this.brains = this.brains.filter(brain => brain.id !== id)
            return response
        } catch (error) {
            throw error
        }
    }
    @action async deleteADocument(id: string): Promise<AxiosResponse<any, any>> {
        try {
            const response = await this.appStore.docQueryApi.delete(`/document?document_id=${id}`);
            this.documents = this.documents.filter(document => document.id !== id)
            return response
        } catch (error) {
            throw error
        }
    }
}
