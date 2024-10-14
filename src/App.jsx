import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CourseList from './components/CourseList';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import BookingPage from './components/BookingPage';
import PaymentForm from './components/PaymentForm';
import ReviewPage from './components/ReviewPage';
import EnrolledCourses from './components/EnrolledCourses'; 
import Navbar from './components/Navbar'; 
import Assessment from './components/Assessment';
import TestPage from './components/TestPage';
import CoursePage from './components/CoursePage';
import { AuthProvider } from './context/AuthContext';

// A wrapper component that conditionally shows the Navbar
const Layout = ({ children }) => {
  const location = useLocation();

  // Hide the Navbar on login and registration pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />} {/* Only render Navbar if hideNavbar is false */}
      {children}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/enrolled-courses" element={<EnrolledCourses />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentForm />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/course/:courseId/test" element={<TestPage />} /> {/* Route for assessments */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
