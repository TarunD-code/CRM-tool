import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import SidebarLayout from './components/SidebarLayout';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserForm from './components/UserForm';
import Profile from './components/Profile';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users/:id/edit" element={<UserForm />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
