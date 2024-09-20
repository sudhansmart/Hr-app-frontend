import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';

const ProfileSubmissions = ({setCounterData}) => {
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
      const attendedcount = filteredData.filter(item => item.interviewStatus === "attended").length;
      const notattendedcount = filteredData.filter(item => item.interviewStatus === "notattended").length;
      const holdedcount = filteredData.filter(item => item.interviewStatus === "hold").length;
      setFormdata(filteredData);
      const counter = [{
        name : "Profile Submissions",
        count : filteredData.length
      },
      {
        name : "Interview Attended",
        count : attendedcount
      },
      {
        name : "Interview Not Attended",
        count : notattendedcount
      },
      {
        name : "Holded",
        count : holdedcount
      }
    ];
    setCounterData(counter);
      console.log(counter);
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
      setFormdata(flattenedData);
      const attendedcount = flattenedData.filter(item => item.interviewStatus === "attended").length;
      const notattendedcount = flattenedData.filter(item => item.interviewStatus === "notattended").length;
      const holdedcount = flattenedData.filter(item => item.interviewStatus === "hold").length;
      const counter = [{
        name : "Profile Submissions",
        count : flattenedData.length
      },
      {
        name : "Interview Attended",
        count : attendedcount
      },
      {
        name : "Interview Not Attended",
        count : notattendedcount
      },
      {
        name : "Holded",
        count : holdedcount
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
      const response = axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
       
        remarksFirstRecruiter: file.remarksFirstRecruiter,
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
      const response = await axios.put(`http://localhost:5000/candidate/updatestatus/${id}`, {
        interviewStatus: value,
      });
  
      if (response.status === 200) {
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
  const sortedData = formdata.sort((a, b) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const filteredData = sortedData.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const roleMatch = item.role?.toLowerCase().includes(searchText.toLowerCase());
    const positionMatch = item.position?.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName?.toLowerCase().includes(searchText.toLowerCase());

    const dateObject = new Date(item.createdDate);
    const formattedDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());

    const startDateWithoutTime = startDate ? new Date(startDate) : null;
    const endDateWithoutTime = endDate ? new Date(endDate) : null;

    const dateMatch =
      (!startDateWithoutTime || formattedDate >= startDateWithoutTime) &&
      (!endDateWithoutTime || formattedDate <= endDateWithoutTime);

    return (nameMatch || clientMatch || roleMatch || positionMatch) && dateMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4" style={{ height: '100vh' }}>
      <div className="col-md-12">
        <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Submitted Candidates</h4>
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
                Date
                <button className="btn btn-link" onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                </button>
              </th>
              {adminLoggedIn && <th>Recruiter Name</th>}
              <th>Interview Status</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Job Location</th>
              <th>Client Name</th>
              <th>Position</th>
              <th>Current Company</th>
              <th>Total Experience</th>
              <th>Relevant Experience</th>
              <th>Current CTC</th>
              <th>Expected CTC</th>
              <th>Notice Period</th>
              <th>FeedBack</th>
             
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item._id} className="align-text-bottom text-center">
                <th scope="row">{index + 1}</th>
                <td>{new Date(item.createdDate).toLocaleDateString('en-GB')}</td>
                {adminLoggedIn && <td>{item.recruiterName}</td>}
              <td style={{ width: '100px' }}> <Form.Select size="sm" style={{ width: '150px' }}
                         name='interviewStatus' defaultValue={item.interviewStatus} onChange={(e) => handleStatusChange(e, item._id)}>
                        <option value="nill">Please Select</option>
                        <option value="attended">Attended</option>
                        <option value="notattended">Not Attended</option>
                        <option value="hold">Hold</option>
                       </Form.Select>
                </td> 
               
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
                <td>{item.currentCompany}</td>
                <td>{item.overallExperience? item.overallExperience : item.totalExp} Y</td>
                <td>{item.relevantExperience? item.relevantExperience : item.relevantExp} Y</td>
                <td>{item.currentCTC} LPA</td>
                <td>{item.expectedCTC} LPA</td>
                <td>{item.noticePeriod == 0 ? <td>Immediate</td> : <td>{item.noticePeriod} Days</td>}</td>
                <td>
                  {editingRowId === item._id ? (
                    <input
                      type="text"
                      name="remarksFirstRecruiter"
                      value={item.remarksFirstRecruiter}
                      onChange={(e) => handleInputChange(e, item._id)}
                    />
                  ) : (
                    item.remarksFirstRecruiter
                  )}
                </td>
               
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

export default ProfileSubmissions;
