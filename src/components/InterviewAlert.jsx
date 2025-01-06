import React, { useState, useEffect } from 'react';
import '../styles/interviewAlert.css';
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import InterviewNote from './InterviewNote';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faBriefcase, faBuilding, faCalendarDays, faClock, } from '@fortawesome/free-solid-svg-icons';


function InterviewAlert() {
  const [candidates, setCandidates] = useState([]);
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [data, setData] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState();
 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
     
      const decodedToken = decodeToken(token);
          if (decodedToken && decodedToken.name) {
            setRecruiterName(decodedToken.name);
            setRecruiterId(decodedToken.userId)
            if(decodedToken.role === 'admin'){
              setAdminLoggedIn(true)
            }  
          }
    }
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
      // const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
      const data = response.data;

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
      if(adminLoggedIn){
        setCandidates(flattenedData);
        
      }else{
        const recruiterData = flattenedData.filter((item) => {
          // Check if interviewdate exists, and if not, exclude it
          if (!item.interviewdate) {
              return false;
          }
      
          // Convert interviewdate to a Date object
          const interviewDate = new Date(item.interviewdate);
          
          // Get today's date (without time)
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set the time to midnight for comparison
          
          // Filter by recruiterId and interviewdate is today or in the future
          return item.recruiterId === recruiterId.toString() && interviewDate >= today;
      });
      
      setCandidates(recruiterData);
      
    }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    
    fetchData();
  }, [recruiterId]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Filter candidates based on interviewdate matching today
  const todayCandidates = candidates.filter(candidate => {
    const interviewDate = candidate.interviewdate ? candidate.interviewdate.split('T')[0] : '';
    return interviewDate === today;
  });

 

  const otherCandidates = candidates.filter(candidate => {
    const interviewDate = candidate.interviewdate ? candidate.interviewdate.split('T')[0] : '';
    return interviewDate !== today;
  });
  

  const openModal = (data) => {
    setData(data);
    setModalShow(true);
  };

  return (
    <div className='interviewalert-main'>
       <InterviewNote modalShow={modalShow} setModalShow={setModalShow} data={data}/>
      <h5 className='interviewalert-title m-2'>Interview Follow-ups</h5>
    
      <ul className='candidate-interviewlist'>
        {/* Render today's candidates first */}
        {todayCandidates.map((candidate, index) => (
          <li
             onClick={() => openModal(candidate)}
            key={index}
            style={{
              width: '100%',
              backgroundColor: '#2a9df4',
              padding: '10px',
              color:"white",
              marginBottom: '10px',
              borderRadius: '5px',
              boxShadow: '1px 1px 5px 1px #808080cc',
              listStyleType: 'none',
              cursor: 'pointer',
            }}
          >
            <strong className='datalist'>{adminLoggedIn && candidate.recruiterName}{adminLoggedIn && <FontAwesomeIcon icon={faAsterisk} />} {candidate.name.replace(/\b\w/g, c => c.toUpperCase()) }</strong> <FontAwesomeIcon icon={faBuilding} /> {candidate.clientName} <FontAwesomeIcon icon={faBriefcase} /> {candidate.role?candidate.role:candidate.position} <FontAwesomeIcon icon={faCalendarDays} /> {candidate.interviewdate?new Date(candidate.interviewdate).toLocaleDateString('en-GB'):"NA"} <FontAwesomeIcon icon={faClock} /> {candidate.interviewTime?candidate.interviewTime : "NA"}
          </li>
        ))}

        {/* Render other candidates */}
        {!adminLoggedIn && otherCandidates.map((candidate, index) => (
          <li
             onClick={() => openModal(candidate)}
            key={index}
            style={{
              backgroundColor: '#caf0f8',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              boxShadow: '1px 1px 5px 1px #808080cc',
              listStyleType: 'none',
              cursor: 'pointer',
            }}
          >
            <strong className='datalist'>{candidate.name.replace(/\b\w/g, c => c.toUpperCase()) }</strong> <FontAwesomeIcon className='dataicons' icon={faBuilding} /> {candidate.clientName} <FontAwesomeIcon className='dataicons' icon={faBriefcase} /> {candidate.role?candidate.role:candidate.position} <FontAwesomeIcon className='dataicons' icon={faCalendarDays} /> {candidate.interviewdate?new Date(candidate.interviewdate).toLocaleDateString('en-GB'):"NA"} <FontAwesomeIcon className='dataicons' icon={faClock} /> {candidate.interviewTime?candidate.interviewTime : "NA"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InterviewAlert;
