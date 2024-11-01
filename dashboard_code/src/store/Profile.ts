import { makeObservable, action, observable, computed } from "mobx";
import { AppStore } from "./AppStore";

export interface UserProfile {
    _id: string;
    email: string;
    verified: boolean;
    googleUser: boolean;
    googleId?: string;
    imageUrl: string;
    fname: string;
    lname: string;
    accountType: "user" | "admin";
    permissions: string[];
    users: string[];
    created: Date;
    customerId: string;
    credits: number;
    creditsUsed: number;
    plan: "free" | "entry" | "pro" | "";
    status: "trialing" | "active" | "inactive" | "";
    trial_end: Date;
    current_period_end: Date;
    cancel_at_period_end: boolean;
    referralId: string;
    referrerPaid: boolean;
    referrer?: string | UserProfile;
}

class ProfileStore {
    _id: string = "";
    email: string = "example@gmail.com";
    verified = false;
    googleUser = false;
    googleId: string | undefined = "";
    imageUrl = "";
    fname = "jhon";
    lname = "doe";
    accountType: "user" | "admin" = "user";
    permissions: string[] = ["user"];
    users: string[] = [""];
    created: Date = new Date();
    customerId: string = "";
    credits: number = 0;
    creditsUsed: number = 0;
    plan: "free" | "entry" | "pro" | "" = "";
    status: "trialing" | "active" | "inactive" | "" = "";
    trial_end: Date = new Date();
    current_period_end: Date = new Date();
    cancel_at_period_end: boolean = false;
    referralId: string = "";
    referrerPaid: boolean = false;
    referrer?: string | UserProfile;

    @observable isProfileLoading = true;
    @observable isLoggedIn = false;
    @observable referral: string | null = null;

    appStore;
    constructor(appStore: AppStore) {
        this.appStore = appStore;
        makeObservable(this);
        this.init();
    }
    private init() {
        this.refreshProfile();
        this.referralTrackingCode();
        this.refreshToken()
    }
    @action async refreshProfile() {
        try {
            const profile = await this.appStore.api.post("/user/refresh/profile");
            this.setProfile(profile.data.profile)
        } catch (error: any) {
            console.error(error.message);
            this.logout()
        } finally {
            this.isProfileLoading = false;
        }
    }

    setProfile(profile: UserProfile) {
        this._id = profile._id;
        this.email = profile.email;
        this.verified = profile.verified;
        this.googleUser = profile.googleUser;
        this.googleId = profile.googleId;
        this.imageUrl = profile.imageUrl;
        this.users = profile.users;
        this.fname = profile.fname;
        this.lname = profile.lname;
        this.accountType = profile.accountType;
        this.permissions = profile.permissions;
        this.created = profile.created;
        this.customerId = profile.customerId;
        this.credits = profile.credits;
        this.creditsUsed = profile.creditsUsed;
        this.plan = profile.plan || "";
        this.status = profile.status || "";
        this.trial_end = profile.trial_end;
        this.current_period_end = profile.current_period_end;
        this.cancel_at_period_end = profile.cancel_at_period_end;
        this.referralId = profile.referralId;
        this.referrerPaid = profile.referrerPaid;
        this.referrer = profile.referrer;
    }
    @computed get fullName() {
        return this.fname + ` ${this.lname}`
    }
    // referral tracking
    private referralTrackingCode() {
        const referral = new URLSearchParams(window.location.search).get(
            "referral"
        );
        if (referral) {
            this.setReferral(referral);
        } else {
            this.initReferral();
        }
    }
    private setReferral(referral: string) {
        this.referral = referral;
        localStorage.setItem("referral", JSON.stringify(referral));
    }

    private initReferral() {
        const referral = localStorage.getItem("referral");
        this.referral = referral;
    }

    updateCredits(data: { credits: number; creditsUsed: number }) {
        try {
            this.credits = data.credits;
            this.creditsUsed = data.creditsUsed;
        } catch (err) {
            console.log(err);
        }
    }

    @action
    refreshToken = async (): Promise<string | undefined> => {
        try {
            const res = await this.appStore.api.post('/auth/refresh');
            this.appStore.setToken(res.data)
            return res.data;
        } catch (err) {
            this.logout();
        }
    };

    @action
    logout = async () => {
        await this.appStore.api.get('/auth/logout');
        window.location.replace("/login")
        this.isLoggedIn = false;
        this.appStore.setToken("");
    };
}

export default ProfileStore;
