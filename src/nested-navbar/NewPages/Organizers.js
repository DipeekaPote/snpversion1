
import React, { useState, useEffect, useMemo } from 'react'
import { Box, Button, IconButton, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate,useParams } from "react-router-dom";
import { toast } from 'react-toastify';

const Organizers = () => {

  const [openMenuId, setOpenMenuId] = useState(null);
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  const navigate = useNavigate();

  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const [tempIdget, setTempIdGet] = useState("");
  const [showOrganizerTemplateForm, setShowOrganizerTemplateForm] = useState(false);

  const fetchOrganizerTemplates = async () => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch email templates');
      }
      const data = await response.json();
      console.log(data)
      setOrganizerTemplatesData(data.OrganizerTemplates);

    } catch (error) {
      console.error('Error fetching email templates:', error);
    }
  };

  const handleEdit = (_id) => {
    navigate('OrganizerTempUpdate/' + _id)
  };

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

  const handleCreateInvoiceClick = () => {
    setShowOrganizerTemplateForm(true);
    navigate(`/accountsdash/organizers/${data}/accountorganizer`)
  };

  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this organizer template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete item');
          }
          return response.text();
        })
        .then((result) => {
          console.log(result);
          toast.success('Item deleted successfully');
          fetchOrganizerTemplates();
          // setshowOrganizerTemplateForm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error('Failed to delete item');
        });
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates();
  }, []);





  return (
    <Box sx={{ mt: 2 }}>

      <Button variant="contained" onClick={handleCreateInvoiceClick} sx={{ mb: 3 }}>New Organizer</Button>
      {/* <MaterialReactTable columns={columns} table={table} /> */}
      <Paper>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Last Updated</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Progress</strong></TableCell>
              <TableCell><strong>Seal</strong></TableCell>
              <TableCell><strong></strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizerTemplatesData.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <Typography
                    sx={{ color: '#2c59fa', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => handleEdit(row._id)}
                  >
                    {row.templatename}
                  </Typography>
                </TableCell>
                <TableCell>{row.createdAt}</TableCell>
                <TableCell></TableCell>
                <TableCell>{row.sections.length}</TableCell> {/* Show the number of sections */}
                <TableCell></TableCell>
                <TableCell sx={{ textAlign: 'end' }}>
                  <IconButton onClick={() => toggleMenu(row._id)} style={{ color: '#2c59fa' }}>
                    <CiMenuKebab style={{ fontSize: '25px' }} />
                    {openMenuId === row._id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          zIndex: 1,
                          backgroundColor: '#fff',
                          boxShadow: 1,
                          borderRadius: 1,
                          p: 1,
                          // left:0,
                          right: '30px',
                          m: 2,
                          top: '10px', width: '150px', textAlign: 'start'
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Publice to Marketplace</Typography>
                        <Typography
                          sx={{ fontSize: '12px', fontWeight: 'bold' }}
                          onClick={() => handleEdit(row._id)}
                        >
                          Edit
                        </Typography>

                        <Typography
                          sx={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }}
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </Typography>
                      </Box>
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

    </Box>


  )
}

export default Organizers