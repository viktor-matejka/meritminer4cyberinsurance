import {
    ActionTypes,
    UpdateProfile,
    UpdateServiceConfiguration,
    UserProfileState
} from "./types";

const initialState: UserProfileState = {
    profile: {
        budget: 0,
        budgetWeight: 1,
        businessValue: 0,
        companyName: "",
        employeeTraining: 1,
        externalAdvisor: false,
        failedAttacks: 0,
        industry: "TELECOM",
        investedAmount: 0,
        knownVulnerabilities: 0,
        nrEmployees: 0,
        region: "EUROPE",
        successfulAttacks: 0
    },
    serviceConfiguration: {
        "serviceType": ["PROACTIVE"],
        "attackType": ["APPLICATION"],
        "deploymentTime": "SECONDS",
        "deploymentTimeWeight": 1,
        "leasingPeriod": "MINUTES",
        "leasingPeriodWeight": 1,
    }
};

export const profileReducer = () => {
    return (
        state = initialState,
        action: UpdateProfile | UpdateServiceConfiguration
    ) => {
        switch (action.type) {
            case ActionTypes.UPDATING_PROFILE:
                return {profile: action.profile, serviceConfiguration: {...state.serviceConfiguration}};
            case ActionTypes.UPDATING_SERVICE_CONFIGURATION:
                return {profile: {...state.profile}, serviceConfiguration: action.serviceConfiguration};
            default:
                return state;
        }
    };
};