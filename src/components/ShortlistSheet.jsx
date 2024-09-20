import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { decodeToken } from '../utils/decodeToken';
import { FaPencilAlt } from "react-icons/fa";
import { Form } from 'react-bootstrap';
import axios from 'axios';


const ShortlistSheet = () => {
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingRowId, setEditingRowId] = useState(null);
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
      const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
      const data = response.data;

      // Flatten the nested data if necessary
      const flattenedData = data.map(candidate => ({
        ...candidate.common,
        ...candidate.infosys,
        ...candidate.jobDetails,
        ...candidate.wipro1,
        ...candidate.wipro2,
        ...candidate.accenture,
        _id: candidate._id, // Ensure _id is preserved
      }));

      // Filter by recruiterId
      const filteredData = flattenedData.filter(item => item.recruiterId === recruiterId.toString());
      const shortlisted = filteredData.filter(item => item.interviewFinalStatus === 'selected');
      setFormdata(shortlisted);
      console.log(shortlisted);
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
    console.log("file", file)

    // Make an API call to update the interview status in the backend 
    try {
      const response = axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
       
       
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
      const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
      const data = response.data;

      // Flatten the nested data if necessary
      const flattenedData = data.map(candidate => ({
        ...candidate.common,
        ...candidate.infosys,
        ...candidate.jobDetails,
        ...candidate.wipro1,
        ...candidate.wipro2,
        ...candidate.accenture,
        _id: candidate._id, // Ensure _id is preserved
      }));     
      setFormdata(flattenedData);
      
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
        const response = await axios.put(
          `http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`,
          {offerStatus: value}
        );
    
        if (response.status === 200) {
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
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const filteredData = sortedData.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const roleMatch = item.role?.toLowerCase().includes(searchText.toLowerCase());
    const positionMatch = item.position?.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName?.toLowerCase().includes(searchText.toLowerCase());

    const dateObject = new Date(item.shortlistedDate);
    const formattedDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());

    const startDateWithoutTime = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    const endDateWithoutTime = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

    const dateMatch =
      startDateWithoutTime &&
      endDateWithoutTime &&
      formattedDate >= new Date(startDateWithoutTime) &&
      formattedDate <= new Date(endDateWithoutTime);

    return (nameMatch || roleMatch || positionMatch || clientMatch) && (!startDateWithoutTime || dateMatch);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4" style={{ height: '100vh' }}>
      <div className="col-md-12">
        <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Shortlist Sheet</h4>
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

      <div className="datatable overflow-auto">
        <table className="table table-striped table-bordered scrollable-table">
          <thead className="align-text-bottom text-center">
            <tr>
              <th>SL.No</th>
              <th>
                Shortlisted Date
                <button className="btn btn-link" onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                </button>
              </th>
              <th>Offer Status</th>
              {/* <th>Recruiter Remarks [L1]</th> */}
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
            {currentItems.map((item, index) => (
              <tr key={item._id} className="align-text-bottom text-center">
                <th scope="row">{index + 1}</th>
                   <td>{new Date(item.shortlistedDate).toLocaleDateString('en-GB')}</td>
                   {adminLoggedIn?
                   <td> <Form.Select size="sm" style={{ width: '150px' }}
                           name='offerStatus' defaultValue={item.offerStatus} onChange={(e) => handleFinalStatusChange(e, item._id)}>
                        <option value="nill">Please Select</option>
                        <option value="released">Released</option>
                        <option value="yettorelease">Yet to Release</option>
                        <option value="hold">On Hold</option>
                       </Form.Select>
                </td> :
                <td>{item.offerStatus?item.offerStatus.replace(/\b\w/g, l => l.toUpperCase()):"-"}</td>}
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
                  <p> { item.shortlistRemark  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
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
                  <p> { item.expectedDOJ  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>    :  
                  <td>{item.expectedDOJ}</td>}
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination justify-content-center">
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShortlistSheet;
