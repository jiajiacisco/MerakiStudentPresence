# Meraki Student Presence

**Background:** <br/> University is looking to refresh existing network equipment. To position Meraki in a stronger position, we wanted to show that besides providing network connectivity and cloud-based management,
Meraki APIs can be used to simplify certain operational and administrative works in the school environment 
<br/>

**Product Description:** <br/>
MerakiStudentPresence makes use of Meraki APIs and telemetry data to enable university admins to have greater visbility into a student's activity in the univeristy campus <br/>

**Use Cases:** 
1. **Attendance Taking** Verify if a student visited the campus on a certain date and time
2. **Location Analytics** Verify student location on campus based on the Access Point his device is connected to
3. **Device Lost&Found** When a device goes missing, we can narrow down the location by checking which access point it is connected to

**Product Overview**<br/>
1. **Login Page:<space>** Enter your Meraki API Key that is obtainable from your Meraki Dashboard <br/>
![App Interface Diagram](https://github.com/jiajiacisco/MerakiStudentPresence/blob/main/images/p3.png)
3. **Query Page:<space>** The webpage will fetch the Meraki Organisation and Network your API Key has access to. Select what you wish to query and input the datetime period. <br/>
![App Interface Diagram](https://github.com/jiajiacisco/MerakiStudentPresence/blob/main/images/p4.png)
4. **Query Records:<space>** Display data for all users that associated and disassociate with the Meraki Network. Data is downloadable into excel for further use. <br/>
![App Interface Diagram](https://github.com/jiajiacisco/MerakiStudentPresence/blob/main/images/p5.png)
5. **Built-in Search Functionality:<space>** Allow users to search and filter data for a particular Date, User Name or Device Name. <br/>
![App Interface Diagram](https://github.com/jiajiacisco/MerakiStudentPresence/blob/main/images/p6.png)

# App Design <br />
![Overall Block Diagram](https://github.com/jiajiacisco/MerakiStudentPresence/blob/main/images/p1.png)
![Overall Block Diagram](https://github.com/jiajiacisco/MerakiStudentPresence/blob/main/images/p2.png)

**Technolgies Used:** 
Meraki API, ReactJS,Python, Flask




