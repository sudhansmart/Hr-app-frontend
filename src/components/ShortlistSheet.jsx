import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { decodeToken } from '../utils/decodeToken';
import { FaPencilAlt } from "react-icons/fa";
import { Col, Form,OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import { use } from 'react';


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

const ShortlistSheet = ({loadData}) => {
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingRowId, setEditingRowId] = useState(null);
  const [status,setStatus] = useState('nill');
  const [finalItems, setFinalItems] = useState([]);
    const [formdata, setFormdata] = useState([]);
    const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
    const [recruiterId, setRecruiterId] = useState('');
   
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.userId) {
          setRecruiterId(decodedToken.userId);
        }
      }
    }, []);
      // Fetch candidates' data
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
      const shortlisted = filteredData.filter(item => item.interviewFinalStatus === 'shortlisted');
      setFormdata(shortlisted);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditClick = (id) => {
    setEditingRowId(id);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
  };

  const handleSaveClick = (id) => {
    setEditingRowId(null);
    const file = formdata.find((item) => item._id === id);
    

    // Make an API call to update the interview status in the backend 
    try {
      const response = axios.put(`http://103.38.50.152/nodejs/candidate/updateinterviewfinalstatus/${id}`, {
        // const response = axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
       
        ShortlistRecruiterRemark:file.ShortlistRecruiterRemark,
        shortlistforecast: file.shortlistforecast,
        shortlistRemark: file.shortlistRemark,
        offeredCTC: file.offeredCTC,
        billValue: file.billValue,
        expectedDOJ: file.expectedDOJ,

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
      const filteredData = flattenedData.filter(item => item.interviewFinalStatus === "shortlisted"); 
      setFormdata(filteredData);
      
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


    useEffect(() => {
      if (recruiterId) {
        fetchData();
      }
      if(adminLoggedIn){
        fetchAllData();
      }
    }, [recruiterId]);

    const handleFinalStatusChange = async (e, id) => {
      const { name, value } = e.target;
    
      // Update the formdata state
      setFormdata((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, [name]: value } : item
        )
      );

      try {
        // Make an API call to update the interview status in the backend
        const response = await axios.put(`http://103.38.50.152/nodejs/candidate/updateinterviewfinalstatus/${id}`,
        // const response = await axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`,
          {offerStatus: value}
        );
    
        if (response.status === 200) {
          loadData();
          console.log("Status updated successfully:", response.data);
        } else {
          console.log("Failed to update status");
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };
  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Sort and filter data
  const sortedData = formdata.sort((a, b) => {
    const dateA = new Date(a.shortlistedDate);
    const dateB = new Date(b.shortlistedDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const filteredData = sortedData.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const recruiterMatch = item.recruiterName?.toLowerCase().includes(searchText.toLowerCase());
    const roleMatch = item.role?.toLowerCase().includes(searchText.toLowerCase());
    const positionMatch = item.position?.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName?.toLowerCase().includes(searchText.toLowerCase());
    const locationMatch = item.location?.toLowerCase().includes(searchText.toLowerCase());
    const emailMatch = item.email?.toLowerCase().includes(searchText.toLowerCase());
    const dateObject = new Date(item.shortlistedDate);
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

    return (nameMatch || recruiterMatch || locationMatch || emailMatch || roleMatch || positionMatch || clientMatch) && (!startDateWithoutTime || dateMatch);
  });



  useEffect(() => {
    let filData;
  
    if (status === "nill") {
      filData = filteredData.filter(
        (item) =>
          item.offerStatus  === undefined
      );
    } else {
      filData = filteredData.filter(
        (item) => item.offerStatus === status
      );
    }
  
    setFinalItems(filData);
  }, [status, formdata,filteredData]);
  
  
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
        <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Shortlist Sheet</h4>
        <div className="mb-3 d-flex justify-content-end" >
          <Col md={2}>
          <Form.Select size="sm"  
                         
                          defaultValue={status}
                          onChange={(e) => setStatus(e.target.value)}>
                        <option value="nill">Please Select</option>
                        <option value="released">Offer Released</option>
                        <option value="yettorelease">Selected</option>
                        <option value="drop">Dropped</option>
                        <option value="hold">On Hold</option>
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
              <th>
                 Date
                <button className="btn btn-link" onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                </button>
              </th>
              <th>Offer Status</th>
              <th>Recruiter Remarks [L1]</th>
              <th>Final Remarks</th>
              <th>forcast</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th> 
              <th>Current Location</th>
              <th>Client Name</th>
              <th>Designation/Position</th> 
              <th>Offered CTC</th>
              <th>Bill value</th>
              <th>Expected DOJ</th>
             
            </tr>
          </thead>

          <tbody>
            {showItems.map((item, index) => (
              <tr key={item._id} className="align-text-bottom text-center">
                  <th scope="row">{indexOfFirstItem + index + 1}</th>
                {adminLoggedIn && <td>{item.recruiterName}</td>}
                   <td>{new Date(item.shortlistedDate).toLocaleDateString('en-GB')}</td>
                   {adminLoggedIn?
                   <td> <Form.Select size="sm" style={{ width: '150px' }}
                           name='offerStatus' defaultValue={item.offerStatus} onChange={(e) => handleFinalStatusChange(e, item._id)}>
                        <option value="nill">Please Select</option>
                        <option value="released">Offer Released</option>
                        <option value="yettorelease">Selected</option>
                        <option value="drop">Dropped</option>
                        <option value="hold">On Hold</option>
                       </Form.Select>
                </td> :
                <td className='text-center'>{item.offerStatus?item.offerStatus.replace(/\b\w/g, l => l.toUpperCase()):"-"}</td>}
                   <td> {editingRowId === item._id ? (
                    <>  <input
                      type="text"
                      name="ShortlistRecruiterRemark"  
                      value={item.ShortlistRecruiterRemark}
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
                  <><TableCellWithTooltip content={item.ShortlistRecruiterRemark? item.ShortlistRecruiterRemark : 'N/A'} maxLength={10} /><FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </>
                  )}</td>   
                {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <>  <input
                      type="text"
                      name="shortlistRemark"  
                      value={item.shortlistRemark}
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
                  <> <TableCellWithTooltip content={item.shortlistRemark? item.shortlistRemark : 'N/A'} maxLength={20} /><FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </>
                  )}</td>    :  
                  <td>{item.shortlistRemark}</td>} 
                   {adminLoggedIn?  <td> {editingRowId === item._id ? (
                    <>  <input
                      type="text"
                      name="shortlistforecast"
                      value={item.shortlistforecast}
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
                  <p> { item.shortlistforecast  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{item.shortlistforecast}</td>} 
                
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
                <td>{item.position? item.position : item.role}</td>
                 <td> {editingRowId === item._id ? (
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
                  )}</td> 
               <td> {editingRowId === item._id ? (
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
                  )}</td>  
                       <td> {editingRowId === item._id ? (
                    <> 
                     <input
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
                  <p> { item.expectedDOJ && new Date(item.expectedDOJ).toLocaleDateString('en-GB')  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td> 
                
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

export default ShortlistSheet;
