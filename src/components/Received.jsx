import React, { useState,useEffect } from 'react';
import '../styles/raised.css';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Received() {
  
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;


     
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
      const filteredData = flattenedData.filter(item => item.raisedStatus === "received");
      setTableData(filteredData);
     
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  



 

  // Pagination functions
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  function calculateDaysDifference(givenDateString) {
    // Convert the given date string to a Date object
    const givenDate = new Date(givenDateString);
  
    // Get the current date
    const currentDate = new Date();
  
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = currentDate - givenDate;
  
    // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 ms)
    const differenceInDays = Math.floor(differenceInMilliseconds / (24 * 60 * 60 * 1000));
  
    return differenceInDays;
  }



  return (
    <div className='raised-main'>
      <h4>Received</h4>
      <table className='raised-table'>
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
            <th>Invoice Number</th>
            <th>Date of Invoice</th>
            <th>GSTIN</th>
            <th>Fees</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>IGST</th>
            <th>Invoice Amount</th>
            <th>TDS</th>
            <th>Receivable Amount</th>
            <th>Received Date</th>
            <th>Balance</th>
            <th>Audit Reference</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
              <td>{item.billedDate?calculateDaysDifference(item.billedDate): "-"}</td>
              <td>{item.clientName}</td>
              <td>{item.joinedDate? new Date(item.joinedDate).toLocaleDateString(): "NA"}</td>
              <td>{item.name}</td>
              <td>{item.mobileNo}</td>
              <td>{item.email}</td>
              <td>{item.location}</td>
              <td>{item.position}</td>
              <td>{item.invoiceNumber}</td>
              <td>{item.invoiceDate}</td>
              <td>{item.gstin}</td>
              <td>{item.fees}</td>
              <td>{item.cgst}</td>
              <td>{item.sgst}</td>
              <td>{item.igst}</td>              
              <td>{item.invoiceAmount}</td>
              <td>{item.tds}</td>
              <td>{item.receivableAmount}</td>
              <td>{item.receivedDate}</td>
              <td>{item.balanceAmount}</td>
              <td>{item.auditReference}</td>
              <td>{item.billingRemark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className='pagination-controls text-center mt-3'>
        <Button variant='outline-primary' onClick={handlePrevPage} disabled={currentPage === 1}><FontAwesomeIcon icon={faArrowLeftLong}/></Button>
        <span> Page {currentPage} of {totalPages} </span>
        <Button variant='outline-primary' onClick={handleNextPage} disabled={currentPage === totalPages}><FontAwesomeIcon icon={faArrowRightLong}/></Button>
      </div>
    </div>
  );
}

export default Received;
