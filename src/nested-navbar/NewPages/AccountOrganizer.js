import {
    Box, Typography, Divider, Dialog, Tooltip,
    DialogContent, Select, LinearProgress, Autocomplete, TextField, MenuItem, Chip, Container, Button, Checkbox, FormControl
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const AccountOrganizer = () => {
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;

    const { data } = useParams();

    const [organizerTemplate, setOrganizerTemplate] = useState([]);
    const [organizerTemp, setOrganizerTemp] = useState(null);
    const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] = useState('');
    const [selectedAccount, setSelectedAccount] = useState([]);
    const [showOrganizerForm, setShowOrganizerForm] = useState(false);
    const [organizeraccountwise, setorganizeraccountwise] = useState();
    const [selectedOrganizerTempData, setSelectedOrganizerTempData] = useState();

    const navigate = useNavigate();
    useEffect(() => {
        fetchOrganizerTemplateData();
        fetchAccountsData()
    }, []);

    const fetchOrganizerTemplateData = async () => {
        try {
            const url = "http://127.0.0.1:7600/workflow/organizers/organizertemplate/";
            const response = await fetch(url);
            const result = await response.json();
            setOrganizerTemplate(result.OrganizerTemplates);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [accountData, setAccountData] = useState([]);
    const fetchAccountsData = async () => {
        try {
            const url = `${ACCOUNT_API}/accounts/account/accountdetailslist/`;
            const response = await fetch(url);
            const result = await response.json();
            if (Array.isArray(result.accountlist)) {
                setAccountData(result.accountlist);
            } else {
                console.error("Account list is not an array", result.accountlist);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handleOrganizerTemplateChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOrganizerTemplate(selectedValue);
        // Fetch data based on selected value
        fetchOrganizerTemplateDataByTempId(selectedValue);
    };
    // const [sections, setSections] = useState([]);
    const [sections, setSections] = useState([]);
const[organizerName, setOrganizerName] = useState('');

    const fetchOrganizerTemplateDataByTempId = async (selectedOrganizerTempid) => {
        try {
            const url = `http://127.0.0.1:7600/workflow/organizers/organizertemplate/${selectedOrganizerTempid}`;
            const response = await fetch(url);
            const result = await response.json();
            console.log(result)
            console.log(result.organizerTemplate.sections);
            setSelectedOrganizerTempData(result.organizerTemplate);
            setSections(result.organizerTemplate.sections);
            setOrganizerName(result.organizerTemplate.organizerName);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const handlePreview = () => {
        setPreviewDialogOpen(true); // Open the dialog
        console.log(selectedOrganizerTempData.sections)
        const sections = (selectedOrganizerTempData.sections);
        const data = {
            sections // sections // This contains all your sections and their elements
        };
        console.log("Data for preview:", data);
    };

    console.log(sections)
    console.log(accountData)
    console.log(selectedOrganizerTempData)
    console.log(selectedAccount)
    console.log(selectedOrganizerTemplate)

    const AccountsOptions = (accountData || []).map((account) => ({
        value: account.id,
        label: account.Name,
    }));

    const OrganizerTemplateOptions = organizerTemplate.map((organizertemp) => ({
        value: organizertemp._id,
        label: organizertemp.organizerName,
    }));

    const handleOrganizerFormClose = () => {
        setTimeout(() => {
        }, 1000);
    };

    //Preview
    const [startDate, setStartDate] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [answeredElements, setAnsweredElements] = useState({});
    const [radioValues, setRadioValues] = useState({});
    const [checkboxValues, setCheckboxValues] = useState({});
    const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
    const [inputValues, setInputValues] = useState({});
    const [selectedValue, setSelectedValue] = useState(null);
    const shouldShowSection = (section) => {
        if (!section.sectionsettings?.conditional) return true;
    
        const condition = section.sectionsettings?.conditions?.[0];
        if (condition && condition.question && condition.answer) {
            const radioAnswer = radioValues[condition.question];
            const checkboxAnswer = checkboxValues[condition.question];
            const dropdownAnswer = selectedDropdownValue;
                // For radio buttons
            if (radioAnswer !== undefined && condition.answer === radioAnswer) {
                return true;
            }
                // For checkboxes: check if the condition answer is in the selected checkbox values
            if (checkboxAnswer && checkboxAnswer[condition.answer]) {
                return true;
            }
                // For dropdowns: check if the condition answer matches the selected dropdown value
            if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
                return true;
            }
                return false;
        }
            return true;
    };
    

    const getVisibleSections = () => sections.filter(shouldShowSection);
    const visibleSections = getVisibleSections();

    const handleInputChange = (event, elementText) => {
      const { value } = event.target;
      setInputValues((prevValues) => ({
        ...prevValues,
        [elementText]: value,
      }));
      setAnsweredElements((prevAnswered) => ({
        ...prevAnswered,
        [elementText]: true,
      }));
    };

    const totalSteps = visibleSections.length;
    const totalElements = sections[activeStep]?.formElements.length || 0;

    const answeredCount = sections[activeStep]?.formElements.filter(
        (element) => answeredElements[element.text]
    ).length || 0;

    const handleClosePreview = () => {
        setPreviewDialogOpen(false); // Close the dialog
    };
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
    const handleNext = () => {
        if (activeStep < totalSteps - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };
    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };
    const handleDropdownChange = (event) => {
        const selectedIndex = event.target.value;
        setActiveStep(selectedIndex);
    };
    const shouldShowElement = (element) => {
        if (!element.questionsectionsettings?.conditional) return true;

        const condition = element.questionsectionsettings?.conditions?.[0];

        if (condition && condition.question && condition.answer) {
            const radioAnswer = radioValues[condition.question];
            const checkboxAnswer = checkboxValues[condition.question];
            const dropdownAnswer = selectedDropdownValue;

            // For radio buttons
            if (radioAnswer !== undefined && condition.answer === radioAnswer) {
                return true;
            }

            // For checkboxes: check if the condition answer is in the selected checkbox values
            if (checkboxAnswer && checkboxAnswer[condition.answer]) {
                return true;
            }

            // For dropdowns: check if the condition answer matches the selected dropdown value
            if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
                return true;
            }

            return false;
        }
        return true;
    };

  
    const handleRadioChange = (value, elementText) => {
        setRadioValues((prevValues) => ({
          ...prevValues,
          [elementText]: value,
        }));
        setAnsweredElements((prevAnswered) => ({
          ...prevAnswered,
          [elementText]: true,
        }));
      };
    
      const handleCheckboxChange = (value, elementText) => {
        setCheckboxValues((prevValues) => ({
          ...prevValues,
          [elementText]: {
            ...prevValues[elementText],
            [value]: !prevValues[elementText]?.[value],
          },
        }));
        setAnsweredElements((prevAnswered) => ({
          ...prevAnswered,
          [elementText]: true,
        }));
      };

      const handleChange = (event, elementText) => {
        setSelectedValue(event.target.value);
        setAnsweredElements((prevAnswered) => ({
          ...prevAnswered,
          [elementText]: true,
        }));
      };
    
    



  const handleDropdownValueChange = (event, elementText) => {
    setSelectedDropdownValue(event.target.value);
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || '';
  };


    const createOrganizerOfAccount = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            accountid: data,
            organizertemplateid: selectedOrganizerTemplate,
            // reminders: reminder,
            jobid: ["661e495d11a097f731ccd6e8"],
            sections: selectedOrganizerTempData?.sections?.map(section => ({
                name: section?.text || '',
                id: section?.id?.toString() || '',
                text: section?.text || '',
                formElements: section?.formElements?.map(question => ({
                    type: question?.type || '',
                    id: question?.id || '',
                    sectionid: question?.sectionid || '',
                    options: question?.options?.map(option => ({
                        id: option?.id || '',
                        text: option?.text || '',
                        selected: option?.selected || false,
                    })) || [],
                    text: question?.text || '',
                    textvalue: question?.textvalue || '',
                })) || []
            })) || [],
            active: true
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        console.log(raw);
        const url = 'http://127.0.0.1:7600/organizer-account-wise';

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                console.log(result.newOrganizerAccountWise);
                const { _id } = result.newOrganizerAccountWise;

                console.log(_id); // "66f7e5d97114d8ad832c2d3e" 
                setorganizeraccountwise(result.newOrganizerAccountWise)
                setShowOrganizerForm(true);
                setSelectedOrganizerTemplate(selectedOrganizerTemplate);
                console.log(selectedOrganizerTemplate)

                navigate(`/organizerform/${_id}`);

            })
            .catch((error) => console.error(error));
    };

    const handleDelete = (valueToDelete) => {
        setSelectedAccount((prevSelected) =>
            prevSelected.filter((value) => value !== valueToDelete)
        );
    };


    return (
        <Container>
            {/* <Box p={2}>
                <Typography><strong>Organizer</strong></Typography>
            </Box> */}
            <Divider />

            <Box mt={3} borderBottom={"2px solid #e2e8f0"} p={2}>
                <Typography fontSize={20}><strong>Create organizer</strong></Typography>
            </Box>

            <Box mt={3}>
                <Typography>Accounts</Typography>
                <Autocomplete
                    multiple
                    options={AccountsOptions}
                    getOptionLabel={(option) => option.label}
                    value={selectedAccount.map((id) => AccountsOptions.find((opt) => opt.value === id)).filter(Boolean)} // Convert selected IDs to option objects
                    onChange={(event, newValue) => {
                        setSelectedAccount(newValue.map((option) => option.value)); // Update state with new IDs
                    }}
                    renderTags={(selected, getTagProps) =>
                        selected.map((option, index) => (
                            <Chip
                                key={option.value}
                                label={option.label}
                                {...getTagProps({ index })}
                                onDelete={() => handleDelete(option.value)}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select Accounts"
                        />
                    )}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                checked={selectedAccount.indexOf(option.value) > -1}
                                style={{ marginRight: 8 }}
                            />
                            {option.label}
                        </li>
                    )}
                />
            </Box>


            <Box mt={3}>
                <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                    <Typography>Organizer Template</Typography>
                    {/* <InputLabel>Organizer Template</InputLabel> */}
                    <Select
                        value={selectedOrganizerTemplate}
                        // onChange={(event) => setSelectedOrganizerTemplate(event.target.value)} // Handle selection change
                        onChange={handleOrganizerTemplateChange}
                        renderValue={(selected) => {
                            const option = OrganizerTemplateOptions.find(opt => opt.value === selected);
                            return option ? option.label : ''; // Show the label of the selected option
                        }}
                        label="Organizer Template"
                    >
                        {OrganizerTemplateOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box mt={2}>
    <TextField
      label="Enter Text"
      variant="outlined"
      fullWidth
      value={organizerName || ''} // Replace 'someField' with the field you want to display/edit
     
    />
  </Box>

            <Box>
                <Button variant="contained" onClick={handlePreview}>Preview Mode</Button>
            </Box>

            <Box display={'flex'} gap={2} alignItems={'center'} mt={2}>
                <Box>
                    <Button onClick={createOrganizerOfAccount} variant="contained">Create</Button>
                </Box>

                <Box>
                    <Button onClick={handleOrganizerFormClose} variant='outlined'>Cancel</Button>
                </Box>

            </Box>


            <Dialog open={previewDialogOpen} onClose={handleClosePreview} fullScreen >

                <DialogContent >


                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid #3FA2F6', p: 2, mb: 3, borderRadius: '10px', backgroundColor: '#96C9F4' }}>
                                    <Box >
                                        <Typography fontWeight='bold'>Preview mode</Typography>
                                        <Typography>The client sees your organizer like this</Typography>
                                    </Box>
                                    <Button variant='text' onClick={handleClosePreview} >Back to edit</Button>
                                </Box>
                                <Typography variant='text' gutterBottom>
                                    {organizerName}
                                </Typography>

                                <FormControl fullWidth sx={{ marginBottom: '10px', marginTop: '10px' }}>
                                    <Select
                                        value={activeStep}
                                        onChange={handleDropdownChange}
                                        size='small'
                                    >
                                        {/* {sections.map((section, index) => (
                <MenuItem key={index} value={index}>
                    {section.text} ({answeredCount}/{totalElements})
                </MenuItem>
            ))} */}
                                        {visibleSections.map((section, index) => (
                                            <MenuItem key={index} value={index}>
                                                {section.text} ({answeredCount}/{totalElements})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Box mt={2} mb={2}>
                                    <LinearProgress variant="determinate" value={(activeStep + 1) / totalSteps * 100} />
                                </Box>

                                {/* {sections
        .filter(shouldShowSection) // Filter sections based on conditions
        .map((section, sectionIndex) => (
            sectionIndex === activeStep && ( */}
                                <Box sx={{ pl: 20, pr: 20 }}>
                                    {visibleSections.map((section, sectionIndex) => (
                                        sectionIndex === activeStep && (
                                            <Box key={section.text}>
                                                {section.formElements.map((element) => (
                                                    shouldShowElement(element) && (
                                                        <Box key={element.text} >
                                                            {(element.type === 'Free Entry' || element.type === 'Number' || element.type === 'Email') && (
                                                                <Box>
                                                                    <Typography fontSize='18px' mb={1} mt={1}>{element.text}</Typography>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        size='small'
                                                                        multiline
                                                                        fullWidth
                                                                        // margin='normal'
                                                                        placeholder={`${element.type} Answer`}
                                                                        inputProps={{
                                                                            type: element.type === 'Free Entry' ? 'text' : element.type.toLowerCase(),
                                                                        }}
                                                                        maxRows={8}
                                                                        style={{ display: 'block', marginTop: '15px' }}
                                                                        value={inputValues[element.text] || ''}
                                                                        onChange={(e) => handleInputChange(e, element.text)}
                                                                    />
                                                                </Box>
                                                            )}

                                                            {element.type === 'Radio Buttons' && (
                                                                <Box>
                                                                    <Typography fontSize='18px' mb={1} mt={1} >{element.text}</Typography>
                                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                        {element.options.map((option) => (
                                                                            <Button
                                                                                key={option.text}
                                                                                variant={radioValues[element.text] === option.text ? 'contained' : 'outlined'}
                                                                                onClick={() => handleRadioChange(option.text, element.text)}
                                                                            >
                                                                                {option.text}
                                                                            </Button>
                                                                        ))}
                                                                    </Box>
                                                                </Box>
                                                            )}

                                                            {element.type === 'Checkboxes' && (
                                                                <Box>
                                                                    <Typography fontSize='18px' >{element.text}</Typography>
                                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                        {element.options.map((option) => (
                                                                            <Button
                                                                                key={option.text}
                                                                                variant={checkboxValues[element.text]?.[option.text] ? 'contained' : 'outlined'}
                                                                                onClick={() => handleCheckboxChange(option.text, element.text)}
                                                                            >
                                                                                {option.text}
                                                                            </Button>
                                                                        ))}
                                                                    </Box>
                                                                </Box>
                                                            )}

                                                            {element.type === 'Yes/No' && (
                                                                <Box>
                                                                    <Typography fontSize='18px' >{element.text}</Typography>
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                        {element.options.map((option) => (
                                                                            <Button
                                                                                key={option.text}
                                                                                variant={selectedValue === option.text ? 'contained' : 'outlined'}
                                                                                onClick={(event) => handleChange(event, element.text)}
                                                                            >
                                                                                {option.text}
                                                                            </Button>
                                                                        ))}
                                                                    </Box>
                                                                </Box>
                                                            )}

                                                            {element.type === 'Dropdown' && (
                                                                <Box>
                                                                    <Typography fontSize='18px' >{element.text}</Typography>
                                                                    <FormControl fullWidth>
                                                                        <Select
                                                                            value={selectedDropdownValue}
                                                                            onChange={(event) => handleDropdownValueChange(event, element.text)}
                                                                            size='small'
                                                                        >
                                                                            {element.options.map((option) => (
                                                                                <MenuItem key={option.text} value={option.text}>
                                                                                    {option.text}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Box>
                                                            )}

                                                            {element.type === 'Date' && (
                                                                <Box>
                                                                    <Typography fontSize='18px' >{element.text}</Typography>
                                                                    <DatePicker
                                                                        format="DD/MM/YYYY"
                                                                        sx={{ width: '100%', backgroundColor: '#fff' }}
                                                                        selected={startDate}
                                                                        onChange={handleStartDateChange}
                                                                        renderInput={(params) => <TextField {...params} size="small" />}
                                                                        onOpen={() => setAnsweredElements((prevAnswered) => ({
                                                                            ...prevAnswered,
                                                                            [element.text]: true,
                                                                        }))}
                                                                    />
                                                                </Box>
                                                            )}
                                                            {/* File Upload */}
                                                            {element.type === "File Upload" && (
                                                                <Box>
                                                                    <Typography fontSize='18px' mb={1} mt={2}>{element.text}</Typography>
                                                                    {/* <Tooltip title="Unavailable in preview mode" placement="top">
                                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                <Button variant="contained" color="primary" disabled>
                                                    Upload
                                                </Button>
                                            </Box>
                                        </Tooltip> */}
                                                                    <Tooltip title="Unavailable in preview mode" placement="top">
                                                                        <Box sx={{ position: 'relative', width: '100%' }}>
                                                                            <TextField
                                                                                variant="outlined"
                                                                                size="small"
                                                                                fullWidth
                                                                                // margin="normal"
                                                                                disabled
                                                                                placeholder="Add Document"
                                                                                sx={{
                                                                                    cursor: 'not-allowed',
                                                                                    '& .MuiInputBase-input': {
                                                                                        pointerEvents: 'none',
                                                                                        cursor: 'not-allowed',
                                                                                    },
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                    </Tooltip>
                                                                </Box>
                                                            )}
                                                            {element.type === "Text Editor" && (
                                                                <Box mt={2} mb={2}>
                                                                    <Typography>{stripHtmlTags(element.text)}</Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )
                                                ))}
                                            </Box>
                                        )
                                    ))}

                                    <Box mt={3} display='flex' gap={3} alignItems='center'>
                                        <Button disabled={activeStep === 0} onClick={handleBack} variant='contained'>
                                            Back
                                        </Button>
                                        <Button onClick={handleNext} disabled={activeStep === totalSteps - 1} variant='contained'>
                                            Next
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </LocalizationProvider>
                    </Box>
                </DialogContent>

            </Dialog>

        </Container>
    );
}

export default AccountOrganizer