import './App.scss';
import React from "react";
import {Landing} from "./Landing/Landing";


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
        <Landing />
    </div>
  );
}

export default App;
