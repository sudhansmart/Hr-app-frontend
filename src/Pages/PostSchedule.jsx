import React,{useState,useEffect} from 'react'
import '../styles/postschedule.css'
import ShortlistSheet from '../components/ShortlistSheet'
import PostScheduleButtons from '../components/PostScheduleButtons'
import OfferSheet from '../components/OfferSheet';
import Joined from '../components/Joined';
import Drops from '../components/Drops';
import ShorlistOnHold from '../components/ShorlistOnHold';
import CounterDisplay from '../components/CounterDisplay';
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import { monthlyCount } from '../utils/monthlyCount';
import { dailyCount } from '../utils/dailyCount';
import Billing from './Billing';
function PostSchedule() {
    const [form, setForm] = useState("shortlist");
    const [recruiterId, setRecruiterId] = useState('');
    const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
    const [postCounterData,setPostCounterData] = useState();

    
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
        const shortlistedData = filteredData.filter(item => item.interviewFinalStatus === 'shortlisted');
        const offerReceived = filteredData.filter(item => item.offerStatus === 'released');
        const JoinedData = filteredData.filter(item => item.joinedStatus === 'joined')
        const droppedData = filteredData.filter(item => item.joinedStatus === "drop" || item.interviewFinalStatus === "rejected" || item.offerStatus === "drop")
        const onHoldData = filteredData.filter(item => item.offerStatus === 'hold')
        const monthlyShortlisted =   monthlyCount(shortlistedData);
        const monthlyOfferReceived = monthlyCount(offerReceived);
        const monthlyJoined = monthlyCount(JoinedData)
        const monthlyDropped = monthlyCount(droppedData)
        const monthlyOnHold = monthlyCount(onHoldData)
        
      
  
     
        // Initialize counts
        let totalShortlisted = monthlyShortlisted.length;
      
        
      
  
        // Prepare counter array
        const counter = [
          {
                 id: 1,
                 name: "shortlisted",
                 monthlycount:totalShortlisted,
                
             },
             {
                 id: 2,
                 name: "Offer Received",
                 monthlycount:monthlyOfferReceived.length,
                
             },
             {
                 id: 3,
                 name: "Joined",
                 monthlycount:monthlyJoined.length,
                
                 
             },
             {
                 id: 4,
                 name: "Drops",
                 monthlycount: monthlyDropped.length,
                 
             },
             {
                 id: 5,
                 name: "Shorlist On Hold",
                 monthlycount:monthlyOnHold.length,
                
             }
       ]
    
    
        // Set the counters or handle them as needed
        
        setPostCounterData(counter); 
      }else if(adminLoggedIn){
       
        const filteredData = flattenedData;
        console.log("actual data :",filteredData)
        const shortlistedData = filteredData.filter(item => item.interviewFinalStatus === 'shortlisted' &&
                                                             item.offerStatus !== 'released' && 
                                                             item.offerStatus !== 'hold'  &&
                                                             item.offerStatus !== 'drop');
        const offerReceived = filteredData.filter(item => item.offerStatus === 'released' && 
                                                          item.joinedStatus !== 'joined'  &&
                                                          item.joinedStatus !== "drop"
                                                          );
        const JoinedData = filteredData.filter(item => item.joinedStatus === 'joined')
        const droppedData = filteredData.filter(item => item.joinedStatus === "drop" || item.interviewFinalStatus === "rejected")
        const onHoldData = filteredData.filter(item => item.offerStatus === 'hold')
  
        const monthlyShortlisted =   monthlyCount(shortlistedData);
        console.log("monthly short count :",monthlyShortlisted)
        const monthlyOfferReceived = monthlyCount(offerReceived);
        const monthlyJoined = monthlyCount(JoinedData)
        const monthlyDropped = monthlyCount(droppedData)
        const monthlyOnHold = monthlyCount(onHoldData) 
        
      
        
     
        // Initialize counts
        let totalShortlisted = monthlyShortlisted.length;
      
        
      
  
        // Prepare counter array
        const counter = [
          {
                 id: 1,
                 name: "shortlisted",
                 monthlycount:totalShortlisted,
                
             },
             {
                 id: 2,
                 name: "Offer Received",
                 monthlycount:monthlyOfferReceived.length,
                
             },
             {
                 id: 3,
                 name: "Joined",
                 monthlycount:monthlyJoined.length,
                
                 
             },
             {
                 id: 4,
                 name: "Drops",
                 monthlycount: monthlyDropped.length,
                 
             },
             {
                 id: 5,
                 name: "Shorlist On Hold",
                 monthlycount:monthlyOnHold.length,
                
             }
       ]
    
    
        // Set the counters or handle them as needed
        
        setPostCounterData(counter); 
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
    if(adminLoggedIn){
      // fetchAllData()
    }
  }, [recruiterId]);



  const loadData =  () => {
    fetchData();
  }
    







  return (
    <div className='postschedule-main  '>
          <CounterDisplay  postCounterData={postCounterData} />
          <div className="d-flex w-100">
            <PostScheduleButtons setForm={setForm}/>
          </div>
          <div className="tablesection m-5">
            {form === "shortlist" && <ShortlistSheet loadData={loadData}/>}
            {form === "offer" && <OfferSheet loadData={loadData}/>}
            {form === "join" && <Joined loadData={loadData}/>}
            {form === "drop" && <Drops loadData={loadData}/>}
            {form === "hold" && <ShorlistOnHold loadData={loadData}/>}
            {form === "billing"  && <Billing/>}
            </div>
    </div>
  )
}

export default PostSchedule