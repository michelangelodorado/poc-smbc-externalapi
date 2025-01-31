const express = require('express');
const axios = require('axios');
const { parseStringPromise, Builder } = require('xml2js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

const API_KEY = process.env.API_KEY; // Set this in your .env file
const BASE_URL = 'https://poc.smbcsgtest.com';

app.use(express.json());
app.use(express.text({ type: 'application/xml' }));

// Convert JSON to XML
app.post('/smarts/v2/json2xml', async (req, res) => {
    try {
        const builder = new Builder();
        const xmlData = builder.buildObject({ Document: req.body });
        res.header('Content-Type', 'application/xml').send(xmlData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Convert XML to JSON
app.post('/smarts/v2/xml2json', async (req, res) => {
    try {
        const jsonData = await parseStringPromise(req.body, { explicitArray: false });
        res.json(jsonData.Document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all invoices
app.get('/trade/invoicefinancing/v2/invoices', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/trade/invoicefinancing/v2/invoices`, {
            headers: { 'Ocp-Apim-Subscription-Key': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data || 'No response data'
        });
    }
});

// Create a new invoice
app.post('/trade/invoicefinancing/v2/invoices/new', async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/trade/invoicefinancing/v2/invoices/new`, req.body, {
            headers: { 'Ocp-Apim-Subscription-Key': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data || 'No response data'
        });
    }
});

// Get a specific invoice by ID
app.get('/trade/invoicefinancing/v2/invoices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${BASE_URL}/trade/invoicefinancing/v2/invoices/${id}`, {
            headers: { 'Ocp-Apim-Subscription-Key': API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data || 'No response data'
        });
    }
});

// Additional Endpoints
app.get('/beta/unusedendpoint', async (req, res) => {
    try {
        res.json({ message: 'This is an unused endpoint response' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/beta/unusedendpoint2', async (req, res) => {
    try {
        res.json({ message: 'This is another unused endpoint response' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
