import {ACTIONS} from "../actions/actions";
import {initialStore} from "../store/store";

export const userDataGetter = (state = initialStore, action) => {
    switch(action.type) {
        case ACTIONS.GET_USER_DATA: {
            return {...state,  chosenUser: action.payload}
        }
        default: {
            return state
        }
    }
}