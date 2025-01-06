import React,{useState,useEffect} from 'react'
import '../styles/preSchedule.css'
import PrescheduleButtons from '../components/PrescheduleButtons'
import ProfileSubmissions from '../components/ProfileSubmissions';
import InterviewAttendedSheet from '../components/InterviewAttendedSheet';
import CounterDisplay from '../components/CounterDisplay';
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import { monthlyCount } from '../utils/monthlyCount';
import { dailyCount } from '../utils/dailyCount';
import TurnUpDatas from '../components/TurnUpDatas';

function PreSchedule() {
  const [form, setForm] = useState("profilesubmission");
  const [recruiterId, setRecruiterId] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
  const [preCounterData,setPreCounterData] = useState();


  const InterviewdailyCount = (data) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
        const DailyFiltered = data.filter(item => {
          const itemDate = new Date(item.interviewdate).toISOString().split('T')[0]; // Convert item date to 'YYYY-MM-DD'
          return itemDate === currentDate;
        });
       return DailyFiltered 
    } catch (error) {
        console.log("Error occured in DailyCount utils :",error)
    }
}

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
      if(recruiterId && !adminLoggedIn){
       

        const filteredData = flattenedData.filter(item => item.recruiterId === recruiterId.toString());
        const interviewAttendedData = filteredData.filter(item => item.interviewStatus === 'attended');
        const interviewNotAttendedData = filteredData.filter(item => item.interviewStatus === 'notattended')
        const interviewHoldData = filteredData.filter(item => item.interviewStatus === 'hold')
  
        const monthlyFiltered =   monthlyCount(filteredData);
        const DailyFiltered =  dailyCount(filteredData);
        const monthlyattended = monthlyCount(interviewAttendedData);
        const Dailyattended = InterviewdailyCount(interviewAttendedData)
        const monthlyNotAttended = monthlyCount(interviewNotAttendedData)
        const DailyNotAttended = InterviewdailyCount(interviewNotAttendedData)
        const monthlyHold = monthlyCount(interviewHoldData)
        const DailyHold = dailyCount(interviewHoldData)
  
        const monthlyScreeningRejected = monthlyCount(filteredData.filter(item => item.interviewStatus === 'rejected'));
        const DailyScreeningRejected = dailyCount(filteredData.filter(item => item.interviewStatus === 'rejected'));
        const monthlyScheduled = monthlyCount(filteredData.filter(item => item.interviewStatus !== 'rejected'));
        const DailyScheduled = dailyCount(filteredData.filter(item => item.interviewStatus !== 'rejected'));
  
      
        // Initialize counts
        let totalSubmissions = monthlyFiltered.length;
        let totalSubmissionsDaily = DailyFiltered.length
        
        let totalAttended = monthlyattended.length;
        let totalNotAttended = monthlyNotAttended.length;
        let totalHold =monthlyHold.length;
    
  
        // Prepare counter array
        const counter = [
          {
            id: 1,
            name: "Profile Submission",
            monthlycount: totalSubmissions,
            dailycount: totalSubmissionsDaily 
          },
          {
            id: 2,
            name: "Interview Scheduled",
            monthlycount:  monthlyScheduled.length,
            dailycount:DailyScheduled.length // Get last day count
          },
          {
            id: 3,
            name: "Screening Rejected",
            monthlycount:  monthlyScreeningRejected.length,
            dailycount:DailyScreeningRejected.length // Get last day count
          },
          {
            id: 4,
            name: "Interview Attended",
            monthlycount: totalAttended,
            dailycount: Dailyattended.length// Get last day count
          },
          {
            id: 5,
            name: "Not Attended",
            monthlycount: totalNotAttended,
            dailycount:DailyNotAttended.length// Get last day count
          },
          {
            id: 6,
            name: "Interview Hold",
            monthlycount: totalHold,
            dailycount: DailyHold.length // Get last day count
          }
        ];
    
        setPreCounterData(counter); 
      }else if(adminLoggedIn){
       
        const filteredData = flattenedData;
      const interviewAttendedData = filteredData.filter(item => item.interviewStatus === 'attended');
      const interviewNotAttendedData = filteredData.filter(item => item.interviewStatus === 'notattended')
      const interviewHoldData = filteredData.filter(item => item.interviewStatus === 'hold')

      const monthlyFiltered =   monthlyCount(filteredData);
      const DailyFiltered =  dailyCount(filteredData);
      const monthlyattended = monthlyCount(interviewAttendedData);
      const Dailyattended = InterviewdailyCount(interviewAttendedData)
      const monthlyNotAttended = monthlyCount(interviewNotAttendedData)
      const DailyNotAttended = InterviewdailyCount(interviewNotAttendedData)
      const monthlyHold = monthlyCount(interviewHoldData)
      const DailyHold = dailyCount(interviewHoldData)

      const monthlyScreeningRejected = monthlyCount(filteredData.filter(item => item.interviewStatus === 'rejected'));
      const DailyScreeningRejected = dailyCount(filteredData.filter(item => item.interviewStatus === 'rejected'));
      const monthlyScheduled = monthlyCount(filteredData.filter(item => item.interviewStatus !== 'rejected'));
      const DailyScheduled = dailyCount(filteredData.filter(item => item.interviewStatus !== 'rejected'));

    
      // Initialize counts
      let totalSubmissions = monthlyFiltered.length;
      let totalSubmissionsDaily = DailyFiltered.length
      
      let totalAttended = monthlyattended.length;
      let totalNotAttended = monthlyNotAttended.length;
      let totalHold =monthlyHold.length;
  

      // Prepare counter array
      const counter = [
        {
          id: 1,
          name: "Profile Submission",
          monthlycount: totalSubmissions,
          dailycount: totalSubmissionsDaily 
        },
        {
          id: 2,
          name: "Interview Scheduled",
          monthlycount:  monthlyScheduled.length,
          dailycount:DailyScheduled.length // Get last day count
        },
        {
          id: 3,
          name: "Screening Rejected",
          monthlycount:  monthlyScreeningRejected.length,
          dailycount:DailyScreeningRejected.length // Get last day count
        },
        {
          id: 4,
          name: "Interview Attended",
          monthlycount: totalAttended,
          dailycount: Dailyattended.length// Get last day count
        },
        {
          id: 5,
          name: "Not Attended",
          monthlycount: totalNotAttended,
          dailycount:DailyNotAttended.length// Get last day count
        },
        {
          id: 6,
          name: "Interview Hold",
          monthlycount: totalHold,
          dailycount: DailyHold.length // Get last day count
        }
      ];
  
      setPreCounterData(counter); // Assuming you want to set this data somewhere
    }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

 

  // Decode token and set recruiter ID
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
   
  }, [recruiterId]);

  const loadData =  () => {
    fetchData();
  }


  return (
    <div  className='preschedule-main '>
        <CounterDisplay counterData={preCounterData}  />
      <div className='d-flex w-100'>
            <PrescheduleButtons setForm={setForm}/>
          
      </div>
         
          <div className="tablesection m-4">
            {form === "profilesubmission" && <ProfileSubmissions loadData={loadData} />}
            {form === "interview" && <InterviewAttendedSheet  loadData={loadData}/>}
            {form === "t&d" && <TurnUpDatas/>}
            </div>
    </div>
  )
}

export default PreSchedule