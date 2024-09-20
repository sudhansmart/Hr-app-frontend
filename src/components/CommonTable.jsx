import React, { useState, useEffect,useRef } from 'react';
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

const CommonTable = () => {
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
      const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
      const data = response.data;
      // Flatten the nested data if necessary, depending on the structure
      const flattenedData = data.map(candidate => ({
        ...candidate.common,
        ...candidate.infosys,
        ...candidate.jobDetails,
        ...candidate.wipro1,
        ...candidate.wipro2,
        ...candidate.accenture,
        _id: candidate._id, // Ensure _id is preserved
      }));
      const filteredData = flattenedData.filter(item => item.formType === "common");
      setFormdata(filteredData);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const updateCandidate = async (candidateId, updatedData) => {
      
    const formData = new FormData();
    Object.keys(updatedData).forEach((key) => formData.append(key, updatedData[key]));
    formData.append('file', fileInputRef.current.files[0]);
    

    try {
      const response = await axios.put(`http://localhost:5000/candidate/updateCandidate/${candidateId}`, formData);
      if (response.status === 200) {
        console.log('Candidate updated successfully:', response.data);
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
     
        const response = await axios.get(`http://localhost:5000/candidate/download/${authId}`, {
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
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Filtered and paginated data
  const filteredData = sortedData.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const destinationMatch = item.position.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName && item.clientName.toLowerCase().includes(searchText.toLowerCase());

    const dateObject = new Date(item.date);
    const formattedDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());

    const startDateWithoutTime = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    const endDateWithoutTime = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

    const dateMatch =
      startDateWithoutTime &&
      endDateWithoutTime &&
      formattedDate >= new Date(startDateWithoutTime) &&
      formattedDate <= new Date(endDateWithoutTime);

    return (nameMatch || destinationMatch || clientMatch) && (!startDateWithoutTime || dateMatch);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };
  const openPdfInNewTab = (pdfId) => {
    console.log("pdfId",pdfId);
    if (pdfId) {
      const pdfUrl = `http://localhost:5000/candidate/pdfs/${pdfId}`;
      window.open(pdfUrl, '_blank');
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

        <div className='datatable overflow-auto'>
          <table className="table table-striped table-bordered scrollable-table">
            <thead className='align-text-bottom text-center'>
              <tr>
                <th>SL.No</th>
                <th>
                  Date
                  <button className="btn btn-link" onClick={toggleSortOrder}>
                    {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                  </button>
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Location</th>
                <th>Qualification</th>
                <th>Client Name</th>
                <th>Position</th>
                <th>Current Company</th>
                <th>Total Experience</th>
                <th>Relevant Experience</th>
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
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.mobileNo}</td>
                  <td>{item.location}</td>
                  <td>{item.qualification}</td>
                  <td>{item.clientName}</td>
                  <td>{item.position}</td>
                  <td>{item.currentCompany}</td>
                  <td>{item.overallExperience} Y</td>
                  <td>{item.relevantExperience} Y</td>
                  <td>{item.currentCTC} LPA</td>
                  <td>{item.expectedCTC} LPA</td>
                  {item.noticePeriod == 0 ? <td>Immediate</td> : <td>{item.noticePeriod} Days</td>}
                  <td>{item.interviewMode}</td>
                  <TableCellWithTooltip content={item.remarksFirstRecruiter} maxLength={20} />
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
                    name="mobileNo"
                    value={editingData?.mobileNo || ''}
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
                <Form.Group as={Col} md="5" controlId="formJobLevel">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualification"
                    value={editingData?.qualification || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Client Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName"
                    value={editingData?.clientName || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
            
                
                </Row>
                <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    value={editingData?.position || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Current Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="currentCompany"
                    value={editingData?.currentCompany || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Total Experience</Form.Label>
                  <Form.Control
                    type="text"
                    name="overallExperience"
                    value={editingData?.overallExperience || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Relevant Experience</Form.Label>
                  <Form.Control
                    type="text"
                    name="relevantExperience"
                    value={editingData?.relevantExperience || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
               
                </Row>
                <Row className="mb-3">
                <Form.Group as={Col} md="2" controlId="formJobLevel">
                  <Form.Label>Current CTC</Form.Label>
                  <Form.Control
                    type="number"
                    name="currentCTC"
                    value={editingData?.currentCTC || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="formJobLevel">
                  <Form.Label>Expected CTC</Form.Label>
                  <Form.Control
                    type="number"
                    name="expectedCTC"
                    value={editingData?.expectedCTC || ''}
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
                       name="remarksFirstRecruiter"
                       value={editingData?.remarksFirstRecruiter || ''}
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

        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default CommonTable;
