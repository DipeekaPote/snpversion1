
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
    Alert,
    InputLabel,
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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CiMenuKebab } from "react-icons/ci";
import EditorShortcodes from '../Texteditor/EditorShortcodes';


const MyStepperUpdate = () => {

    const { _id } = useParams();

    const [activeStep, setActiveStep] = useState(0);
    const [introductionContent, setIntroductionContent] = useState('');
    const [termsContent, setTermsContent] = useState('');
    const [servicedata, setServiceData] = useState([]);
    const [activeOption, setActiveOption] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [templatename, settemplatename] = useState("");
    const [errors, setErrors] = useState({});
    const [introductionname, setIntroductionName] = useState("");
    const [termsandconditionname, setTermsandConditionName] = useState("");
    const [selectedUser, setSelectedUser] = useState([]);
    const [combinedTeamMemberValues, setCombinedTeamMemberValues] = useState([]);
    const [userData, setUserData] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [proposalName, setProposalName] = useState('');
    const [shortcuts, setShortcuts] = useState([]);
    const [filteredShortcuts, setFilteredShortcuts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('contacts');
    const [selectedShortcut, setSelectedShortcut] = useState("");
    const [daysuntilNextReminder, setDaysuntilNextReminder] = useState('3');
    const [noOfReminder, setNoOfReminder] = useState(1);
    const [description, setDescription] = useState('');
    const [selectedservice, setselectedService] = useState();


    const [invoiceDataUpdate, setInvoiceDataUpdate] = useState({});

    useEffect(() => {
        console.log('Invoice data received:', serviceandinvoiceSettingonupdate);
    }, []);

    const serviceandinvoiceSettingonupdate = (serviceAndInvoiceData) => {
        console.log('Invoice data received:', serviceAndInvoiceData);

        const newInvoiceData = {
            servicesandinvoicetempid: serviceAndInvoiceData.invoiceTempId,
            invoicetemplatename: serviceAndInvoiceData.invoiceTempName,
            invoiceteammember: serviceAndInvoiceData.invoiceTeamMember,
            issueinvoice: serviceAndInvoiceData.issueInvoiceSelect,
            specificdate: serviceAndInvoiceData.specificDate,
            specifictime: serviceAndInvoiceData.specificTime,
            description: serviceAndInvoiceData.descriptionData,
            lineItems: serviceAndInvoiceData.lineItems,
            summary: serviceAndInvoiceData.summary,
            notetoclient: serviceAndInvoiceData.noteToClient,

        };
        setInvoiceDataUpdate(newInvoiceData);

    };
    console.log(invoiceDataUpdate)


    // console.log(combinedValues)

    useEffect(() => {
        fetchUserData();
        // console.log('Invoice data received:', serviceAndInvoiceData);
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

    const toggleDropdown = (event) => {
        setAnchorEl(event.currentTarget);
        setShowDropdown(!showDropdown);
    };

    const handleAddShortcut = (shortcut) => {
        setProposalName((prevText) => prevText + `[${shortcut}]`);
        setShowDropdown(false);
    };

    const [stepsVisibility, setStepsVisibility] = useState({
        Introduction: true,
        Terms: true,
        ServicesInvoices: true,
        CustomEmailMessage: true,
        Reminders: true,
    });


    const steps = ['General'].concat(
        stepsVisibility.Introduction ? ['Introduction'] : [],
        stepsVisibility.Terms ? ['Terms'] : [],
        stepsVisibility.ServicesInvoices ? ['Services & Invoices'] : [],
        activeOption === 'invoice' ? ['Payments'] : []
    );

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = (serviceAndInvoiceData) => {
        if (!serviceAndInvoiceData) {
            console.error('Error: serviceAndInvoiceData is undefined');
            return;
        }
        // onupdateserviceandinvoiceSettings(serviceAndInvoiceData);
        updatesaveProposaltemp();
        setActiveStep(0);
    };

    const handleStepClick = (step) => {
        setActiveStep(step);
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

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;
        if (!templatename) tempErrors.templatename = "Template name is required";
        // if (!jobName) tempErrors.jobName = "Job name is required";

        setErrors(tempErrors);
        // return isValid;
        return Object.keys(tempErrors).length === 0;
    };

    const handleEditorChange = (content) => {
        setDescription(content);
    };

    const handleIntroductionName = (e) => {
        const { value } = e.target;
        setIntroductionName(value);
    };
    const handleTermsandConditionName = (e) => {
        const { value } = e.target;
        setTermsandConditionName(value);
    };
    const [addInvoice, setAddInvoice] = useState('');
    const [addInvoiceitemized, setAddInvoiceitemized] = useState('');
    const handleShowInvoiceForm = () => {
        setActiveOption('invoice');
        setAddInvoice('invoice');
    };

    const handleShowServiceForm = () => {
        setActiveOption('service');
        setAddInvoiceitemized('service')
    };

    const handleServiceChange = (index, selectedOptions) => {
        setselectedService(selectedOptions);
        fetchservicebyid(selectedOptions.value, index);
    };

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

    const [option, setOptions] = useState([]);
    const [invoiceData, setInvoiceData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchproposalbyid = async () => {
        try {
            const url = `http://127.0.0.1:7500/workflow/proposalesandels/proposalesandelslist/${_id}`;
            const response = await fetch(url);
            const result = await response.json();

            const proposalesandelsTemplate = result.proposalesAndElsTemplate;
            console.log(proposalesandelsTemplate)
            // Set template name and proposal name
            settemplatename(proposalesandelsTemplate.templatename);
            setProposalName(proposalesandelsTemplate.proposalname);

            // Map team members for Autocomplete
            const mappedOptions = proposalesandelsTemplate.teammember.map((member) => ({
                label: member.username, // Display username
                value: member._id, // Use _id as the value
            }));
            setOptions(mappedOptions);
            setSelectedUser(mappedOptions);

            const selectedValues = mappedOptions.map((option) => option.value);
            setCombinedTeamMemberValues(selectedValues);

            // Set the visibility of sections
            setStepsVisibility({
                Introduction: proposalesandelsTemplate.introduction,
                Terms: proposalesandelsTemplate.terms,
                ServicesInvoices: proposalesandelsTemplate.servicesandinvoices,
                CustomEmailMessage: proposalesandelsTemplate.custommessageinemail,
                Reminders: proposalesandelsTemplate.reminders,
            });

            // Set introduction and terms content
            setIntroductionName(proposalesandelsTemplate.introductiontextname);
            setIntroductionContent(proposalesandelsTemplate.introductiontext);
            setTermsContent(proposalesandelsTemplate.termsandconditions);
            setTermsandConditionName(proposalesandelsTemplate.termsandconditionsname);
            setDescription(proposalesandelsTemplate.custommessageinemailtext);
            setDaysuntilNextReminder(proposalesandelsTemplate.daysuntilnextreminder);
            setNoOfReminder(proposalesandelsTemplate.numberofreminder);
            setPaymentTerms(proposalesandelsTemplate.paymentterms)
            setPaymentDueDate(proposalesandelsTemplate.paymentduedate)
            setPaymentAmount(proposalesandelsTemplate.paymentamount)
            // Set invoice data

            if (proposalesandelsTemplate.Additemizedserviceswithoutcreatinginvoices === 'service') {
                console.log(proposalesandelsTemplate.lineItems)
        
                const mappedLineItems = proposalesandelsTemplate.lineItems.map(item => ({
                    productName: item.productorService || '',  // Map productorService to productName
                    description: item.description || '',
                    rate: item.rate ? `$${parseFloat(item.rate).toFixed(2)}` : '$0.00',  // Ensure rate is properly formatted
                    qty: item.quantity ? item.quantity.toString() : '1',  // Ensure quantity is a string
                    amount: item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : '$0.00',  // Ensure amount is properly formatted
                    tax: item.tax || false,  // Default to false if tax is not provided
                    isDiscount: false  // Assuming isDiscount is not part of the response, default to false
                }));


                setRows(mappedLineItems)
                // summary(proposalesandelsTemplate.summary)
            }

            const invoiceData = {
                servicesandinvoicetempid: proposalesandelsTemplate.servicesandinvoicetempid,
                invoicetemplatename: proposalesandelsTemplate.invoicetemplatename,
                invoiceteammember: proposalesandelsTemplate.invoiceteammember,
                issueinvoice: proposalesandelsTemplate.issueinvoice,
                specificdate: proposalesandelsTemplate.specificdate,
                specifictime: proposalesandelsTemplate.specifictime,
                description: proposalesandelsTemplate.description,
                lineItems: proposalesandelsTemplate.lineItems,
                summary: proposalesandelsTemplate.summary,
                notetoclient: proposalesandelsTemplate.notetoclient,
            };
            setIsUpdating(true)
            setInvoiceData(invoiceData);
          
            console.log(invoiceData)
            // Conditionally set the active option
            if (proposalesandelsTemplate.Addinvoiceoraskfordeposit === 'invoice') {
                setActiveOption('invoice');
                setAddInvoice(proposalesandelsTemplate.Addinvoiceoraskfordeposit)
                
            } else if (proposalesandelsTemplate.Additemizedserviceswithoutcreatinginvoices === 'service') {
                setActiveOption('service');
                setAddInvoiceitemized(proposalesandelsTemplate.Additemizedserviceswithoutcreatinginvoices)
            }


            // Set the rows (line items)
            // setRows(proposalesandelsTemplate.lineItems);
        } catch (error) {
            console.error("Error fetching proposal by id:", error);
        }
    };

    // Define service and invoice settings outside of fetchData
    const serviceandinvoiceSettings = {
        servicesandinvoicetempid: invoiceData?.servicesandinvoicetempid,
        invoicetemplatename: invoiceData?.invoicetemplatename,
        invoiceteammember: invoiceData?.invoiceteammember,
        issueinvoice: invoiceData?.issueinvoice,
        specificdate: invoiceData?.specificdate,
        specifictime: invoiceData?.specifictime,
        description: invoiceData?.description,
        lineItems: invoiceData?.lineItems,
        summary: invoiceData?.summary,
        notetoclient: invoiceData?.notetoclient,

        isUpdating: isUpdating
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchproposalbyid();
        };

        fetchData();
    }, []); // Empty dependency array to run only once on mount

    console.log(serviceandinvoiceSettings);

    const updatesaveProposaltemp = () => {
        if (!validateForm()) {
            // toast.error("Please fix the validation errors.");
            return;
        }
        if (activeOption === 'invoice') {

            const lineItems = invoiceDataUpdate.lineItems.map(item => ({
                productorService: item.productName, // Assuming productName maps to productorService
                description: item.description,
                rate: item.rate.replace('$', ''), // Removing '$' sign from rate
                quantity: item.qty,
                amount: item.amount.replace('$', ''), // Removing '$' sign from amount
                tax: item.tax.toString() // Converting boolean to string
            }));

            const options = {
                method: 'PATCH',
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
                    servicesandinvoiceid: "66fa83ffe6e0f4ca11c2204d",
                    custommessageinemail: stepsVisibility.CustomEmailMessage,
                    custommessageinemailtext: description,
                    reminders: stepsVisibility.Reminders,
                    daysuntilnextreminder: daysuntilNextReminder,
                    numberofreminder: noOfReminder,
                    introductiontextname: introductionname,
                    introductiontext: introductionContent,
                    termsandconditionsname: termsandconditionname,
                    termsandconditions: termsContent,
                    servicesandinvoicetempid: invoiceDataUpdate.servicesandinvoicetempid,
                    invoicetemplatename: invoiceDataUpdate.invoicetemplatename,
                    invoiceteammember: invoiceDataUpdate.invoiceteammember,
                    issueinvoice: invoiceDataUpdate.issueinvoice,
                    specificdate: invoiceDataUpdate.specificdate,
                    specifictime: invoiceDataUpdate.specifictime,
                    description: invoiceDataUpdate.description,
                    lineItems: lineItems,
                    summary: invoiceDataUpdate.summary,
                    notetoclient: invoiceDataUpdate.notetoclient,
                    Addinvoiceoraskfordeposit: addInvoice,
                    Additemizedserviceswithoutcreatinginvoices: addInvoiceitemized,
                    paymentterms: paymentterms,
                    paymentduedate: paymentduedate,
                    paymentamount: paymentamount,
                    active: true
                })
            };
            console.log(options.body)
            fetch(`http://127.0.0.1:7500/workflow/proposalesandels/proposalesandels/${_id}`, options)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if (result && result.message === "ProposalesAndEls Template created successfully") {

                        // fetchPrprosalsAllData();
                        toast.success("ProposalesAndEls Template created successfully");

                    } else {
                        toast.error(result.message || "Failed to create ProposalesAndEls Template");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };

        if (activeOption === 'service') {

            const lineItems = invoiceDataUpdate.lineItems.map(item => ({
                productorService: item.productName, // Assuming productName maps to productorService
                description: item.description,
                rate: item.rate.replace('$', ''), // Removing '$' sign from rate
                quantity: item.qty,
                amount: item.amount.replace('$', ''), // Removing '$' sign from amount
                tax: item.tax.toString() // Converting boolean to string
            }));
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
                    // servicesandinvoiceid: "66fa83ffe6e0f4ca11c2204d",
                    custommessageinemail: stepsVisibility.CustomEmailMessage,
                    custommessageinemailtext: description,
                    reminders: stepsVisibility.Reminders,
                    daysuntilnextreminder: daysuntilNextReminder,
                    numberofreminder: noOfReminder,
                    introductiontextname: introductionname,
                    introductiontext: introductionContent,
                    termsandconditionsname: termsandconditionname,
                    termsandconditions: termsContent,
                    servicesandinvoicetempid: invoiceData.servicesandinvoicetempid,
                    // invoicetemplatename: invoiceData.invoicetemplatename,
                    // invoiceteammember: invoiceData.invoiceteammember,
                    // issueinvoice: invoiceData.issueinvoice,
                    // specificdate: invoiceData.specificdate,
                    // specifictime: invoiceData.specifictime,
                    // description: invoiceData.description,
                    lineItems: lineItems,
                    summary: {
                        subtotal: subtotal,
                        taxRate: taxRate,
                        taxTotal: taxTotal,
                        total: totalAmount,
                    },
                    // notetoclient: invoiceData.notetoclient,
                    Addinvoiceoraskfordeposit: addInvoice,
                    Additemizedserviceswithoutcreatinginvoices: addInvoiceitemized,
                    // paymentterms: paymentterms,
                    // paymentduedate: paymentduedate,
                    // paymentamount: paymentamount,
                    active: true
                })
            }
            console.log(options.body)
            fetch(`http://127.0.0.1:7500/workflow/proposalesandels/proposalesandels/${_id}`, options)
                .then(response => response.json())
                .then(result => {
                    console.log(result.message);
                    // toast.success("Invoice created successfully");
                    if (result && result.message === "ProposalesAndEls Template Updated successfully") {
                        // fetchPrprosalsAllData();
                        toast.success("ProposalesAndEls Template Updated successfully");
                    } else {
                        toast.error(result.message || "Failed to update ProposalesAndEls Template");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };
    };


    //*****Payments */

    const [paymentterms, setPaymentTerms] = useState("");
    const handlePaymentTerms = (e) => {
        const { value } = e.target;
        setPaymentTerms(value);
    };
    const [paymentduedate, setPaymentDueDate] = useState("");
    const handlePaymentDueDate = (e) => {
        const { value } = e.target;
        setPaymentDueDate(value);
    };
    const [paymentamount, setPaymentAmount] = useState("");
    const handlePaymentAmount = (e) => {
        const { value } = e.target;
        setPaymentAmount(value);
    };

    //*******ServiceUpdate */

    //   const handleSaveInvoice = () => {
    //     const serviceAndInvoice = {
    //         // invoiceTempId: selectInvoiceTemp.value,
    //         // invoiceTempName: selectInvoiceTemp.label,
    //         // invoiceTeamMember: selecteduser.value,
    //         // issueInvoiceSelect: issueInvoice,
    //         // specificDate: startDate,
    //         // specificTime: selectedTime,
    //         descriptionData: description,
    //         lineItems: rows,
    //         summary: {
    //             subtotal: subtotal,
    //             taxRate: taxRate,
    //             taxTotal: taxTotal,
    //             total: totalAmount,
    //         },
    //         // noteToClient: clientNote,
    //     };

    //     console.log('Service and Invoice Settings:', serviceAndInvoice);

    //     if (typeof serviceandinvoiceSettings === 'function') {
    //         serviceandinvoiceSettings(serviceAndInvoice);
    //     }
    // };

    // const handleSaveInvoiceonUpdate = () => {
    //     const serviceAndInvoice = {
    //         // invoiceTempId: selectInvoiceTemp.value,
    //         // invoiceTempName: selectInvoiceTemp.label,
    //         // invoiceTeamMember: selecteduser.value,
    //         // issueInvoiceSelect: issueInvoice,
    //         // specificDate: startDate,
    //         // specificTime: selectedTime,
    //         descriptionData: description,
    //         lineItems: rows,
    //         summary: {
    //             subtotal: subtotal,
    //             taxRate: taxRate,
    //             taxTotal: taxTotal,
    //             total: totalAmount,
    //         },
    //         // noteToClient: clientNote,
    //     };
    //     console.log('Service and Invoice Settings:', serviceAndInvoice);
    //     if (typeof serviceandinvoiceSettingonupdate === 'function') {
    //         serviceandinvoiceSettingonupdate(serviceAndInvoice);
    //     }
    //     setRows(rows)
    // };

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


                            <Box sx={{ border: '1px solid grey', borderRadius: '20px', padding: '15px', mb: 2, mt: 2 }} className="stepsCard">
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={stepsVisibility.CustomEmailMessage}
                                                onChange={handleSwitchChange('CustomEmailMessage')}
                                            />
                                        }
                                        label="Custom message in email"
                                    />
                                    <Box sx={{ backgroundColor: 'var(--colors-core-blue-600)', padding: '5px 10px', borderRadius: '5px' }}>
                                        <Typography variant="body2" fontWeight="bold" color="white">Best practice</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    Your client will receive a link via email to view and sign this proposal.
                                </Typography>

                                {/* Conditionally render the WYSIWYG editor or static content */}
                                {stepsVisibility.CustomEmailMessage && (
                                    <Grid item xs={12} sm={6}>
                                        <Box>
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

                                        <Box mt={2}>
                                            <EditorShortcodes onChange={handleEditorChange} initialContent={description} />
                                        </Box>
                                    </Grid>
                                )}
                            </Box>

                            <Box mt={2}>
                                <Box display={'flex'} alignItems={'center'} >
                                    <Box>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={stepsVisibility.Reminders}
                                                    onChange={handleSwitchChange('Reminders')}
                                                />
                                            }
                                            label="Custom message in email"
                                        />

                                    </Box>
                                    <Typography variant='h6'>Reminders</Typography>

                                </Box>
                                {stepsVisibility.Reminders && (
                                    <Box mb={3}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2 }}>
                                            <Box>
                                                <InputLabel sx={{ color: 'black' }}>Days until next reminder</InputLabel>
                                                <TextField
                                                    // margin="normal"
                                                    fullWidth
                                                    name="Daysuntilnextreminder"
                                                    value={daysuntilNextReminder}
                                                    onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                                                    placeholder="Days until next reminder"
                                                    size="small"
                                                    sx={{ mt: 2 }}
                                                />
                                            </Box>

                                            <Box>
                                                <InputLabel sx={{ color: 'black' }}>No Of reminders</InputLabel>
                                                <TextField

                                                    fullWidth
                                                    name="No Of reminders"
                                                    value={noOfReminder}
                                                    onChange={(e) => setNoOfReminder(e.target.value)}

                                                    placeholder="NoOfreminders"
                                                    size="small"
                                                    sx={{ mt: 2 }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
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
                                onChange={handleIntroductionName}
                                value={introductionname}
                            />
                        </Box>
                        <Editor
                            onChange={handleIntroductionChange}
                            initialContent={introductionContent}
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
                                onChange={handleTermsandConditionName}
                                value={termsandconditionname}
                            />
                        </Box>
                        <TermEditor
                            onChange={handleTermsChange}
                            initialContent={termsContent}
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
                        //  value= {}
                        // onClick={() => setActiveOption('invoice')}
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
                        // onClick={() => setActiveOption('service')}
                        >
                            Add itemized services without creating invoices
                            <Typography component="p">
                                No invoice or deposit request will be created
                            </Typography>
                        </Typography>

                        {/* Render the forms conditionally based on activeOption state */}

                        {activeOption === 'invoice' && invoiceData && Object.keys(invoiceData).length > 0 && (
                            <Box>
                                <Invoice serviceandinvoiceSettings={serviceandinvoiceSettings} serviceandinvoiceSettingonupdate={serviceandinvoiceSettingonupdate} />
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
                                {/* <button onClick={isUpdating ? handleSaveInvoiceonUpdate : handleSaveInvoice}>
                                {isUpdating ? "Update Invoice" : "Save Invoice"}
                            </button> */}
                            </Box>

                        )}
                    </Box>
                );

            case steps.indexOf('Payments'):
                return (
                    <Box>
                        <Typography variant="h6">Payment Information</Typography>
                        <Box mt={1} mb={3}>
                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                placeholder="Payment terms"
                                sx={{ backgroundColor: '#fff' }}
                                onChange={handlePaymentTerms}
                                value={paymentterms}
                            />
                        </Box>
                        <Box mt={1} mb={3}>
                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                placeholder="Payment due date"
                                sx={{ backgroundColor: '#fff' }}
                                onChange={handlePaymentDueDate}
                                value={paymentduedate}
                            />
                        </Box>
                        <Box mt={1} mb={3}>
                            <TextField
                                size="small"
                                fullWidth
                                margin="normal"
                                placeholder="Payment amount"
                                sx={{ backgroundColor: '#fff' }}
                                onChange={handlePaymentAmount}
                                value={paymentamount}
                            />
                        </Box>
                        {/* Add more fields for payment details if necessary */}
                    </Box>
                );

            default:
                return <Typography>Unknown Step</Typography>;
        }
    };

    return (
        <Box sx={{ width: '100%' }}>

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

        </Box>
    );
}


export default MyStepperUpdate;