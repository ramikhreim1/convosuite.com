import { makeObservable, action } from "mobx";
import { AppStore } from "./AppStore";

export interface UserType {
    _id: number;
    name: string;
    email: string;
    status: 'active' | 'pending';
    role: string;
    admin: string;
    userId?: {
        _id: string;
        accountType: string;
        email: string;
    }
}

export class UserStore implements UserType {
    _id: number;
    status: 'active' | 'pending';
    role: string;
    admin: string;
    name: string;
    email: string;
    userId?: {
        _id: string;
        accountType: string;
        email: string;
    }
    appStore;
    constructor(appStore: AppStore, user: UserType) {
        this.appStore = appStore;
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.admin = user.admin;
        this.status = user.status;
        this.userId = user.userId;
        makeObservable(this);
    }

    // Update user details
    @action
    async updateUser(updatedUser: {
        name: string;
        email: string;
    }): Promise<boolean> {
        try {
            await this.appStore.api.put(`/admins/users/${this._id}`, updatedUser);
            this.name = updatedUser.name;
            this.email = updatedUser.email;
            return true;
        } catch {
            return false;
        }
    }

    // Update user details
    @action
    async editAccountType(accountType: string): Promise<boolean> {
        try {
            await this.appStore.api.put(`/admins/users/update-user-roles/${this._id}`, { accountType });
            return true;
        } catch {
            return false;
        }
    }

    // Get a specific user by ID
    @action
    async removeFromMember(): Promise<any> {
        try {
            return this.appStore.api.delete(`/admins/users/remove-a-member/${this._id}`);
        } catch (error) {
            return error;
        }
    }


    // Remove a user
    @action
    async deleteUser(): Promise<boolean> {
        try {
            await this.appStore.api.delete(`/admins/users/${this._id}`);
            return true;
        } catch {
            return false;
        }
    }
}

class UsersStore {

    appStore;
    constructor(appStore: AppStore) {
        this.appStore = appStore;
        makeObservable(this);
    }

    // Get all users
    @action
    async getUsers(): Promise<UserStore[]> {
        try {
            const response = await this.appStore.api.get(`/admins/users`);
            return response.data.map((user: any) => (new UserStore(this.appStore, user)));
        } catch {
            return [];
        }
    }

    // Get a specific user by ID
    @action
    async getUserById(id: number): Promise<UserType | null> {
        try {
            const response = await this.appStore.api.get(`/admins/users/${id}`);
            return new UserStore(this.appStore, response.data);
        } catch {
            return null;
        }
    }

    // Add a new user
    @action
    async addUser(newUser: {
        fname: string;
        lname: string;
        email: string;
        role: string;
    }): Promise<{ success: boolean, message: string }> {
        try {
            await this.appStore.api.post(`/admins/users/create`, {
                name: newUser.fname + ' ' + newUser.lname,
                role: newUser.role,
                email: newUser.email
            });
            return { success: true, message: "User added successfully" };
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            return { success: false, message: "somthing went wrong" };
        }
    }
}

export default UsersStore;
