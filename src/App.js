import './App.scss';
import React from "react";
import {Landing} from "./Landing/Landing";
import {Pagination} from "./Pagination/Pagination";

const LIMIT_OF_USERS_ON_THE_PAGE = 20;

export const fetchCharacters = page => {
  // https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json
  return fetch(`https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json?offset=${(page - 1) * LIMIT_OF_USERS_ON_THE_PAGE}&limit=${LIMIT_OF_USERS_ON_THE_PAGE}`).then(response => {
    console.log(response)
    return response.json();
  }).then(data => {
    return data.map(user => {
      return user
    })
  }).catch((reason => console.log(reason)))
}



function App() {
  return (
    <div className="app">
        <Landing pageSize={LIMIT_OF_USERS_ON_THE_PAGE}/>
        <Pagination pageSize={LIMIT_OF_USERS_ON_THE_PAGE}/>
    </div>
  );
}

export default App;
