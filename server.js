import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'data', 'permits.json');
const CONTRACTORS_PATH = path.join(__dirname, 'data', 'contractors.json');
const VENDORS_PATH = path.join(__dirname, 'data', 'vendors.json');
const TRUCKS_PATH = path.join(__dirname, 'data', 'trucks.json');
const MAINTENANCE_PATH = path.join(__dirname, 'data', 'maintenance.json');
const CLIENTS_PATH = path.join(__dirname, 'data', 'clients.json');
const EMPLOYEES_PATH = path.join(__dirname, 'data', 'employees.json');
const PROPOSALS_PATH = path.join(__dirname, 'data', 'proposals.json');
const DATA_DIR = path.join(__dirname, 'data');

// Handle large base64 payloads (Videos, PDFs)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Ensure db files exist with initial data
if (!fs.existsSync(DB_PATH)) {
  console.log('Creating initial permits.json...');
  fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

if (!fs.existsSync(CONTRACTORS_PATH)) {
  console.log('Creating initial contractors.json...');
  fs.writeFileSync(CONTRACTORS_PATH, JSON.stringify([], null, 2));
}

if (!fs.existsSync(VENDORS_PATH)) {
  console.log('Creating initial vendors.json...');
  fs.writeFileSync(VENDORS_PATH, JSON.stringify([], null, 2));
}

if (!fs.existsSync(TRUCKS_PATH)) {
  console.log('Creating initial trucks.json...');
  fs.writeFileSync(TRUCKS_PATH, JSON.stringify([], null, 2));
}

if (!fs.existsSync(MAINTENANCE_PATH)) {
  console.log('Creating initial maintenance.json...');
  fs.writeFileSync(MAINTENANCE_PATH, JSON.stringify([], null, 2));
}

if (!fs.existsSync(CLIENTS_PATH)) {
  console.log('Creating initial clients.json...');
  fs.writeFileSync(CLIENTS_PATH, JSON.stringify([], null, 2));
}

if (!fs.existsSync(EMPLOYEES_PATH)) {
  console.log('Creating initial employees.json...');
  fs.writeFileSync(EMPLOYEES_PATH, JSON.stringify([], null, 2));
}

if (!fs.existsSync(PROPOSALS_PATH)) {
  console.log('Creating initial proposals.json...');
  fs.writeFileSync(PROPOSALS_PATH, JSON.stringify([], null, 2));
}

// Routes
app.get('/api/permits', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading permits.json:', err);
    res.status(500).json({ error: 'Failed to load permits' });
  }
});

app.post('/api/permits', (req, res) => {
  try {
    const permits = req.body;
    fs.writeFileSync(DB_PATH, JSON.stringify(permits, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to permits.json:', err);
    res.status(500).json({ error: 'Failed to save permits' });
  }
});

app.get('/api/contractors', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(CONTRACTORS_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading contractors.json:', err);
    res.status(500).json({ error: 'Failed to load contractors' });
  }
});

app.post('/api/contractors', (req, res) => {
  try {
    const contractors = req.body;
    fs.writeFileSync(CONTRACTORS_PATH, JSON.stringify(contractors, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to contractors.json:', err);
    res.status(500).json({ error: 'Failed to save contractors' });
  }
});

app.get('/api/vendors', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(VENDORS_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading vendors.json:', err);
    res.status(500).json({ error: 'Failed to load vendors' });
  }
});

app.post('/api/vendors', (req, res) => {
  try {
    const vendors = req.body;
    fs.writeFileSync(VENDORS_PATH, JSON.stringify(vendors, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to vendors.json:', err);
    res.status(500).json({ error: 'Failed to save vendors' });
  }
});

app.get('/api/trucks', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(TRUCKS_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading trucks.json:', err);
    res.status(500).json({ error: 'Failed to load trucks' });
  }
});

app.post('/api/trucks', (req, res) => {
  try {
    const trucks = req.body;
    fs.writeFileSync(TRUCKS_PATH, JSON.stringify(trucks, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to trucks.json:', err);
    res.status(500).json({ error: 'Failed to save trucks' });
  }
});

app.get('/api/maintenance', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(MAINTENANCE_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading maintenance.json:', err);
    res.status(500).json({ error: 'Failed to load maintenance records' });
  }
});

app.post('/api/maintenance', (req, res) => {
  try {
    const records = req.body;
    fs.writeFileSync(MAINTENANCE_PATH, JSON.stringify(records, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to maintenance.json:', err);
    res.status(500).json({ error: 'Failed to save maintenance records' });
  }
});

app.get('/api/clients', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(CLIENTS_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading clients.json:', err);
    res.status(500).json({ error: 'Failed to load clients' });
  }
});

app.post('/api/clients', (req, res) => {
  try {
    const clients = req.body;
    fs.writeFileSync(CLIENTS_PATH, JSON.stringify(clients, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to clients.json:', err);
    res.status(500).json({ error: 'Failed to save clients' });
  }
});

app.get('/api/employees', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(EMPLOYEES_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading employees.json:', err);
    res.status(500).json({ error: 'Failed to load employees' });
  }
});

app.post('/api/employees', (req, res) => {
  try {
    const employees = req.body;
    fs.writeFileSync(EMPLOYEES_PATH, JSON.stringify(employees, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to employees.json:', err);
    res.status(500).json({ error: 'Failed to save employees' });
  }
});

app.get('/api/proposals', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(PROPOSALS_PATH, 'utf8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading proposals.json:', err);
    res.status(500).json({ error: 'Failed to load proposals' });
  }
});

app.post('/api/proposals', (req, res) => {
  try {
    const proposals = req.body;
    fs.writeFileSync(PROPOSALS_PATH, JSON.stringify(proposals, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing to proposals.json:', err);
    res.status(500).json({ error: 'Failed to save proposals' });
  }
});

// Single permit update helper (optional but useful)
app.put('/api/permits/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedPermit = req.body;
    let data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    data = data.map(p => p.id === id ? updatedPermit : p);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update permit' });
  }
});

app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `PermitPro Backend running at http://localhost:${PORT}`);
});
