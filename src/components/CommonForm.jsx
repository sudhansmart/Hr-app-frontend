import React, { useState, useRef ,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik } from 'formik';
import * as yup from 'yup';
import { decodeToken } from '../utils/decodeToken';
import axios from 'axios';

function CommonForm() {
 
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

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Mobile No is required'),
    location: yup.string().required('Location is required'),
    qualification: yup.string().required('Qualification is required'),
    clientName: yup.string().required('Client Name is required'),
    role: yup.string().required('Position is required'),
    currentCompany: yup.string().required('Current Company is required'),
    overAllExp: yup
      .string()
      .matches(/^\d+$/, 'Overall experience must be a number')
      .required('Overall Experience is required'),
    relevantExp: yup
      .string()
      .matches(/^\d+$/, 'Relevant experience must be a number')
      .required('Relevant Experience is required'),
    currentCtc: yup.string().required('Current CTC is required'),
    expectedCtc: yup.string().required('Expected CTC is required'),
    noticePeriod: yup.string().required('Notice Period is required'),
    interviewMode: yup.string().required('Interview Mode is required'),
    file: yup
      .mixed()
      .required('CV is required')
      .test(
        'fileSize',
        'File size is too large. Max size is 5MB',
        (value) => value && value.size <= 5 * 1024 * 1024
      )
      .test(
        'fileType',
        'Invalid file format. Only PDF, DOC, and DOCX are allowed',
        (value) =>
          value && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type)
      ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      formData.append('recruiterName', recruiterName);
      formData.append('recruiterId', recruiterId);
      formData.append('formType', 'common');
      

      console.log('Form Data:', Object.fromEntries(formData));

      const response = await axios.post('http://localhost:5000/candidate/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200){
        alert('Your data has been saved successfully!');
         resetForm();
         fileInputRef.current.value = '';
      }

      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
          name: '',
          email: '',
          phoneNumber: '',
          location: '',
          qualification: '',
          clientName: '',
          role: '',
          currentCompany: '',
          overAllExp: '',
          relevantExp: '',
          currentCtc: '',
          expectedCtc: '',
          noticePeriod: '',
          interviewMode: '',
          remarks: '',
          file: null,
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors, setFieldValue, resetForm }) => (
          <Form noValidate onSubmit={handleSubmit} className="applicant-form">
            <Row className="mb-3">
              <Form.Group as={Col} md="3" controlId="validationFormik01">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !errors.name}
                  isInvalid={touched.name && !!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik02">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik03">
                <Form.Label>Mobile No</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  isValid={touched.phoneNumber && !errors.phoneNumber}
                  isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                />
                <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik04">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  isValid={touched.location && !errors.location}
                  isInvalid={touched.location && !!errors.location}
                />
                <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="3" controlId="validationFormik05">
                <Form.Label>Qualification</Form.Label>
                <Form.Control
                  type="text"
                  name="qualification"
                  value={values.qualification}
                  onChange={handleChange}
                  isValid={touched.qualification && !errors.qualification}
                  isInvalid={touched.qualification && !!errors.qualification}
                />
                <Form.Control.Feedback type="invalid">{errors.qualification}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik06">
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  type="text"
                  name="clientName"
                  value={values.clientName}
                  onChange={handleChange}
                  isValid={touched.clientName && !errors.clientName}
                  isInvalid={touched.clientName && !!errors.clientName}
                />
                <Form.Control.Feedback type="invalid">{errors.clientName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik07">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  isValid={touched.role && !errors.role}
                  isInvalid={touched.role && !!errors.role}
                />
                <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik08">
                <Form.Label>Current Company</Form.Label>
                <Form.Control
                  type="text"
                  name="currentCompany"
                  value={values.currentCompany}
                  onChange={handleChange}
                  isValid={touched.currentCompany && !errors.currentCompany}
                  isInvalid={touched.currentCompany && !!errors.currentCompany}
                />
                <Form.Control.Feedback type="invalid">{errors.currentCompany}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="validationFormik09">
                <Form.Label>Overall Experience</Form.Label>
                <Form.Control
                  type="text"
                  name="overAllExp"
                  value={values.overAllExp}
                  onChange={handleChange}
                  isValid={touched.overAllExp && !errors.overAllExp}
                  isInvalid={touched.overAllExp && !!errors.overAllExp}
                />
                <Form.Control.Feedback type="invalid">{errors.overAllExp}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="validationFormik10">
                <Form.Label>Relevant Experience</Form.Label>
                <Form.Control
                  type="text"
                  name="relevantExp"
                  value={values.relevantExp}
                  onChange={handleChange}
                  isValid={touched.relevantExp && !errors.relevantExp}
                  isInvalid={touched.relevantExp && !!errors.relevantExp}
                />
                <Form.Control.Feedback type="invalid">{errors.relevantExp}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="validationFormik11">
                <Form.Label>Current CTC</Form.Label>
                <Form.Control
                  type="text"
                  name="currentCtc"
                  value={values.currentCtc}
                  onChange={handleChange}
                  isValid={touched.currentCtc && !errors.currentCtc}
                  isInvalid={touched.currentCtc && !!errors.currentCtc}
                />
                <Form.Control.Feedback type="invalid">{errors.currentCtc}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="validationFormik12">
                <Form.Label>Expected CTC</Form.Label>
                <Form.Control
                  type="text"
                  name="expectedCtc"
                  value={values.expectedCtc}
                  onChange={handleChange}
                  isValid={touched.expectedCtc && !errors.expectedCtc}
                  isInvalid={touched.expectedCtc && !!errors.expectedCtc}
                />
                <Form.Control.Feedback type="invalid">{errors.expectedCtc}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="validationFormik13">
                <Form.Label>Notice Period</Form.Label>
                <Form.Control
                  type="text"
                  name="noticePeriod"
                  value={values.noticePeriod}
                  onChange={handleChange}
                  isValid={touched.noticePeriod && !errors.noticePeriod}
                  isInvalid={touched.noticePeriod && !!errors.noticePeriod}
                />
                <Form.Control.Feedback type="invalid">{errors.noticePeriod}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="validationFormik13">
                      <Form.Label>Interview Mode</Form.Label>
                      <Form.Select
                        value={values.interviewMode || 'Please Select'} // Use the 'value' prop for default value
                        name='interviewMode'
                        onChange={handleChange}
                        isValid={touched.interviewMode && !errors.interviewMode}
                        isInvalid={touched.interviewMode && !!errors.interviewMode}
                        aria-label="select Here"
                      >
                        <option value="" >Please Select</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Virtual">Virtual</option>
                        <option value="Telephonic">Telephonic</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.interviewMode}
                      </Form.Control.Feedback>
                    </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationFormik15">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  name="remarks"
                  value={values.remarks}
                  onChange={handleChange}
                  rows={3}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationFormikFile">
                <Form.Label>Upload CV</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  ref={fileInputRef}
                  onChange={(event) => setFieldValue('file', event.target.files[0])}
                  isInvalid={touched.file && !!errors.file}
                />
                <Form.Control.Feedback type="invalid">{errors.file}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CommonForm;
