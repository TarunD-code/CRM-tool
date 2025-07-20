import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

interface UserRequest {
  name: string;
  age: number;
  place: string;
  contactNumber: string;
  email?: string;
  password?: string;
}

const UserForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<UserRequest>({ name: '', age: 0, place: '', contactNumber: '', email: '', password: '' });
  const [snackbar, setSnackbar] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/users/${id}`).then(res => setForm(res.data));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`/api/users/${id}`, form);
      setSnackbar('User updated');
    } else {
      await axios.post('/api/users', form);
      setSnackbar('User created');
    }
    setTimeout(() => navigate('/users'), 1000);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>{isEdit ? 'Edit User' : 'Add User'}</Typography>
      <TextField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required={!isEdit}
        disabled={isEdit}
      />
      {!isEdit && (
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
      )}
      <TextField
        label="Age"
        name="age"
        type="number"
        value={form.age}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Place"
        name="place"
        value={form.place}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Contact Number"
        name="contactNumber"
        value={form.contactNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {isEdit ? 'Update' : 'Create'}
      </Button>
      <Button onClick={() => navigate('/users')} sx={{ mt: 2, ml: 2 }}>
        Cancel
      </Button>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </Box>
  );
};

export default UserForm; 