import React, { useState, useEffect } from 'react';
import '../styles/clientMaster.css';
import { Col, Form, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

function ClientMaster() {
  const [formData, setFormData] = useState({
    clientName: '',
    position: '',
  });
  const [clientData, setClientData] = useState([]);
  const [clients, setClients] = useState([]);
  const [positions, setPositions] = useState([]);
  const [activeKey, setActiveKey] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch all client data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get('http://103.38.50.152/nodejs/client/getclients');
      // const response = await axios.get('http://localhost:5000/client/getclients');
      const clientArr = response.data.map((item) => item.clientName);
      const uniqueClients = [...new Set(clientArr)];
      setClientData(response.data);
      setClients(uniqueClients);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Filter positions by client name
  const filterPositions = (clientName) => {
    setActiveKey(clientName);
    const filteredData = clientData.filter((item) => item.clientName === clientName);
    setPositions(filteredData);
  };

  // Delete a specific position by ID
  const deletePosition = async (id) => {
    try {
      const response = await axios.delete(`http://103.38.50.152/nodejs/client/deleteclient/${id}`);
      // const response = await axios.delete(`http://localhost:5000/client/deleteclient/${id}`);
      if (response.status === 200) {
        alert('Position deleted successfully!');
        setPositions([])
        fetchData();

      } else {
        alert('Error deleting position. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEdit && editId) {
        // Update existing data
        
        const response = await axios.put(`http://103.38.50.152/nodejs/client/updateclient/${editId}`, formData);
        // const response = await axios.put(`http://localhost:5000/client/updateclient/${editId}`, formData);
        if (response.status === 200) {
          alert('Client data updated successfully!');
        } else {
          alert('Error updating client data. Please try again.');
        }
      } else {
        // Add new data
        
        const response = await axios.post('http://103.38.50.152/nodejs/client/addclient', formData);
        // const response = await axios.post('http://localhost:5000/client/addclient', formData);
        if (response.status === 200) {
          alert('Client data submitted successfully!');
        } else {
          alert('Error submitting client data. Please try again.');
        }
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    }
  };

  // Reset form and cancel edit mode
  const resetForm = () => {
    setFormData({ clientName: '', position: '' });
    setShowEdit(false);
    setEditId(null);
  };

  // Handle edit button click
  const handleEdit = (position) => {
    setFormData({ clientName: position.clientName, position: position.position });
    setEditId(position._id);
    setShowEdit(true);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="clientmaster-main">
      <div className="clientmaster-clientsec">
        <div className="clientlist-sec" style={{ overflowY: 'scroll', maxHeight: '100%' }}>
          <table>
            <thead>
              <tr>
                <th>SL.No</th>
                <th>Client Name</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr
                  key={client}
                  className={activeKey === client ? 'clientactive' : ''}
                  onClick={() => filterPositions(client)}
                >
                  <td>{index + 1}</td>
                  <td>{client}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="clientlist-sec" style={{ overflowY: 'scroll', maxHeight: '100%' }}>
          <table>
            <thead>
              <tr>
                <th>SL.No</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr key={position._id}>
                  <td>{index + 1}</td>
                  <td>{position.position}</td>
                  <td className="d-flex gap-2 justify-content-center">
                    <FontAwesomeIcon
                      className="text-primary"
                      icon={faPencil}
                      onClick={() => handleEdit(position)}
                    />
                    <FontAwesomeIcon
                      className="text-danger"
                      icon={faTrash}
                      onClick={() => deletePosition(position._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Form className="clientmaster-form" onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              type="text"
              name="clientName"
              placeholder="Enter Client Name"
              value={formData.clientName}
              onChange={handleChange}
              required
            />
          </Col>
          <Col>
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              name="position"
              placeholder="Enter Position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>
        <div className="mt-3">
          {showEdit ? (
            <>
              <Button variant="secondary" onClick={resetForm} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </>
          ) : (
            <Button variant="primary" type="submit">
              Submit
            </Button>
          )}
        </div>
      </Form>
      </div>
    </div>
  );
}

export default ClientMaster;
