import React, { useState, useEffect,useRef,useImperativeHandle,forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Modal, Button, Form, Row,Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { decodeToken } from '../utils/decodeToken';
// Tooltip Function
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

const PersonalTrackerTable = forwardRef(({ position }, ref) => {
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null); // Data being edited
  const fileInputRef = useRef(null);
  const [formdata, setFormdata] = useState([]);
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterId, setRecruiterId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
     
      const decodedToken = decodeToken(token);
          if (decodedToken && decodedToken.name) {
            setRecruiterName(decodedToken.name);
            setRecruiterId(decodedToken.userId)
          }
    }
  }, [])


  const fetchData = async () => {
    try {
      const response = await axios.get('http://103.38.50.152/nodejs/candidate/getpersonaltracker');
      // const response = await axios.get('http://localhost:5000/candidate/getpersonaltracker');
      const data = response.data;
      const recruiterData =  data.filter((item) => item.recruiterId === recruiterId.toString());
      setFormdata(recruiterData);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    
      fetchData();

    
  }, [recruiterId]);

  useImperativeHandle(ref, () => ({
    fetchData,
  }));


  const updateCandidate = async (candidateId, updatedData) => {
      
    const formData = new FormData();
    Object.keys(updatedData).forEach((key) => formData.append(key, updatedData[key]));
    formData.append('file', fileInputRef.current.files[0]);
    

    try {
      const response = await axios.put(`http://103.38.50.152/nodejs/candidate/updatepersonaltracker/${candidateId}`, formData);
      // const response = await axios.put(`http://localhost:5000/candidate/updatepersonaltracker/${candidateId}`, formData);
      if (response.status === 200) {
        console.log('Candidate updated successfully:', response.data);
        fetchData();
        alert('Candidate updated successfully');
      } else {
        console.error('Error updating candidate:', response.data.message);
        alert('Error updating candidate');
      }
    } catch (error) {
      console.error('Error making the update request:', error);
      alert('Failed to update candidate');
    }
  };
  
  // Modify handleSaveChanges to make the API call to update data
  const handleSaveChanges = () => {
    if (editingData) {
      updateCandidate(editingData._id, editingData).then(() => {
        setFormdata((prevData) =>
          prevData.map((item) => (item._id === editingData._id ? editingData : item))
        );
        handleClose();
      });
    }
  };

  const handleDownload = async (name, authId) => {
    try {
     
        const response = await axios.get(`http://103.38.50.152/nodejs/candidate/download/${authId}`, {
        responseType: 'blob',
      });
      
      if (response.status === 201) {
        alert("Candidate CV not available. Please upload.");
      } else {
        const blob = new Blob([response.data]);
        const link = document.createElement('a');
         
       
  
        const fileName = `${name}_CV.pdf`; // Replace whitespace with underscores
  
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
    }
  };



  const openModal = (data) => {
    setEditingData(data);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingData(null);
  };

  

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData({ ...editingData, [name]: value });
  };

  // Sort tableData based on date
  const sortedData = formdata.sort((a, b) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Filtered and paginated data
  const filteredData = sortedData.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const roleMatch = item.role?.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName && item.clientName?.toLowerCase().includes(searchText.toLowerCase());

    const dateObject = new Date(item.date);
    const formattedDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());

    const startDateWithoutTime = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    const endDateWithoutTime = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

    const dateMatch =
      startDateWithoutTime &&
      endDateWithoutTime &&
      formattedDate >= new Date(startDateWithoutTime) &&
      formattedDate <= new Date(endDateWithoutTime);

    return (nameMatch || roleMatch || clientMatch) && (!startDateWithoutTime || dateMatch);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };
  const openPdfInNewTab = (pdfId) => {
   
    if (pdfId) {
      const pdfUrl = `http://103.38.50.152/nodejs/candidate/personaltrackerpdfs/${pdfId}`;
      window.open(pdfUrl, '_blank');
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="container mt-4 " style={{ height: '100vh' }}>
        <div className="col-md-12">
          <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Added Candidates</h4>
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

        <div className='datatable overflow-auto' style={{ overflowY: "scroll" ,maxHeight: "65%"}}>
          <table className="table table-striped table-bordered scrollable-table">
            <thead className='align-text-bottom text-center' style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
              <tr>
                <th>SL.No</th>
                <th>
                  Date
                  <button className="btn btn-link" onClick={toggleSortOrder}>
                    {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                  </button>
                </th>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Location</th>
                <th>Client Name</th>
                <th>Position</th>
                <th>Previous Company</th>
                <th>Total Experience</th>
                <th>Current CTC</th>
                <th>Expected CTC</th>
                <th>Notice Period</th>
                <th>InterviewMode</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index} className="align-text-bottom text-center">
                  <th scope="row">{index + 1}</th>
                  <td>{new Date(item.createdDate).toLocaleDateString('en-GB')}</td>
                  <td>{item.personalTrackStatus.replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.location}</td>
                  <td>{item.companyName}</td>
                  <td>{item.role}</td>
                  <td>{item.previousCompany}</td>
                  <td>{item.overAllExp} Y</td>
                  <td>{item.currentCtc} LPA</td>
                  <td>{item.expectedCtc} LPA</td>
                  {item.noticePeriod == 0 ? <td>Immediate</td> : <td>{item.noticePeriod} Days</td>}
                  <td>{item.interviewMode}</td>
                  <TableCellWithTooltip content={item.remarks} maxLength={20} />
                  <td>
                    <FontAwesomeIcon icon={faFilePen} style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => openModal(item)} />
                    <FontAwesomeIcon icon={faDownload} onClick={() => openPdfInNewTab(item._id)} style={{ fontSize: '18px', cursor: 'pointer', marginLeft: '10px' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal size="lg" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Candidate Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} md="3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editingData?.name || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="5" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editingData?.email || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="formPhoneNumber">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={editingData?.phoneNumber || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
               
               
                </Row>
                <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={editingData?.location || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
               
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={editingData?.companyName || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={editingData?.role || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Previous Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="previousCompany"
                    value={editingData?.previousCompany || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
            
                
                </Row>
                <Row className="mb-3">
               
               
                
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Total Experience</Form.Label>
                  <Form.Control
                    type="text"
                    name="overAllExp"
                    value={editingData?.overAllExp || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationFormik13">
                      <Form.Label>Interview Mode</Form.Label>
                      <Form.Select
                        value={editingData?.interviewMode || 'Please Select'} // Use the 'value' prop for default value
                        name='interviewMode'
                        onChange={handleEditChange}
                       
                        aria-label="select Here"
                      >
                        <option value="" >Please Select</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Virtual">Virtual</option>
                        <option value="Telephonic">Telephonic</option>
                      </Form.Select>
                     
                    </Form.Group>
                    <Form.Group as={Col} md="5" controlId="validationFormik13">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={editingData?.personalTrackStatus || 'Please Select'} // Use the 'value' prop for default value
                        name='personalTrackStatus'
                        onChange={handleEditChange}
                       
                        aria-label="select Here"
                      >
                        <option value="" >Please Select</option>
                        <option value="attended">Attended</option>
                        <option value="notattended">Not-Attended</option>
                        <option value="hold">Hold</option>
                        <option value="yetToAttend">Yet-to-Attend</option>
                      </Form.Select>
                      
                    </Form.Group>
               
                </Row>
                <Row className="mb-3">
                <Form.Group as={Col} md="2" controlId="formJobLevel">
                  <Form.Label>Current CTC</Form.Label>
                  <Form.Control
                    type="number"
                    name="currentCtc"
                    value={editingData?.currentCtc || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="formJobLevel">
                  <Form.Label>Expected CTC</Form.Label>
                  <Form.Control
                    type="number"
                    name="expectedCtc"
                    value={editingData?.expectedCtc || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="formJobLevel">
                  <Form.Label>Notice Period</Form.Label>
                  <Form.Control
                    type="text"
                    name="noticePeriod"
                    value={editingData?.noticePeriod || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group controlId="formFile" as={Col} md="4" className="mb-3">
                     <Form.Label>Upload CV</Form.Label>
                       <Form.Control type="file" 
                      //  onChange={(e) => setFieldValue('file', e.target.files[0])}
                       accept=".pdf, .doc, .docx" 
                       ref={fileInputRef}/>
                    </Form.Group>
                    {editingData?.uploadCV  && <p className='text-success'>{editingData?.uploadCV}</p>
                    }
                
                </Row>
                    <Row className="mb-3">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control as="textarea"
                       name="remarks"
                       value={editingData?.remarks || ''}
                       onChange={handleEditChange} rows={2} />
                    </Form.Group>               
                    </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
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
    </>
  );
});

export default PersonalTrackerTable;
