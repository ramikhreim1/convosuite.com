import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { AppStore } from "../store/AppStore";
import { inject, observer } from "mobx-react";
import { GiBrain } from "react-icons/gi"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { toast } from "react-hot-toast";

const supportedFileFormats = [
    'pdf', 'jpeg', 'png', 'txt', 'csv', 'md', 'm4a', 'mp3', 'webm', 'mp4', 'mpeg', 'wav',
    'html', 'pptx', 'docx', 'odt', 'epub', 'ipynb'
];


const schema = yup.object().shape({
    file: yup
        .mixed(),
    URL: yup
        .string()
        .url('Invalid URL'),
    brain_id: yup
        .string()
        .required('Brain ID is required'),
});

type YourFormType = yup.InferType<typeof schema>;


interface CreateDocumentModelPropType {
    store?: AppStore
}

const CreateDocumentModel: React.FC<CreateDocumentModelPropType> = inject('store')(observer(({ store }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema), });

    const onSubmit = async (data: YourFormType, e: any) => {
        try {
            if (data.file.length > 0 || data.URL) {
                let res = null
                if (data.URL) {
                    res = store?.brain.uploadURL(data.brain_id, data.URL)
                    // crawl URL
                } else if (data.file.length > 0) {
                    // Upload File
                    const extension = data.file[0].name.split('.').pop().toLowerCase();
                    if (!supportedFileFormats.includes(extension)) throw new Error("Invalid File Format")
                    res = store?.brain.uploadDocument(data.brain_id, data.file[0])

                } else {
                    throw new Error("Invalid Upload")
                }
                if (res) {
                    toast.promise(res, {
                        loading: 'Uploading document...',
                        success: 'Document uploaded successfully!',
                        error: 'An error occurred while uploading the document.',
                    });
                    await res;
                    store?.brain.getDocuments()
                }
            } else {
                throw new Error("Enter a File or a URL")
            }
        } catch (error: any) {
            toast.error(error.message)
        }

    }


    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                style={{ backgroundColor: '#2346d4e6' }}
                className="absolute right-0 bg-blue-100 rounded py-2 px-2 text-white"
            >
                Upload Documents
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Upload a Document
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mt-4">
                                            <div>
                                                <label className="mb-3 block text-black dark:text-white">
                                                    Attach file
                                                </label>
                                                <input
                                                    {...register("file")}
                                                    accept={supportedFileFormats.join(" ")}
                                                    type="file"
                                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center justify-center w-full">
                                            <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                                            <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
                                        </div>

                                        <div>
                                            <label className="mb-3 block text-black dark:text-white">
                                                Enter A URL
                                            </label>
                                            <input
                                                {...register("URL")}
                                                type="text"
                                                placeholder="URL"
                                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label className="mb-3 block text-black dark:text-white">
                                                Select Brain
                                            </label>
                                            <div className="relative z-20 bg-white dark:bg-form-input">
                                                <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                                    <GiBrain />
                                                </span>
                                                <select {...register("brain_id")} className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                                                    {store?.brain.brains.map(brain => (<option value={brain.id}>{brain.brain_name}</option>))}
                                                </select>
                                                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <g opacity="0.8">
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                                fill="#637381"
                                                            ></path>
                                                        </g>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4">

                                            <button
                                                type="submit"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                Train Brain
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}));
export default CreateDocumentModel