import { generate } from "shortid";

interface IErrorMessageGenerator {
    action: string,
    errorMessage: string
}

export const generateInfoMessage = (msg: string) => {
    return { id: generate(), msg }
}

export const generateErrorMessage = (data: IErrorMessageGenerator) => {
    return { id: generate(), msg: `Error with ${data.action}. Error message: ${data.errorMessage}` }
}
