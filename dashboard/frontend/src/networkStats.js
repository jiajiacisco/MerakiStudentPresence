import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from "./campus.jpg";
import {useLocation} from 'react-router-dom';

const NetworkStats = () => {

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
    let [orgId, setorgId] = useState('Organisation');
    let [id, setId] = useState('Network');
    let [startDateTime, setstartDateTime]= useState('');
    let [endDateTime, setendDateTime]= useState('');
    let [message, setmessage] = useState('');

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

    const changePage = (event)=> { 
        navigate("/networkEvents",
        {state:{APIkey:API_KEY}}
        )
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

    const handleSubmit = async (event)=>{
        event.preventDefault();
        if ( orgId === "Organisation" ||  id === "Network" ) {
        } else {
        axios.get('/clientWireless', {
            params: {
              networkId: id,
              orgId: orgId,
              start:startDateTime,
              end: endDateTime,
              APIKey: API_KEY
            }
          }).then(function (response) {
            navigate("/table",
            {state:{clientData:response.data}}
            )
          }).catch(error => {
            setmessage("Invalid Inputs Please Change them" )
          })
    }
    }

    return (

        <div className='main' style={myStyle}>
        <div className="create">  
            <h2>Welcome Back!</h2>
            <form onSubmit={handleSubmit}>
                <label>Select your organisation</label>
                <select onChange={(event)=>{onStateChange(event)}}>
                <option>Organisation</option>
                {
                    orgIdList.map((item)=> {
                        return (<option key={item}> {item}</option>)
                    })
                }
                </select>
                    <label>Select your Network</label>
                    <select onChange={(e) =>  setId(e.target.value)} > 
                    <option>Network</option>
                    {
                        networkIdList.map((item)=>{
                            return(<option key={item}> {item}</option>)
                            
                        })
                    }
                    </select>
                {/* YYYY-MM-DDThh:mm:ssZ */}
                <label>Start DateTime</label>
                    <input 
                    type="datetime-local" 
                    required 
                    value={startDateTime}
                    onChange={(e) =>  setstartDateTime(e.target.value)}
                    />  
                <label>End DateTime</label>
                    <input 
                    type="datetime-local" 
                    required 
                    value={endDateTime}
                    onChange={(e) =>  setendDateTime(e.target.value)}
                    />  
                    <button>Submit</button>
            </form>
            <p className="errormsg">{message}</p>
            <button className='nav' onClick={changePage}> Change Selection Mode </button>
        </div>
        </div>
    );
};
export default NetworkStats;
