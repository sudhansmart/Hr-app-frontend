import React, { useState, useEffect, useRef,forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Modal, Button, Form,Col,Row} from 'react-bootstrap';
import { decodeToken } from '../utils/decodeToken';
import * as XLSX from 'xlsx';

// Tooltip function
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

const OtherTable = forwardRef(({ position }, ref) => { 
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const fileInputRef = useRef(null);
  const [formdata, setFormdata] = useState([]);
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [positions, setPositions] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
  const [roleId, setRoleId] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedRows,setSelectedRows] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.name) {
        setRecruiterName(decodedToken.name);
        setRecruiterId(decodedToken.userId);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://103.38.50.152/nodejs/labels/getlabels');
        // const response = await axios.get('http://localhost:5000/labels/getlabels');
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };
    fetchPositions();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
      // const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
      const data = response.data;
      const flattenedData = data.map((candidate) => ({
        ...candidate.common,
        ...candidate.infosys,
        ...candidate.jobDetails,
        ...candidate.wipro1,
        ...candidate.wipro2,
        ...candidate.accenture,
        ...candidate.other,
        _id: candidate._id, // Ensure _id is preserved
      }));
      const filteredData = flattenedData.filter((item) => item.formType === 'other');
      if(adminLoggedIn){
        const finalData = filteredData.filter((item) => item.formId === roleId);
        setFormdata(finalData);
        
      }else{
    
      const recruiterData =  filteredData.filter((item) => item.recruiterId === recruiterId.toString());
      const finalData = recruiterData.filter((item) => item.formId === position);
      setFormdata(finalData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (position) {
      fetchData();
    }if(adminLoggedIn){
      fetchData();
    }
  }, [position,roleId]);

  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  const updateCandidate = async (candidateId, updatedData) => {
    const formData = new FormData();
    Object.keys(updatedData).forEach((key) => {
      if (!['recruiterName', 'recruiterId', 'uploadCV', 'formId', '_id', 'file', 'createdDate'].includes(key)) {
        formData.append(key, updatedData[key]);
      }
    });
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formData.append('file', fileInputRef.current.files[0]);
    }

    try {
      const response = await axios.put(`http://103.38.50.152/nodejs/candidate/updateCandidate/${candidateId}`, formData);
      // const response = await axios.put(`http://localhost:5000/candidate/updateCandidate/${candidateId}`, formData);
      if (response.status === 200) {
        alert('Candidate updated successfully');
        fetchData();
      } else {
        alert('Error updating candidate');
      }
    } catch (error) {
      console.error('Error making the update request:', error);
      alert('Failed to update candidate');
    }
  };

  const handleSaveChanges = () => {
    if (editingData) {
      updateCandidate(editingData._id, editingData);
      setShowModal(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData({ ...editingData, [name]: value });
  };

  const openModal = (data) => {
    setEditingData(data);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingData(null);
  };
   
  const handlePositionChange = async (e) => {
    const id = e.target.value;
    
    setRoleId(id);
    setSelectedPosition(id);
  }
 

  const openPdfInNewTab = (pdfId) => {
    console.log("pdfId",pdfId);
    if (pdfId) {
      const pdfUrl = `http://103.38.50.152/nodejs/candidate/pdfs/${pdfId}`;
      window.open(pdfUrl, '_blank');
    }
  };


  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedData = formdata.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const filteredData = sortedData.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase());
    const locationMatch = item.location?.toLowerCase().includes(searchText.toLowerCase());
    const emailMatch = item.email?.toLowerCase().includes(searchText.toLowerCase());
    const positionMatch = item.position?.toLowerCase().includes(searchText.toLowerCase());
    const clientMatch = item.clientName && item.clientName?.toLowerCase().includes(searchText.toLowerCase());

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

    return (nameMatch || locationMatch || emailMatch || positionMatch || clientMatch) && dateMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const allKeys = [
    ...new Set(
      formdata
        .flatMap((item) => Object.keys(item))
        .filter(
          (key) =>
            !['recruiterName', 'recruiterId', 'uploadCV', 'formId', '_id', 'file', 'formType', 'createdDate'].includes(
              key
            )
        )
    ),
  ];

 

  // Updated handleExportExcel function
  const handleExportExcel = () => {
    const selectedData = filteredData.filter(item => selectedRows.includes(item._id));
    
    if (selectedData.length === 0) {
      alert("Please select at least one row to export.");
      return;
    }
    const exportData = selectedData.map(item => {
      const { recruiterName, recruiterId, uploadCV, formId, _id, file, createdDate, ...exportableData } = item;
      return exportableData;
    });
   
  
     // Create a worksheet from the filtered and ordered data
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Get headers and insert them manually to enable bold styling
  const headers = Object.keys(exportData[0]);
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
  
  // Apply bold styling to headers
  headers.forEach((header, index) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
    worksheet[cellRef].s = { font: { bold: true } }; // Set header cells to bold
  });

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');

  // Export the workbook as an Excel file
  XLSX.writeFile(workbook, 'candidates.xlsx');
  };
  

  const handleCheckBoxChange = (id) => {
    setSelectedRows(prevRows => prevRows.includes(id) ? prevRows.filter(rowId => rowId !== id) : [...prevRows, id]);
  };
 

  return (
    <>
      <div className="container mt-4">
     {adminLoggedIn &&  <Form.Group controlId="formPosition">
          <Form.Label>Job Position</Form.Label>
          <Form.Control as="select" value={selectedPosition} onChange={handlePositionChange}>
            <option value="">Select a position</option>
            {positions.map((item, index) => (
              <option key={index} value={item._id} >
                {item.position}
              </option>
            ))}
          </Form.Control>
        </Form.Group>}
        <div className="col-md-12">
          <h4 className="pt-3 pb-4 text-center font-bold font-up deep-purple-text">Added Candidates</h4>
        {adminLoggedIn &&   <div className="text-end">
           <Button variant='success' className='mb-3 text-align-end' onClick={handleExportExcel} disabled={selectedRows.length === 0}>Export to Excel</Button>
           </div>}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control my-0 py-1 pl-3 purple-border"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>
        </div>

        <div className="datatable overflow-auto">
          <table className="table table-striped table-bordered">
            <thead className="text-center">
              <tr>
               {adminLoggedIn && <th></th>} 
                <th>SL.No</th>
                <th>Created Date</th>
                {adminLoggedIn && <th>Recruiter Name</th>}
                {allKeys.map((key, index) => (
                  <th key={index}>{key.replace(/\b\w/g, (c) => c.toUpperCase())}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index} className="text-center">
                  {adminLoggedIn && <td><input type="checkbox" onChange={()=>handleCheckBoxChange(item._id)} checked={selectedRows.includes(item._id)} /></td>}
                  <th scope="row">{index + 1}</th>
                  <td>{new Date(item.createdDate).toLocaleDateString('en-GB')}</td>
                  {adminLoggedIn && <td>{item.recruiterName}</td>}
                  {allKeys.map((key, i) => (
                    <td key={i}>{item[key] !== undefined ? item[key] : '-'}</td>
                  ))}
                  <td >
                    <FontAwesomeIcon
                      icon={faFilePen}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => openModal(item)}
                    />
                    <FontAwesomeIcon
                      icon={faDownload}
                      onClick={() => openPdfInNewTab( item._id)}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }).map((_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Editing */}
      {editingData && (
        <Modal size="lg" show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Candidate</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
              {allKeys.map((key) => (
                <Col key={key} md={4}>
                <Form.Group controlId={`form-${key}`} key={key}>
                  <Form.Label>{key.replace(/\b\w/g, (c) => c.toUpperCase())}</Form.Label>
                  <Form.Control
                    type="text"
                    name={key}
                    value={editingData[key] || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                </Col>
              ))}
              </Row>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload CV</Form.Label>
                <Form.Control type="file" ref={fileInputRef} />
              </Form.Group>
              {editingData?.uploadCV  && <p className='text-success'>{editingData?.uploadCV}</p>
                    }
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
      )}
    </>
  );
});

export default OtherTable;
