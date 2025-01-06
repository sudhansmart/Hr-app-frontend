import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faCheck, faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../styles/profileSubmission.css';

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

const ProfileSubmissions = ({loadData}) => {
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
      setFormdata(filteredData);
      
     
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
      
      setFormdata(flattenedData);
    
      
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
  

    // Make an API call to update the interview status in the backend 
    try {
      const response = axios.put(`http://103.38.50.152/nodejs/candidate/updateinterviewfinalstatus/${id}`, {
        // const response = axios.put(`http://localhost:5000/candidate/updateinterviewfinalstatus/${id}`, {
        remarksFirstRecruiter: file.remarksFirstRecruiter,
        interviewdate:file.interviewdate,
        interviewTime: file.interviewTime
        
      })
      if (response.status === 200) {
        console.log(" Table updated successfully:", response.data);
      } else {
        console.log("Failed to update remark2:", response.data);
      }
      
    } catch (error) {
      console.error('Error updating remark2:', error);
      
    }
  };

  const handleDateChange = (date, id) => {
    // Convert the date to UTC format (if required)
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0]; // This ensures the date is in YYYY-MM-DD format
  
    setFormdata((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, interviewdate: utcDate } : item
      )
    );
  };
  

  const handleTimeChange = (e, id) => {
    const { value } = e.target;
    setFormdata((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, interviewTime: value } : item
      )
    );
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
      const response = await axios.put(`http://103.38.50.152/nodejs/candidate/updatestatus/${id}`, {
        // const response = await axios.put(`http://localhost:5000/candidate/updatestatus/${id}`, {
        interviewStatus: value,
      });
  
      if (response.status === 200) { 
        console.log('Status updated successfully:', response.data);
        loadData();
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
    const recruiterMatch = item.recruiterName?.toLowerCase().includes(searchText.toLowerCase());
    const locationMatch = item.location?.toLowerCase().includes(searchText.toLowerCase());
    const emailMatch = item.email?.toLowerCase().includes(searchText.toLowerCase());
    const positionMatch = item.position?.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName?.toLowerCase().includes(searchText.toLowerCase());

    const dateObject = new Date(item.createdDate);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const convertTo12HourFormat = (time) => {
    if (!time) return ''; // Handle empty time input
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const normalizedHours = hours % 12 || 12; // Convert 0 hour to 12
    return `${normalizedHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

   const getColor = (interviewStatus) => {
    switch (interviewStatus) {
      case 'nill':
        return '#FF885B';
      case 'attended':
        return '#A0D683';
      case 'notattended':
        return '#C96868';
      case 'hold':
        return '#FEEE91';  
      default:
        return '#FF885B';
    }
  };

  const openPdfInNewTab = (pdfId) => {
    if (pdfId) {
      const pdfUrl = `http://103.38.50.152/nodejs/candidate/pdfs/${pdfId}`;
      window.open(pdfUrl, '_blank');
    }
  };


   
  return (
    <div className="mt-4" style={{ height: '100vh' }}>
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

      <div className="datatable overflow-auto"  style={{ overflowY: "scroll" ,maxHeight: "65%"}}>
        <table className="profile-table  table-bordered scrollable-table" >
          <thead className="align-text-bottom text-center" style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
            <tr>
              <th>Action</th>
              <th>Interview Date</th>
              <th>Interview Time</th>
              <th>Interview Status</th>
              <th>SL.No</th>
              <th>
                Date
                <button className="btn btn-link" onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                </button>
              </th>
              {adminLoggedIn && <th>Recruiter Name</th>}
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
              <tr key={item._id} className="align-text-bottom text-center" style={{ backgroundColor: !item.interviewdate? '#ffbd7361' : 'white' }}  >
                <td>
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
                    <>
                    
                    <FontAwesomeIcon
                      icon={faFilePen}
                      style={{ fontSize: '18px', cursor: 'pointer',color: '#870909' }}
                      onClick={() => handleEditClick(item._id)}
                    />
                    <FontAwesomeIcon 
                        icon={faDownload}
                        style={{ fontSize: '18px', cursor: 'pointer',marginLeft: '10px', color: '#062a9b' }}
                        onClick={() => openPdfInNewTab(item._id)} /> 
                    </>
                  )}
                </td>
                <td>
                    {editingRowId === item._id ? (
                      <DatePicker
                      selected={item.interviewdate ? new Date(item.interviewdate) : undefined}
                        onChange={(date) => handleDateChange(date, item._id)}
                        dateFormat="dd-MM-yyyy"
                      />
                    ) : (
                      item.interviewdate?
                         new Date(item.interviewdate).toLocaleDateString('en-GB') // Format: dd/mm/yyyy
                                : 'N/A'
                    )}
                  </td>
                  <td>
                    {editingRowId === item._id ? (
                      <input
                        type="time"
                        value={item.interviewTime?item.interviewTime :null}
                        onChange={(e) => handleTimeChange(e, item._id)}
                      />
                    ) : (
                       convertTo12HourFormat(item.interviewTime) || 'N/A'
                    )}
                  </td>
              <td style={{ width: '100px',backgroundColor: getColor(item.interviewStatus) }}> <Form.Select size="sm" style={{ width: '150px' }}
                         name='interviewStatus' defaultValue={item.interviewStatus} onChange={(e) => handleStatusChange(e, item._id)}>
                        <option value="nill">Please Select</option>
                        <option value="attended">Attended</option>
                        <option value="notattended">Not Attended</option>
                        <option value="hold">Hold</option>
                        <option value="rejected">Screening Reject</option>
                       </Form.Select>
                </td> 
                <th scope="row">{indexOfFirstItem + index + 1}</th>
           
                <td>{new Date(item.createdDate).toLocaleDateString('en-GB')}</td>
                {adminLoggedIn && <td>{item.recruiterName}</td>}
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
                {item.noticePeriod == 0 ?
                    <td>Immediate</td> :
                 <td>{item.noticePeriod} Days</td>}
                
                <td>
                  {editingRowId === item._id ? (
                    <input
                      type="text"
                      name="remarksFirstRecruiter"
                      value={item.remarksFirstRecruiter}
                      onChange={(e) => handleInputChange(e, item._id)}
                    />
                  ) : (
                    <TableCellWithTooltip content={item.remarksFirstRecruiter? item.remarksFirstRecruiter : 'N/A'} maxLength={20} />
                   
                  )}
                </td>
               
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

export default ProfileSubmissions;
