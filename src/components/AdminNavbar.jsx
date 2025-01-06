import React,{useState,useEffect} from 'react'
import { Navbar, Nav, Container, NavDropdown ,Button,Modal} from 'react-bootstrap'
import '../styles/navBar.css'
import logo from '../assets/images/logo-main.png'
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeToken';
import { Link } from 'react-router-dom';
import SendNotification from './SendNotification';


function AdminNavbar({setAdminLoggedIn}) {
  const [modalShow, setModalShow] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserLoggedIn(true);
      const decodedToken = decodeToken(token);
          if (decodedToken && decodedToken.name) {
              setUsername(decodedToken.name);
          }
    }
  }, [])
   
  const handleLogout = () => {
    localStorage.clear();
    setAdminLoggedIn(false);
    setUserLoggedIn(false);
    navigate('/');
  }
  
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
         {/* <img src={event} alt="event-logo" className="skylark-event" /> */}

    <Container className='nav'>
      <Navbar.Brand href="#home">
             <img src={logo} alt="Skylark-logo" className="skylark-logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end" >
            
        <Nav > 
          <Nav.Link as={Link} to="/admindashboard">Home</Nav.Link>
          
          <NavDropdown title="Candidate" id="collasible-nav-dropdown">
            <NavDropdown.Item as={Link} to="/managecandidate">Manage Candidate</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/exportdata">Export Data</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/trackcandidate">Track Candidate</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/findcandidates">Find Candidate</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/clientwisedata">Client-Wise Candidate</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/clientmaster">Client Master</NavDropdown.Item>
          </NavDropdown> 
          <Nav.Link  as={Link} to="/managerecruiters">Manage Recruiters</Nav.Link>
          <Nav.Link  as={Link} to="/settracker">Set Tracker</Nav.Link>
          <Nav.Link  as={Link} to="/preschedule">Pre-Schedule</Nav.Link>
          <Nav.Link  as={Link} to="/postschedule">Post-Schedule</Nav.Link>
         
          <Nav.Link  as={Link} to="/managecandidates">Reports</Nav.Link>
          {/* <Button variant='success text-light' onClick={() => setModalShow(true)} > Send Notification</Button> */}
          {userLoggedIn &&
          <NavDropdown title={username}id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown> 
            
           }

        </Nav>
      </Navbar.Collapse>
    </Container>
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Send Notification
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
           <SendNotification/>
      
      </Modal.Body>
    
    </Modal>
   
  </Navbar>
  )
}

export default AdminNavbar