import {ThunkDispatch} from "redux-thunk";
import {ActionTypes, ErrorFetchingPredictions, FetchedPredictions, FetchingPredictions} from "./types";
import {getDomain} from "../../helpers/Domain";
import {HTTP_OPTIONS, PROTOCOL_METHOD} from "../../helpers/FetchOptions";
import { convertor } from "../../helpers/Convertor"
interface UserProfile {
    investedAmount: number,
    successfulAttacks: number,
    failedAttacks: number,
    businessValue: number,
    nrEmployees: number,
    employeeTraining: number,
    knownVulnerabilities: number,
    externalAdvisor: boolean
}

export const fetchPredictions = (profile: UserProfile): any => {
    return async (
        dispatch: ThunkDispatch<{}, {}, FetchingPredictions | FetchedPredictions | ErrorFetchingPredictions>
    ) => {

        dispatch({
            type: ActionTypes.FETCHING_PREDICTIONS,
            loading: true
        });
        const body = convertor(profile)
        //dummy promise
        await new Promise(resolve => setTimeout(resolve, 1000));
        fetch(`${getDomain()}/predict`, {...HTTP_OPTIONS(PROTOCOL_METHOD.POST), body: JSON.stringify(body)})
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch server...');
                }
            })
            .then((response: any) => {
                dispatch({
                    type: ActionTypes.FETCHED_PREDICTIONS,
                    predictions: response,
                    loading: false
                });
            })
            .catch((error: string) => {
                dispatch({
                    type: ActionTypes.ERROR_FETCHING_PREDICTIONS,
                    error,
                    loading: false
                });
            });
    };
};