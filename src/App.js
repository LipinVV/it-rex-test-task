import './App.scss';
import React from "react";
import {UsersTemplate} from "./UsersTemplate/UsersTemplate";
import {createStore} from "redux";
import {allReducers} from "./reducers/reducers";

export const store = createStore(
    allReducers,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
  localStorage['redux-store'] = JSON.stringify(store.getState());
})

export const fetchCharacters = () => {
  return fetch(`https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json`).then(response => {
    return response.json();
  }).then(data => {
    return data.map(user => {
      return user;
    })
  }).catch((reason => console.log(reason)))
}


function App() {
  return (
    <div className="app">
        <UsersTemplate />
    </div>
  );
}

export default App;
