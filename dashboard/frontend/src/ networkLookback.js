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

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from "./campus.jpg";
import {useLocation} from 'react-router-dom';

const NetworkLookback = () => {

    const myStyle = {
        backgroundImage: `url(${background})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    const location = useLocation();
    const API_KEY = location.state.APIkey
    const navigate = useNavigate();

    let [orgIdList, setOrgIdList] = useState([]);
    let [networkIdList, setnetworkIdList] = useState([]);
    let [networkId, setNetwork] = useState([]);
    let [lookbackHours, setLookbackHours] = useState(12);
    let [orgId, setorgId] = useState('Organisation');
    let [id, setId] = useState('Network');
    
    useEffect(()=>{
        getAllState();
    },[]);

    const getAllState = async () => {
        const result =  await  axios.get("/dashboard", {
            params: {
              APIKey: API_KEY
            }
          })
        setNetwork(result.data.data)
        for (let i = 0; i<result.data.data.length;i++) {
            setOrgIdList(oldArray => [...oldArray,result.data.data[i]['orgId']] );
            console.log(result.data.data[i]['networkId'])
        }
    }
        
    const onStateChange = async (event)=> { 
        setorgId(event.target.value)
        for (let i = 0; i<networkId.length;i++) {
            if (networkId[i]["orgId"] === event.target.value) {
                setnetworkIdList(networkId[i]["networkId"])
            }
            if (event.target.value==="Organisation") {
                setnetworkIdList([])
            }
        }
    }

    const changePage = (event)=> { 
        navigate("/networkStats",
        {state:{APIkey:API_KEY}}
        )
    }

    const handleSubmit = async (event)=>{
        event.preventDefault();
        if ( orgId === "Organisation" ||  id === "Network" ) {
        } 
        else {
        axios.get('/client', {
            params: {
              networkId: id,
              orgId: orgId,
              lookback: lookbackHours,
              APIKey: API_KEY
            }
          })
          .then(function (response) {
            navigate("/table",
            {state:{clientData:response.data}}
            )
          })
        }
    }

    return (
        
        <div className='main' style={myStyle}>
        <div className="create" > 
            <h2>Welcome Back! </h2>
            <form onSubmit={handleSubmit}>
            <label>Select your organisation</label>
            <select onChange={(event)=>{onStateChange(event)}}>
            <option>Organisation</option>
            {
                orgIdList.map((item)=> {
                    return (<option key={item.id}> {item}</option>)
                })
            }

            </select>
                <label>Select your Network</label>
                <select onChange={(e) =>  setId(e.target.value)} > 
                <option>Network</option>
                {
                    networkIdList.map((item)=>{
                        return(<option> {item}</option>)
                        
                    })
                }
            </select>
                <label>Lookback Period (Hours)</label>
                <input 
                type="number" 
                required 
                value={lookbackHours}
                onChange={(e) =>  setLookbackHours(e.target.value)}
                />
                <button>Submit</button>

            </form>
            <button className='nav' onClick={changePage}> Change Selection Mode </button>
        </div>
        </div>
    );
};

export default NetworkLookback;