import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { decodeToken } from './utils/decodeToken';
import AddCandidate from './Pages/AddCandidate';
import PreSchedule from './Pages/PreSchedule';
import PostSchedule from './Pages/PostSchedule';
import AdminNavbar from './components/AdminNavbar';
import NavBar from './components/NavBar';
import ManageCandidates from './Pages/ManageCandidates';
import ManageRecruiters from './Pages/ManageRecruiters';
import MainPage from './Pages/MainPage';
import RecruiterDashBoard from './Pages/RecruiterDashBoard';
import AdminDashBoard from './Pages/AdminDashBoard';

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
  const [recruiterLoggedIn, setRecruiterLoggedIn] = useState(localStorage.getItem('recruiterAuth') === 'true');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <AppContent 
        adminLoggedIn={adminLoggedIn}
        setAdminLoggedIn={setAdminLoggedIn}
        recruiterLoggedIn={recruiterLoggedIn}
        setRecruiterLoggedIn={setRecruiterLoggedIn}
        authToken={authToken}
        setAuthToken={setAuthToken}
      />
    </Router>
  );
}

function AppContent({ adminLoggedIn, setAdminLoggedIn, recruiterLoggedIn, setRecruiterLoggedIn, authToken, setAuthToken }) {
  const navigate = useNavigate();
  const location = useLocation(); // To track the current path

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        if (decodedToken.role === 'admin') {
          setAdminLoggedIn(true);
        } else if (decodedToken.role === 'recruiter') {
          setRecruiterLoggedIn(true);
        }
      }
    }
  }, [authToken, setAdminLoggedIn, setRecruiterLoggedIn]);

  // Avoid automatic redirects when the user is already on a valid page
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/recruiterdashboard' || location.pathname === '/admindashboard') {
      if (recruiterLoggedIn) {
        navigate('/recruiterdashboard');
      } else if (adminLoggedIn) {
        navigate('/admindashboard');
      } else {
        navigate('/');
      }
    }
  }, [recruiterLoggedIn, adminLoggedIn, location.pathname, navigate]);

  return (
    <>
      {adminLoggedIn && <AdminNavbar setAdminLoggedIn={setAdminLoggedIn} />}
      {recruiterLoggedIn && <NavBar setRecruiterLoggedIn={setRecruiterLoggedIn} />}
      <Routes>
        <Route path='/' element={<MainPage setAuthToken={setAuthToken} />} />
        <Route
          path='/recruiterdashboard'
          element={recruiterLoggedIn ? <RecruiterDashBoard /> : <Navigate to='/' />}
        />
        <Route
          path='/admindashboard'
          element={adminLoggedIn ? <AdminDashBoard /> : <Navigate to='/' />}
        />
        <Route
          path='/addcandidate'
          element={recruiterLoggedIn ? <AddCandidate /> : <Navigate to='/' />}
        />
        <Route
          path='/preschedule'
          element={authToken ? <PreSchedule /> : <Navigate to='/' />}
        />
        <Route
          path='/postschedule'
          element={authToken ? <PostSchedule /> : <Navigate to='/' />}
        />
        <Route
          path='/managecandidate'
          element={adminLoggedIn ? <ManageCandidates /> : <Navigate to='/' />}
        />
        <Route
          path='/managerecruiters'
          element={adminLoggedIn ? <ManageRecruiters /> : <Navigate to='/' />}
        />
      </Routes>
    </>
  );
}

export default App;
