import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
    Container,
    Box,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    TextField,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    Button,
    FormLabel,
    Paper,
    LinearProgress, Tooltip,
} from '@mui/material'; // Make sure you have MUI installed
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const CreateOrganizerUpdate = ({ OrganizerData }) => {
    // console.log(OrganizerData)
    const API_KEY = process.env.REACT_APP_API_IP;
    const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
    const navigate = useNavigate();
    const { data } = useParams();
    // console.log(data)
    const [accountsData, setAccountsData] = useState([]);
    const [organizerTemplate, setOrganizerTemplate] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] = useState(null);
    const [selectedOrganizerOfAccountData, setSelectedOrganizerOfAccountData] = useState(null);
    const [organizerName, setOrganizerName] = useState('');
    const [reminder, setReminder] = useState(false);
    const [organizerTemp, setOrganizerTemp] = useState(null);
    const [fileInputs, setFileInputs] = useState({});
    const [sections, setSections] = useState([]);
    useEffect(() => {
        fetchOrganizerOfAccount(data);
    }, []);

    const fetchOrganizerOfAccount = () => {

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${data}`;
        // console.log(url)
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                // console.log(result.organizerAccountWise)
                // Find the organizer that matches the _id
                const selectedOrganizer = result.organizerAccountWise.find(org => org._id === OrganizerData);
                // console.log(selectedOrganizer)
                setOrganizerTemp(selectedOrganizer)

                const selectedAccount = {
                    value: selectedOrganizer.accountid._id,
                    label: selectedOrganizer.accountid.accountName
                };
                setSelectedAccounts([selectedAccount]);

                const selectedorganizer = {
                    value: selectedOrganizer.organizertemplateid._id,
                    label: selectedOrganizer.organizertemplateid.organizerName
                };
                setSelectedOrganizerTemplate([selectedorganizer]);
                setOrganizerName(selectedOrganizer.organizertemplateid.organizerName);
                setSections(selectedOrganizer.sections);
            }
            )
            .catch((error) => console.error(error));
    }
    // console.log(organizerTemp)

    // const fetchOrganizerById = async (OrganizerData) => {
    //     console.log(OrganizerData);
    //     const requestOptions = {
    //         method: 'GET',
    //         redirect: 'follow',
    //     };
    //     const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${OrganizerData}`;

    //     try {
    //         const response = await fetch(url, requestOptions);
    //         const result = await response.json();
    //         console.log("Fetch Organizer By ID Result: ", result);
    //         if (result && result.organizerTemplate) {

    //             setOrganizerName(result.organizerTemplate.organizerName);
    //             console.log(result.organizerTemplate.organizerName)

    //             const organizeroptions = {
    //                 value: result.organizerTemplate._id,
    //                 label: result.organizerTemplate.organizerName
    //             };
    //             console.log(organizeroptions)
    //             setSelectedOrganizerTemplate(organizeroptions);

    //         } else {
    //             console.error("Invalid response structure: ", result);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching organizer template by ID:', error);
    //     }
    // };

    // const fetchOrganizerTemplateData = async () => {
    //     try {
    //         const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/`;
    //         const response = await fetch(url);
    //         const result = await response.json();
    //         setOrganizerTemplate(result.OrganizerTemplates);
    //         console.log(result)
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    const AccountsOptions = accountsData.map((account) => ({
        value: account._id,
        label: account.accountName,
    }));

    const OrganizerTemplateOptions = organizerTemplate.map((organizertemp) => ({
        value: organizertemp._id,
        label: organizertemp.organizerName,
    }));
    const handleAccountChange = (selectedOption) => {
        setSelectedAccounts(selectedOption);
    };

    const handleOrganizerTemplateChange = (selectedOption) => {
        setSelectedOrganizerTemplate(selectedOption);
        // fetchOrganizerById(data);
    };

    const handleRemindersChange = (checked) => {
        setReminder(checked);
    };

    const handleCheckboxToggle = (questionId, optionId) => {
        setOrganizerTemp(prevOrganizerTemp => {
            const updatedSections = prevOrganizerTemp.sections.map(section => ({
                ...section,
                formElements: section.formElements.map(question => {
                    if (question.id === questionId) {
                        return {
                            ...question,
                            options: question.options.map(option => ({
                                ...option,
                                selected: option.id === optionId ? !option.selected : option.selected
                            }))
                        };
                    }
                    return question;
                })
            }));

            return {
                ...prevOrganizerTemp,
                sections: updatedSections
            };
        });
    };

    // const handleRadioToggle = (questionId, optionId) => {
    //     setOrganizerTemp(prevOrganizerTemp => {
    //         const updatedSections = prevOrganizerTemp.sections.map(section => ({
    //             ...section,
    //             formElements: section.formElements.map(question => {
    //                 if (question.id === questionId) {
    //                     return {
    //                         ...question,
    //                         options: question.options.map(option => ({
    //                             ...option,
    //                             selected: option.id === optionId
    //                         }))
    //                     };
    //                 }
    //                 return question;
    //             })
    //         }));

    //         return {
    //             ...prevOrganizerTemp,
    //             sections: updatedSections
    //         };
    //     });
    // };

    const handleRadioToggle = (questionId, selectedOptionText) => {
        setOrganizerTemp(prevOrganizerTemp => {
            const updatedSections = prevOrganizerTemp.sections.map(section => ({
                ...section,
                formElements: section.formElements.map(question => {
                    if (question.id === questionId) {
                        return {
                            ...question,
                            options: question.options.map(option => ({
                                ...option,
                                selected: option.text === selectedOptionText // Compare based on text
                            }))
                        };
                    }
                    return question;
                })
            }));

            return {
                ...prevOrganizerTemp,
                sections: updatedSections
            };
        });
    };

    // const handleInputChange = (questionId, value) => {
    //     setOrganizerTemp(prevOrganizerTemp => {
    //         const updatedSections = prevOrganizerTemp.sections.map(section => ({
    //             ...section,
    //             formElements: section.formElements.map(question => {
    //                 if (question.id === questionId) {
    //                     return {
    //                         ...question,
    //                         textvalue: value
    //                     };
    //                 }
    //                 return question;
    //             })
    //         }));

    //         return {
    //             ...prevOrganizerTemp,
    //             sections: updatedSections
    //         };
    //     });
    // };



    // const handleInputChange = (event, elementText) => {
    //     const { value } = event.target;
    //     setInputValues((prevValues) => ({
    //         ...prevValues,
    //         [elementText]: value,
    //     }));
    //     setAnsweredElements((prevAnswered) => ({
    //         ...prevAnswered,
    //         [elementText]: true,
    //     }));
    // };

    const handleInputChange = (questionId, value) => {
        setOrganizerTemp(prevOrganizerTemp => {
            const updatedSections = prevOrganizerTemp.sections.map(section => ({
                ...section,
                formElements: section.formElements.map(question => {
                    if (question.id === questionId) {
                        return {
                            ...question,
                            textvalue: value
                        };
                    }
                    return question;
                })
            }));
    
            const newOrganizerTemp = {
                ...prevOrganizerTemp,
                sections: updatedSections
            };
    
            console.log("Updated organizerTemp:", newOrganizerTemp); // Debug to check new state
    
            return newOrganizerTemp;
        });
    };
    

    const handleFileInputChange = (questionId, event) => {
        const files = event.target.files;
        setFileInputs(prevState => ({
            ...prevState,
            [questionId]: files[0]
        }));
    };

    const handleOrganizerFormClose = () => {
        setTimeout(() => {
            // window.location.reload();
            navigate(`/accountsdash/organizers/${selectedAccounts?.value}`)
        }, 1000);
    };

    const createOrganizerOfAccount = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            accountid: selectedAccounts?.value,
            organizertemplateid: selectedOrganizerTemplate?.value,
            reminders: reminder,
            jobid: ["661e495d11a097f731ccd6e8"],
            sections: organizerTemp?.sections?.map(section => ({
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
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        console.log(raw);
        const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizerTemp._id}`;
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                toast.success("Organizer AccountWise Updated successfully");
            })
            .catch((error) => console.error(error));
    };

    //Sections 

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
    // console.log(sections);
    const getVisibleSections = () => sections.filter(shouldShowSection);
    const visibleSections = getVisibleSections();
    // console.log(visibleSections)
    const totalSteps = visibleSections.length;
    const totalElements = sections[activeStep]?.formElements.length || 0;

    const answeredCount = sections[activeStep]?.formElements.filter(
        (element) => answeredElements[element.text]
    ).length || 0;

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

    return (
        <Container>
            <Box component={Paper} p={2} mb={4}>
                <Typography variant="h4" gutterBottom>
                    Create Organizer
                </Typography>
                <Box mb={2}>
                    <FormControl fullWidth variant="outlined">
                        <Typography>Accounts</Typography>
                        <Select
                            value={selectedAccounts}
                            onChange={handleAccountChange}
                            MenuProps={{ disableScrollLock: true }}
                        >
                            {AccountsOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box mb={2}>
                    <FormControl fullWidth variant="outlined">
                        <Typography >Organizer Template</Typography>
                        <Select
                            value={selectedOrganizerTemplate}
                            onChange={handleOrganizerTemplateChange}

                            MenuProps={{ disableScrollLock: true }}
                        >
                            {OrganizerTemplateOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box mb={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Organizer Name"
                        value={organizerName}
                        onChange={(e) => setOrganizerName(e.target.value)}
                    />
                </Box>

                <Box mb={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={reminder}
                                onChange={handleRemindersChange}
                                color="primary"
                            />
                        }
                        label="Reminders"
                    />
                </Box>
            </Box>
            <Box>
                <FormControl fullWidth sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <Select
                        value={activeStep}
                        onChange={handleDropdownChange}
                        size='small'
                    >
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
                {organizerTemp && (
                    <Box component={Paper} p={2} mb={4}>
                        <form key={organizerTemp.organizertemplateid}>
                            <Typography variant="h5" gutterBottom>
                                {organizerName}
                            </Typography>

                            {visibleSections.map((section, sectionIndex) => (
                                sectionIndex === activeStep && (
                                    <Box key={section.text}>
                                        {section.formElements.map((element) => (
                                            shouldShowElement(element) && (
                                                <Box key={element.id} >
                                                    {(element.type === 'Free Entry' || element.type === 'Number' || element.type === 'Email') && (
                                                        // <Box>
                                                        //     <Typography fontSize='18px' mb={1} mt={1}>{element.text}</Typography>
                                                        //     <TextField
                                                        //         variant="outlined"
                                                        //         size='small'
                                                        //         multiline
                                                        //         fullWidth
                                                        //         // margin='normal'
                                                        //         placeholder={`${element.type} Answer`}
                                                        //         inputProps={{
                                                        //             type: element.type === 'Free Entry' ? 'text' : element.type.toLowerCase(),
                                                        //         }}
                                                        //         maxRows={8}
                                                        //         style={{ display: 'block', marginTop: '15px' }}
                                                        //         value={inputValues[element.text] || ''}
                                                        //         onChange={(e) => handleInputChange(e, element.text)}
                                                        //     />
                                                        // </Box>
                                                        <Box>
                                                            <Typography fontSize='18px' mb={1} mt={1}>{element.text}</Typography>
                                                            <TextField
                                                                variant="outlined"
                                                                size='small'
                                                                multiline
                                                                fullWidth
                                                                placeholder="Your answer here"
                                                                value={element.textvalue || ''} // Ensure the value points to `element.textvalue`
                                                                onChange={(e) => {
                                                                    console.log("TextField change:", e.target.value); // Debug line
                                                                    handleInputChange(element.id, e.target.value);
                                                                }}
                                                                maxRows={8}
                                                                style={{ display: 'block', marginTop: '15px' }}
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
                        </form>
                    </Box>
                )}
            </Box>
            <Box display="flex" justifyContent="space-between">
                <Link to={`/accountsdash/organizers/${selectedAccounts?.value}`}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={createOrganizerOfAccount}
                    >
                        Save
                    </Button>
                </Link>
                <Button variant="outlined" onClick={handleOrganizerFormClose}>
                    Cancel
                </Button>
            </Box>



        </Container>
    );
};




export default CreateOrganizerUpdate;



