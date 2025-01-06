import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp,  faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Form,OverlayTrigger, Tooltip,Col } from 'react-bootstrap';
import { FaPencilAlt } from "react-icons/fa";
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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

const OfferSheet = ({loadData}) => {
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
  const [status,setStatus] = useState('nill');
  const [finalItems, setFinalItems] = useState([]);


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
      const offerreleased = filteredData.filter(item => item.offerStatus === "released");
      setFormdata(offerreleased);
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
      const filteredData = flattenedData.filter(item => item.offerStatus === "released");
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

  const handleSaveClick = (id) => {
    setEditingRowId(null);
    const file = formdata.find((item) => item._id === id);
    console.log("file", file)

    // Make an API call to update the interview status in the backend 
    try {
      const response = axios.put(`http://103.38.50.152/nodejs/candidate/updateinterviewfinalstatus/${id}`, {
      // const response = axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
       
        offerReleasedDate: file.offerReleasedDate,
        offeredCTC: file.offeredCTC,
        billValue: file.billValue,
        expectedDOJ: file.expectedDOJ
      })
      if (response.status === 200) {
        console.log("remark2 updated successfully:", response.data);
      } else {
        console.log("Failed to update remark2:", response.data);
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

  const handleStatusChange = async(e, id) => {
    const { name, value } = e.target;
    setFormdata((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, [name]: value } : item
      )
    );

    try {
      // Make an API call to update the interview status in the backend
      const response = await axios.put(`http://103.38.50.152/nodejs/candidate/updateinterviewfinalstatus/${id}`, {
      // const response = await axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
        joinedStatus: value,
      });
  
      if (response.status === 200) {
        loadData();
        console.log('Status updated successfully:', response.data);
      } else {
        console.log('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };




  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Sort and filter data
  const parseDate = (dateStr) => {
    if (!dateStr) return null; // Return null if the date string is missing
    const [day, month, year] = dateStr.split('-').map(Number);
    if (!day || !month || !year) return null; // Return null if date is invalid
    return new Date(year, month - 1, day); // Convert to a Date object
  };
  
  const sortedData = formdata.sort((a, b) => {
    const dateA = parseDate(a.offerReleasedDate);
    const dateB = parseDate(b.offerReleasedDate);
  
    // Handle cases where date is missing
    if (!dateA && !dateB) return 0; // Both dates are missing, consider equal
    if (!dateA) return sortOrder === 'asc' ? 1 : -1; // Missing date goes last
    if (!dateB) return sortOrder === 'asc' ? -1 : 1; // Missing date goes last
  
    // Perform the sorting based on the parsed dates
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  

  const filteredData = sortedData.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const roleMatch = item.role?.toLowerCase().includes(searchText.toLowerCase());
    const recruiterMatch = item.recruiterName?.toLowerCase().includes(searchText.toLowerCase());
    const positionMatch = item.position?.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName?.toLowerCase().includes(searchText.toLowerCase());
    const locationMatch = item.location?.toLowerCase().includes(searchText.toLowerCase());
    const emailMatch = item.email?.toLowerCase().includes(searchText.toLowerCase());

    const dateObject = new Date(item.offerReleasedDate);
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
return (nameMatch || recruiterMatch || locationMatch || emailMatch || clientMatch || roleMatch || positionMatch) && dateMatch;

  });


  useEffect(() => {
    let filData;
        console.log("inside : ",filteredData)
    if (status === "nill") {
      filData = filteredData.filter(
        (item) =>
         item.offerStatus === "released" && item.joinedStatus  !== "drop" &&  item.joinedStatus !== 'joined' 
      );
    } else {
      filData = filteredData.filter(
        (item) => item.joinedStatus === status
      );
    }
  
    setFinalItems(filData);
  }, [status,formdata]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const showItems = finalItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(finalItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

 

  return (
    <div className=" mt-4" style={{ height: '100vh' }}>
      <div className="col-md-12">
        <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Offer Received Sheet</h4>
        <div className="mb-3 d-flex justify-content-end" >
          <Col md={2}>
          <Form.Select size="sm" 
                         
                          defaultValue={status}
                          onChange={(e) => setStatus(e.target.value)}>
                        
                        <option value="nill">Please Select</option>
                        <option value="joined">Joined</option>
                        <option value="drop">Dropped</option>
                        
                       </Form.Select>
            </Col>
        </div>
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
              {/* <th>
                Offer Release Date
                <button className="btn btn-link" onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                </button>
              </th> */}
              <th>Joining Status</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th> 
              <th>Current Location</th>
              <th>Client Name</th>
              <th>Designation/Position</th> 
              <th>Offered CTC</th>
              <th>Bill value</th>
              <th>Expected DOJ</th>
              <th>Remark</th>
              
            </tr>
          </thead>

          <tbody>
            {showItems.map((item, index) => (
              <tr key={item._id} className="align-text-bottom text-center">
                  <th scope="row">{indexOfFirstItem + index + 1}</th>
                {adminLoggedIn && <td>{item.recruiterName}</td>}
                {/* {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <> 
                     <DatePicker
                      selected={item.offerReleasedDate ? new Date(item.offerReleasedDate) : undefined}
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
                  ) : (
                  <p> {   <td>{new Date(item.offerReleasedDate).toLocaleDateString('en-GB')}</td>  } <FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{new Date(item.offerReleasedDate).toLocaleDateString('en-GB')}</td>}  */}
                   {adminLoggedIn?
                   <td> <Form.Select size="sm" style={{ width: '150px' }}
                           name='joinedStatus' defaultValue={item.joinedStatus} onChange={(e) => handleStatusChange(e, item._id)}>
                        <option value="nill">Please Select</option>
                        <option value="joined">Joined</option>
                        <option value="drop">Dropped</option>
                       
                       </Form.Select>
                </td> :
                <td>{item.joinedStatus?item.joinedStatus.replace(/\b\w/g, l => l.toUpperCase()):"-"}</td>}
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
                <td>{item.position?item.position.replace(/\b\w/g, l => l.toUpperCase()):item.role}</td>
                {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <>  <input
                      type="number"
                      name="offeredCTC"  
                      value={item.offeredCTC}
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
                  <p> { item.offeredCTC  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{item.offeredCTC}</td>} 
                  {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <>  <input
                      type="number"
                      name="billValue"  
                      value={item.billValue}
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
                  <p> { item.billValue  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{item.billValue}</td>} 
                   {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <>  <input
                      type="date"
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
                  <p> {new Date(item.expectedDOJ).toLocaleDateString('en-GB')}<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{new Date(item.expectedDOJ).toLocaleDateString('en-GB')} </td>} 
                <td><TableCellWithTooltip content={item.remarks? item.remarks : 'N/A'}/></td>  
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-3">
          <button
            className="btn btn-primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-3">Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

    </div>
  );
};

export default OfferSheet;
