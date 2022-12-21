import { errorNotifications } from "../redux/errorReducer";

export type IEnv = "prod" | "dev" | "test" | "qa" | "uat"

// response from server
export interface IUserRes {
    "fullName": string
    "error"?: boolean
    "message"?: string
    "userName": string
    "id": number
}

// client app user store
export interface IAppUser {
    name: string,
    id: number
    isLoggedIn: boolean,
    isAdmin: boolean
}

// user status

export interface IUserState {
    info: IAppUser
    isLoggedIn: boolean,
}

export interface IEnvConfig {
    name: string
    color: string
    slug: IEnv
}

export interface INotification {
    msg: string;
    id: string;
}

export interface IRootState {

    userSession: IAppUser
    errorNotifications: INotification[],
    infoNotifications: INotification[],
    themeReducer: { className: string },
    sidebarReducer: {
        show: boolean,
        collapse: boolean,
    },
    router?: any
}

export type ErrorNotificationActions = 'ADD_ERROR' | 'REMOVE_ERROR' | 'REMOVE_ALL_ERRORS' | 'LOCATION_CHANGE';

export type InfoNotificationActions = 'ADD_INFO' | 'REMOVE_INFO' | 'REMOVE_ALL_INFO' | 'LOCATION_CHANGE';


export type LogUserActions = 'UPDATE_USER' | 'LOGOUT_USER';

export interface IEditRTOptions extends IRTTableOptions {
    inputKeys: string[];
}
export interface IRTTableOptions {
    inputKeys?: string[];
    tableHead: {
        Header: string,
        accessor: string,
        filterable?: boolean,
        width?: number,
        minWidth?: number,
        sortable?: boolean,
        sortMethod?: any,
        filterMethod?: any
    }[],
    defaultSorted?: IREdefaultSorted[]
    convertToTableData?: (data: any) => void
}
export interface IREdefaultSorted {
    id: string
    desc: boolean
}


export interface ILabelValueBlock {
    label: string
    value: string | JSX.Element | number
    errorMessage?: string
}

export interface ITabProps {
    tabButton: string
    tabContent: JSX.Element
}

export interface ISelectOption {
    value: any,
    label: string
}

export interface INotificationProps {
    addErrorAction: (payload: INotification) => void
    addInfoAction: (payload: INotification) => void
}

export interface IInputField {
    id: string
    required: boolean
    type: string
    options?: {
        value: string | number
        label: string
    }[]
}