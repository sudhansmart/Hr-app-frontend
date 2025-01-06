import React, { useState, useRef ,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik } from 'formik';
import * as yup from 'yup';
import { decodeToken } from '../utils/decodeToken';
import axios from 'axios';
import DatePicker from 'react-datepicker';

function PersonalTracker({onFormSubmit}) {
 
  const fileInputRef = useRef(null);
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

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
    companyName: yup.string().required('Company Name is required'),
    role: yup.string().required('Position is required'),
    previousCompany: yup.string().required('Current Company is required'),
    overAllExp: yup.string()
    .matches(/^\d+(\.\d+)?$/, 'Relevant Experience must be a valid number')
    .required('Overall Experience is required'),
    currentCtc: yup.string()
    .matches(/^\d+(\.\d+)?$/, 'Relevant Experience must be a valid number')
    .required('Current CTC is required'),
    expectedCtc: yup.string()
    .matches(/^\d+(\.\d+)?$/, 'Relevant Experience must be a valid number')
    .required('Expected CTC is required'),
    skills: yup.string().required('Skills is required'),
    noticePeriod: yup.string().required('Notice Period is required'),
    interviewMode: yup.string().required('Interview Mode is required'),
    personalTrackStatus: yup.string().required('Personal Track Status is required'),
    lastWorkingDay: yup.date().required('Last Working Day is required'),
    qualification: yup.string().required('Qualification is required'),
    gender: yup.string().required('Gender is required'),
    remarks : yup.string().required("Remarks is required")
    
  });

  const handleSubmit = async (values, { resetForm }) => {
     setBtnLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      formData.append('recruiterName', recruiterName);
      formData.append('recruiterId', recruiterId);
      formData.append('formType', 'common');
      

      console.log('Form Data:', Object.fromEntries(formData));
         const response = await axios.post('http://103.38.50.152/nodejs/candidate/addpersonaltracker', formData, {
      // const response = await axios.post('http://localhost:5000/candidate/addpersonaltracker', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200){
        alert('Your data has been saved successfully!');
         resetForm();
         fileInputRef.current.value = '';
         onFormSubmit();
         setBtnLoading(false);
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
          companyName: '',
          role: '',
          previousCompany: '',
          qualification: '',
          gender: '',
          overAllExp: '',
          currentCtc: '',
          expectedCtc: '',
          noticePeriod: '',
          interviewMode: '',
          personalTrackStatus:'',
          lastWorkingDay: '',
          remarks: '',
          skills:'',
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
              

              <Form.Group as={Col} md="3" controlId="validationFormik06">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={values.companyName}
                  onChange={handleChange}
                  isValid={touched.companyName && !errors.companyName}
                  isInvalid={touched.companyName && !!errors.companyName}
                />
                <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>
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
                <Form.Label>Previous Company</Form.Label>
                <Form.Control
                  type="text"
                  name="previousCompany"
                  value={values.previousCompany}
                  onChange={handleChange}
                  isValid={touched.previousCompany && !errors.previousCompany}
                  isInvalid={touched.previousCompany && !!errors.previousCompany}
                />
                <Form.Control.Feedback type="invalid">{errors.previousCompany}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationFormik09">
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
              <Form.Group as={Col} md="3" controlId="validationFormik01">
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
              <Form.Group as={Col} md="3" controlId="validationFormik11">
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

              <Form.Group as={Col} md="3" controlId="validationFormik12">
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
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        value={values.gender || 'Please Select'} // Use the 'value' prop for default value
                        name='gender'
                        onChange={handleChange}
                        isValid={touched.gender && !errors.gender}
                        isInvalid={touched.gender && !!errors.gender}
                        aria-label="select Here"
                      >
                        <option value="" >Please Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                       
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.gender}
                      </Form.Control.Feedback>
                    </Form.Group>
            </Row>

            <Row className="mb-3">
             

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
                    <Form.Group as={Col} md="2" controlId="validationFormik13">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={values.personalTrackStatus || 'Please Select'} // Use the 'value' prop for default value
                        name='personalTrackStatus'
                        onChange={handleChange}
                        isValid={touched.personalTrackStatus && !errors.personalTrackStatus}
                        isInvalid={touched.personalTrackStatus && !!errors.personalTrackStatus}
                        aria-label="select Here"
                      >
                        <option value="" >Please Select</option>
                        <option value="attended">Attended</option>
                        <option value="notattended">Not-Attended</option>
                        <option value="hold">Hold</option>
                        <option value="yetToAttend">Yet-to-Attend</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.personalTrackStatus}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationFormik19" as={Col} md="2">
                     <Form.Label>Last Working Day</Form.Label><br/>
                        <Form.Control
                          as={DatePicker}
                          className="form-control"
                          selected={values.lastWorkingDay}
                          name="lastWorkingDay"
                          onChange={(date) =>
                            handleChange({
                              target: { name: 'lastWorkingDay', value: date },
                            })
                          }
                           dateFormat="dd-MM-yyyy"
                          isValid={touched.lastWorkingDay && !errors.lastWorkingDay}
                          isInvalid={touched.lastWorkingDay && !!errors.lastWorkingDay}
                          placeholder='DD-MM-YYYY'
                          
                          autoComplete="off"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastWorkingDay}
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
                  isValid={touched.remarks && !errors.remarks}
                  isInvalid={touched.remarks && !!errors.remarks}
                />
                 <Form.Control.Feedback type="invalid">
                          {errors.remarks}
                        </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormik15">
                <Form.Label>Skills</Form.Label>
                <Form.Control
                  as="textarea"
                  name="skills"
                  placeholder='Please Add Atleast 5 Skills.'
                  value={values.skills}
                  onChange={handleChange}
                  rows={3}
                  isValid={touched.skills && !errors.skills}
                  isInvalid={touched.skills && !!errors.skills}
                />
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                          {errors.skills}
                        </Form.Control.Feedback>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationFormikFile">
                <Form.Label>Upload CV</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  ref={fileInputRef}
                  onChange={(event) => setFieldValue('file', event.target.files[0])}
                 
                />
               
              </Form.Group>
            </Row>

            <Button type="submit" disabled={btnLoading} >Submit</Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default PersonalTracker;
