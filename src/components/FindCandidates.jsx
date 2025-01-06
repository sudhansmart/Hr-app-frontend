import React, { useEffect, useState } from 'react';
import '../styles/findcandidates.css';
import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';
import maleicon from '../assets/images/male.jpeg';
import femaleicon from '../assets/images/female.jpeg';

import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope,faBuilding, faUserTie,faPhone,faUser,faCalendarDays,faClock,faCoins,faBriefcase, faUserGraduate ,faLocationDot} from '@fortawesome/free-solid-svg-icons';


function FindCandidates() {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [qualification, setQualification] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gender, setGender] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sample data to demonstrate filtering
  const [candidates, setCandidates] = useState([]); 
  

  const fetchAllCandidates = async () => {
      try {
           const response = await axios.get('http://103.38.50.152/nodejs/candidate/getpersonaltracker');
          
           setCandidates(response.data);
      } catch (error) {
          console.log("Error Occured in fetching all candidates in FindCandidates :",error)
      } 

  };

  useEffect(() => {
    fetchAllCandidates();
  }, []);

  const [filteredCandidates, setFilteredCandidates] = useState([]);

  const handleSearch = () => {
    const searchResults = candidates.filter(candidate => {

      const candidateNoticePeriod = parseInt(candidate.noticePeriod);

    // Notice period range filtering
    let noticePeriodMin = null;
    let noticePeriodMax = null;

    if (noticePeriod) {
      const [min, max] = noticePeriod.split('-').map(Number);
      noticePeriodMin = min !== undefined ? min : null;
      noticePeriodMax = max !== undefined ? max : null;
    }
      return (
        (!keywords || candidate.role?.toLowerCase().includes(keywords.toLowerCase()) || candidate.skills.toLowerCase().includes(keywords.toLowerCase())) &&
        
        (!location || candidate.location?.toLowerCase().includes(location.toLowerCase())) &&
        (!qualification || candidate.qualification?.toLowerCase().includes(qualification.toLowerCase())) &&
        (!companyName || candidate.companyName?.toLowerCase() === companyName.toLowerCase()) &&
        (!gender || candidate.gender?.toLowerCase() === gender) &&
        (!minExperience || candidate.overAllExp >= parseInt(minExperience)) &&
        (!maxExperience || candidate.overAllExp <= parseInt(maxExperience)) &&
        (!minSalary || candidate.currentCtc >= parseInt(minSalary)) &&
        (!maxSalary || candidate.currentCtc <= parseInt(maxSalary)) &&
        (!noticePeriod || 
          (noticePeriodMin !== null && candidateNoticePeriod >= noticePeriodMin && 
           noticePeriodMax !== null && candidateNoticePeriod <= noticePeriodMax)) && 
        (!startDate || new Date(candidate.lastWorkingDay) >= new Date(startDate)) &&
        (!endDate || new Date(candidate.lastWorkingDay) <= new Date(endDate))
      );
    });

    setFilteredCandidates(searchResults);
  };

  const handleReset = () => {
    setKeywords('');
    setLocation('');
    setQualification('');
    setCompanyName('');
    setGender('');
    setMinExperience('');
    setMaxExperience('');
    setMinSalary('');
    setMaxSalary('');
    setNoticePeriod('');
    setStartDate('');
    setEndDate('');
    setFilteredCandidates([]);
  };



   const openPdfInNewTab = (pdfId) => {
    
    if (pdfId) {
      const pdfUrl = `http://103.38.50.152/nodejs/candidate/personaltrackerpdfs/${pdfId}`;
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="findcandidates-main">
      <div className="searchsection p-5">
        <Form className='searchformsec'>
          <Row className="mb-3">
            <Col md="4">
              <FloatingLabel controlId="floatingInputGrid" className="floating-label small" label="Keywords [Job Title, Skills]">
                <Form.Control
                  type="text"
                  placeholder=""
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </FloatingLabel>
            </Col>
            <Col md="2">
              <FloatingLabel controlId="floatingInputGrid" label="Location">
                <Form.Control
                  type="text"
                  placeholder=""
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </FloatingLabel>
            </Col>
            <Col md="2">
              <FloatingLabel controlId="floatingInputGrid" label="Qualification">
                <Form.Control
                  type="text"
                  placeholder=""
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </FloatingLabel>
            </Col>
            <Col md="2">
              <FloatingLabel controlId="floatingInputGrid" label="Company Name">
                <Form.Control
                  type="text"
                  placeholder=""
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </FloatingLabel>
            </Col>
            <Col md="2">
              <FloatingLabel controlId="floatingSelect" label="Gender">
                <Form.Select
                  aria-label="Select Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>Please Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md="3">
              <Form.Label>Experience</Form.Label>
              <Row>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Min">
                    <Form.Control
                      type="number"
                      placeholder=""
                      value={minExperience}
                      onChange={(e) => setMinExperience(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Max">
                    <Form.Control
                      type="number"
                      placeholder=""
                      value={maxExperience}
                      onChange={(e) => setMaxExperience(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
            <Col md="3">
              <Form.Label>Salary</Form.Label>
              <Row>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Min">
                    <Form.Control
                      type="number"
                      placeholder=""
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Max">
                    <Form.Control
                      type="number"
                      placeholder=""
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
            <Col md="4">
              <Form.Label>Last Working Day</Form.Label>
              <Row>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="Start">
                    <Form.Control
                      type="date"
                      placeholder="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel controlId="floatingInputGrid" label="End">
                    <Form.Control
                      type="date"
                      placeholder="End Date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
            <Col md="2">
              <Form.Label>Notice Period</Form.Label>
              <FloatingLabel controlId="floatingSelect" label="Days">
                <Form.Select
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                >
                  <option>Please Select</option>
                  <option value="0">Immediate Joiner</option>
                  <option value="0-15">0-15</option>
                  <option value="15-30">15-30</option>
                  <option value="30-45">30-45</option>
                  <option value="45">45 Above</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <div className="searchbtnsection">
            <Button variant="outline-primary" onClick={handleReset}> Reset </Button>
            <Button variant="primary" onClick={handleSearch}> Search </Button>
          </div>
          <h5>Search Results:</h5>
        </Form>
       
        <div className="results-section mt-4">
          
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map(candidate => (
              <div key={candidate._id} className="findcandidate-cardcover">
                     <div className="findcandidate-topsec">
                       <img src={candidate.gender === 'male' ? maleicon : femaleicon} className='findcandidate-img' alt="skylark-logo" />
                       <div className="findcandidate-rightcontent">
                          <div className="rightcontent-left">
                         <h5>{candidate.name}</h5>
                         <p><FontAwesomeIcon className='findcandidate-icon' icon={faUserTie}/> {candidate.role}</p>
                         <p><FontAwesomeIcon className='findcandidate-icon'  icon={faEnvelope}/> {candidate.email}</p>
                         <p><FontAwesomeIcon className='findcandidate-icon' icon={faPhone}/> {candidate.phoneNumber}</p>
                         <p><FontAwesomeIcon className='findcandidate-icon' icon={faBuilding}/> {candidate.companyName}</p>
                         <p><FontAwesomeIcon className='findcandidate-icon' icon={faLocationDot}/> {candidate.location}</p>
                        
                         
                         </div>
                         <div className="rightcontent-right">
                            <p><FontAwesomeIcon className='findcandidate-icon' icon={faUserGraduate}/> {candidate.qualification?candidate.qualification:"NA"}</p>
                            <p><FontAwesomeIcon className='findcandidate-icon' icon={faUser}/> {candidate.gender}</p>
                            <p><FontAwesomeIcon className='findcandidate-icon'    icon={faBriefcase}/> {candidate.overAllExp} Years</p>
                            <p><FontAwesomeIcon className='findcandidate-icon'   icon={faCoins}/> {candidate.currentCtc} LPA</p>
                            <p><FontAwesomeIcon className='findcandidate-icon'   icon={faClock}/> {candidate.noticePeriod} Days</p>
                            <p><FontAwesomeIcon className='findcandidate-icon'   icon={faCalendarDays}/> {candidate.lastWorkingDay?new Date(candidate.lastWorkingDay).toLocaleDateString():"NA"}</p>

                         </div>
                       </div>
                     </div>
                     <div className="findcandidate-bottomsec">
                              <h4 className='mt-2'>Skills :</h4>
                              <div className='d-flex justify-content-around'>
                              <ul className='d-flex gap-4 flex-wrap'>
                                {candidate.skills.split(",").map((skill, index) => (
                                  <li key={index}>{skill.trim()}</li> // Split, trim, and render each skill as a list item
                                ))}
                             </ul>

                             <Button variant='outline-success' onClick={() => openPdfInNewTab(candidate._id)}>View Cv</Button>
                             </div>
                       </div>  
              </div>
            ))
          ) : (
            <p>No candidates found based on search criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindCandidates;
