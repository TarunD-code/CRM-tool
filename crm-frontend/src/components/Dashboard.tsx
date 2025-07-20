import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Alert } from '@mui/material';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface User {
  id: number;
  name: string;
  age: number;
  place: string;
  contactNumber: string;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get<User[]>('/api/users').then(res => setUsers(res.data));
  }, []);

  // Example: group users by place for a simple chart
  const usersByPlace = users.reduce<{ [place: string]: number }>((acc, user) => {
    acc[user.place] = (acc[user.place] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(usersByPlace).map(([place, count]) => ({ place, count }));

  // Calculate average age, youngest, oldest, top 5 cities, age groups, and recent users
  const averageAge = users.length ? (users.reduce((sum, u) => sum + u.age, 0) / users.length).toFixed(1) : '-';
  const youngest = users.length ? Math.min(...users.map(u => u.age)) : '-';
  const oldest = users.length ? Math.max(...users.map(u => u.age)) : '-';
  const topCities = Object.entries(usersByPlace)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([place, count]) => ({ place, count }));
  const ageGroups = [
    { label: '0-20', count: users.filter(u => u.age <= 20).length },
    { label: '21-30', count: users.filter(u => u.age > 20 && u.age <= 30).length },
    { label: '31-40', count: users.filter(u => u.age > 30 && u.age <= 40).length },
    { label: '41+', count: users.filter(u => u.age > 40).length },
  ];
  const recentUsers = [...users].sort((a, b) => b.id - a.id).slice(0, 5);

  const totalPlaces = new Set(users.map(u => u.place)).size;
  const totalContacts = new Set(users.map(u => u.contactNumber)).size;
  const pieColors = ['#008080', '#1976d2', '#ff9800', '#4caf50', '#e91e63', '#9c27b0'];
  const top5Places = Object.entries(usersByPlace)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([place, count]) => ({ name: place, value: count }));
  const ageGroupPie = ageGroups.map(g => ({ name: g.label, value: g.count }));
  const evenOddPie = [
    { name: 'Even Age', value: users.filter(u => u.age % 2 === 0).length },
    { name: 'Odd Age', value: users.filter(u => u.age % 2 !== 0).length },
  ];

  const firstLetterPie = Object.entries(
    users.reduce<{ [letter: string]: number }>((acc, u) => {
      const letter = u.name.charAt(0).toUpperCase();
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Welcome to your CRM Dashboard! Here you can view analytics and manage your customers efficiently.
      </Alert>
      <Grid container spacing={3}>
        {/* New Widgets */}
        <Grid item xs={12} sm={6} md={2}><Card><CardContent><Typography variant="h6">Total Users</Typography><Typography variant="h4">{users.length}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={2}><Card><CardContent><Typography variant="h6">Average Age</Typography><Typography variant="h4">{averageAge}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={2}><Card><CardContent><Typography variant="h6">Youngest User</Typography><Typography variant="h4">{youngest}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={2}><Card><CardContent><Typography variant="h6">Oldest User</Typography><Typography variant="h4">{oldest}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={2}><Card><CardContent><Typography variant="h6">Total Places</Typography><Typography variant="h4">{totalPlaces}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} sm={6} md={2}><Card><CardContent><Typography variant="h6">Unique Contacts</Typography><Typography variant="h4">{totalContacts}</Typography></CardContent></Card></Grid>
        {/* New Pie Charts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Users by Top 5 Places</Typography>
              {top5Places && top5Places.length > 0 ? (
                <PieChart width={250} height={250}>
                  <Pie data={top5Places} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#008080">
                    {top5Places.map((entry, idx) =>
                      entry && entry.name ? <Cell key={entry.name} fill={pieColors[idx % pieColors.length]} /> : null
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <Typography>No data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Users by Age Group</Typography>
              {ageGroupPie && ageGroupPie.length > 0 ? (
                <PieChart width={250} height={250}>
                  <Pie data={ageGroupPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#1976d2">
                    {ageGroupPie.map((entry, idx) =>
                      entry && entry.name ? <Cell key={entry.name} fill={pieColors[idx % pieColors.length]} /> : null
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <Typography>No data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Even vs Odd Age</Typography>
              {evenOddPie && evenOddPie.length > 0 ? (
                <PieChart width={250} height={250}>
                  <Pie data={evenOddPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#ff9800">
                    {evenOddPie.map((entry, idx) =>
                      entry && entry.name ? <Cell key={entry.name} fill={pieColors[idx % pieColors.length]} /> : null
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <Typography>No data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top 5 Cities by User Count</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topCities} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <XAxis dataKey="place" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#008080" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Users by Age Group</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ageGroups} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Users by Place</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <XAxis dataKey="place" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Users</Typography>
              <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                {recentUsers.map(u => (
                  <li key={u.id}>{u.name} (Age: {u.age}, Place: {u.place})</li>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Users by First Letter of Name</Typography>
              {firstLetterPie && firstLetterPie.length > 0 ? (
                <PieChart width={250} height={250}>
                  <Pie data={firstLetterPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#4caf50">
                    {firstLetterPie.map((entry, idx) =>
                      entry && entry.name ? <Cell key={entry.name} fill={pieColors[idx % pieColors.length]} /> : null
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <Typography>No data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 