import React, { useState , useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faDownload, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Form from 'react-bootstrap/Form';
import { FaPencilAlt } from "react-icons/fa";
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import '../styles/interviewAttended.css';

const InterviewAttendedSheet = ({setCounterData}) => {
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
      const interviewAttended = filteredData.filter(item => item.interviewStatus === "attended");
      const selectedcount = filteredData.filter(item => item.interviewFinalStatus === "selected").length;
      const rejectedcount = filteredData.filter(item => item.interviewFinalStatus === "hold").length;
      const holdcount = filteredData.filter(item => item.interviewFinalStatus === "rejected").length;

      setFormdata(interviewAttended);
      console.log("fetdch : ",  interviewAttended);
      const counter = [{
        name : "Total Attended",
        count : flattenedData.length
      },
      {
        name : "Selected",
        count : selectedcount
      },
      {
        name : "Rejected",
        count : rejectedcount
      },
      {
        name : "Holded",
        count : holdcount
      }
    ];
      setCounterData(counter);
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
      const interviewAttended = flattenedData.filter(item => item.interviewStatus === "attended");
      const selectedcount = filteredData.filter(item => item.interviewFinalStatus === "selected").length;
      const rejectedcount = filteredData.filter(item => item.interviewFinalStatus === "hold").length;
      const holdcount = filteredData.filter(item => item.interviewFinalStatus === "rejected").length;
     
      setFormdata(interviewAttended);
      
      const counter = [{
        name : "Total Attended",
        count : flattenedData.length
      },
      {
        name : "Selected",
        count : selectedcount
      },
      {
        name : "Rejected",
        count : rejectedcount
      },
      {
        name : "Holded",
        count : holdcount
      }
    ];
      setCounterData(counter);
      
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
      fetchAllData()
    }
  }, [recruiterId]);


  const handleEditClick = (id) => {
    setEditingRowId(id);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
  };

  const handleSaveClick =async (id) => {
    setEditingRowId(null);
    const file = formdata.find((item) => item._id === id);
    

    // Make an API call to update the interview status in the backend 
    try {
      const response = axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
        remark2: file.remark2,
        interviewFinalRemark: file.interviewFinalRemark,
      })
      if (response.status === 200) {
        console.log("remark2 updated successfully:", response.data);
      } else {
        console.log("Failed to update remark2:", response.data);
      }
      
    } catch (error) {
      console.error('Error updating remark2:', error);
      
    }
  }
  

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setFormdata((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, [name]: value } : item
      )
    );
    
  };

  const handleFinalStatusChange = async (e, id) => {
    const { name, value } = e.target;
  
    // Update the formdata state
    setFormdata((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, [name]: value } : item
      )
    );
  
    // Prepare the data to be sent using e.target values
    const sendfile = {
      interviewFinalStatus: name === 'interviewFinalStatus' ? value : undefined,
      remark1: name === 'remark1' ? value : undefined,
    };
  
    console.log("value:", sendfile);
  
    try {
      // Make an API call to update the interview status in the backend
      const response = await axios.put(
        `http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`,
        sendfile
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


    const dateObject = new Date(item.createdDate);
    const formattedDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());

    const startDateWithoutTime = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    const endDateWithoutTime = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

    const dateMatch =
      startDateWithoutTime &&
      endDateWithoutTime &&
      formattedDate >= new Date(startDateWithoutTime) &&
      formattedDate <= new Date(endDateWithoutTime);

    return (nameMatch  || clientMatch || roleMatch || positionMatch) && (!startDateWithoutTime || dateMatch);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4" style={{ height: '100vh' }}>
      <div className="col-md-12">
        <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Interview Attended Sheet</h4>
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
      <table className="table table-striped table-bordered scrollable-table1">
  <thead className="align-text-bottom text-center">
    <tr>
      <th className="sl-no">SL.No</th>
      {adminLoggedIn && <th className="rec-name">Recruiter Name</th>}
      <th className="schedule-date">Schedule Date</th>
      <th className="interview-date">
        Interview Date
        <button className="btn btn-link" onClick={toggleSortOrder}>
          {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
        </button>
      </th>
      <th className="remark1">Remark1</th>
      <th className="remark2">Remark2</th>
      <th className="final-status">Final Status</th>
      <th className="name">Name</th>
      <th className="email">Email</th>
      <th className="mobile-number">Mobile Number</th>
      <th className="location">Location</th>
      <th className="client-name">Client Name</th>
      <th className="designation">Designation</th>
      <th className="total-experience">Total Experience</th>
      <th className="relevant-experience">Relevant Experience</th>
      <th className="current-ctc">Current CTC</th>
      <th className="expected-ctc">Expected CTC</th>
      <th className="notice-period">Notice Period</th>
      <th className="final-remarks">Final Remarks</th>
    </tr>
  </thead>
  <tbody>
    {currentItems.map((item, index) => (
      <tr key={item._id} className="align-text-bottom text-center">
        <th scope="row">{index + 1}</th>
        {adminLoggedIn && <td>{item.recruiterName}</td>}
        <td>{new Date(item.createdDate).toLocaleDateString('en-GB')}</td>
                   <td>{new Date(item.interviewdate).toLocaleDateString('en-GB')}</td>
                 
                    <td>{<Form.Select value={item.remark1} size="sm"
                               name='remark1'  onChange={(e) => handleFinalStatusChange(e, item._id)}
                        style={{ width: '200px' }}>
                        <option value="nill">Please Select</option>
                        <option value="testlink">Test Link Completed</option>
                        <option value="telephonic">Telephonic Completed</option>
                        <option value="walkin">Walkin Completed</option>
                        <option value="virtual">Virtual Completed</option>
                        <option value="other">Other Remarks</option>
                        </Form.Select>}</td>
                     <td> {editingRowId === item._id ? (
                    <>  <input
                      type="text"
                      name="remark2"
                      value={item.remark2}
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
                  <p> { item.remark2  }<FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}</td>  
                  {!adminLoggedIn?
                   <td> <Form.Select size="sm"
                           name='interviewFinalStatus' defaultValue={item.interviewFinalStatus} onChange={(e) => handleFinalStatusChange(e, item._id)}>
                        <option value="nill">Please Select</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                        <option value="hold">Hold</option>
                       </Form.Select>
                </td> :
                <td>{item.interviewFinalStatus?item.interviewFinalStatus.replace(/\b\w/g, l => l.toUpperCase()):"-"}</td>}
                 
                <td>
                  {item.name}
                </td>
                <td>
                  {item.email}
                </td>
                <td>
                  {item.mobileNo}
                </td>
                <td>{item.location} </td>
                <td>{item.clientName}</td>
                <td>{item.position? item.position : item.role}</td>
                <td>{item.overallExperience? item.overallExperience : item.totalExp} </td>
                <td>{item.relevantExperience? item.relevantExperience : item.relevantExp}</td>
                <td>{item.currentCTC} LPA</td>
                <td>{item.expectedCTC} LPA</td>
                <td>{item.noticePeriod}</td>
                <td>
                  {editingRowId === item._id ? (
                   <>
                    <input
                      type="text"
                      name="interviewFinalRemark"
                      value={item.interviewFinalRemark}
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
                    <p> { item.interviewFinalRemark  }  <FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => handleEditClick(item._id)} /> </p>
                  )}
                </td>
                {/* <td>
                  {editingRowId === item._id ? (
                    <>
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
                    <FontAwesomeIcon
                      icon={faFilePen}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => handleEditClick(item._id)}
                    />
                  )}
                </td> */}
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

export default InterviewAttendedSheet;
