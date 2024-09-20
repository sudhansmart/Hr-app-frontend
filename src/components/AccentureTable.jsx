import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { decodeToken } from '../utils/decodeToken';
import PdfViewer from './PdfViewer';

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

const AccentureTable = () => {
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null); // Data being edited
  const [formData, setFormData] = useState([]);
  const fileInputRef = useRef(null);


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
      const filteredData = flattenedData.filter(item => item.formType === "accenture");
      setFormData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (data) => {
    setEditingData(data);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingData(null);
  };

  const updateCandidate = async (candidateId, updatedData) => {
      
    const formData = new FormData();

    // Define the data object with common fields and Infosys-specific fields
    const candidateData = {
      name: updatedData.name,
      email: updatedData.email,
      phoneNumber: updatedData.mobileNo,
      location:   updatedData.location,
      clientName: 'Accenture',
      currentCompany:   updatedData.currentCompany,
      overAllExp:   updatedData.overallExperience,
      relevantExp:   updatedData.relevantExperience,
      currentCtc:   updatedData.currentCTC,
      recruiterName: recruiterName,
      recruiterId: recruiterId,
      expectedCtc:    updatedData.expectedCTC,
      noticePeriod:   updatedData.noticePeriod, 
      file: fileInputRef.current.files[0],
      accenture: {
        cl: updatedData.cl,
        cid: updatedData.cid,
        gender: updatedData.gender,
        role:   updatedData.role,
        primarySkill:   updatedData.primarySkill,
        fatherName:   updatedData.fatherName,
        city:   updatedData.city,
        address:   updatedData.address,
        pincode:   updatedData.pincode,
        sourceNameVendor:'SKYLARK HR SOLUTIONS',
       }

      }
    
    
    // Append common data fields
    Object.entries(candidateData).forEach(([key, value]) => {
      if (typeof value === 'object' && key === 'accenture') {
        // If the value is an object (like accenture), map through it
        Object.entries(value).forEach(([subKey, subValue]) => {
          formData.append(`accenture[${subKey}]`, subValue);
        });
      } else {
        formData.append(key, value);
      }
    });
    
    formData.append('formType', 'accenture');
     


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
        setFormData((prevData) =>
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
      console.log("link", response);
      
      if (response.status === 201) {
        alert("Candidate CV not available. Please upload.");
      } else {
        const blob = new Blob([response.data]);
        const link = document.createElement('a');
         
       
  
        const fileName = `${name}_CV.pdf`; // Replace whitespace with underscores
  
        link.href = window.URL.createObjectURL(blob);
        // setPdfUrl(link.href);
       
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
    }
  };

   

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData({ ...editingData, [name]: value });
  };

  // Sort formData based on date
  const sortedData = formData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Filter data by searchText and date range
  const filteredData = sortedData.filter((item) => {

    const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const roleMatch = item.role.toLowerCase().includes(searchText.toLowerCase());

    const dateMatch =
      (!startDate || new Date(item.date) >= new Date(startDate)) &&
      (!endDate || new Date(item.date) <= new Date(endDate));

    return (nameMatch || roleMatch) && dateMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const openPdfInNewTab = (pdfId) => {
    if (pdfId) {
      const pdfUrl = `http://localhost:5000/candidate/pdfs/${pdfId}`;
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <>
    {/* <PdfViewer pdfId={pdfId}/> */}
      <div className="container mt-4" style={{ height: '100vh' }}>
        <div className="col-md-12">
          <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Added Candidates</h4>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control my-0 py-1 pl-3 purple-border"
              placeholder="Search here..."
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
                    {sortOrder === 'asc' ? (
                      <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowDown} style={{ fontSize: '15px' }} />
                    )}
                  </button>
                </th>
                <th>CL</th>
                <th>CID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Role</th>
                <th>Current Company</th>
                <th>Location</th>
                <th>Total Experience</th>
                <th>Relevant Experience</th>
                <th>Current CTC</th>
                <th>Expected CTC</th>
                <th>Notice Period</th>
                <th>Primary Skill</th>
                <th>Father Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Pincode</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item._id} className="align-text-bottom text-center">
                  <th scope="row">{index + 1}</th>
                  <td>{new Date(item.createdDate).toLocaleDateString('en-GB')}</td>
                  <td>{item.cl}</td>
                  <td>{item.cid}</td>
                  <td>{item.name}</td>
                  <td>{item.gender}</td>
                  <td>{item.mobileNo}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>{item.currentCompany}</td>
                  <td>{item.location}</td>
                  <td>{item.overallExperience}</td>
                  <td>{item.relevantExperience}</td>
                  <td>{item.currentCTC}</td>
                  <td>{item.expectedCTC}</td>
                  <td>{item.noticePeriod}</td>
                  <td>{item.primarySkill}</td>
                  <td>{item.fatherName}</td>
                  <td>{item.city}</td>
                  <td>{item.address}</td>
                  <td>{item.pincode}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faFilePen}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => openModal(item)}
                    />
                    <FontAwesomeIcon  onClick={() => openPdfInNewTab(item._id)}
                      icon={faDownload}
                      style={{ fontSize: '18px', cursor: 'pointer', marginLeft: '10px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination or any other additional logic here */}

          {/* Modal for editing data */}
          <Modal size="lg" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Candidate Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
              <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="formName">
                  <Form.Label>CL</Form.Label>
                  <Form.Control
                    type="number"
                    name="cl"
                    value={editingData?.cl || ''}
                    onChange={handleEditChange}
                  />
                    </Form.Group>
                <Form.Group as={Col} md="3" controlId="formName">
                  <Form.Label>CID</Form.Label>
                  <Form.Control
                    type="number"
                    name="cid"
                    value={editingData?.cid || ''}
                    onChange={handleEditChange}
                  />
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editingData?.name || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationFormik14">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        value={editingData?.gender || 'Please Select'} // Use the 'value' prop for default value
                        name='gender'
                        onChange={handleEditChange}
                        aria-label="select Here"
                      >
                        <option value="" >Please Select</option>
                        <option value="male">Male</option>
                        <option value="Female">Female</option>
                      </Form.Select>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="formPhoneNumber">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNo"
                    value={editingData?.mobileNo || ''}
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
                <Form.Group as={Col} md="4" controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={editingData?.role || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                
                </Row>
                <Row className="mb-3">
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
                  <Form.Label>Current Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={editingData?.location || ''}
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
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Primary Skill</Form.Label>
                  <Form.Control
                    type="text"
                    name="primarySkill"
                    value={editingData?.primarySkill || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>Father Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fatherName"
                    value={editingData?.fatherName || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                </Row>
                <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="formJobLevel">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={editingData?.city || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="5" controlId="formJobLevel">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={editingData?.address || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="formJobLevel">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="number"
                    name="pincode"
                    value={editingData?.pincode || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                </Row>
                <Row className="mb-3">
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
                    {/* <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control as="textarea"
                       name="remarks"
                       value={editingData?.remarks || ''}
                       onChange={handleEditChange} rows={2} />
                    </Form.Group>                */}
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
      </div>
    </>
  );
};

export default AccentureTable;
