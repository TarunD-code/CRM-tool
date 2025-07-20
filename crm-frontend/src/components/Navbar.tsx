import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const Navbar: React.FC = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component={Link} to="/users" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
        CRM - Customer Management
      </Typography>
      <Button color="inherit" component={Link} to="/users">Users</Button>
      <Button color="inherit" component={Link} to="/users/new">Add User</Button>
    </Toolbar>
  </AppBar>
);

export default Navbar; 