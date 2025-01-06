import React,{useState,useEffect} from 'react'
import '../styles/counterRecruiterDashboard.css'
import { decodeToken } from '../utils/decodeToken';
import { monthlyCount } from '../utils/monthlyCount';
import { dailyCount } from '../utils/dailyCount';
import axios from 'axios';
import {getCurrentQuarterData}  from '../utils/getQuarterly'

function CounterRecruiterDashBoard() {
    const [recruiterId, setRecruiterId] = useState('');
    const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
    const [counterData,setCounterData] = useState();
       

         const fetchData = async () => {
            try {
              const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
              // const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
              const data = response.data;
          
              // Flatten the nested data if necessary
              const flattenedData = data.map(candidate => ({
                ...candidate.common,
                ...candidate.infosys,
                ...candidate.jobDetails,
                ...candidate.wipro1,
                ...candidate.wipro2,
                ...candidate.accenture,
                ...candidate.other,
                _id: candidate._id, // Ensure _id is preserved
              }));
          
              // Filter by recruiterId
              const filteredData = flattenedData.filter(item => item.recruiterId === recruiterId.toString());
              const QuarterlyData = getCurrentQuarterData(filteredData);
              const interviewAttendedData = QuarterlyData.filter(item => item.interviewStatus === 'attended');
              const shorlisted = QuarterlyData.filter(item => item.interviewFinalStatus === 'shortlisted');
              const JoinedData = QuarterlyData.filter(item => item.joinedStatus === 'joined')
              
               const joinedValueData = JoinedData.reduce((sum, item) => sum + +(item.billValue || 0), 0);

        
              const monthlyProfileSubmission =   monthlyCount(QuarterlyData);
              const monthlyInterviewAttended = monthlyCount(interviewAttendedData);
              const monthlyShortlisted =   monthlyCount(shorlisted);
              const monthlyJoined = monthlyCount(JoinedData)
              
             
              
            
        
           
              // Initialize counts
            
              
            
        
              // Prepare counter array
              const counter = [
               {
                  id: 1,
                  name: "Profile Submission",
                  monthlycount:monthlyProfileSubmission.length, 
               },
               {
                  id: 2,
                  name: "Interview Attended",
                  monthlycount: monthlyInterviewAttended.length,
               },
               {
                  id: 3,
                  name: "Shortlisted",
                  monthlycount: monthlyShortlisted.length,
               },
               {
                  id: 4,
                  name: "Joined",
                  monthlycount: monthlyJoined.length,
               },
               {
                  id: 5,
                  name: "Joined Value",
                  monthlycount:joinedValueData,
               }
            ]
          
          
              // Set the counters or handle them as needed
             
              setCounterData(counter); // Assuming you want to set this data somewhere
          
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
           
          useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
              const decodedToken = decodeToken(token);
              if (decodedToken && decodedToken.userId) {
                setRecruiterId(decodedToken.userId);
              }
            }
          }, []);
        
          // Fetch data when recruiterId changes
          useEffect(() => {
            if (recruiterId) {
              fetchData();
            }
            if(adminLoggedIn){
              // fetchAllData()
            }
          }, [recruiterId]);
      

   
  return (
    <div className='counterrecruiterdashboard-main'>
         {  counterData &&
            counterData.map((data,index) => (
         <div key={index} className="recruiterDashboard-countercard ">
              
               <p className='monthly'>{data.monthlycount}</p>
               <h4>{data.name}</h4>
               
         </div>
            ))
       }
    </div>
  )
}

export default CounterRecruiterDashBoard