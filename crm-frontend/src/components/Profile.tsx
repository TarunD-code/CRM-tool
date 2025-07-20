import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Snackbar } from '@mui/material';
import axios from 'axios';

interface UserProfile {
  id: number;
  name: string;
  age: number;
  place: string;
  contactNumber: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [edit, setEdit] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  useEffect(() => {
    // For demo, fetch user with id 1. In real app, use auth user id.
    axios.get<UserProfile>('/api/users/1').then(res => setProfile(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!profile) return;
    await axios.put(`/api/users/${profile.id}`, profile);
    setSnackbar('Profile updated');
    setEdit(false);
  };

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>My Profile</Typography>
          <TextField
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!edit}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={profile.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!edit}
          />
          <TextField
            label="Place"
            name="place"
            value={profile.place}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!edit}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={profile.contactNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!edit}
          />
          {edit ? (
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
              Save
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setEdit(true)} sx={{ mt: 2 }}>
              Edit
            </Button>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </Box>
  );
};

export default Profile; 