import React, { useState, useEffect } from 'react';
import '../styles/interviewDetailsSheet.css';
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import {Col,Form} from 'react-bootstrap';

function InterviewDetailSheet() {
    const [candidates, setCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page
    const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
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

           const filteredData = flattenedData.filter((item) => item.recruiterId === recruiterId.toString());

                 setCandidates(filteredData);
           
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
            setCandidates(flattenedData);
          
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
    }, [recruiterId,adminLoggedIn]);

    const today = new Date().toISOString().split('T')[0];

    const todayCandidates = candidates.filter(candidate => {
        const interviewDate = candidate.interviewdate ? candidate.interviewdate.split('T')[0] : '';
        return interviewDate === today;
    });

    const otherCandidates = candidates.filter(candidate => {
        const interviewDate = candidate.interviewdate ? candidate.interviewdate.split('T')[0] : '';
        return interviewDate > today && interviewDate !== '';
    });

    const convertTo12HourFormat = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const normalizedHours = hours % 12 || 12;
        return `${normalizedHours}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const filteredData = [...todayCandidates, ...otherCandidates].filter((item) => {
     
        const nameMatch = item.recruiterName?.toLowerCase().includes(searchText.toLowerCase());
         const emailMatch = item.email ?.toLowerCase().includes(searchText.toLowerCase())
       
       
        return (nameMatch || emailMatch ) ;
       
      });

    // Pagination logic
    // const combinedCandidates = [...todayCandidates, ...otherCandidates];
    const combinedCandidates = filteredData;
    const totalItems = combinedCandidates.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCandidates = combinedCandidates.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='interviewdetailsheet-main'>
            <h4>Interview Details</h4>
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
            <table className='interviewdetailsheet-table'>
                <thead>
                    <tr>
                        <th>SL.No</th>
                        <th>Interview Date</th>
                        <th>Interview Time</th>
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
        const interviewDate = candidate.interviewdate ? candidate.interviewdate.split('T')[0] : '';
        const isToday = interviewDate === today;

        return (
            <tr key={candidate._id} className={isToday ? 'today-candidate' : ''}>
                <td>{startIndex + index + 1}</td>
                <td>{candidate.interviewdate ? new Date(candidate.interviewdate).toLocaleDateString('en-GB') : "NA"}</td>
                <td>{candidate.interviewTime ? convertTo12HourFormat(candidate.interviewTime) : "NA"}</td>
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

            {/* Pagination Controls */}
            <div className='pagination1 d-flex justify-content-center gap-2 m-5'>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={currentPage === i + 1 ? 'active text-center' : 'text-center'}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default InterviewDetailSheet;
