import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp,  faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';
import { FaPencilAlt } from "react-icons/fa";
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
const TableCellWithTooltip = ({ content, maxLength }) => {
  const renderTooltip = (props) => (
    <Tooltip id="tooltip-top" {...props}>
      {content}
    </Tooltip>
  );

  const truncatedContent = content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;

  return (
    <OverlayTrigger placement="top" overlay={renderTooltip} delay={{ show: 250, hide: 400 }}>
      <td>{truncatedContent}</td>
    </OverlayTrigger>
  );
};
const Drops = () => {
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [formdata, setFormdata] = useState([]);
  const [recruiterId, setRecruiterId] = useState('');
  const [editingRowId, setEditingRowId] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');


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
      const droplist = filteredData.filter(item => item.joinedStatus === "drop" || item.interviewFinalStatus === "rejected");
      setFormdata(droplist);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
      const filteredData = flattenedData.filter(item => item.joinedStatus === "drop" || item.interviewFinalStatus === "rejected" || item.offerStatus === "drop");
      
      setFormdata(filteredData);
      
      
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
      fetchAllData();
    }
  }, [recruiterId]);

  const handleEditClick = (id) => {
    setEditingRowId(id);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
  };

  const handleSaveClick = async(id) => {
    setEditingRowId(null);
    const file = formdata.find((item) => item._id === id); 
   

    // Make an API call to update the interview status in the backend 
    try {
      const response = await axios.put(`http://103.38.50.152/nodejs/candidate/updateinterviewfinalstatus/${id}`, {
        // const response = axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
       
        droppedDate: file.droppedDate,
        expectedDOJ: file.expectedDOJ,
        droppedshortlistStatus: file.droppedshortlistStatus,
        joinedSheetremarks: file.joinedSheetremarks,
       
      })
     
      if (response.status === 200) {
        alert("Candidate data updated successfully");
      } else {
        alert("Failed to update:", response.data);
      }
      
    } catch (error) {
      console.error('Error updating remark2:', error);
      
    }
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setFormdata((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, [name]: value } : item
      )
    );
  };

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Sort and filter data
  const sortedData = formdata.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const filteredData = sortedData.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const roleMatch = item.role?.toLowerCase().includes(searchText.toLowerCase());
    const positionMatch = item.position?.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName?.toLowerCase().includes(searchText.toLowerCase());
    const locationMatch = item.location?.toLowerCase().includes(searchText.toLowerCase());
    const emailMatch = item.email?.toLowerCase().includes(searchText.toLowerCase());

    const dateObject = new Date(item.droppedDate);
    const formattedDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());

    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`; // Format as 'YYYY-MM-DD'
    };
    
    // Format the dates to 'YYYY-MM-DD'
    const formattedDateWithoutTime = formatDate(formattedDate);
    const startDateWithoutTime = startDate ? formatDate(startDate) : null;
    const endDateWithoutTime = endDate ? formatDate(endDate) : null;
    
    // Perform the comparison using the formatted dates
    const dateMatch =
      (!startDateWithoutTime || formattedDateWithoutTime >= startDateWithoutTime) &&
      (!endDateWithoutTime || formattedDateWithoutTime <= endDateWithoutTime);
    return (nameMatch || locationMatch || emailMatch || clientMatch || roleMatch || positionMatch) && dateMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDateChange = (date, id) => {
    // Convert the date to UTC format (if required)
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
       // This ensures the date is in YYYY-MM-DD format
  
    setFormdata((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, droppedDate: utcDate } : item
      )
    );
  };

  return (
    <div className="mt-4" style={{ height: '100vh' }}>
      <div className="col-md-12">
        <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Droped Sheet</h4>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control my-0 py-1 pl-3 purple-border"
            placeholder="Search something here..."
            aria-label="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            placeholder="End Date"
            min={startDate}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="datatable overflow-auto"   style={{ overflowY: "scroll" ,maxHeight: "65%"}}>
        <table className="table table-striped table-bordered scrollable-table">
          <thead className="align-text-bottom text-center" style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
            <tr>
              <th>SL.No</th>
              {adminLoggedIn && <th className="rec-name">Recruiter Name</th>}
              <th>
                Dropped  Date
                <button className="btn btn-link" onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                </button>
              </th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th> 
              <th>Current Location</th>
              <th>Client Name</th>
              <th>Designation/Position</th> 
              <th>Offered CTC</th>
              <th>Bill value</th>
              <th>Expected DOJ</th>
              <th>Shortlisted</th>
              <th>Recruiter Remark</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item._id} className="align-text-bottom text-center">
                  <th scope="row">{indexOfFirstItem + index + 1}</th>
                {adminLoggedIn && <td>{item.recruiterName}</td>}
                {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <> 
                    <DatePicker
                    selected={item.droppedDate ? new Date(item.droppedDate) : undefined}
                      onChange={(date) => handleDateChange(date, item._id)}
                      dateFormat="dd-MM-yyyy"
                    />
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => handleSaveClick(item._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ fontSize: '18px', cursor: 'pointer', marginLeft: '10px' }}
                      onClick={handleCancelClick}
                    />
                  </>
                  ) : (<td>
                 { <td>{new Date(item.droppedDate).toLocaleDateString('en-GB')}</td>  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </td>
                  )}</td>    :  
                  <td>{new Date(item.droppedDate).toLocaleDateString('en-GB')}</td>} 
                   <td>
                  {item.name}
                </td>
                <td>
                  {item.mobileNo}
                </td>
                <td>
                  {item.email}
                </td>
                <td>{item.location} </td>
                <td>{item.clientName}</td>
                <td>{item.position?item.position:item.role}</td>
                <td>{item.offeredCTC}</td>
                <td>{item.billValue}</td>
                {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <>  <input
                      type="text"
                      name="expectedDOJ"  
                      value={item.expectedDOJ}
                      onChange={(e) => handleInputChange(e, item._id)}
                    /> 
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => handleSaveClick(item._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ fontSize: '18px', cursor: 'pointer', marginLeft: '10px' }}
                      onClick={handleCancelClick}
                    />
                  </>
                  ) : (
                  <p> {  new Date(item.expectedDOJ).toLocaleDateString('en-GB') }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{new Date(item.expectedDOJ).toLocaleDateString('en-GB')}</td>}
                {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <>  <input
                      type="text"
                      name="droppedshortlistStatus"  
                      value={item.droppedshortlistStatus}
                      onChange={(e) => handleInputChange(e, item._id)}
                    /> 
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => handleSaveClick(item._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ fontSize: '18px', cursor: 'pointer', marginLeft: '10px' }}
                      onClick={handleCancelClick}
                    />
                  </>
                  ) : (
                  <p> { item.droppedshortlistStatus  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{item.droppedshortlistStatus}</td>} 
                 {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <>  <input
                      type="text"
                      name="joinedSheetremarks"  
                      value={item.joinedSheetremarks}
                      onChange={(e) => handleInputChange(e, item._id)}
                    /> 
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => handleSaveClick(item._id)}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ fontSize: '18px', cursor: 'pointer', marginLeft: '10px' }}
                      onClick={handleCancelClick}
                    />
                  </>
                  ) : (
                  <p> { item.joinedSheetremarks  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{item.joinedSheetremarks}</td>} 
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination justify-content-center mt-3">
  <ul className="pagination">
    {/* Previous Button */}
    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
      <button
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        className="page-link"
      >
        Previous
      </button>
    </li>

    {/* First Page */}
    {currentPage > 2 && (
      <li className="page-item">
        <button onClick={() => paginate(1)} className="page-link">
          1
        </button>
      </li>
    )}

    {/* Dots before current page range */}
    {currentPage > 3 && (
      <li className="page-item disabled">
        <span className="page-link">...</span>
      </li>
    )}

    {/* Display 3 pages around the current page */}
    {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => index + 1)
      .filter(
        (page) =>
          page === currentPage ||
          page === currentPage - 1 ||
          page === currentPage + 1
      )
      .map((page) => (
        <li
          key={page}
          className={`page-item ${currentPage === page ? 'active' : ''}`}
        >
          <button onClick={() => paginate(page)} className="page-link">
            {page}
          </button>
        </li>
      ))}

    {/* Dots after current page range */}
    {currentPage < Math.ceil(filteredData.length / itemsPerPage) - 2 && (
      <li className="page-item disabled">
        <span className="page-link">...</span>
      </li>
    )}

    {/* Last Page */}
    {currentPage < Math.ceil(filteredData.length / itemsPerPage) - 1 && (
      <li className="page-item">
        <button
          onClick={() => paginate(Math.ceil(filteredData.length / itemsPerPage))}
          className="page-link"
        >
          {Math.ceil(filteredData.length / itemsPerPage)}
        </button>
      </li>
    )}

    {/* Next Button */}
    <li
      className={`page-item ${
        currentPage === Math.ceil(filteredData.length / itemsPerPage)
          ? 'disabled'
          : ''
      }`}
    >
      <button
        onClick={() =>
          currentPage < Math.ceil(filteredData.length / itemsPerPage) &&
          paginate(currentPage + 1)
        }
        className="page-link"
      >
        Next
      </button>
    </li>
  </ul>
</div>

    </div>
  );
};

export default Drops;
