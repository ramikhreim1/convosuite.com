import React, { useEffect, useState } from 'react'
import Board from "./Board"
import { inject, observer } from 'mobx-react';
import { AppStore } from '../store/AppStore';
import { LoaderTwo } from '../common/Loader';

interface UserActivityPropType {
    store?: AppStore
}
interface UserActivity {
    count: number
    email: string
    fname: string
}

const MostActiveUsers: React.FC<UserActivityPropType> = inject("store")(observer(({ store }) => {
    const [userActivities, setUserActivities] = useState<UserActivity[]>([])
    const [isLoading, setIsloading] = useState<boolean>(true)


    useEffect(() => {
        getUserActivity()
    }, [])

    const getUserActivity = async () => {
        try {
            const result = await store?.api.post("/apis_usage/user-activity");
            if (result?.data) {
                setUserActivities(result?.data)
            }
        } catch (error) {

        } finally {
            setIsloading(false)
        }
    }

    if (isLoading) {
        return <LoaderTwo />
    }

    return (
        <Board
            title="Most Active Users"
            data={userActivities.map((activity) => ({
                instance: activity.count,
                name: activity.email
            }))}
        />
    )
}));

export default MostActiveUsers