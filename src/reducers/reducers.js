import {combineReducers} from "redux";
import  {userDataGetter} from "./userDataGetter";

export const allReducers = combineReducers({
    userDataGetter: userDataGetter,
})