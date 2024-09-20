import React,{useState,useEffect} from 'react'
import { Navbar, Nav, Container, NavDropdown ,Button} from 'react-bootstrap'
import '../styles/navBar.css'
import logo from '../assets/images/logo.webp'
import { decodeToken } from '../utils/decodeToken';
import { Link,useNavigate } from 'react-router-dom';

function NavBar({setRecruiterLoggedIn}) {
  const navigate = useNavigate();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

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
    setUserLoggedIn(false);
    setRecruiterLoggedIn(false);
    navigate('/');
  }
  
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
    <Container className='nav'>
      <Navbar.Brand href="#home">
             <img src={logo} alt="Skylark-logo" className="skylark-logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end" >
            
        <Nav > 
          <Nav.Link as={Link} href="#Home">Home</Nav.Link>

          <Nav.Link  as={Link} to="/addcandidate">Add Candidate</Nav.Link>
          <Nav.Link  as={Link} to="/preschedule">Pre-Schedule</Nav.Link>
          <Nav.Link  as={Link} to="/postschedule">Post-Schedule</Nav.Link>
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
   
  </Navbar>
  )
}

export default NavBar