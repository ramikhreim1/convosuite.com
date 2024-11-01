import React, { useEffect, useState } from 'react'
import Board from "./Board"
import { inject, observer } from 'mobx-react';
import { AppStore } from '../store/AppStore';
import { LoaderTwo } from '../common/Loader';

interface MostUseCasePropType {
    store?: AppStore
}
interface UseCase {
    usageCount: number
    role: string
}

const MostUseCase: React.FC<MostUseCasePropType> = inject("store")(observer(({ store }) => {
    const [useCase, setuseCase] = useState<UseCase[]>([])
    const [isLoading, setIsloading] = useState<boolean>(true)


    useEffect(() => {
        getUseCase()
    }, [])

    const getUseCase = async () => {
        try {
            const result = await store?.api.post("/apis_usage/most-used-use-case");
            if (result?.data) {
                setuseCase(result?.data)
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
            data={useCase.map((usecase) => ({
                instance: usecase.usageCount,
                name: usecase.role
            }))}
        />
    )
}));

export default MostUseCase