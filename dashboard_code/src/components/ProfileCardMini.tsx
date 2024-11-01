import { inject, observer } from 'mobx-react'
import React from 'react'
import { AppStore } from '../store/AppStore';
import user_14 from "../images/user/user-14.png"

interface ProfileCardMiniPropType {
    store?: AppStore
}

const ProfileCardMini: React.FC<ProfileCardMiniPropType> = inject("store")(observer(({ store }) => {
    return (
        <div className="flex rounded shadow w-full bg-graydark dark:bg-meta-4 font-medium text-bodydark1">
            <span className="h-14 w-14 rounded-full p-2 pr-1">
                <img src={store?.profile.imageUrl || user_14} alt="User" />
            </span>
            <div className="self-center p-2">
                <div className="flex">
                    <div className="name text-base">{store?.profile.fullName}</div>
                    <div className="role font-bold text-xs self-center px-1 w-max rounded">
                        ({store?.profile.accountType})
                    </div>
                </div>
                <div className="title text-sm text-gray-400 -mt-1">{store?.profile.email}</div>
            </div>
        </div>
    )
}));

export default ProfileCardMini