import {ThunkDispatch} from "redux-thunk";
import {ActionTypes, ErrorFetchingPredictions, FetchedPredictions, FetchingPredictions} from "./types";
import {getDomain} from "../../helpers/Domain";
import {HTTP_OPTIONS, PROTOCOL_METHOD} from "../../helpers/FetchOptions";

export const fetchEventlog = (file: File): any => {
    return async (
        dispatch: ThunkDispatch<{}, {}, FetchingPredictions | FetchedPredictions | ErrorFetchingPredictions>
    ) => {
        const input = document.getElementById('uploadEventlog');
        const data = new FormData()
        console.log('input', input);
        
        data.append('file', input.files[0])

        dispatch({
            type: ActionTypes.FETCHING_EVENTLOGFILE,
            eventlogFile: {file},
            loading: true
        });

        //dummy promise
        await new Promise(resolve => setTimeout(resolve, 1000));
        fetch(`${getDomain()}/predict`, {...HTTP_OPTIONS(PROTOCOL_METHOD.POST), body=data})
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch server...');
                }
            })
            .then((response: any) => {
                dispatch({
                    type: ActionTypes.FETCHED_EVENTLOGFILE,
                    predictions: response,
                    loading: false
                });
            })
            .catch((error: string) => {
                dispatch({
                    type: ActionTypes.ERROR_FETCHING_EVENTLOGFILE,
                    error,
                    loading: false
                });
            });
    };
};