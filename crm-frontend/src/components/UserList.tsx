import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import AddIcon from '@mui/icons-material/Add';

interface User {
  id: number;
  name: string;
  age: number;
  place: string;
  contactNumber: string;
  isManager?: boolean;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ name: '', place: '', ageMin: '', ageMax: '' });
  const [pageSize, setPageSize] = useState<number>(25);
  const [dialog, setDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const fetchUsers = async () => {
    const res = await axios.get<User[]>('/api/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setSnackbar('User deleted');
      fetchUsers();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setDialog({ open: true, message: error.response.data });
      } else {
        setSnackbar('Error deleting user');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'age', headerName: 'Age', width: 90 },
    { field: 'place', headerName: 'Place', flex: 1 },
    { field: 'contactNumber', headerName: 'Contact Number', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`/users/${params.id}`)} size="small">
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/users/${params.id}/edit`)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(Number(params.id))} size="small">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredUsers = users.filter(u =>
    (!filter.name || u.name.toLowerCase().includes(filter.name.toLowerCase())) &&
    (!filter.place || u.place.toLowerCase().includes(filter.place.toLowerCase())) &&
    (!filter.ageMin || u.age >= Number(filter.ageMin)) &&
    (!filter.ageMax || u.age <= Number(filter.ageMax))
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const handleExportCSV = () => {
    const csvRows = [
      ['ID', 'Name', 'Age', 'Place', 'Contact Number'],
      ...filteredUsers.map(u => [u.id, u.name, u.age, u.place, u.contactNumber])
    ];
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'users.csv');
  };
  const handleExportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['ID', 'Name', 'Age', 'Place', 'Contact Number'],
      ...filteredUsers.map(u => [u.id, u.name, u.age, u.place, u.contactNumber])
    ]);
    const wb: XLSX.IWorkBook = {
      SheetNames: ['Users'],
      Sheets: { Users: ws },
      Props: {}
    };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'users.xlsx');
  };

  const CustomToolbar: React.FC = () => (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ fileName: 'users' }} />
      <Button onClick={handleExportCSV} sx={{ ml: 1 }}>Export CSV</Button>
      <Button onClick={handleExportExcel} sx={{ ml: 1 }}>Export Excel</Button>
    </GridToolbarContainer>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box component="form" onSubmit={handleFilterSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
          <TextField label="Name" name="name" value={filter.name} onChange={handleFilterChange} size="small" />
          <TextField label="Place" name="place" value={filter.place} onChange={handleFilterChange} size="small" />
          <TextField label="Age Min" name="ageMin" value={filter.ageMin} onChange={handleFilterChange} size="small" type="number" />
          <TextField label="Age Max" name="ageMax" value={filter.ageMax} onChange={handleFilterChange} size="small" type="number" />
          <Button type="submit" variant="contained" color="primary">Filter</Button>
        </Box>
      </Box>
      <DataGrid
        rows={filteredUsers}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        rowsPerPageOptions={[25, 50, 75, 100, 200, filteredUsers.length]}
        pagination
        disableSelectionOnClick
        autoHeight
        components={{ Toolbar: CustomToolbar }}
      />
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
      {dialog.open && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3, minWidth: 300 }}>
            <Typography variant="h6" gutterBottom>Cannot Delete Manager</Typography>
            <Typography gutterBottom>{dialog.message}</Typography>
            <Button variant="contained" color="primary" onClick={() => setDialog({ open: false, message: '' })}>OK</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserList; 