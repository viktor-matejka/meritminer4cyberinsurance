import {ActionTypes, ErrorFetchingPredictions, FetchedPredictions, FetchingPredictions, EventlogState} from "./types";

const initialState: EventlogState = {
    file: null,
    loading: false
};

export const uploadEventlog = () => {
    return (
        state = initialState,
        action: FetchingPredictions | FetchedPredictions | ErrorFetchingPredictions
    ) => {
        switch (action.type) {
            case ActionTypes.FETCHING_EVENTLOGFILE:
                return {
                    ...state, 
                    eventlogFile: action.eventlogFile,
                    loading: action.loading
                };
            case ActionTypes.FETCHED_EVENTLOGFILE:
                return {
                    ...state,
                    loading: action.loading
                };
            case ActionTypes.ERROR_FETCHING_EVENTLOGFILE:
                return {...state, error: action.error, loading: action.loading};
            default:
                return state;
        }
    };
};