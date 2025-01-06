import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { decodeToken } from '../utils/decodeToken';

function OtherForm({setPosition, onFormSubmit }) {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [clientName, setClientName] = useState('');
  const fileInputRef = useRef(null);
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [formId, setFormId] = useState('');

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

  // Fetch positions on component mount
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

  // Handle change of job position
  const handlePositionChange = async (e) => {
    const id = e.target.value;
    setFormId(id);
    setPosition(id)

    try {
      const response = await axios.get(`http://103.38.50.152/nodejs/labels/specificlabel/${id}`);
      // const response = await axios.get(`http://localhost:5000/labels/specificlabel/${id}`);
      setFormSchema(response.data);
      setSelectedPosition(response.data.position);
      setClientName(response.data.clientName);
      setFormData({});
    } catch (error) {
      console.error('Error fetching form schema:', error);
    }
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append text fields to FormData
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Append the file to FormData
    if (fileInputRef.current.files[0]) {
      formDataToSend.append('file', fileInputRef.current.files[0]);
    }
      formDataToSend.append('recruiterName', recruiterName);
      formDataToSend.append('recruiterId', recruiterId);
      formDataToSend.append('formType', 'other');
      formDataToSend.append('formId', formId);
      formDataToSend.append('clientName', clientName);
         

    try {
      const response = await axios.post('http://103.38.50.152/nodejs/candidate/add', formDataToSend, {
      // const response = await axios.post('http://localhost:5000/candidate/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Your data has been saved successfully!');
        setFormData({});
        setSelectedPosition('');
        setFormSchema(null);
        setClientName('');
        fileInputRef.current.value = '';
        onFormSubmit();
      }
    
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <div>
      <h2>Select Job Position</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formPosition">
          <Form.Label>Job Position</Form.Label>
          <Form.Control as="select" value={selectedPosition} onChange={handlePositionChange}>
            <option value="">Select a position</option>
            {positions.map((item, index) => (
              <option key={index} value={item._id}>
                {item.position}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <br />
        {formSchema && (
          <div className="m-3">
            <h3>Fill the Form for {selectedPosition} at {clientName}</h3>
            <Row>
              {formSchema.labels.map((label, index) => (
                <Col md={4} key={index}>
                  <Form.Group className="mb-3" controlId={`formLabel${index}`}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      type="text"
                      name={label}
                      value={formData[label] || ''}
                      onChange={handleInputChange}
                      placeholder={`Enter ${label}`}
                      required
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <Row>
              <Form.Group controlId="formFile" as={Col} md="3" className="mb-3">
                <Form.Label>Upload CV</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf, .doc, .docx"
                  ref={fileInputRef}
                  required
                />
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

export default OtherForm;
