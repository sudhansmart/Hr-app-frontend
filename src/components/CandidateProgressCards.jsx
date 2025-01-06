import React, { useState,useEffect } from 'react'
import '../styles/candidateProgressCard.css'
import MultiStepProgressBar from './MultiStepProgressBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding,faClock,faLocationDot,faUserTie } from '@fortawesome/free-solid-svg-icons'
import { faClockFour } from '@fortawesome/free-regular-svg-icons'
import {Col,Form} from 'react-bootstrap'
import axios from 'axios'


function CandidateProgressCards() {
  const [searchText, setSearchText] = useState('');
  const [formData, setFormData] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageLoading, setPageLoading] = useState(true);
 

  const fetchAllData = async () => {
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
      
      setFormData(flattenedData);
     
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 

  // Fetch data when recruiterId changes
  useEffect(() => {
    if(adminLoggedIn){
      fetchAllData();
      
    }
  }, [searchText]);

  const sortedData = formData.sort((a, b) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
 
  
  const filteredData = sortedData.filter((item) => {
     if (searchText === '') {
     
      return false;
    } else{
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const emailMatch = item.email.toLowerCase().includes(searchText.toLowerCase());
   
   
    return (nameMatch ||  emailMatch  ) ;
    }
  });


  function convertDateTime(isoDate) {
       
    const date = new Date(isoDate);
    
    // Extracting date components
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    // Extracting time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight
  
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }
  return (
    <div className='progresscards-main'>
      <div className="progress-searchsec">
        <Col md={4} >
       
            <Form.Control
              type="search"
              placeholder="Search by Name or Email" 
              className="progress-searchbar"
              aria-label="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
           
        </Col>
               
      </div>
      {filteredData.length === 1 ?
      <div className="progress-bottomsec">
           
           {filteredData.map((data,index) => (<div className="progresscard-cover" key={index}>
                <div className="progress-topsec p-4">
                   <div className="topsec-left">
                         <h3 className='progress-name'> {data.name}</h3>
                         <h5 className='progress-client'><FontAwesomeIcon icon={faBuilding}/>  {data.clientName}</h5>
                         <h5 className='progress-role'><FontAwesomeIcon icon={faUserTie} /> {data.position? data.position : data.role}</h5>
                         <h6 className='progress-location'> <FontAwesomeIcon icon={faLocationDot}/> {data.location}</h6>
                    </div>
                    <div className="topsec-right text-end">
                         <h3 className='progress-recruitername'>{data.recruiterName}</h3>
                         <h5 className='progress-client'><FontAwesomeIcon icon={faClockFour}/>  {data.lastUpdatedDate? convertDateTime(data.lastUpdatedDate) : "NA"}</h5>
                    </div>
                 </div>
                 <div className="progress">
                      <MultiStepProgressBar filteredData={filteredData}/>
                 </div>

            </div>))}
            </div> : <div className="progress-bottomsec1">
              {filteredData && filteredData.length > 0 ? 
            <svg className="bike" viewBox="0 0 48 30" width="48px" height="30px">
               	<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
               		<g transform="translate(9.5,19)">
               			<circle className="bike__tire" r="9" strokeDasharray="56.549 56.549" />
               			<g className="bike__spokes-spin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562">
               				<circle className="bike__spokes" r="5" />
               				<circle className="bike__spokes" r="5" transform="rotate(180,0,0)" />
               			</g>
               		</g>
               		<g transform="translate(24,19)">
               			<g className="bike__pedals-spin" strokeDasharray="25.133 25.133" strokeDashoffset="-21.991" transform="rotate(67.5,0,0)">
               				<circle className="bike__pedals" r="4" />
               				<circle className="bike__pedals" r="4" transform="rotate(180,0,0)" />
               			</g>
               		</g>
               		<g transform="translate(38.5,19)">
               			<circle className="bike__tire" r="9" strokeDasharray="56.549 56.549" />
               			<g className="bike__spokes-spin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562">
               				<circle className="bike__spokes" r="5" />
               				<circle className="bike__spokes" r="5" transform="rotate(180,0,0)" />
               			</g>
               		</g>
               		<polyline className="bike__seat" points="14 3,18 3" strokeDasharray="5 5" />
               		<polyline className="bike__body" points="16 3,24 19,9.5 19,18 8,34 7,24 19" strokeDasharray="79 79" />
               		<path className="bike__handlebars" d="m30,2h6s1,0,1,1-1,1-1,1" strokeDasharray="10 10" />
               		<polyline className="bike__front" points="32.5 2,38.5 19" strokeDasharray="19 19" />
               	</g>
               </svg> : <div className="no-data-found">
               
                </div>}
            </div> }
    </div>
  )
}

export default CandidateProgressCards