import React, { useState,useEffect } from 'react';
import '../styles/yettoraise.css';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faArrowRightLong, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function YetToRaise() {
  const [tableData, setTableData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

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
      const filteredData = flattenedData.filter(item => item.joinedStatus === "joined");
      setTableData(filteredData);
      
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditClick = (item) => {
    setEditingRow(item._id);
    setEditData({ ...item });
  };

  const handleSaveClick = async (id) => {
    // Update the table data with the edited row
    setTableData((prevData) =>
      prevData.map((item) => (item._id === id ? { ...editData, id } : item))
    );
    
    // Set editing row to null to exit edit mode
    setEditingRow(null);
  
    try {
     
      const response = await axios.put( `http://103.38.50.152/nodejs/candidate/updateinterviewfinalstatus/${id}`, 
        //  const response = axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, 
        {  
          location:editData.location,
          position : editData.position,
          role : editData.role,
          offeredCTC: editData.offeredCTC,
          billValue: editData.billValue,
          billingPercentage: editData.billingPercentage,
          
        }
      );
  
      // Check if the response was successful
      if (response.status === 200) {
        console.log("Data updated successfully:", response.data);
      } else {
        console.error("Failed to update data:", response.data);
      }
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };
  

  const handleCancelClick = () => {
    setEditingRow(null);
    setEditData({});
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleStatusChange = async(e, id) => {
    const newStatus = e.target.value;
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, billingStatus: newStatus } : item
      )
    );
         
    try {
    
      const response = await axios.put(`http://103.38.50.152/nodejs/candidate/updateinterviewfinalstatus/${id}`, {
        // const response = await axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
          billingStatus: newStatus,
      });
  
      if (response.status === 200) {
        fetchAllData();
        console.log('Status updated successfully:', response.data);
      } else {
        console.log('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tableData.slice(startIndex, endIndex);
  };

  const getColor = (status) => {
    switch (status) {
      case 'nill':
        return '#FFF';
      case 'norecord':
        return '#FF9C73';
      case 'duplicate':
        return '#FF4545';
      case 'drop':
        return '#A02334';
      case 'yettoraise':
        return '#FEEE91';
      case 'raised':
        return '#8ABFA3';
      default:
        return '#FFF';
    }
  };

  function calculateDaysTillToday(dateString) {
    // Parse the given date string in ISO 8601 format
    const startDate = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(startDate)) {
      throw new Error("Invalid date format. Please provide a valid ISO 8601 date string.");
    }
  
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
      <h4>Yet To Raise</h4>
      <table className='yettoraise-table'>
        <thead>
          <tr>
            <th>SL.No</th>
            <th>Days</th>
            <th>Status</th>
            <th>Client</th>
            <th >DOJ</th>
            <th>Candidate Name</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Current Location</th>
            <th>Position</th>
            <th>Offered CTC</th>
            <th>Bill Value</th>
            <th>Billing Percentage</th>
            <th>Recruiter Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData().map((item, index) => (
            <tr key={index}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{item.joinedDate? calculateDaysTillToday(item.joinedDate) :"NA"}</td>
              <td
                style={{
                  width: '110px',
                  backgroundColor: getColor(item.billingStatus),
                }}
              >
                <Form.Select
                  size='sm'
                  style={{ width: '150px' }}
                  name='billingStatus'
                  value={item.billingStatus}
                  onChange={(e) => handleStatusChange(e, item._id)}
                >
                  <option value='nill'>Please Select</option>
                  <option value='norecord'>No Record Found</option>
                  <option value='duplicate'>Duplicate</option>
                  <option value='drop'>Drop</option>
                  <option value='yettoraise'>Yet To Raise</option>
                  <option value='raised'>Raised</option>
                </Form.Select>
              </td>
              <td>{item.clientName}</td>
              <td >{item.joinedDate?new Date(item.joinedDate).toLocaleDateString('en-GB') :"NA"}</td>
              <td>{item.name}</td>
              <td>{item.mobileNo}</td>
              <td>{item.email}</td>
              <td>
                {editingRow === item._id ? (
                  <input
                    type='text'
                    name='location'
                    value={editData.location}
                    onChange={handleInputChange}
                  />
                ) : (
                  item.location
                )}
              </td>
              <td>
                {editingRow === item._id ? (
                  <input
                    type='text'
                    name='position'
                    value={editData.position}
                    onChange={handleInputChange}
                  />
                ) : (
                  item.position
                )}
              </td>
              <td>
                {editingRow === item._id ? (
                  <input
                    type='number'
                    name='offeredCTC'
                    value={editData.offeredCTC}
                    onChange={handleInputChange}
                  />
                ) : (
                  item.offeredCTC
                )}
              </td>
              <td>
                {editingRow === item._id ? (
                  <input
                    type='number'
                    name='billValue'
                    value={editData.billValue}
                    onChange={handleInputChange}
                  />
                ) : (
                  item.billValue
                )}
              </td>
              <td>
                {editingRow === item._id ? (
                  <input
                    type='number'
                    name='billingPercentage'
                    value={editData.billingPercentage}
                    onChange={handleInputChange}
                  />
                ) : (
                  `${item.billingPercentage?item.billingPercentage:0}%`
                )}
              </td>
              <td>{item.recruiterName}</td>
              <td className='text-center'>
                {editingRow === item._id ? (
                  <>
                    <Button
                      className='mb-2'
                      variant='success'
                      size='sm'
                      onClick={() => handleSaveClick(item._id)}
                    >
                      <FontAwesomeIcon icon={faSave} /> Save
                    </Button>
                    <Button
                      variant='secondary'
                      size='sm'
                     
                      onClick={handleCancelClick}
                    >
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant='warning'
                    size='sm'
                    onClick={() => handleEditClick(item)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </Button>
                )}
              </td>
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
          <FontAwesomeIcon icon={faArrowLeftLong} />
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
          <FontAwesomeIcon icon={faArrowRightLong} />
        </Button>
      </div>
    </div>
  );
}

export default YetToRaise;
