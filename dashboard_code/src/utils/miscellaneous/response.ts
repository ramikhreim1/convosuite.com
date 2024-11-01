import { AxiosError, AxiosResponse } from "axios";

export const errorMessageFromResponse = (res: AxiosResponse | AxiosError): string => {
    if (res instanceof AxiosError) {
        const data = res.response?.data as any
        return data.message || "Something went wrong!"
    } else {
        if (!res.data?.success) {
            return res.data.message
        } else {
            return "Done!"
        }
    }
}