// RCWB – The website for the Royal College Western Band
// Copyright (C) 2025  Sanuka Weerabaddana 

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import PropTypes from 'prop-types'
import './App.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Scores from './components/Scores';
import Members from './components/Members';
import Register from './components/Register';
import PrivateRoute from './logic/PrivateRoute';

function AppRoutes({ isAdmin, setisAdmin }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      document.body.classList.add('scroll-enabled');
    } else {
      document.body.classList.remove('scroll-enabled');
    }
  }, [location]);

  return (
    <Routes>
      <Route 
        path="/login" 
        element={<Login setisAdmin={setisAdmin} />} 
      />
      <Route
        path="/"
        element={
            <Dashboard isAdmin={isAdmin} />
        }
      />
      <Route
        path="/scores-admin"
        element={
          <PrivateRoute>
            <Scores isAdmin={isAdmin} instrument='none' />
          </PrivateRoute>
        }
      />
      <Route
        path="/scores"
        element={
          <Scores isAdmin={false} instrument="none" />
        }
      />
      <Route
        path="/members"
        element={
          <PrivateRoute>
            <Members  isAdmin={isAdmin} />
          </PrivateRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PrivateRoute>
            <Register  isAdmin={isAdmin} />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setisAdmin(true);
      } else {
        setisAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter basename="/RCWB">
      <AppRoutes isAdmin={isAdmin} setisAdmin={setisAdmin} />
    </BrowserRouter>
  );
}

AppRoutes.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  setisAdmin: PropTypes.func.isRequired,
};

export default App;