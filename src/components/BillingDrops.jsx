import React, { useState,useEffect } from 'react';
import '../styles/yettoraise.css';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function BillingDrops() {
  const [tableData, setTableData] = useState([]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

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
      const filteredData = flattenedData.filter(item => item.raisedStatus === "drop");
      setTableData(filteredData);
     
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);



  // Function to handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tableData.slice(startIndex, endIndex);
  };

  function calculateDaysTillToday(dateString) {
    // Parse the given date string in "dd-mm-yyyy" format
    const [day, month, year] = dateString.split('-').map(Number);
  
    // Create a Date object for the given date
    const startDate = new Date(year, month - 1, day);
    
    // Get today's date
    const today = new Date();
  
    // Calculate the difference in milliseconds
    const differenceInMs = today - startDate;
  
    // Convert milliseconds to days
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
  
    return differenceInDays;
  }

 

  return (
    <div className='yettoraise-main'>
      <h4>Drops</h4>
      <table className='yettoraise-table'>
        <thead>
          <tr>
            <th>SL.No</th>
            <th>Days</th>
           
            <th>Client</th>
            <th>DOJ</th>
            <th>Candidate Name</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Current Location</th>
            <th>Position</th>
            <th>Offered CTC</th>
            <th>Bill Value</th>
            <th>Billing Percentage</th>
            <th>Recruiter Name</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData().map((item, index) => (
            <tr key={item.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{calculateDaysTillToday(item.joinedDate)}</td>
              <td>{item.clientName}</td>
              <td>{item.joinedDate}</td>
              <td>{item.name}</td>
              <td>{item.mobileNo}</td>
              <td>{item.email}</td>
              <td>{item.location}</td>
              <td>{item.position}</td>
              <td>{item.offeredCTC}</td>
              <td>{item.billValue}</td>
              <td>{item.billingPercentage} %</td>
              <td>{item.recruiterName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className='pagination-controls text-center mt-3'>
        <Button
          variant='outline-primary'
          size='sm'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faArrowLeftLong}/>
        </Button>
        <span className='pagination-info p-2'>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant='outline-primary'
          size='sm'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faArrowRightLong}/>
        </Button>
      </div>
    </div>
  );
}

export default BillingDrops;
