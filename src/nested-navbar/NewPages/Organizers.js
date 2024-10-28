
import React, { useState, useEffect, useMemo } from 'react'
import { Box, Button, IconButton, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { toast } from 'react-toastify';

const Organizers = () => {

  const [openMenuId, setOpenMenuId] = useState(null);
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  console.log(data);
  const navigate = useNavigate();

  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const [tempIdget, setTempIdGet] = useState("");
  const [showOrganizerTemplateForm, setShowOrganizerTemplateForm] = useState(false);

  const fetchOrganizerTemplates = async (accountid) => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountid}`;
      console.log(url)
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch email templates');
      }
      const data = await response.json();
      console.log(data)
      setOrganizerTemplatesData(data.organizerAccountWise);

    } catch (error) {
      console.error('Error fetching email templates:', error);
    }
  };

  const handleSealed = (_id, issealed) => {
    // navigate('OrganizerTempUpdate/' + _id)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "issealed": issealed
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`http://127.0.0.1:7600/workflow/orgaccwise/organizeraccountwise/${_id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.message === 'Organizer AccountWise Updated successfully') {
          toast.success('Organizer Updated successfully.');
          fetchOrganizerTemplates(data);
        }
      })
      .catch((error) => console.error(error));
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
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/`;
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
    fetchOrganizerTemplates(data);
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
                  // onClick={() => handleEdit(row._id)}
                  >
                    {row.organizertemplateid.organizerName}
                  </Typography>
                </TableCell>
                <TableCell>{row.updatedAt}</TableCell>
                <TableCell></TableCell>
                <TableCell>{row.organizertemplateid.sections.length}</TableCell> {/* Show the number of sections */}
                <TableCell>
                  {row.issealed ? (
                    <Chip label="Sealed" color="primary" />
                  ) : null}
                </TableCell>
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
                          // onClick={() => handleSealed(row._id)}
                          onClick={() => handleSealed(row._id, !row.issealed)}
                        >
                          {row.issealed ? 'Unseal' : 'Seal'}
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