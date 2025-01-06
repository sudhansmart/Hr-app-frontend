import React, { useState, useEffect } from 'react';

import '../styles/followUp.css'
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import {Col,Form} from 'react-bootstrap'

function FollowUpData() {

    const [candidates, setCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page
    const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true' || false);
    const [recruiterName, setRecruiterName] = useState('');
    const [recruiterId, setRecruiterId] = useState('');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
         
          const decodedToken = decodeToken(token);
              if (decodedToken && decodedToken.name) {
                setRecruiterName(decodedToken.name);
                setRecruiterId(decodedToken.userId)
              }
        }
      }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
            const data = response.data;

            const flattenedData = data.map(candidate => ({
                ...candidate.common,
                ...candidate.infosys,
                ...candidate.jobDetails,
                ...candidate.wipro1,
                ...candidate.wipro2,
                ...candidate.accenture,
                ...candidate.other,
                _id: candidate._id,
            }));
          const filteredData = flattenedData.filter(item => item.joinedStatus !== 'joined' && item.joinedStatus !== 'drop'  && item.interviewFinalStatus !== "rejected"  && item.interviewStatus !== "notattended" );
         
          const finalData = filteredData.filter((item) => item.recruiterId === recruiterId.toString());
                 setCandidates(finalData);
        
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchAllData = async () => {
        try {
            const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
            const data = response.data;

            const flattenedData = data.map(candidate => ({
                ...candidate.common,
                ...candidate.infosys,
                ...candidate.jobDetails,
                ...candidate.wipro1,
                ...candidate.wipro2,
                ...candidate.accenture,
                ...candidate.other,
                _id: candidate._id,
            }));
          const filteredData = flattenedData.filter(item => item.joinedStatus !== 'joined' && item.joinedStatus !== 'drop' && item.interviewFinalStatus !== "rejected" );
          
            setCandidates(filteredData);
          
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };   
     
   
    useEffect(() => {
        if (adminLoggedIn) {
            fetchAllData();
        }else{
        fetchData();
        }
    }, [recruiterId]);

    const today = new Date().toISOString().split('T')[0];

    const filteredData = candidates.filter((item) => {
     
        const nameMatch = item.recruiterName?.toLowerCase().includes(searchText.toLowerCase());
         const emailMatch = item.email ?.toLowerCase().includes(searchText.toLowerCase())
       
       
        return (nameMatch || emailMatch ) ;
       
      });

   

    // Pagination logic
    const combinedCandidates = filteredData
    const totalItems = combinedCandidates.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCandidates = combinedCandidates.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
    <div className='followupsheet-main'>
            <h4>Follow-Up Details</h4>
            <Col md={4} className='mb-3' >
                 <Form.Control
                   type="search"
                   placeholder="Search..." 
                   className="progress-searchbar"
                   aria-label="Search"
                   value={searchText}
                   onChange={(e) => setSearchText(e.target.value)}
                 />
             </Col>
             <div className='followupsheet-cover'>
            <table className='followupsheet-table'>
                <thead>
                    <tr>
                        <th>SL.No</th>
                        <th>Interview Date</th>
                        <th>Last Modified</th>
                        {adminLoggedIn &&  <th>Recruiter Name</th> }
                        <th>Name</th>
                        <th>Mobile No</th>
                        <th>Location</th>
                        <th>Email</th>
                        <th>Position</th>
                        <th>Client Name</th>
                        <th>Current CTC</th>
                        <th>Expected CTC</th>
                        <th>Notice Period</th>
                    </tr>
                </thead>
                <tbody>
    {currentCandidates.map((candidate, index) => {
        const lastModifiedDate = candidate.lastUpdatedDate ? candidate.lastUpdatedDate.split('T')[0] : '';
        const isToday = lastModifiedDate === today;

        return (
            <tr key={candidate._id} className={isToday ? '' : 'lastmodied'}>
                <td>{startIndex + index + 1}</td>
                <td>{candidate.interviewdate ? new Date(candidate.interviewdate).toLocaleDateString('en-GB') : "NA"}</td>
                <td className='w-100'>{candidate.lastUpdatedDate? convertDateTime(candidate.lastUpdatedDate) : "NA" }</td>
                {adminLoggedIn && <td>{candidate.recruiterName}</td>}
                <td>{candidate.name}</td>
                <td>{candidate.mobileNo}</td>
                <td>{candidate.location}</td>
                <td>{candidate.email}</td>
                <td>{candidate.position ? candidate.position : candidate.role}</td>
                <td>{candidate.clientName}</td>
                <td>{candidate.currentCTC}</td>
                <td>{candidate.expectedCTC}</td>
                <td>{candidate.noticePeriod}</td>
            </tr>
        );
    })}
</tbody>

            </table>
</div>
            
            <div className='pagination1 d-flex justify-content-center gap-2 m-5'>
    {/* Previous Button */}
    <button
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="prev-button"
    >
        Previous
    </button>

    {/* First Page */}
    {currentPage > 2 && (
        <button onClick={() => handlePageChange(1)} className="text-center">
            1
        </button>
    )}

    {/* Dots before current page range */}
    {currentPage > 3 && <span className="dots">...</span>}

    {/* Display 3 pages around the current page */}
    {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
            (page) =>
                page === currentPage ||
                page === currentPage - 1 ||
                page === currentPage + 1
        )
        .map((page) => (
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={
                    currentPage === page ? 'active text-center' : 'text-center'
                }
            >
                {page}
            </button>
        ))}

    {/* Dots after current page range */}
    {currentPage < totalPages - 2 && <span className="dots">...</span>}

    {/* Last Page */}
    {currentPage < totalPages - 1 && (
        <button
            onClick={() => handlePageChange(totalPages)}
            className="text-center"
        >
            {totalPages}
        </button>
    )}

    {/* Next Button */}
    <button
        onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="next-button"
    >
        Next
    </button>
</div>

        </div>
  )
}

export default FollowUpData

