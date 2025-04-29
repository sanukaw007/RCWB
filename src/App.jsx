// Copyright (C) 2025 Sanuka Weerabaddana

import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Scores from './components/Scores';
import Members from './components/Members';
import Register from './components/Register';
import PrivateRoute from './logic/PrivateRoute';

function App() {
  return (
    <>
      <BrowserRouter basename="/bandb">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/scores-admin"
            element={
              <PrivateRoute>
                <Scores admin={true} instrument='none' />
              </PrivateRoute>
            }
          />
          <Route
            path="/scores"
            element={
              <Scores admin={false} instrument="none" />
            }
          />
          <Route
            path="/members"
            element={
              <PrivateRoute>
                <Members  admin={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PrivateRoute>
                <Register  admin={true} />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;