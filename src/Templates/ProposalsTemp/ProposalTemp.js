import React, { useState, useEffect, useMemo } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  Popover,
  Autocomplete,
  Alert
} from '@mui/material';
import Editor from '../Texteditor/Editor';
import TermEditor from '../Texteditor/TermEditor';
import CreatableSelect from 'react-select/creatable';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from 'react-icons/ri';
import Invoice from './Invoice';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, IconButton, } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiMenuKebab } from "react-icons/ci";

const MyStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showStepper, setShowStepper] = useState(false);
  const [introductionContent, setIntroductionContent] = useState('');
  const [termsContent, setTermsContent] = useState('');
  const [servicedata, setServiceData] = useState([]);
  const [activeOption, setActiveOption] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL

  const navigate = useNavigate();

  const handleShowInvoiceForm = () => {
    setActiveOption('invoice');
  };

  const handleShowServiceForm = () => {
    setActiveOption('service');
  };

  const [stepsVisibility, setStepsVisibility] = useState({
    Introduction: true,
    Terms: true,
    ServicesInvoices: true,
  });

  const steps = ['General'].concat(
    stepsVisibility.Introduction ? ['Introduction'] : [],
    stepsVisibility.Terms ? ['Terms'] : [],
    stepsVisibility.ServicesInvoices ? ['Services & Invoices'] : []
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    createsavejobtemp();
    setActiveStep(0);
    setShowStepper(false); // Hide stepper and show the create template button
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const handleCreateTemplateClick = () => {
    setShowStepper(true);
    createsavejobtemp();
  };

  const handleSwitchChange = (step) => (event) => {
    setStepsVisibility((prev) => ({
      ...prev,
      [step]: event.target.checked,
    }));
  };

  const handleIntroductionChange = (content) => {
    setIntroductionContent(content);
  };

  const handleTermsChange = (content) => {
    setTermsContent(content);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [proposalName, setProposalName] = useState('');
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState('contacts');
  const [selectedShortcut, setSelectedShortcut] = useState("");

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleAddShortcut = (shortcut) => {
    setProposalName((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };
  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes('')));
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === 'contacts') {
      const contactShortcuts = [
        { title: 'Account Shortcodes', isBold: true },
        { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
        { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
        { title: 'Contact Shortcodes', isBold: true, },
        { title: 'Contact Name', isBold: false, value: 'CONTACT_NAME' },
        { title: 'First Name', isBold: false, value: 'FIRST_NAME' },
        { title: 'Middle Name', isBold: false, value: 'MIDDLE_NAME' },
        { title: 'Last Name', isBold: false, value: 'LAST_NAME' },
        { title: 'Phone number', isBold: false, value: 'PHONE_NUMBER' },
        { title: 'Country', isBold: false, value: 'COUNTRY' },
        { title: 'Company name', isBold: false, value: 'COMPANY_NAME ' },
        { title: 'Street address', isBold: false, value: 'STREET_ADDRESS' },
        { title: 'City', isBold: false, value: 'CITY' },
        { title: 'State/Province', isBold: false, value: 'STATE / PROVINCE' },
        { title: 'Zip/Postal code', isBold: false, value: 'ZIP / POSTAL CODE' },
        { title: 'Custom field:Email', isBold: false, value: 'CONTACT_CUSTOM_FIELD:Email' },
        { title: 'Date Shortcodes', isBold: true },
        { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
        { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
        { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
        { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
        { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
        { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
        { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
        { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
        { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
        { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
        { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
        { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
        { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
        { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
        { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
        { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
        { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
        { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
        { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
        { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
        { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
        { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
        { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
        { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === 'account') {
      const accountShortcuts = [
        { title: 'Account Shortcodes', isBold: true },
        { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
        { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
        { title: 'Date Shortcodes', isBold: true },
        { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
        { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
        { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
        { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
        { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
        { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
        { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
        { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
        { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
        { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
        { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
        { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
        { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
        { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
        { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
        { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
        { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
        { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
        { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
        { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
        { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
        { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
        { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
        { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const handleProposalName = (e) => {
    const { value } = e.target;
    setProposalName(value);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedTeamMemberValues, setCombinedTeamMemberValues] = useState([]);
  const [userData, setUserData] = useState([]);

  // console.log(combinedValues)
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const url = 'http://127.0.0.1:8080/api/auth/users';
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedTeamMemberValues(selectedValues);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  // services data
  useEffect(() => {

    fetchServiceData();
  }, []);
  const fetchServiceData = async () => {
    try {
      const url = 'http://127.0.0.1:7500/workflow/services/servicetemplate';
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.serviceTemplate)
      setServiceData(data.serviceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const serviceoptions = servicedata.map((service) => ({
    value: service._id,
    label: service.serviceName,
  }));
  const [selectedservice, setselectedService] = useState();
  const fetchservicebyid = async (id, rowIndex) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    const url = `http://127.0.0.1:7500/workflow/services/servicetemplate/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.serviceTemplate);

        const service = Array.isArray(result.serviceTemplate) ? result.serviceTemplate[0] : result.serviceTemplate;

        const updatedRow = {
          productName: service.serviceName || '', // Assuming serviceName corresponds to productName
          description: service.description || '',
          rate: service.rate ? `$${service.rate.toFixed(2)}` : '$0.00',
          qty: '1', // Default quantity is 1
          amount: service.rate ? `$${service.rate.toFixed(2)}` : '$0.00', // Assuming amount is calculated as rate
          tax: service.tax || false,
          isDiscount: false // Default value if not present in the service object
        };

        const updatedRows = [...rows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };

        console.log(updatedRows);
        setRows(updatedRows);
      })
      .catch((error) => console.error(error));
  }

  const handleServiceChange = (index, selectedOptions) => {
    setselectedService(selectedOptions);
    fetchservicebyid(selectedOptions.value, index);
  };

  const handleServiceInputChange = (inputValue, actionMeta, index) => {
    if (actionMeta.action === 'input-change') {
      const newRows = [...rows];
      newRows[index].productName = inputValue;
      setRows(newRows);
    }
  };
  // add row
  const [rows, setRows] = useState([
    { productName: '', description: '', rate: '$0.00', qty: '1', amount: '$0.00', tax: false, isDiscount: false }
  ]);
  const addRow = (isDiscountRow = false) => {
    const newRow = isDiscountRow
      ? { productName: '', description: '', rate: '$-10.00', qty: '1', amount: '$-10.00', tax: false, isDiscount: true }
      : { productName: '', description: '', rate: '$0.00', qty: '1', amount: '$0.00', tax: false, isDiscount: false };
    setRows([...rows, newRow]);
  };
  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const handleInputChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    const newRows = [...rows];

    if (name === 'rate' || name === 'qty') {
      newRows[index][name] = newValue;

      const rate = parseFloat(newRows[index].rate.replace('$', '')) || 0;
      const qty = parseInt(newRows[index].qty) || 0;
      const amount = (rate * qty).toFixed(2);
      newRows[index].amount = `$${amount}`;
    } else {
      newRows[index][name] = newValue;
    }

    setRows(newRows);
  };

  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);

  const handleSubtotalChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setSubtotal(value);
    calculateTotal(value, taxRate);
  };

  const handleTaxRateChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setTaxRate(value);
    calculateTotal(subtotal, value);
  };

  const calculateTotal = (subtotal, taxRate) => {
    const tax = subtotal * (taxRate / 100);
    setTaxTotal(tax);
    setTotalAmount((subtotal + tax).toFixed(2));
  };
  useEffect(() => {
    const calculateSubtotal = () => {
      let subtotal = 0;

      rows.forEach(row => {

        subtotal += parseFloat(row.amount.replace('$', '')) || 0;

      });
      console.log(subtotal)
      setSubtotal(subtotal);
      calculateTotal(subtotal, taxRate);
    };
    calculateSubtotal();
  }, [rows]);


  const [templatename, settemplatename] = useState("");
  const [errors, setErrors] = useState({});

 
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    if (!templatename) tempErrors.templatename = "Template name is required";
    // if (!jobName) tempErrors.jobName = "Job name is required";

    setErrors(tempErrors);
    // return isValid;
    return Object.keys(tempErrors).length === 0;
  };

  const createsavejobtemp = () => {

    if (!validateForm()) {
      // toast.error("Please fix the validation errors.");
      return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            templatename: templatename,
            teammember: combinedTeamMemberValues,
            proposalname: proposalName,
            introduction: stepsVisibility.Introduction,
            terms: stepsVisibility.Terms,
            servicesandinvoices: stepsVisibility.ServicesInvoices,
            introductiontext: introductionContent,
            termsandconditions: termsContent,
            servicesandinvoiceid: "66fa83ffe6e0f4ca11c2204d",
            custommessageinemail: "false",
            custommessageinemailtext: "fhxdghxgh",
            reminders: "false",
            daysuntilnextreminder: 34646,
            numberofreminder: 567657,
            active: true
        })
    };

    fetch('http://127.0.0.1:7500/workflow/proposalesandels/proposalesandels', options)
        .then(response => response.json())
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

  //delete template
  const handleEdit = (_id) => {

    navigate("workflow/proposalesandels/proposalesandels/" + _id);
  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this Job template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          setShowForm(false);
          fetchServiceData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }

  };

const [tempIdget, setTempIdGet] = useState("");
const [openMenuId, setOpenMenuId] = useState(null);
const toggleMenu = (_id) => {
  setOpenMenuId(openMenuId === _id ? null : _id);
  setTempIdGet(_id);
};

const columns = useMemo(() => [
  {
    accessorKey: 'templatename',
    header: 'Name',
    Cell: ({ row }) => (
      <Typography
        sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: 'bold' }}
        onClick={() => handleEdit(row.original._id)}
      >
        {row.original.templatename}
      </Typography>
    ),
  },
  {
    accessorKey: 'Setting', header: 'Setting',
    Cell: ({ row }) => (
      <IconButton onClick={() => toggleMenu(row.original._id)} style={{ color: "#2c59fa" }}>
        <CiMenuKebab style={{ fontSize: "25px" }} />
        {openMenuId === row.original._id && (
          <Box sx={{ position: 'absolute', zIndex: 1, backgroundColor: '#fff', boxShadow: 1, borderRadius: 1, p: 1, left: '30px', m: 2 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }} onClick={() => {
              handleEdit(row.original._id);

            }} >Edit</Typography>
            <Typography sx={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }} onClick={() => handleDelete(row.original._id)}>Delete</Typography>
          </Box>
        )}
      </IconButton>

    ),

  },

], [openMenuId]);

const table = useMaterialReactTable({
  columns,
  data: proposalesAndElsTemplates,
  enableBottomToolbar: true,
  enableStickyHeader: true,
  columnFilterDisplayMode: "custom", // Render own filtering UI
  enableRowSelection: true, // Enable row selection
  enablePagination: true,
  muiTableContainerProps: { sx: { maxHeight: "400px" } },
  initialState: {
    columnPinning: { left: ["mrt-row-select", "tagName"], right: ['settings'], },
  },
  muiTableBodyCellProps: {
    sx: (theme) => ({
      backgroundColor: theme.palette.mode === "dark-theme" ? theme.palette.grey[900] : theme.palette.grey[50],
    }),
  },
});


  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box >
            <Typography sx={{ fontWeight: 'bold', }}>General </Typography>
            <Box mt={2}>
              <label className='custom-input-label'>Template name (not visible to clients)</label>
              <TextField
                error={!!errors.templatename}
                placeholder='Template name (not visible to clients)'
                value={templatename}
                onChange={(e) => settemplatename(e.target.value)}
                size='small'
                margin='normal'
                fullWidth
                sx={{ backgroundColor: '#fff' }}
              />
              {(!!errors.templatename) && <Alert sx={{
                    width: '96%',
                    p: '0', // Adjust padding to control the size
                    pl: '4%', height: '23px',
                    borderRadius: '10px',
                    borderTopLeftRadius: '0',
                    borderTopRightRadius: '0',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center', // Center content vertically
                    '& .MuiAlert-icon': {
                      fontSize: '16px', // Adjust the size of the icon
                      mr: '8px', // Add margin to the right of the icon
                    },
                  }} variant="filled" severity="error" >
                    {errors.templatename}
                  </Alert>}
            </Box>
            <Box sx={{ width: '100%', marginTop: '30px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box ml={2}>
                    <label className='custom-input-label'>Team Member</label>

                    <Autocomplete
                      multiple
                      sx={{ mt: 2, backgroundColor: '#fff' }}
                      options={options}
                      size='small'
                      getOptionLabel={(option) => option.label}
                      value={selectedUser}
                      onChange={handleUserChange}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" placeholder="Assignees" />
                      )}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box ml={3}>
                    <label className='custom-input-label'>Proposal name (visible to clients)</label>
                    <TextField
                      fullWidth
                      value={proposalName + selectedShortcut} onChange={handleProposalName}
                      placeholder="Proposal name (visible to clients)"
                      size="small"
                      sx={{ mt: 2, backgroundColor: '#fff' }}

                    />
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleDropdown}
                        sx={{ mt: 2 }}
                      >
                        Add Shortcode
                      </Button>

                      <Popover
                        open={showDropdown}
                        anchorEl={anchorEl}
                        onClose={handleCloseDropdown}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                      >
                        <Box >
                          <List className="dropdown-list" sx={{ width: '300px', height: '300px', cursor: 'pointer' }}>
                            {filteredShortcuts.map((shortcut, index) => (
                              <ListItem
                                key={index}
                                onClick={() => handleAddShortcut(shortcut.value)}
                              >
                                <ListItemText
                                  primary={shortcut.title}
                                  primaryTypographyProps={{
                                    style: {
                                      fontWeight: shortcut.isBold ? 'bold' : 'normal',
                                    },
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Popover>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <FormControl component="fieldset" sx={{ width: '100%', mt: 3 }}>
              <Typography sx={{ fontWeight: 'bold', }}>Steps </Typography>
              <Box sx={{ border: '1px solid grey', borderRadius: '20px', padding: '15px', mb: 2, mt: 2 }} className="stepsCard">
                <FormControlLabel
                  control={
                    <Switch
                      checked={stepsVisibility.Introduction}
                      onChange={handleSwitchChange('Introduction')}
                    />
                  }
                  label="Introduction"
                />
                <p>Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share</p>
              </Box>
              <Box sx={{ border: '1px solid grey', borderRadius: '20px', padding: '15px', mb: 2 }} className="stepsCard">
                <FormControlLabel
                  control={
                    <Switch
                      checked={stepsVisibility.Terms}
                      onChange={handleSwitchChange('Terms')}
                    />
                  }
                  label="Terms"
                />
                <p>Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed.</p>
              </Box>
              <Box sx={{ border: '1px solid grey', borderRadius: '20px', padding: '15px', mb: 2 }} className="stepsCard">
                <FormControlLabel
                  control={
                    <Switch
                      checked={stepsVisibility.ServicesInvoices}
                      onChange={handleSwitchChange('ServicesInvoices')}
                    />
                  }
                  label="Services & Invoices"
                />
                <p>Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically.</p>
              </Box>
            </FormControl>
          </Box>
        );
      case steps.indexOf('Introduction'):
        return (
          <Box>
            <Typography variant="h6">Introduction</Typography>
            <Box mt={1} mb={3}>
              <TextField
                size="small"
                // variant="standard"
                fullWidth
                margin="normal"
                placeholder="Introduction"
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>
            <Editor
              onChange={handleIntroductionChange}
              content={introductionContent}
            />
          </Box>
        );
      case steps.indexOf('Terms'):
        return (
          <Box>
            <Typography variant="h6">Terms and Conditions</Typography>

            <Box mt={1} mb={3}>
              <TextField
                size="small"
                // variant="standard"
                fullWidth
                margin="normal"
                placeholder="Engagement letter"
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>
            <TermEditor
              onChange={handleTermsChange}
              content={termsContent}
            />
          </Box>
        );
      case steps.indexOf('Services & Invoices'):
        return (

          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>Choose one of the options</Typography>

            <Typography
              sx={{
                border: activeOption === 'invoice' ? '1px solid blue' : '1px solid grey',
                borderRadius: '20px',
                padding: '15px',
                cursor: 'pointer',
                marginTop: '15px',
                backgroundColor: activeOption === 'invoice' ? 'rgba(90, 165, 230, 0.5)' : 'transparent',
                boxShadow: activeOption === 'invoice' ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none',
              }}
              onClick={handleShowInvoiceForm}
            >
              Add invoice or ask for deposit
              <Typography component="p">
                Create one-time or recurring invoice, or ask for deposit to sign
              </Typography>
            </Typography>

            <Typography
              sx={{
                border: activeOption === 'service' ? '1px solid blue' : '1px solid grey',
                borderRadius: '20px',
                padding: '15px',
                cursor: 'pointer',
                marginTop: '15px',
                backgroundColor: activeOption === 'service' ? 'rgba(90, 165, 230, 0.5)' : 'transparent',
                boxShadow: activeOption === 'service' ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none',
              }}
              onClick={handleShowServiceForm}
            >
              Add itemized services without creating invoices
              <Typography component="p">
                No invoice or deposit request will be created
              </Typography>
            </Typography>

            {/* Render the forms conditionally based on activeOption state */}
            {activeOption === 'invoice' && (
              <Box>

                {/* <Typography>Invoice Form</Typography> */}
                <Invoice />
              </Box>
            )}

            {activeOption === 'service' && (
              <Box>

                {/* <Typography>Service Form</Typography> */}
                <div className='invoice-section-three'>
                  <Box sx={{ margin: '20px 0 10px 0' }}>
                    <Typography variant="h6">Line items</Typography>
                    <Typography variant="body2" >
                      Client-facing itemized list of products and services
                    </Typography>
                  </Box>

                  <Table sx={{ width: '100%', backgroundColor: '#fff' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell >PRODUCT OR SERVICE</TableCell>
                        <TableCell>DESCRIPTION</TableCell>
                        <TableCell>RATE</TableCell>
                        <TableCell>QTY</TableCell>
                        <TableCell>AMOUNT</TableCell>
                        <TableCell>TAX</TableCell>
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <CreatableSelect
                              placeholder='Product or Service'
                              options={serviceoptions}
                              value={serviceoptions.find(option => option.label === row.productName) || { label: row.productName, value: row.productName }}
                              onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                              onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, index)}
                              isClearable
                            />
                          </TableCell>
                          <TableCell>
                            <input type='text' name='description' value={row.description} onChange={(e) => handleInputChange(index, e)} style={{ border: 'none' }} placeholder='Description' />
                          </TableCell>
                          <TableCell>
                            <input type='text' name='rate' value={row.rate} onChange={(e) => handleInputChange(index, e)} style={{ border: 'none' }} />
                          </TableCell>
                          <TableCell>
                            <input type='text' name='qty' value={row.qty} onChange={(e) => handleInputChange(index, e)} style={{ border: 'none' }} />
                          </TableCell>
                          <TableCell className={row.isDiscount ? 'discount-amount' : ''}>{row.amount}</TableCell>
                          <TableCell>
                            <Checkbox name='tax' checked={row.tax} onChange={(e) => handleInputChange(index, e)} />
                          </TableCell>
                          <TableCell>
                            <IconButton>
                              <BsThreeDotsVertical />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => deleteRow(index)}>
                              <RiCloseLine />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                    <Button onClick={() => addRow()} startIcon={<AiOutlinePlusCircle />} sx={{ color: 'blue', fontSize: '18px' }}>
                      Line item
                    </Button>
                    <Button onClick={() => addRow(true)} startIcon={<CiDiscount1 />} sx={{ color: 'blue', fontSize: '18px' }}>
                      Discount
                    </Button>
                  </Box>

                  <div className='one-time-summary' style={{ marginTop: '20px' }}>
                    <Typography variant="h6">Summary</Typography>
                    <Table sx={{ backgroundColor: '#fff' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>SUBTOTAL</TableCell>
                          <TableCell>TAX RATE</TableCell>
                          <TableCell>TAX TOTAL</TableCell>
                          <TableCell>TOTAL</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <input
                              type="number"
                              value={subtotal}
                              onChange={handleSubtotalChange}
                              style={{ border: 'none' }}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="number"
                              value={taxRate}
                              onChange={handleTaxRateChange}
                              style={{ border: 'none' }}
                            />%
                          </TableCell>
                          <TableCell>${taxTotal.toFixed(2)}</TableCell>
                          <TableCell>${totalAmount}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Box>
            )}
          </Box>
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {showStepper ? (
        <Box>
          <Grid container spacing={3} mr={5} p={5}>
            <Grid item xs={8} >
              <Box sx={{ p: 2, backgroundColor: '#fff' }}>
                <Stepper activeStep={activeStep}  >
                  {steps.map((label, index) => (
                    <Step key={index} onClick={() => handleStepClick(index)} >
                      <StepLabel style={{ cursor: 'pointer', }} >{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? handleReset : handleNext}
                  sx={{ width: '200px' }}
                >
                  {activeStep === steps.length - 1 ? 'Save Template' : 'Next'}
                </Button>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
              </Box>
            </Grid>

          </Grid>
          <Box sx={{ pl: 2, pr: 5 }}>{renderStepContent(activeStep)}</Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleCreateTemplateClick}>
          Create Template
        </Button>
        <MaterialReactTable columns={columns} table={table} />
        </Box>
      )}
    </Box>
  );
};

export default MyStepper;