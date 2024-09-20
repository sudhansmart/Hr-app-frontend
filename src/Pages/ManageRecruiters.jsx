import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faFilePen, faDownload, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import {Form,Row,Col, Button} from 'react-bootstrap'

function ManageRecruiters() {
    const [searchText, setSearchText] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('desc');
    const [formdata, setFormdata] = useState([
      {
        _id: '1',
        date:"2023-01-30T08:32:53.177+00:00",
        name: 'Hariharasudhan',
        userId: 'Skylark@001',
        password: 'Skylark@123',
       
      }
    ]);

    const[addData,setAddData] = useState({
      name: '',
      userId: '',
      password: '',
    })
  
    const [editingRowId, setEditingRowId] = useState(null);
  
    const handleEditClick = (id) => {
      setEditingRowId(id);
    };
  
    const handleCancelClick = () => {
      setEditingRowId(null);
    };
  
    const handleSaveClick = (id) => {
      setEditingRowId(null);
    };
  
    const handleInputChange = (e, id) => {
      const { name, value } = e.target;
      setFormdata((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, [name]: value } : item
        )
      );
    };   

    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setAddData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleAddSubmit = (e) => {
      e.preventDefault();
     console.log(addData)
    }
    
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
      const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const userIdMatch = item.userId && item.userId.toLowerCase().includes(searchText.toLowerCase());
  
      const dateObject = new Date(item.date);
      const formattedDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
  
      const startDateWithoutTime = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
      const endDateWithoutTime = endDate ? new Date(endDate).toISOString().split('T')[0] : null;
  
      const dateMatch =
        startDateWithoutTime &&
        endDateWithoutTime &&
        formattedDate >= new Date(startDateWithoutTime) &&
        formattedDate <= new Date(endDateWithoutTime);
  
      return (nameMatch || userIdMatch ) && (!startDateWithoutTime || dateMatch);
    });
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div>
         
         <div className="container mt-4" style={{ height: '100vh' }}>
      <div className="col-md-12">
        <h4 className="pt-3 pb-4 text-center mb-5 font-bold font-up deep-purple-text">Manage Recruiters</h4>
        <Form onSubmit={handleAddSubmit}>
         <Row>
             <Col md={3}>
             <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Recruiter Name</Form.Label>
                <Form.Control type="text" name='name' value={addData.name} placeholder="Enter Name"  onChange={handleOnChange}/>
              </Form.Group>
             </Col>
             <Col md={3}>
             <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>User ID</Form.Label>
                <Form.Control type="text" name='userId' value={addData.userId} placeholder="Enter UserId" onChange={handleOnChange} />
              </Form.Group>
             </Col>
             <Col md={3}>
             <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Password</Form.Label>
                <Form.Control type="text" name='password' value={addData.password} placeholder="Enter Password" onChange={handleOnChange} />
              </Form.Group>
             </Col>
             <Col md={2} className='text-center align-content-center'>
                   <Button type="submit" className="btn btn-primary">Add</Button>
             </Col>

         </Row>
        </Form>
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
                Created Date
                <button className="btn btn-link" onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '15px' }} /> : <FontAwesomeIcon style={{ fontSize: '15px' }} icon={faArrowDown} />}
                </button>
              </th>
              <th>Name</th>
              <th>User Id</th>
              <th>Password</th> 
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item._id} className="align-text-bottom text-center">
                <th scope="row">{index + 1}</th>
                <td>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                <td>
                  {editingRowId === item._id ? (
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleInputChange(e, item._id)}
                    />
                  ) : (
                    item.name   
                  )}
                </td>
                <td>
                  {editingRowId === item._id ? (
                    <input
                      type="text"
                      name="userId"
                      value={item.userId}
                      onChange={(e) => handleInputChange(e, item._id)}
                    />
                  ) : (
                    item.userId
                  )}
                </td>
                <td>
                  {editingRowId === item._id ? (
                    <input
                      type="text"
                      name="password"
                      value={item.password}
                      onChange={(e) => handleInputChange(e, item._id)}
                    />
                  ) : (
                    item.password
                  )}
                </td>
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
                    <FontAwesomeIcon
                      icon={faFilePen}
                      style={{ fontSize: '18px', cursor: 'pointer' }}
                      onClick={() => handleEditClick(item._id)}
                    />
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
    </div>
  )
}

export default ManageRecruiters