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

import React from "react";
import "./App.css";
import './index.css';
import Home from "./home";
import {Routes ,Route} from "react-router-dom"
import TanStackTable from "./stackTable";
import TanStackTableEvent from "./stackTableEvent";
import NetworkEvents from "./networkEvents";
import NetworkLookback from "./ networkLookback";
import NetworkStats from "./networkStats";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/networkEvents" element={ <NetworkEvents/> } />
        <Route path="/networkLookback" element={ <NetworkLookback /> } />
        <Route path="/networkStats" element={ <NetworkStats/> } />
        <Route path="/table" element={ <TanStackTable/> } />
        <Route path="/EventTable" element={ <TanStackTableEvent/> } />

      </Routes>
    </div>
  )
}
 
export default App;
