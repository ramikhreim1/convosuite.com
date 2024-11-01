import Breadcrumb from "../../components/Breadcrumb"
import TableThree from "../../components/TableThree";
import React, { useEffect, useState } from "react";
import { AppStore } from "../../store/AppStore";
import { inject, observer } from "mobx-react";
import { toast } from "react-hot-toast";
import CreateDocumentModel from "../../components/CreateDocument";

interface BrainPropTypes {
    store?: AppStore
}

const Brain: React.FC<BrainPropTypes> = inject('store')(observer(({ store }) => {

    useEffect(() => {
        store?.brain.init()
    }, [])

    function handleEvent(event: any) {
        switch (event.type) {
            case "view":
                // redirect to chatbot with brain id
                window.location.href = `/ai/ChatGPT?brain_id=${event.id}`

                break;
            case "delete":
                store?.brain.deleteABrain(event.id)
                break;

            default:
                break;
        }
    }
    const handleDocumentTableEvent = (event: any) => {
        switch (event.type) {
            case "view":
                // redirect to chatbot with brain id
                break;
            case "delete":
                store?.brain.deleteADocument(event.id)
                break;

            default:
                break;
        }
    }

    return (
        <><Breadcrumb pageName={'Brains Management'} />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="flex w-auto">
                    <h4 className="mb-6 w-1/2 text-xl font-semibold text-black dark:text-white">
                        Your Brains
                    </h4>
                    <div className="relative -my-0.5 w-full">
                        <CreateBrain />
                    </div>
                </div>

                <div className="flex flex-col">
                    <TableThree columns={[
                        { label: "brain_name", width: "220px" },
                        { label: "created_at", width: "220px" },
                    ]} records={store?.brain.brains as any} actions={["view", "delete"]} onClick={handleEvent} />
                </div>
                <hr className="my-4" />
                <div className="flex w-auto">
                    <h4 className="mb-6 w-1/2 text-xl font-semibold text-black dark:text-white">
                        Your Documents
                    </h4>
                    <div className="relative -my-0.5 w-full">
                        <CreateDocumentModel />
                    </div>
                </div>
                <div className="flex flex-col">
                    <TableThree columns={[
                        { label: "title", width: "220px" },
                        { label: "status", width: "220px" },
                        { label: "file_type", width: "220px" },
                        { label: "file_size", width: "220px" },
                        { label: "created_at", width: "220px" },
                    ]} records={store?.brain.documents as any} actions={["view", "delete"]} onClick={handleDocumentTableEvent} />
                </div>
            </div>
        </>
    )
}));

interface CreateBrainPropType {
    store?: AppStore
}

const CreateBrain: React.FC<CreateBrainPropType> = inject("store")(observer(({ store }) => {
    const [inputEnabled, setInputEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [brainName, setBrainName] = useState("");

    const createBrain = async () => {
        try {
            setLoading(true)
            await store?.brain.createABrain(brainName);
            await store?.brain.getBrains();
            toast.success("Brain created successfully")
        } catch (error) {

        } finally {
            setInputEnabled(false);
            setLoading(false)
        }

    }
    return (<div className="flex justify-end items-center gap-2">
        {inputEnabled && <>
            <input
                value={brainName}
                onChange={(e) => setBrainName(e.target.value)}
                type="text"
                placeholder="Enter Brain name"
                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <button
                disabled={loading}
                onClick={() => createBrain()}
                className="bg-blue-100 rounded py-2 px-2 text-white"
                style={{ backgroundColor: '#2346d4e6' }}
            >
                {loading ? "Saving..." : "save"}
            </button>
        </>}
        <button
            disabled={loading}
            onClick={() => setInputEnabled(o => !o)}
            className="bg-blue-100 rounded py-2 px-2 text-white"
            style={{ backgroundColor: '#2346d4e6' }}
        >
            {inputEnabled ? "Cancel" : "New brain"}
        </button>
    </div>)
}))



export default Brain