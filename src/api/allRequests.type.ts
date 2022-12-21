export interface IRequest {
    url: string
    method: 'PUT' | 'GET' | 'DELETE' | 'POST'
    mockResponse: Promise<any | unknown>
}

export interface IRequests {
    [key: string]: IRequest
}
export interface IAllRequests {
    [key: string]: {
        [key: string]: IRequest
    }
    auth: {
        login: IRequest
        forgotPassword: IRequest
    },
    buildingSupplier: {
        all: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest
    },
    company: {
        all: IRequest
        get: IRequest
        create: IRequest
        update: IRequest
        getFolderName: IRequest
        addFolderName: IRequest
        updateFolderName: IRequest
    },
    userProfile: {
        all: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest

    },
    contact: {
        all: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest
    },
    partyType: {
        all: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest
    },
    docType: {
        all: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest
    },
    emailTemplate: {
        all: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest
        templateFields: IRequest
    },
    service: {
        all: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest
    },
    project: {
        projectsCount: IRequest
        all: IRequest
        allActive: IRequest
        allDeleted: IRequest
        allArchived: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest
        archive: IRequest
        deleteServcie: IRequest
        getAllProjectChecklists: IRequest
        getSingleProjectChecklist: IRequest
        createSingleProjectChecklist: IRequest
        updateSingleProjectChecklist: IRequest
        deleteSingleProjectChecklist: IRequest
        createSingleProjectChecklistItem: IRequest
        updateSingleProjectChecklistItem: IRequest
        deleteSingleProjectChecklistItem: IRequest
        getInspectors: IRequest
        getAllDocsAllParties: IRequest
        getAllDocsPerParty: IRequest
        getApprovedRequiredDocs: IRequest
        postUploadedDocs: IRequest
        deleteUploadedDocs: IRequest
        getSystemGeneratedDocs: IRequest

    },
    checklistTemplate: {
        all: IRequest
        get: IRequest
        update: IRequest
        create: IRequest
        delete: IRequest
    },
    checklistTemplateItem: {
        create: IRequest
        update: IRequest
        delete: IRequest
    },
    miscellaneous: {
        postCodes: IRequest
    },
    workflow: {
        all: IRequest,
        get: IRequest,
        getSteps: IRequest
    },
    projectWorkflow: {
        getCompletedSteps: IRequest,
        w1s1get: IRequest,
        w1s1post: IRequest,
        w1s2get: IRequest,
        w1s2post: IRequest,
        w1s3get: IRequest,
        w1s3post: IRequest,
        w1s4post: IRequest,
        w1s4get: IRequest,
        w1s5post: IRequest,
        w1s6post: IRequest,
        w1s7getProjectParties: IRequest,
        w1s7linkPartiesToProject: IRequest,
        w1s8getProjectLeader: IRequest,
        w1s8postProjectLeader: IRequest,
        w1s8getReminder: IRequest,
        w1s8postReminder: IRequest,
        w1s9getEmail: IRequest,
        w1s9postEmail: IRequest,
        w1s9transfer: IRequest,
        w1s10getEmail: IRequest,
        w1s10postEmail: IRequest,
        w1s10transfer: IRequest,
        w1s11getInspection: IRequest,
        w1s11postInspection: IRequest,
        w1s11transfer: IRequest,
        w1s12getAllChecklistsData: IRequest,
        w1s12UpdateChecklistItem: IRequest,
        w1s12getFormatedEmail: IRequest,
        w1s12sendEmail: IRequest,
        w1s13getInvoiceDetails: IRequest,
        w1s13sendInvoice: IRequest,
        w1s14getEmail: IRequest,
        w1s14sendEmail: IRequest,
        w1s15getReport: IRequest,
        w1s15sendReport: IRequest,
        w1PartyDocsRequiredFromParty: IRequest,
        w1s12done: IRequest,
        w1PartyDocsCountByParty: IRequest,
        w1PartyDocsSinglePartyUploaded: IRequest,
        w1PartyDocsUploadDocumentFromParty: IRequest,
        w1GetAllParties: IRequest,
        w2s1getInfo: IRequest,
        w2s1postInfo: IRequest,
        /*         w1PartyDocsUploadDocumentFromParty: IRequest */

    },
    docs: {
        getSinglePartyUploadedFileList: IRequest
        getSinglePartyRequiredFileList: IRequest
        getSinglePartyDocCount: IRequest
        postSinglePartyUploadFile: IRequest
        getChecklistItemsForParty: IRequest
        postChecklistItemsForParty: IRequest
    }
}
