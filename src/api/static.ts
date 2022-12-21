
import allRequests, { requestNBK } from "./allRequests"
import { IEmailTemplateFields, IPosecodeRes, IPostCode } from "./allResponse"

let allEmailFields: IEmailTemplateFields = []

export const getEmailFeilds = () => {
    if (allEmailFields.length === 0) {
        return requestNBK({
            requestConfig: allRequests.emailTemplate.templateFields
        }).then((res: IEmailTemplateFields) => {
            allEmailFields = res
            return res
        })

    } else {
        return Promise.resolve(allEmailFields)
    }
}
let allPostcodes: IPostCode[] = []

export const getPostcodes = () => {
    if (allEmailFields.length === 0) {
        return requestNBK({ requestConfig: allRequests.miscellaneous.postCodes }).then((res: IPosecodeRes) => {
            allPostcodes = res.postCodes
            return res.postCodes
        })

    } else {
        return Promise.resolve(allPostcodes)
    }
}
