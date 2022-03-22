export type EventlogFile = {
    file: File
}

export enum ActionTypes {
    FETCHING_EVENTLOGFILE = "FETCHING_EVENTLOGFILE",
    FETCHED_EVENTLOGFILE = "FETCHED_EVENTLOGFILE",
    ERROR_FETCHING_EVENTLOGFILE = "ERROR_FETCHING_EVENTLOGFILE"
}

/**
 * Action Types
 */
export type FetchingPredictions = {
    type: ActionTypes.FETCHING_EVENTLOGFILE,
    eventlogFile: EventlogFile,
    loading: boolean
};

export type FetchedPredictions = {
    type: ActionTypes.FETCHED_EVENTLOGFILE,
    loading: boolean
};


export type ErrorFetchingPredictions = {
    type: ActionTypes.ERROR_FETCHING_EVENTLOGFILE;
    error: string;
    loading: boolean;
};

/**
 * State Type
 */
export type EventlogState = {
    file: File | null,
    error?: string,
    loading: boolean
};