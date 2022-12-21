export interface IPostCode {
    id: number
    postnummer: string
    poststed: string
    kommunenummer: string
    kommunenavn: string
    kategori: string
}

export interface IPostCodeRes {
    postCodes: IPostCode[]
}

export interface IComponayProfile {
    id: number
    companyName: string
    organizationalNumber: string
    address: string
    ownerName: string
    postCode: number
    telephone: string
    mobile: string
    nameOnEmailAddress: string
    senderEmailAddress: string
}

export interface IComponayProfileRes {
    companyProfile: IComponayProfile
}

export interface INewUserProfile {
    userName: string
    designation: string
    password: string
    userTypeId: number
    isActive: boolean
    picture: string
    contactId: number
}

export interface IUserProfile extends INewUserProfile {
    id: number
}
export interface IUserProfileRes {
    userProfile: IUserProfile
}

export interface IAllUsersRes {
    multiUserProfiles: IUserProfile[]
}

export interface IBuildingSupplierNew {
    title: string
}

export interface IBuildingSupplier extends IBuildingSupplierNew {
    id: number
}

export interface IBuildingSupplierRes {
    buildingSupplier: IBuildingSupplier
}

export interface IBuildingSuppliersAll {
    multiBuildingSuppliers: IBuildingSupplier[]
}

export interface IContactNew {
    "name": string
    "contactNo": string
    "email": string
    "companyName"?: string
}
export interface IContact extends IContactNew {
    "id": number,

}

export interface IContactAll {
    multiContact: IContact[]
}

export interface IContactRes {
    contact: IContact
}
export interface IPartyTypeNew {
    "name": string
    "isDefault": boolean
}

export interface IPartyType extends IPartyTypeNew {
    "id": number
}

export interface IPartyTypeRes {
    partyType: IPartyType
}
export interface IPartyTypeAll {
    multiPartyTypes: IPartyType[]
}

export interface IEmailTemplateNew {
    title: string
    template: string
}

export interface IEmailTemplate extends IEmailTemplateNew {
    id: number
}

export interface IEmailTemplateRes {
    emailTemplate: IEmailTemplate
}
export interface IEmailTemplateAll {
    multiEmailTemplates: IEmailTemplate[]
}

export type IEmailTemplateFields = string[]

export interface IDocTypeNew {
    partyTypeId: number | null
    docName: string
    isRequired: boolean
}

export interface IDocType extends IDocTypeNew {
    id: number
}

export interface IDocTypeRes {
    docType: IDocType
}

export interface IDocTypeAll {
    multiDocTypes: IDocType[]
}

export interface IServiceSlab {
    id: number
    serviceId: number
    rangeFrom: number
    rangeTo: number
    rate: string
}

export interface IServiceWorkflowCategory {
    id?: number
    serviceId: number
    workflowCategoryId: number
}
export interface IServiceNew {
    name: string
    description: string
    serviceTypeId: 1 | 2 | 3 | 0
    serviceChargedAs: 1 | 2 | 0
    rate: string,
    servicePerSlabList?: null | IServiceSlab[]
    serviceWorkflowCategory: IServiceWorkflowCategory[]
    checklistTempId: number | null
}

export interface IService extends IServiceNew {
    id: number
}

export interface IServiceRes {
    service: IService
}

export interface IServiceAll {
    multiService: IService[]
}

export interface IChecklistItem {
    id: number
    checklistId: number
    title: string
}

export interface IChecklistNew {
    title: string
    isDefault: null | boolean
    serviceSelectedID?: number
    checklistItemTemplateList: IChecklistItem[]
    checkListAttchedWithService?: IService
}

export interface IChecklist extends IChecklistNew {
    id: number
}

export interface IChecklistRes {
    checklistTemplate: IChecklist
}

export interface IChecklistAll {
    multiChecklistTemplate: IChecklist[]
}

export interface IProjectAll {
    multiProject: IProject[]
}

export interface IPostcode {
    id: number
    postnummer: string
    poststed: string
    kommunenummer: string
    kommunenavn: string
    kategori: string
}

export interface IPosecodeRes {
    postCodes: IPostcode[]
}

export interface IProjectService {
    "id"?: number,
    "projectId"?: number,
    "serviceId": number,
    "quantity": number,
    "price": string,
    "isNewAdded": boolean,
    "service"?: null
}


export interface IProject {
    "id": number
    "title": string
    "dated": string
    "customerId": string
    "contactPersonId": string
    "buildingSupplierId": string
    "gardsNo": null | string
    "bruksnmmer": null | string
    "address": null | string
    "postNo": null | string
    "poststed": null | string
    "kommune": null | string
    "comments": null | string
    "inspectorId": null | string
    "projectLeaderId": null | string
    "remContactCustomerDate": null | string
    "remContactCustomerDdl": null | string
    "description": "UK Våtrom",
    "completeDate": null | string
    "isSubmitted": null | string
    "longitude": null | string
    "latitude": null | string
    "inspectionEventComment": null | string
    "inspectionDate": null | string
    "godkjensDate": null | string
    "projectStatus": null | string
    "projectImage": null | string
    "inspectorComment": null | string
    "inspectorSignature": null | string
    "takkBestillingenCdate": null | string
    "soknadOmAnsvarsrettCdate": null | string
    "ansvarligSokerCdate": null | string
    "gratulererGodkjentCdate": null | string
    "createChecklistCdate": null | string
    "addPartiesCdate": null | string
    "setProLeaderContactCustomerCdate": null | string
    "emailCustomerUpInspectionCd": null | string
    "upcomingInspectionCdate": null | string
    "partiesDataCdate": null | string
    "assignInspectorCdate": null | string
    "projectSubProcessCdate": null | string
    "projectSubCompleteCd": null | string
    "reviewInspReportCd": null | string
    "invoiceSetCd": null | string
    "submitInspectionRepRemindCd": null | string
    "submitInspectionRepRemindAgainCd": null | string
    "kontrollerklaeringPdfCd": null | string
    "finalReportPdfCdate": null | string
    "modifiedDate": null | string
    "isDeleted": null | string
    "isArchived": null | string
    "isApprovedInspReport": null | string
    "vismaInvoiceId": null | string
    "takkBestillingenIsCompleted": null | string
    "soknadOmAnsvarsrettIsCompleted": null | string
    "ansvarligSokerIsCompleted": null | string
    "gratulererGodkjentIsCompleted": null | string
    "createChecklistIsCompleted": null | string
    "addPartiesIsCompleted": null | string
    "setProLeaderContactCustomerIsCompleted": null | string
    "emailCustomerUpInspectionIsCompleted": null | string
    "partiesDataIsCompleted": null | string
    "assignInspectorIsCompleted": null | string
    "isApprovedInspReportIsCompleted": null | string
    "invoiceTripletexId": null | string
    "tepmlateValue": null | string
    "avvik": null | string
    "avvikSendtKommune": null | string
    "skipInspection": null
    "projectService": IProjectService[],
    "projectServiceWorkflowList": IServiceWorkflowCategory[]
}

export interface IProjectRes {
    project: IProject
}

export interface IStep {
    "id": number
    "workflowCategoryId": number
    "stepName": string
    "stepSequence": number
    "isActive": boolean
    "isTransferable": boolean
}

export interface IWorkflow {
    "id": number
    "name": string
    "isDefault": boolean
}
export interface IWorkflowRes {
    workflowCategory: IWorkflow
}

export interface IWorkflowAll {
    multiWorkflowCategory: IWorkflow[]
}
export interface IStepsRes {
    multiWorkflowCategorySteps: IStep[]
}

export interface IProjectWorkflowStepsRes {
    multiProjectWorkflow: IProjectWorkflowSteps[]
}
export interface IProjectWorkflowSteps {
    attachmentURL: null | string
    emailContent: null | string
    emailFrom: null | string
    emailHistoryId: number
    emailSubject: null | string
    emailTempId: null | string
    emailTo: null | string
    fileName: null | string
    fileNames: null | string
    id: number
    insertDate: string
    insertedBy: number
    isTransfer: boolean | null
    projectId: number
    rootURL: string
    workflowId: number
    workflowStepId: number
}

export interface IProjectWorkflowEmail {
    id: number
    projectId: number
    workflowId: number
    workflowStepId: number
    isTransfer: boolean
    emailHistoryId: number
    insertDate: string
    insertedBy: number
    emailContent: string
    emailSubject: string
    emailTo: string
    projectLeaderEmailTo: string | null
    emailFrom: string
    attachmentURL: string | null
    fileName: string | null
    fileNames: string | null
    rootURL: string | null
    emailTempId: number
    fileAttached: any
    contactCustomerDate: string
}
export interface IProjectWorkflowEmailRes {
    projectWorkflow: IProjectWorkflowEmail
}

export interface IProjectWorkflowPartiesEmailRes {
    projectWorkflow: {
        
    }
}