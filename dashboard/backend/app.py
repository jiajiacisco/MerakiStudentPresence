#!/usr/bin/env python3
"""
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
"""

__author__ = "Jiade Lian <jiadlian@cisco.com>"
__copyright__ = "Copyright (c) 2023 Cisco and/or its affiliates."
__license__ = "Cisco Sample Code License, Version 1.1"

from flask import Flask,request,jsonify,make_response
import meraki
import pandas as pd                                                                                                                                                                      
import os
from dotenv import load_dotenv
import json
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta
import pytz

# Global Flask flask_app
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


@app.route('/', methods=['POST'])
def apiKey_page():
    """
    Checks if the  Meraki API Key is valid
    :return: JSON response indicating Success or Failure
    """
    jsonData = json.loads(request.data)
    API_KEY = jsonData["API_KEY"]
    dashboard = meraki.DashboardAPI(API_KEY, suppress_logging=True)
    
    try:
        orgData = dashboard.organizations.getOrganizations()
        data = {'message': 'API_KEY is valid', 'code': 'Success'}
        print("success")
        del dashboard
        return make_response(jsonify(data), 201) 
    except:
        data = {'message': 'API_KEY is invalid', 'code': 'Failure'}
        print("fail")
        del dashboard
        return make_response(jsonify(data), 401)


@app.route('/dashboard', methods=['GET'])
def returnData():
    """
    Uses Meraki API Key to retrieve the NAME and ID of all organizations and networks under the organization 
    :return: JSON response mapping Organizations Name & ID to Network Name & ID
    """

    API_KEY = request.args.get('APIKey')
    dashboard = meraki.DashboardAPI(API_KEY, suppress_logging=True)
    orgData = dashboard.organizations.getOrganizations()
    orgIDtoNetworkIDs = dict()
    arr = []
    allOrganisationsID = set()
    for data in orgData:
        allOrganisationsID.add("%s (%s)" %(data["name"],data["id"]))
     
    for orgIdAndName in allOrganisationsID:
        dictData = dict()
        orgId = orgIdAndName.split('(')[1]
        print("_____")
        allNetworks = dashboard.organizations.getOrganizationNetworks(orgId)
        allNetworkID = []
        for network in allNetworks:
            allNetworkID.append("%s (%s)"%(network['name'],network["id"]))

        dictData["orgId"] = orgIdAndName
        dictData["networkId"] = allNetworkID
        arr.append(dictData)
    orgIDtoNetworkIDs["data"] = arr
    print(orgIDtoNetworkIDs)
    del dashboard
    return make_response(jsonify(orgIDtoNetworkIDs), 200)


@app.route('/client', methods=['GET'])
def returnClientData():
    """
    Returns data of all network clients connected to the network at a specific time interval
    The time inveral is the current time up till the lookback period
    :return: JSON response containing data about each connected network client
    """
    API_KEY = request.args.get('APIKey')
    dashboard = meraki.DashboardAPI(API_KEY, suppress_logging=True)

    networkId = request.args.get('networkId')
    orgId = request.args.get('orgId')
    lookback = request.args.get('lookback')
    dashboard = meraki.DashboardAPI(API_KEY, suppress_logging=True)

    networkId = networkId.split('(')[1][:-1]
    orgId = orgId.split('(')[1][:-1]
    lookback = int(lookback) * 3600
    client = dashboard.networks.getNetworkClients(networkId, timespan=lookback, recentDeviceConnections=["Wireless"], perPage=5000)
    print(client)
    if not client:
        payload = dict()
        payload["data"] = [{}]
        return make_response(jsonify(payload), 200)  
    
    """
    Converting time from UTC to Australia,Melbourne
    """
    df = pd.DataFrame.from_dict(client)
    df['firstSeen'] = df['firstSeen'].apply(lambda x: (datetime.strptime(x,"%Y-%m-%dT%H:%M:%SZ") + timedelta(hours=11)).strftime("%Y-%m-%d %H:%M %p"))
    df['lastSeen'] = df['lastSeen'].apply(lambda x: (datetime.strptime(x,"%Y-%m-%dT%H:%M:%SZ") + timedelta(hours=11)).strftime("%Y-%m-%d %H:%M %p"))
    clientData =  df.to_dict('records')
    payload = dict()
    payload["data"] = clientData
    print(make_response(jsonify(payload), 200))
    return make_response(jsonify(payload), 200) 


@app.route('/clientWireless', methods=['GET'])
def returnClientDataWirelessStats():
    """
    Retrieves the MAC address of all wireless clients connected to the network at a specific datetime interval and uses the MAC address to retrieve
    additional information about each client
    :return: JSON response containing data about each connected network client
    """
    
    API_KEY = request.args.get('APIKey')
    dashboard = meraki.DashboardAPI(API_KEY, suppress_logging=True)

    networkId = request.args.get('networkId')
    orgId = request.args.get('orgId')
    startDateTime = request.args.get('start')
    endDateTime = request.args.get('end')

    START_TIME = datetime.strptime(startDateTime,"%Y-%m-%dT%H:%M") - timedelta(hours=11)
    START_TIME = datetime.strftime(START_TIME,"%Y-%m-%dT%H:%M") + ":00Z" 

    END_TIME = datetime.strptime(endDateTime,"%Y-%m-%dT%H:%M") - timedelta(hours=11)
    END_TIME = datetime.strftime(END_TIME,"%Y-%m-%dT%H:%M") + ":00Z" 
    networkId = networkId.split('(')[1][:-1]
    orgId = orgId.split('(')[1][:-1]

    print(START_TIME)
    print(END_TIME)

    wirelessStats = dashboard.wireless.getNetworkWirelessClientsConnectionStats(networkId, t0=START_TIME, t1=END_TIME)
    print(wirelessStats)
    
    if not wirelessStats:
        payload = dict()
        payload["data"] = [{}]
        return make_response(jsonify(payload), 200) 

    clientMacAddr = []
    for data in wirelessStats:
        clientMacAddr.append(data['mac'])

    clientDataAll = dashboard.networks.getNetworkClients(networkId, t0=START_TIME, recentDeviceConnections=["Wireless"], perPage=5000)
    clientDataFiltered = []
    for clientData in clientDataAll:
        if clientData['mac'] in clientMacAddr:
            clientDataFiltered.append(clientData)

    df = pd.DataFrame.from_dict(clientDataFiltered)

    """
    Converting time from UTC to Australia,Melbourne
    """
    df['firstSeen'] = df['firstSeen'].apply(lambda x: (datetime.strptime(x,"%Y-%m-%dT%H:%M:%SZ") + timedelta(hours=11)).strftime("%Y-%m-%d %H:%M %p"))
    df['lastSeen'] = df['lastSeen'].apply(lambda x: (datetime.strptime(x,"%Y-%m-%dT%H:%M:%SZ") + timedelta(hours=11)).strftime("%Y-%m-%d %H:%M %p"))

    clientDataFiltered =  df.to_dict('records')
    payload = dict()
    payload["data"] = clientDataFiltered
    return make_response(jsonify(payload), 200) 



@app.route('/networkEvents', methods=['GET'])
def returnNetworkEvents(): 
    """
    Retrieves all network authentication/association events from a network that took place at a specific datetime interval
    :return: JSON response containing data about each network event
    """

    API_KEY = request.args.get('APIKey')
    dashboard = meraki.DashboardAPI(API_KEY, suppress_logging=True)

    networkId = request.args.get('networkId')
    orgId = request.args.get('orgId')
    startDateTime = request.args.get('start')
    endDateTime = request.args.get('end')

    START_TIME = datetime.strptime(startDateTime,"%Y-%m-%dT%H:%M") - timedelta(hours=11) 
    timeSpanStart = START_TIME.timestamp()
    START_TIME = datetime.strftime(START_TIME,"%Y-%m-%dT%H:%M") + ":00Z"

    END_TIME = datetime.strptime(endDateTime,"%Y-%m-%dT%H:%M") - timedelta(hours=11) 
    timeSpanEnd = END_TIME.timestamp() 
    END_TIME = datetime.strftime(END_TIME,"%Y-%m-%dT%H:%M") + ":00Z" 
    
    networkId = networkId.split('(')[1][:-1]
    orgId = orgId.split('(')[1][:-1]
    # includedEventTypes = ['splash_auth','association','8021x_auth','8021x_eap_success','disassociation']
    networkData = dashboard.networks.getNetworkEvents(networkId, startingAfter=START_TIME, includedEventTypes = ['8021x_auth','splash_auth','association','disassociation'], productType='wireless',perPage=1000)
    print(networkData)
    networkEventsWithinTimespan = []
    networkEvents = networkData['events']
    clientIds = set() 
    networkUserIds = []

    """
    Creating a mapping between clientId and UserName
    """
    clientDataAll = dashboard.networks.getNetworkClients(networkId, t0=START_TIME, recentDeviceConnections=["Wireless"], perPage=5000)
    clientIdtoUsername = dict()
    for clientData in clientDataAll:    
        clientId = clientData['id']
        clientUsername = clientData['user']
        clientIdtoUsername[clientId] = clientUsername
    print(clientIdtoUsername)

    for event in networkEvents:
        if event['clientId'] not in clientIds:
            eventOccurence = event['occurredAt']
            eventOccurence = (datetime.strptime(eventOccurence,"%Y-%m-%dT%H:%M:%S.%fZ")).timestamp() 
            if timeSpanStart<=eventOccurence<=timeSpanEnd:
                networkEventsWithinTimespan.append(event)
                try:
                    networkUserIds.append(clientIdtoUsername[event['clientId']])
                    #networkUserIds.append(event['eventData']['identity'])
                except:
                    networkUserIds.append("None")
                #clientIds.add(event['clientId'])

    if not networkEventsWithinTimespan:
        print("no data")
        payload = dict()
        payload["data"] = [{}]
        return make_response(jsonify(payload), 200) 

    df = pd.DataFrame.from_dict(networkEventsWithinTimespan)


    df["UserName"] = networkUserIds 

    """
    Converting time from UTC to Australia,Melbourne
    """
    df['occurredAt'] = df['occurredAt'].apply(lambda x: (datetime.strptime(x,"%Y-%m-%dT%H:%M:%S.%fZ") + timedelta(hours=11)).strftime("%Y-%m-%d %H:%M %p")) 
    df['eventData'] = df['eventData'].apply(lambda x: str(x))
    clientDataFiltered =  df.to_dict('records')
    payload = dict()
    payload["data"] = clientDataFiltered
    return make_response(jsonify(payload), 200) 

if __name__ == '__main__':

    app.run()


