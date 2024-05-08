/*
Copyright (c) 2023 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.


__author__ = "Jiade Lian <jiadlian@cisco.com>, Rey Diaz <rediaz@cisco.com>"
__copyright__ = "Copyright (c) 2023 Cisco and/or its affiliates."
__license__ = "Cisco Sample Code License, Version 1.1"
*/

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import background from "./home.png";

function Home() {

  const [API_KEY, setapiKey] = useState('');
  const [message, setmessage] = useState('');
  const navigate = useNavigate();

  async function postJSON(data) {
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
       const result = await response.json();
       console.log(result)
       if (result["code"]==='Failure') {
        setmessage("API KEY is not valid")
       }else{
        navigate("/networkEvents",
        {state:{APIkey:API_KEY}}
        )
       }
    } catch (error) {
      console.log("error")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiSubmit = {API_KEY};
    postJSON(apiSubmit);
  }

  const myStyle = {
    backgroundImage: `url(${background})`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
};

    return (
      <div className="home" style={myStyle}>
      <div className="submit">
      <h2>Enter Meraki API Key</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          required 
          value={API_KEY}
          onChange={(e) => setapiKey(e.target.value)}
        />
        <p className="errormsg">{message}</p>
        <button>Submit</button>
      </form>
    </div>
    </div>
    );
  }

export default Home

