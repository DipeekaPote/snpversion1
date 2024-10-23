import { Box, ListItem, Chip, Grid, Card, CardContent, Typography, Divider, Button, Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormControl, InputLabel, RadioGroup, Radio, TextField, IconButton, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiArchiveOut } from "react-icons/bi";
import { LuUserCircle2 } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import { useTheme, useMediaQuery, } from '@mui/material';
import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlusCircle, AiOutlineDelete } from 'react-icons/ai';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const Accountupdate = ({ onClose, selectedAccount }) => {
    const theme = useTheme();
    const USER_API = process.env.REACT_APP_USER_URL;
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedOption, setSelectedOption] = useState("Account Info");

    const handleOptionChange = (event, value) => {
        setSelectedOption(value || event.target.value);
        setActiveStep(value || event.target.value);
    };
    const [activeStep, setActiveStep] = useState("Account Info");
    const [accountType, setAccountType] = useState("Individual");
    const handleAccountTypeChange = (event) => {
        setAccountType(event.target.value);
    };

    //for tags
    const [selectedTags, setSelectedTags] = useState([]);
    const [combinedValues, setCombinedValues] = useState([]);

    const handleTagChange = (event, newValue) => {
        setSelectedTags(newValue.map((option) => option.value));
        // Send selectedValues array to your backend
        console.log("Selected Values:", newValue.map((option) => option.value));
        // Assuming setCombinedValues is a function to send the values to your backend
        setCombinedValues(newValue.map((option) => option.value));
    };

    //Tag FetchData ================

    useEffect(() => {
        fetchData();
    }, []);
    const [tags, setTags] = useState([]);
    const fetchData = async () => {
        try {
            const url = `${TAGS_API}/tags/`;
            const response = await fetch(url);
            const data = await response.json();
            setTags(data.tags);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    //  for tags

    const [userData, setUserData] = useState([]);

    // console.log(combinedValues)
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const url = `${USER_API}/api/auth/users`;
            const response = await fetch(url);
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const calculateWidth = (tagName) => {
        const options = userData.map((user) => ({
            value: user._id,
            label: user.username,
        }));
        const baseWidth = 10; // base width for each tag
        const charWidth = 8; // approximate width of each character
        const padding = 10; // padding on either side
        return baseWidth + (charWidth * tagName.length) + padding;
    };

    const tagsOptions = tags.map((tag) => ({
        value: tag._id,
        label: tag.tagName,
        colour: tag.tagColour,

        customStyle: {
            backgroundColor: tag.tagColour,
            color: "#fff",
            borderRadius: "8px",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "5px",
            padding: "2px,8px",
            fontSize: '10px',
            width: `${calculateWidth(tag.tagName)}px`,
            margin: '7px'
        },
        customTagStyle: {
            backgroundColor: tag.tagColour,
            color: "#fff",
            alignItems: "center",
            textAlign: "center",
            padding: "2px,8px",
            fontSize: '10px',
            cursor: 'pointer',
        },
    }));

    const handleContactTagChange = (index, event, newValue) => {
        // Map newValue to get an array of option values
        const selectedTags = newValue.map((option) => option.value);

        // Update the contacts state
        setContacts((prevContacts) => {
            const updatedContacts = [...prevContacts];
            updatedContacts[index].tags = selectedTags;
            return updatedContacts;
        });
        // Log the selected tags
        console.log("Selected Tags for contact", index, ":", selectedTags);
        // Update combined values
        setCombinedValues((prevCombinedValues) => [
            ...prevCombinedValues,
            ...selectedTags,
        ]);
    };

    const tagsoptions = tags.map((tag) => ({
        value: tag._id,
        label: tag.tagName,
        colour: tag.tagColour,

        customStyle: {
            backgroundColor: tag.tagColour,
            color: "#fff",
            borderRadius: "8px",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "5px",
            padding: "2px,8px",
            fontSize: '10px',
            width: `${calculateWidth(tag.tagName)}px`,
            margin: '7px'
        },
        customTagStyle: {
            backgroundColor: tag.tagColour,
            color: "#fff",
            alignItems: "center",
            textAlign: "center",
            padding: "2px,8px",
            fontSize: '10px',
            cursor: 'pointer',
        },
    }));

    const [countries, setCountries] = useState([]);
    useEffect(() => {
        axios
            .get('https://restcountries.com/v3.1/all')
            .then((response) => {
                const countryData = response.data.map((country) => ({
                    name: country.name.common,
                    code: country.cca2,
                }));
                setCountries(countryData);
            })
            .catch((error) =>
                console.error('Error fetching country data:', error)
            );
    }, []);

    const [phoneNumbers, setPhoneNumbers] = useState([]);

    const handleDeletePhoneNumber = (phoneIndex) => {
        setPhoneNumbers((prevPhoneNumbers) => {
            // Create a new array excluding the phone number at the specified index
            return prevPhoneNumbers.filter((_, index) => index !== phoneIndex);
        });
    };
    const handleContactPhoneNumberChange = (index, phoneIndex, phoneValue) => {
        setContacts(prevContacts => {
            const updatedContacts = [...prevContacts];
            const contact = updatedContacts[index];

            // Ensure the phoneNumbers array has enough elements
            if (contact.phoneNumbers.length <= phoneIndex) {
                contact.phoneNumbers = [
                    ...contact.phoneNumbers,
                    ...Array(phoneIndex + 1 - contact.phoneNumbers.length).fill({ phone: '' })
                ];
            }
            // Update the phone number
            contact.phoneNumbers[phoneIndex] = { ...contact.phoneNumbers[phoneIndex], phone: phoneValue };
            return updatedContacts;
        });
    };
    const handleContactAddPhoneNumber = () => {
        setPhoneNumbers((prevPhoneNumbers) => [
            ...prevPhoneNumbers,
            { id: Date.now(), phone: '', isPrimary: false },
        ]);
    };

    const handleContactAddressChange = (index, field, value) => {
        setContacts((prevContacts) => {
            const updatedContacts = [...prevContacts];
            updatedContacts[index] = {
                ...updatedContacts[index],
                address: {
                    ...updatedContacts[index].address,
                    [field]: value
                }
            };
            return updatedContacts;
        });
    };

    //for creating multiple forms when click on Add New Contact
    const [contactCount, setContactCount] = useState(1);

    //*Dipeeka */

    const updateContactsAccountId = (newAccountId) => {
        setContacts(contacts.map(contact => ({
            ...contact,
            accountid: newAccountId
        })));
    };

    const [AccountId, setAccountId] = useState()

    const addNewContact = () => {
        setContacts([...contacts, { firstName: '', middleName: '', lastName: '', contactName: '', companyName: '', note: '', ssn: '', email: '', login: 'false', notify: 'false', emailSync: 'false', tags: [], phoneNumbers: [], address: { country: '', streetAddress: '', city: '', state: '', postalCode: '' }, accountid: AccountId }]);
        setContactCount(contactCount + 1);
    };
    const handleContactSwitchChange = (index, fieldName, checked) => {
        const updatedContacts = [...contacts];
        updatedContacts[index] = { ...updatedContacts[index], [fieldName]: checked ? 'true' : 'false' };
        setContacts(updatedContacts);
    };
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const [contacts, setContacts] = useState([]);

    //Account Data Integration
    const [accountName, setaccountName] = useState('');
    const [companyname, setcompanyname] = useState('')
    console.log(selectedAccount)
    useEffect(() => {
        if (selectedAccount) {
        setAccountType(selectedAccount.clientType)
        setaccountName(selectedAccount.accountName)
      setcompanyname(selectedAccount.companyname)
    }
    }, [selectedAccount]);

    return (

        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid grey' }}>
                <Typography variant='h6'>Edit account</Typography>
                <RxCross2 style={{ cursor: 'pointer' }} onClick={onClose} />
            </Box>

            <Box className='account-form' sx={{ height: '90vh', overflowY: 'auto' }}>
                <Box >
                    <FormControl sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <RadioGroup
                            row
                            aria-labelledby="main-radio-buttons-group-label"
                            name="main-radio-buttons-group"
                            value={selectedOption}
                            onChange={handleOptionChange}
                        >
                            <Box className='account-contact-info' >
                                {activeStep === 'Contact Info' ? (
                                    <>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, gap: 2, cursor: 'pointer' }} onClick={() => {
                                                handleOptionChange(null, 'Account Info');
                                            }}>
                                                <CheckCircleRoundedIcon style={{ color: "green" }} />
                                                <Typography>Account Info</Typography>
                                            </Box>

                                            <ArrowForwardIosRoundedIcon />
                                            <FormControlLabel value="Contact Info" control={<Radio checked />} label="Contact Info" sx={{ ml: 2 }} />
                                        </Box>

                                    </>
                                ) : (
                                    <>
                                        <FormControlLabel value="Account Info" control={<Radio checked={selectedOption === 'Account Info'} />} label="Account Info" sx={{ mb: 2 }} />
                                        <ArrowForwardIosRoundedIcon />
                                        <FormControlLabel value="Contact Info" control={<Radio checked={selectedOption === 'Contact Info'} />} label="Contact Info" sx={{ mb: 2, ml: 2 }} />
                                    </>
                                )}
                            </Box>
                        </RadioGroup>
                    </FormControl>



                    <Box sx={{ p: 2 }}>
                        {selectedOption === 'Account Info' && (
                            <Box>
                                {/* Client Type Heading */}
                                <Box>
                                    <h3>Client Type</h3>
                                </Box>

                                {/* Account Type Radio Buttons */}
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-labelledby="account-type-radio-buttons-group-label"
                                        name="account-type-radio-buttons-group"
                                        value={accountType}
                                        onChange={handleAccountTypeChange}
                                    >
                                        <FormControlLabel value="Individual" control={<Radio />} label="Individual" />
                                        <FormControlLabel value="Company" control={<Radio />} label="Company" />

                                    </RadioGroup>
                                </FormControl>

                                {/* Account Info for Individual Type */}
                                {accountType === 'Individual' && (
                                    <Box>
                                        <Box className="account-Type-options" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <h3>Account Info</h3>

                                            {/* Help and More Options Icons */}
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <HelpOutlineRoundedIcon />
                                                <MoreVertRoundedIcon />
                                            </Box>
                                        </Box>

                                        <Box>
                                            <InputLabel sx={{ color: 'black' }}>Account Name</InputLabel>

                                            <TextField
                                                size='small'
                                                fullWidth
                                                placeholder="Account Name"
                                                margin='normal'
                                                value={accountName}
                                                onChange={(e) => setaccountName(e.target.value)}
                                            />
                                        </Box>

                                        <Box>
                                            <InputLabel sx={{ color: 'black' }}>Company Name</InputLabel>

                                            <TextField
                                                size='small'
                                                fullWidth
                                                placeholder="Company Name"
                                                margin='normal'
                                                value={companyname}
                                                onChange={(e) => setcompanyname(e.target.value)}
                                            />
                                        </Box>


                                        <Box >

                                            <InputLabel sx={{ color: 'black' }}>Tags</InputLabel>

                                            <Autocomplete
                                                multiple
                                                size='small'
                                                id="tags-outlined"
                                                options={tagsOptions}
                                                getOptionLabel={(option) => option.label}
                                                value={tagsOptions.filter(option => selectedTags.includes(option.value))}
                                                onChange={handleTagChange}
                                                renderTags={(selected, getTagProps) =>
                                                    selected.map((option, index) => (
                                                        <Chip
                                                            key={option.value}
                                                            label={option.label}
                                                            style={option.customTagStyle}
                                                            {...getTagProps({ index })}
                                                        />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"

                                                        placeholder="Tags"
                                                        sx={{ width: '100%', marginTop: '8px' }}
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props} style={option.customStyle}>
                                                        {option.label}
                                                    </Box>
                                                )}
                                            />
                                        </Box>

                                        <Box mt={2}>
                                            <InputLabel sx={{ color: 'black' }}>Team Member</InputLabel>
                                            <Autocomplete
                                                multiple
                                                sx={{ mt: 2 }}
                                                options={[]} // Empty array to avoid the error
                                                size="small"
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" placeholder="Team Member" />
                                                )}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography><h3>Company address</h3></Typography>
                                        </Box>

                                        <Box>
                                            <InputLabel sx={{ color: 'black' }}>Country</InputLabel>
                                            <Autocomplete
                                                size="small"
                                                options={countries}
                                                getOptionLabel={(option) => option.name}
                                                // value={cCountry}
                                                // onChange={(event, newValue) => SetCCountry(newValue)}
                                                renderOption={(props, option) => (
                                                    <ListItem
                                                        {...props}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            padding: '8px',
                                                            borderBottom: '1px solid #ddd',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Typography sx={{ fontWeight: 500 }}>{option.name}</Typography>
                                                        <Typography sx={{ fontSize: '0.9rem', color: 'gray' }}>{option.code}</Typography>
                                                    </ListItem>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Country"
                                                        variant="outlined"
                                                        sx={{ marginTop: '8px', width: '100%' }}
                                                    />
                                                )}
                                            />
                                        </Box>

                                        <Box>
                                            <InputLabel sx={{ color: 'black', mt: 2 }}>Street address</InputLabel>
                                            <TextField placeholder="Street address"
                                                // onChange={(e) => SetCStreetAddress(e.target.value)} 
                                                size='small' fullWidth margin='normal' />

                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: isSmallScreen
                                                    ? 'column'
                                                    : 'row',
                                                gap: isSmallScreen ? 2 : 5,
                                                mt: 2
                                            }}
                                        >
                                            <Box>

                                                <InputLabel sx={{ color: 'black' }}>City</InputLabel>

                                                <TextField
                                                    fullWidth
                                                    margin="normal"
                                                    name="city"
                                                    // value={city}
                                                    // onChange={(e) => setCcity(e.target.value)}
                                                    placeholder="City"
                                                    size="small"
                                                />
                                            </Box>
                                            <Box>

                                                <InputLabel sx={{ color: 'black' }}>State/Province</InputLabel>

                                                <TextField
                                                    margin="normal"
                                                    name="state"
                                                    fullWidth

                                                    // onChange={(e) => SetCStateProvince(e.target.value)}
                                                    placeholder="State/Province"
                                                    size="small"
                                                />
                                            </Box>
                                            <Box>

                                                <InputLabel sx={{ color: 'black' }}>ZIP/Postal Code</InputLabel>

                                                <TextField
                                                    margin="normal"
                                                    fullWidth
                                                    name="postalCode"
                                                    // onChange={(e) => SetCZipPostalCode(e.target.value)}
                                                    placeholder="ZIP/Postal Code"
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>





                                    </Box>
                                )}
                                <Button type="submit"
                                    variant="contained"
                                    color="primary" sx={{ borderRadius: '10px', mt: 3 }} onClick={() => {
                                        handleOptionChange(null, 'Contact Info');
                                        // handleSubmit();
                                    }}>Continue</Button>
                            </Box>

                        )}
                    </Box>
                </Box>

                {selectedOption === 'Contact Info' && (
                    <>
                        <Box className='create_new_contactform-container'>
                            <Box className='create_new_contactform-container'>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                    <h3 style={{ marginLeft: "20px" }}>Contacts</h3>
                                    <Box onClick={handleClickOpen} sx={{ color: '#1976d3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px' }} >
                                        <AddCircleOutlineIcon />
                                        <Typography>Link existing contact</Typography>

                                    </Box>

                                </Box>

                                {/* MUI Dialog */}
                                <Dialog open={open} onClose={onClose}>
                                    <DialogTitle>Search for a Contact</DialogTitle>
                                    <Divider />
                                    <DialogContent>
                                        <DialogContentText>
                                            Search for an existing contact by entering their name, phone number, or email.
                                            If the contact is not in your CRM, click "Cancel" and create one on the previous page.
                                        </DialogContentText>

                                        <Box mt={5}>
                                            <InputLabel sx={{ color: 'black' }}>Serch for contact</InputLabel>

                                            <TextField
                                                margin="normal"
                                                fullWidth
                                                name="postalCode"
                                                // onChange={(e) => SetCZipPostalCode(e.target.value)}
                                                placeholder="start typng the contact name,phone number or email to serch"
                                                size="small"
                                            />

                                        </Box>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button variant='contained'>
                                            Add
                                        </Button>

                                        <Button onClick={onClose} color="primary">
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>


                            {contacts.map((contact, index) => (
                                <Box style={{ border: "1px solid #e2e8f0", margin: '15px', borderRadius: '8px', height: "55vh", overflowY: 'auto', padding: '15px' }} className='create_new_contactform'>
                                    <Typography variant="h6" gutterBottom sx={{ ml: 1 }}>
                                        Contact {index + 1}
                                    </Typography>
                                    <Box >
                                        <form >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                                    gap: isSmallScreen ? 2 : 5,
                                                    padding: '1px 5px 0 5px',
                                                }}
                                            >
                                                <Box>
                                                    <InputLabel sx={{ color: 'black' }}>First Name</InputLabel>
                                                    <TextField
                                                        margin="normal"
                                                        fullWidth
                                                        name="firstName"
                                                        placeholder="First Name"
                                                        size="small"
                                                    // onChange={(e) => handleContactInputChange(index, e)}
                                                    />
                                                </Box>
                                                <Box>
                                                    <InputLabel sx={{ color: 'black' }}>Middle Name</InputLabel>
                                                    <TextField
                                                        margin="normal"
                                                        fullWidth
                                                        name="middleName"
                                                        placeholder="Middle Name"
                                                        size="small"
                                                    // onChange={(e) => handleContactInputChange(index, e)}
                                                    />

                                                </Box>
                                                <Box>
                                                    <InputLabel sx={{ color: 'black' }}>Last Name</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        name="lastName"
                                                        margin="normal"
                                                        placeholder="Last name"
                                                        size="small"
                                                    // onChange={(e) => handleContactInputChange(index, e)}
                                                    />

                                                </Box>
                                            </Box>
                                            <Box >


                                                <InputLabel sx={{ color: 'black' }}>Contact Name</InputLabel>

                                                <TextField
                                                    name="contactName"
                                                    fullWidth
                                                    placeholder="Contact Name"
                                                    margin="normal"
                                                    size="small"
                                                    value={contact.contactName}
                                                // onChange={(e) => handleContactInputChange(index, e)}
                                                />

                                            </Box>
                                            <Box >

                                                <InputLabel sx={{ color: 'black' }}>Company Name</InputLabel>

                                                <TextField
                                                    fullWidth
                                                    name="companyName"
                                                    margin="normal"
                                                    placeholder="Company Name"
                                                    size="small"
                                                // onChange={(e) => handleContactInputChange(index, e)}
                                                />
                                            </Box>
                                            <Box >

                                                <InputLabel sx={{ color: 'black' }}>Note</InputLabel>

                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    name="note"
                                                    margin="normal"
                                                    placeholder="Note"
                                                    size="small"
                                                // onChange={(e) => handleContactInputChange(index, e)}
                                                />
                                            </Box>
                                            <Box >

                                                <InputLabel sx={{ color: 'black' }}>SSN</InputLabel>

                                                <TextField
                                                    fullWidth
                                                    name="ssn"
                                                    margin="normal"
                                                    placeholder="SSN"
                                                    size="small"
                                                // onChange={(e) => handleContactInputChange(index, e)}
                                                />
                                            </Box>
                                            <Box >

                                                <InputLabel sx={{ color: 'black' }}>Email</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    name="email"
                                                    margin="normal"
                                                    placeholder="Email"
                                                    size="small"
                                                // onChange={(e) => handleContactInputChange(index, e)}
                                                />
                                            </Box>



                                            {/* Switches for Login, Notify, and Email Sync */}
                                            <Box sx={{ mt: 1 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={contact.login === 'true'}
                                                            onChange={(e) => handleContactSwitchChange(index, 'login', e.target.checked)}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Login"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={contact.notify === 'true'}
                                                            onChange={(e) => handleContactSwitchChange(index, 'notify', e.target.checked)}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Notify"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={contact.emailSync === 'true'}
                                                            onChange={(e) => handleContactSwitchChange(index, 'emailSync', e.target.checked)}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Email Sync"
                                                />
                                            </Box>

                                            <Box key={contact.id}>
                                                <InputLabel sx={{ color: 'black' }}>Tags</InputLabel>

                                                <Autocomplete
                                                    multiple
                                                    options={tagsoptions}
                                                    getOptionLabel={(option) => option.label}
                                                    value={tagsoptions.filter(option => (contact.tags || []).includes(option.value))}
                                                    // value={contact.selectedTags || []} // Ensure it's an array
                                                    onChange={(event, newValue) => handleContactTagChange(index, event, newValue)}
                                                    renderTags={(tagValue, getTagProps) =>
                                                        tagValue.map((option, index) => (
                                                            <Chip
                                                                key={option.value}
                                                                label={option.label}
                                                                style={option.customTagStyle}
                                                                {...getTagProps({ index })}
                                                            />
                                                        ))
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}

                                                            variant="outlined"
                                                            size="small"
                                                            placeholder="Select tags"
                                                            sx={{ width: '100%', marginTop: '8px' }}
                                                        />
                                                    )}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" {...props} style={option.customStyle}>
                                                            {option.label}
                                                        </Box>
                                                    )}
                                                />
                                            </Box>

                                            <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: 'bold', mt: 3 }}>
                                                Phone Numbers
                                            </Typography>

                                            {phoneNumbers.map((phone, phoneIndex) => (
                                                <Box
                                                    key={phone.id}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        ml: 1,
                                                        mb: 2,
                                                    }}
                                                >
                                                    {phone.isPrimary && (
                                                        <Chip
                                                            label="Primary phone"
                                                            color="primary"
                                                            size="small"
                                                            sx={{ position: 'absolute', mt: -3 }}
                                                        />
                                                    )}
                                                    <PhoneInput
                                                        country={'us'}
                                                        value={phone.phone}
                                                        onChange={(phoneValue) =>
                                                            handleContactPhoneNumberChange(index, phoneIndex, phoneValue)
                                                        }
                                                        inputStyle={{
                                                            width: '100%',
                                                        }}
                                                        buttonStyle={{
                                                            borderTopLeftRadius: '8px',
                                                            borderBottomLeftRadius: '8px',
                                                        }}
                                                        containerStyle={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                        }}
                                                    />
                                                    <AiOutlineDelete
                                                        onClick={() => handleDeletePhoneNumber(phoneIndex)}
                                                        style={{ cursor: 'pointer', color: 'red' }}
                                                    />
                                                </Box>
                                            ))}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 2,
                                                    alignItems: isSmallScreen ? 'center' : 'flex-start',
                                                    ml: 1,
                                                    cursor: 'pointer',
                                                    color: 'blue',
                                                    fontWeight: 600,
                                                }}
                                                onClick={() => handleContactAddPhoneNumber(index)}
                                            >
                                                <AiOutlinePlusCircle style={{ marginTop: '20px' }} />
                                                <p>Add phone number</p>
                                            </Box>

                                            <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: 'bold', mt: 3 }}>
                                                Address
                                            </Typography>

                                            <Box key={contact.id}>
                                                {/* Country Selection */}
                                                <Box>
                                                    <InputLabel sx={{ color: 'black' }}>Country</InputLabel>

                                                    <Autocomplete
                                                        size="small"
                                                        value={countries.find((country) => country.code === contact.address?.country) || null} // Ensure it's null if undefined
                                                        onChange={(event, newValue) => handleContactAddressChange(index, 'country', newValue?.code || '')} // Handle value change
                                                        options={countries}
                                                        getOptionLabel={(option) => option.name} // Show country name in options
                                                        isOptionEqualToValue={(option, value) => option.code === value.code} // Handle matching options
                                                        renderOption={(props, option) => (
                                                            <ListItem
                                                                {...props}
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    padding: '8px',
                                                                    borderBottom: '1px solid #ddd',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <Typography sx={{ fontWeight: 500 }}>{option.name}</Typography>
                                                                <Typography sx={{ fontSize: '0.9rem', color: 'gray' }}>{option.code}</Typography>
                                                            </ListItem>
                                                        )}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                placeholder="Country"
                                                                sx={{ width: '100%', marginTop: '8px' }}
                                                            />
                                                        )}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box>

                                                <InputLabel sx={{ color: 'black', mt: 2 }}>Street address</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    name="streetAddress"
                                                    margin="normal"
                                                    placeholder="Street address"
                                                    size="small"
                                                // onChange={(e) => handleContactAddressChange(index, 'streetAddress', e.target.value)}
                                                />
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: isSmallScreen
                                                        ? 'column'
                                                        : 'row',
                                                    gap: isSmallScreen ? 2 : 5,
                                                    mt: 2
                                                }}
                                            >
                                                <Box>

                                                    <InputLabel sx={{ color: 'black' }}>City</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        margin="normal"
                                                        name="city"
                                                        placeholder="City"
                                                        size="small"
                                                    // onChange={(e) => handleContactAddressChange(index, 'city', e.target.value)}
                                                    />
                                                </Box>
                                                <Box>

                                                    <InputLabel sx={{ color: 'black' }}>State/Province</InputLabel>
                                                    <TextField
                                                        margin="normal"
                                                        name="state"
                                                        fullWidth
                                                        placeholder="State/Province"
                                                        size="small"
                                                    // onChange={(e) => handleContactAddressChange(index, 'state', e.target.value)}
                                                    />
                                                </Box>
                                                <Box>

                                                    <InputLabel sx={{ color: 'black' }}>ZIP/Postal Code</InputLabel>
                                                    <TextField
                                                        margin="normal"
                                                        fullWidth
                                                        name="postalCode"
                                                        placeholder="ZIP/Postal Code"
                                                        size="small"
                                                    // onChange={(e) => handleContactAddressChange(index, 'postalCode', e.target.value)}
                                                    />
                                                </Box>
                                            </Box>
                                        </form>
                                    </Box>
                                </Box>
                            ))}

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    ml: 1,
                                    cursor: 'pointer',
                                    color: '#1976d3',
                                    fontWeight: 600,
                                    marginLeft: '20px'
                                }}

                            >
                                <AiOutlinePlusCircle />
                                <p onClick={addNewContact}>Add New Contact</p>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 4,
                                    padding: '1px 5px 0 5px',
                                }}
                            >
                                <Button variant="contained"
                                    color="primary"

                                    sx={{
                                        mt: 2,
                                        ml: 3,
                                        borderRadius: '10px',
                                    }} onClick={() => {
                                        handleOptionChange(null, 'Account Info');
                                    }}
                                >Back</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"

                                    sx={{
                                        mt: 2,

                                        borderRadius: '10px',
                                    }}
                                // onClick={handlesubmitContact}
                                >
                                    Create
                                </Button>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    onClick={onClose}
                                    sx={{
                                        mt: 2,

                                        borderRadius: '10px',
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}

            </Box>
        </Box>




    )
}

export default Accountupdate