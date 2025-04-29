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
      <BrowserRouter basename="/RCWB">
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