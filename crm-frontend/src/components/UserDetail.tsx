import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface User {
  id: number;
  name: string;
  age: number;
  place: string;
  contactNumber: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<User>(`/api/users/${id}`).then(res => setUser(res.data));
  }, [id]);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Button variant="outlined" onClick={() => navigate('/users')} sx={{ mb: 2 }}>Back to List</Button>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>{user.name}</Typography>
          <Typography>ID: {user.id}</Typography>
          <Typography>Age: {user.age}</Typography>
          <Typography>Place: {user.place}</Typography>
          <Typography>Contact Number: {user.contactNumber}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetail; 