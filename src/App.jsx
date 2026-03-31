import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AllPermits } from './components/AllPermits';
import { CityPermits } from './components/CityPermits';
import { Alerts } from './components/Alerts';
import { PermitForm } from './components/PermitForm';
import { ContractorForm } from './components/ContractorForm';
import { Vendors } from './components/Vendors';
import { VendorForm } from './components/VendorForm';
import { Trucks } from './components/Trucks';
import { TruckForm } from './components/TruckForm';
import { TruckMaintenance } from './components/TruckMaintenance';
import { MaintenanceForm } from './components/MaintenanceForm';
import { Clients } from './components/Clients';
import { ClientForm } from './components/ClientForm';
import { Employees } from './components/Employees';
import { EmployeeForm } from './components/EmployeeForm';
import { LandingPage } from './components/LandingPage';
import { Stats } from './components/Stats';
import { ReportBuilder } from './components/ReportBuilder';
import { Contractors } from './components/Contractors';
import { Proposals } from './components/Proposals';
import { ProposalForm } from './components/ProposalForm';
import { LozaConcreteApp } from './components/loza-dms/LozaConcreteApp';
import { calculateStatus, isWithinUrgentThreshold } from './utils/permitUtils';
import { 
  LayoutDashboard, 
  Plus, 
  Building2, 
  HelpCircle, 
  FileText, 
  HardHat, 
  Settings, 
  LogOut, 
  Search, 
  Menu, 
  X, 
  Bell, 
  Sun, 
  Moon,
  BarChart3,
  Store,
  Shield,
  AlertCircle,
  ClipboardList,
  BarChart2,
  Truck, 
  Wrench, 
  Users, 
  Contact,
  FileSignature
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState('landing');
  const [permits, setPermits] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPermit, setEditingPermit] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [editingContractor, setEditingContractor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [editingVendor, setEditingVendor] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [editingTruck, setEditingTruck] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isCityFormModal, setIsCityFormModal] = useState(false);
  const [isContractorFormModal, setIsContractorFormModal] = useState(false);
  const [isNewContractorModalOpen, setIsNewContractorModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [editingProposal, setEditingProposal] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load permits from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [permitsRes, contractorsRes, vendorsRes, trucksRes, maintenanceRes, clientsRes, employeesRes, proposalsRes] = await Promise.all([
          fetch('/api/permits'),
          fetch('/api/contractors'),
          fetch('/api/vendors'),
          fetch('/api/trucks'),
          fetch('/api/maintenance'),
          fetch('/api/clients'),
          fetch('/api/employees'),
          fetch('/api/proposals')
        ]);

        if (!permitsRes.ok || !contractorsRes.ok || !vendorsRes.ok || !trucksRes.ok || !maintenanceRes.ok || !clientsRes.ok || !employeesRes.ok || !proposalsRes.ok) {
          throw new Error('Server responded with an error');
        }

        const permitsData = await permitsRes.json();
        const contractorsData = await contractorsRes.json();
        const vendorsData = await vendorsRes.json();
        const trucksData = await trucksRes.json();
        const maintenanceData = await maintenanceRes.json();
        const clientsData = await clientsRes.json();
        const employeesData = await employeesRes.json();
        const proposalsData = await proposalsRes.json();
        
        if (!Array.isArray(permitsData) || !Array.isArray(contractorsData) || !Array.isArray(vendorsData) || !Array.isArray(trucksData) || !Array.isArray(maintenanceData) || !Array.isArray(clientsData) || !Array.isArray(employeesData) || !Array.isArray(proposalsData)) {
          throw new Error('Server returned invalid data format');
        }

        // If permits API is empty, check for legacy localStorage data
        if (permitsData.length === 0) {
          const saved = localStorage.getItem('permits');
          if (saved) {
            const legacyData = JSON.parse(saved);
            if (Array.isArray(legacyData) && legacyData.length > 0) {
              console.log('Migrating legacy localStorage data to backend...');
              await saveToBackend(legacyData);
              setPermits(legacyData);
            }
          }
        } else {
          setPermits(permitsData);
        }

        // If contractors API is empty, derive from permits if possible
        if (contractorsData.length === 0 && permitsData.length > 0) {
          const derived = Array.from(new Map(permitsData.map(p => [p.contractorName, { 
            id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
            name: p.contractorName, 
            phone: p.contractorPhone, 
            email: p.contractorEmail,
            createdAt: new Date().toISOString()
          }])).values()).filter(c => c.name);
          
          if (derived.length > 0) {
            console.log('Populating contractors from existing permits...');
            await saveContractorsToBackend(derived);
            setContractors(derived);
          }
        } else {
          setContractors(contractorsData);
        }

        setVendors(vendorsData);
        setTrucks(trucksData);
        setMaintenance(maintenanceData);
        setClients(clientsData);
        setEmployees(employeesData);
        setProposals(proposalsData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to connect to backend server. Is it running?');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const saveToBackend = async (data) => {
    try {
      await fetch('/api/permits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save permits:', err);
      setError('Connection lost! Your changes might not have been saved to disk.');
    }
  };

  const saveContractorsToBackend = async (data) => {
    try {
      await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save contractors:', err);
      setError('Connection lost! Your contractor changes might not have been saved.');
    }
  };

  const saveVendorsToBackend = async (data) => {
    try {
      await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save vendors:', err);
      setError('Connection lost! Your vendor changes might not have been saved.');
    }
  };

  const saveTrucksToBackend = async (data) => {
    try {
      await fetch('/api/trucks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save trucks:', err);
      setError('Connection lost! Your truck changes might not have been saved.');
    }
  };

  const saveMaintenanceToBackend = async (data) => {
    try {
      await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save maintenance:', err);
      setError('Connection lost! Your maintenance changes might not have been saved.');
    }
  };

  const saveClientsToBackend = async (data) => {
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save clients:', err);
      setError('Connection lost! Your client changes might not have been saved.');
    }
  };

  const saveEmployeesToBackend = async (data) => {
    try {
      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save employees:', err);
      setError('Connection lost! Your employee changes might not have been saved.');
    }
  };

  const saveProposalsToBackend = async (data) => {
    try {
      await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to save proposals:', err);
      setError('Connection lost! Your proposal changes might not have been saved.');
    }
  };

  useEffect(() => {
    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (isLoading) return;

    // Recalculate statuses and normalize
    const updatedPermits = permits.map(p => ({
      ...p,
      status: calculateStatus(p.submissionDate, p.expirationDate)
    }));
    
    // Crucial: Only sync if internal state changed to avoid infinite cycles
    // or if this is the first real load after migration/fetch
    const hasChanges = JSON.stringify(updatedPermits) !== JSON.stringify(permits);
    
    if (hasChanges) {
      setPermits(updatedPermits);
      saveToBackend(updatedPermits);
    }
  }, [permits, isLoading]);

  const handleAddPermit = (initialCity = '', isContractorOnly = false) => {
    // Robust check: if called as an event handler, initialCity will be the event object
    const city = typeof initialCity === 'string' ? initialCity : '';
    setIsCityFormModal(city !== '');
    setIsContractorFormModal(isContractorOnly === true); // Ensure boolean
    setEditingPermit({
      type: isContractorOnly === true ? 'Contractor Registration' : '',
      city: isContractorOnly === true ? 'N/A' : city,
      permitId: isContractorOnly === true ? `REG-${Date.now().toString().slice(-4)}` : '',
      contractorName: '',
      contractorPhone: '',
      contractorEmail: '',
      buildingDept: '',
      buildingDeptEmail: '',
      buildingDeptPhone: '',
      publicWorks: '',
      businessLicense: '',
      isCityForm: city !== '',
      isContractorForm: isContractorOnly === true,
      submissionDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    });
    setIsFormOpen(true);
  };

  const handleEditPermit = (permit) => {
    setIsCityFormModal(!!permit.isCityForm);
    setIsContractorFormModal(!!permit.isContractorForm);
    setEditingPermit(permit);
    setIsFormOpen(true);
  };

  const handleDeletePermit = (id) => {
    if (window.confirm('Are you sure you want to delete this permit?')) {
      setPermits(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSavePermit = (formData) => {
    if (formData.id) {
      setPermits(prev => prev.map(p => p.id === formData.id ? { ...formData, id: p.id } : p));
    } else {
      setPermits(prev => [...prev, { ...formData, id: Date.now().toString() }]);
    }
    setIsFormOpen(false);
    setEditingPermit(null);
  };

  const handleAddContractor = (contractor = null) => {
    setEditingContractor(contractor);
    setIsNewContractorModalOpen(true);
  };

  const handleSaveContractor = (contractorData) => {
    let updatedContractors;
    if (editingContractor) {
      // Update existing contractor
      updatedContractors = contractors.map(c => 
        c.id === editingContractor.id ? { ...c, ...contractorData } : c
      );
    } else {
      // Create new contractor
      const newContractor = {
        ...contractorData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedContractors = [...contractors, newContractor];
    }
    setContractors(updatedContractors);
    saveContractorsToBackend(updatedContractors);
    setIsNewContractorModalOpen(false);
    setEditingContractor(null);
  };

  const handleAddVendor = (vendor = null) => {
    setEditingVendor(vendor);
    setIsVendorModalOpen(true);
  };

  const handleSaveVendor = (vendorData) => {
    let updatedVendors;
    if (editingVendor) {
      updatedVendors = vendors.map(v => 
        v.id === editingVendor.id ? { ...v, ...vendorData } : v
      );
    } else {
      const newVendor = {
        ...vendorData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedVendors = [...vendors, newVendor];
    }
    setVendors(updatedVendors);
    saveVendorsToBackend(updatedVendors);
    setIsVendorModalOpen(false);
    setEditingVendor(null);
  };

  const handleAddTruck = (truck = null) => {
    setEditingTruck(truck);
    setIsTruckModalOpen(true);
  };

  const handleSaveTruck = (truckData) => {
    let updatedTrucks;
    if (editingTruck) {
      updatedTrucks = trucks.map(t => 
        t.id === editingTruck.id ? { ...t, ...truckData } : t
      );
    } else {
      const newTruck = {
        ...truckData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedTrucks = [...trucks, newTruck];
    }
    setTrucks(updatedTrucks);
    saveTrucksToBackend(updatedTrucks);
    setIsTruckModalOpen(false);
    setEditingTruck(null);
  };

  const handleAddMaintenance = (record = null) => {
    setEditingMaintenance(record);
    setIsMaintenanceModalOpen(true);
  };

  const handleSaveMaintenance = (maintenanceData) => {
    let updatedMaintenance;
    if (editingMaintenance) {
      updatedMaintenance = maintenance.map(m => 
        m.id === editingMaintenance.id ? { ...m, ...maintenanceData } : m
      );
    } else {
      const newRecord = {
        ...maintenanceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedMaintenance = [...maintenance, newRecord];
    }
    setMaintenance(updatedMaintenance);
    saveMaintenanceToBackend(updatedMaintenance);
    setIsMaintenanceModalOpen(false);
    setEditingMaintenance(null);
  };

  const handleAddClient = (client = null) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (clientData) => {
    let updatedClients;
    if (editingClient) {
      updatedClients = clients.map(c => 
        c.id === editingClient.id ? { ...c, ...clientData } : c
      );
    } else {
      const newClient = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedClients = [...clients, newClient];
    }
    setClients(updatedClients);
    saveClientsToBackend(updatedClients);
    setIsClientModalOpen(false);
    setEditingClient(null);
  };

  const handleAddEmployee = (employee = null) => {
    setEditingEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (employeeData) => {
    let updatedEmployees;
    if (editingEmployee) {
      updatedEmployees = employees.map(e => 
        e.id === editingEmployee.id ? { ...e, ...employeeData } : e
      );
    } else {
      const newEmployee = {
        ...employeeData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedEmployees = [...employees, newEmployee];
    }
    setEmployees(updatedEmployees);
    saveEmployeesToBackend(updatedEmployees);
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const handleAddProposal = (proposal = null) => {
    setEditingProposal(proposal);
    setIsProposalModalOpen(true);
  };

  const handleSaveProposal = (proposalData) => {
    let updatedProposals;
    if (editingProposal) {
      updatedProposals = proposals.map(p => 
        p.id === editingProposal.id ? { ...p, ...proposalData } : p
      );
    } else {
      const newProposal = {
        ...proposalData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedProposals = [...proposals, newProposal];
    }
    setProposals(updatedProposals);
    saveProposalsToBackend(updatedProposals);
    setIsProposalModalOpen(false);
    setEditingProposal(null);
  };

  const alertCount = permits.filter(p => 
    isWithinUrgentThreshold(p.submissionDate) || isWithinUrgentThreshold(p.expirationDate)
  ).length;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            permits={permits} 
            onAddPermit={handleAddPermit}
            onEditPermit={handleEditPermit}
            onDeletePermit={handleDeletePermit}
          />
        );
      case 'permits':
        return (
          <AllPermits 
            permits={permits}
            onAddPermit={handleAddPermit}
            onEditPermit={handleEditPermit}
            onDeletePermit={handleDeletePermit}
          />
        );
      case 'city-permits':
        return (
          <CityPermits 
            permits={permits}
            onAddPermit={handleAddPermit}
            onEditPermit={handleEditPermit}
            onDeletePermit={handleDeletePermit}
          />
        );
      case 'alerts':
        return (
          <Alerts 
            permits={permits} 
            onEditPermit={handleEditPermit}
          />
        );
      case 'stats':
        return <Stats permits={permits} />;
      case 'reports':
        return <ReportBuilder permits={permits} />;
      case 'contractors':
        return (
          <Contractors 
            permits={permits} 
            contractors={contractors}
            onEditPermit={handleEditPermit}
            onDeletePermit={handleDeletePermit}
            onRegisterContractor={handleAddContractor}
            onEditContractor={handleAddContractor}
          />
        );
      case 'vendors':
        return (
          <Vendors 
            vendors={vendors}
            onRegisterVendor={handleAddVendor}
            onEditVendor={handleAddVendor}
          />
        );
      case 'trucks':
        return (
          <Trucks 
            trucks={trucks}
            onRegisterTruck={handleAddTruck}
            onEditTruck={handleAddTruck}
          />
        );
      case 'maintenance':
        return (
          <TruckMaintenance 
            maintenance={maintenance}
            trucks={trucks}
            onRegisterMaintenance={handleAddMaintenance}
            onEditMaintenance={handleAddMaintenance}
          />
        );
      case 'clients':
        return (
          <Clients 
            clients={clients}
            onRegisterClient={handleAddClient}
            onEditClient={handleAddClient}
          />
        );
      case 'employees':
        return (
          <Employees 
            employees={employees}
            onRegisterEmployee={handleAddEmployee}
            onEditEmployee={handleAddEmployee}
          />
        );
      case 'proposals':
        return (
          <Proposals 
            proposals={proposals}
            onRegisterProposal={handleAddProposal}
            onEditProposal={handleAddProposal}
            onOpenLozaDMS={() => setCurrentView('loza-select')}
          />
        );
      case 'loza-select':
        return (
          <div className="max-w-2xl mx-auto mt-20">
            <button 
              onClick={() => setCurrentView('proposals')}
              className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-8 transition-colors"
            >
              ← Back to Proposals
            </button>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Loza DMS</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">Select a profile to create documents</p>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentView('loza-isidro')}
                className="glass-card text-left group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-700 flex items-center justify-center mb-4 text-white text-lg font-bold">IL</div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Isidro Loza</h3>
                <p className="text-xs text-[var(--muted-foreground)]">(310) 994-8152</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-3">Proposals, Invoices, Receipts & Terms</p>
              </button>
              <button
                onClick={() => setCurrentView('loza-alan')}
                className="glass-card text-left group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-600 flex items-center justify-center mb-4 text-white text-lg font-bold">AK</div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Alan Kester</h3>
                <p className="text-xs text-[var(--muted-foreground)]">(310) 977-4804</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-3">Proposals, Invoices, Receipts & Terms</p>
              </button>
            </div>
          </div>
        );
      case 'loza-isidro':
        return <LozaConcreteApp onBack={() => setCurrentView('loza-select')} profileKey="isidro" />;
      case 'loza-alan':
        return <LozaConcreteApp onBack={() => setCurrentView('loza-select')} profileKey="alan" />;
      case 'landing':
        return <LandingPage onEnter={() => setCurrentView('dashboard')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Sidebar - Hidden on Landing Page */}
      {currentView !== 'landing' && (
        <aside className="w-20 lg:w-64 border-r border-[var(--border)] flex flex-col items-center lg:items-stretch py-8 glass overflow-hidden transition-all duration-300 animate-in slide-in-from-left-4 duration-500">
          <div className="px-6 mb-12 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
              <Shield className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 dark:from-white to-slate-500 dark:to-slate-400 hidden lg:block">PermitPro</span>
          </div>

          {error && (
            <div className="mx-4 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] text-red-100 font-medium leading-tight">{error}</p>
            </div>
          )}

          <nav className="flex-1 px-4 space-y-2">
            <NavLink 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')}
            />
            <NavLink 
              icon={FileSignature} 
              label="Proposals" 
              active={currentView === 'proposals'} 
              onClick={() => setCurrentView('proposals')}
            />
            <NavLink 
              icon={FileText} 
              label="All Permits" 
              active={currentView === 'permits'} 
              onClick={() => setCurrentView('permits')}
            />
            <NavLink 
              icon={HardHat} 
              label="Contractors" 
              active={currentView === 'contractors'} 
              onClick={() => setCurrentView('contractors')}
            />
            <NavLink 
              icon={Building2} 
              label="City Forms" 
              active={currentView === 'city-permits'} 
              onClick={() => setCurrentView('city-permits')}
            />
            <NavLink 
              icon={Store} 
              label="Vendors" 
              active={currentView === 'vendors'} 
              onClick={() => setCurrentView('vendors')}
            />
            <NavLink 
              icon={Truck} 
              label="Trucks" 
              active={currentView === 'trucks'} 
              onClick={() => setCurrentView('trucks')}
            />
            <NavLink 
              icon={Wrench} 
              label="Maintenance" 
              active={currentView === 'maintenance'} 
              onClick={() => setCurrentView('maintenance')}
            />
            <NavLink 
              icon={Users} 
              label="Clients" 
              active={currentView === 'clients'} 
              onClick={() => setCurrentView('clients')}
            />
            <NavLink 
              icon={Contact} 
              label="Employees" 
              active={currentView === 'employees'} 
              onClick={() => setCurrentView('employees')}
            />
            <NavLink 
              icon={Bell} 
              label="Alerts" 
              badge={alertCount > 0 ? alertCount.toString() : null} 
              active={currentView === 'alerts'}
              onClick={() => setCurrentView('alerts')}
            />
            <NavLink 
              icon={BarChart2} 
              label="Stats & Analysis" 
              active={currentView === 'stats'} 
              onClick={() => setCurrentView('stats')}
            />
            <NavLink 
              icon={ClipboardList} 
              label="Report Builder" 
              active={currentView === 'reports'} 
              onClick={() => setCurrentView('reports')}
            />
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white/5 hover:text-slate-200 rounded-xl transition-all"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium hidden lg:block">Theme</span>
            </button>
            <NavLink icon={Settings} label="Settings" />
          </nav>

          <div className="px-4 mt-auto space-y-2">
            {isLoading && (
               <div className="px-4 py-2 flex items-center gap-3 text-primary-400">
                 <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-xs font-medium">Syncing...</span>
               </div>
            )}
            <button 
              onClick={() => {
                if (window.confirm('This will wipe ALL permit data from the server. Are you sure?')) {
                  setPermits([]);
                  localStorage.clear();
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
            >
              <AlertCircle size={20} />
              <span className="text-sm font-medium hidden lg:block">Clear All Data</span>
            </button>
            <NavLink icon={HelpCircle} label="Help Center" />
            <div className="mt-8 p-4 glass-card bg-primary-500/5 border-primary-500/20 hidden lg:block">
              <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Storage</p>
              <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 w-1/4 rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Local Storage (Active)</p>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${currentView !== 'landing' ? 'px-6 py-12 lg:px-12' : ''}`}>
        <div className={currentView !== 'landing' ? "max-w-7xl mx-auto" : ""}>
          {renderView()}
        </div>
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <PermitForm 
          permit={editingPermit} 
          isCityForm={isCityFormModal}
          isContractorForm={isContractorFormModal}
          contractors={contractors}
          onSave={handleSavePermit} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      {/* Contractor Selection Form */}
      {isNewContractorModalOpen && (
        <ContractorForm 
          contractor={editingContractor}
          onSave={handleSaveContractor}
          onCancel={() => {
            setIsNewContractorModalOpen(false);
            setEditingContractor(null);
          }}
        />
      )}

      {/* Vendor Form Modal */}
      {isVendorModalOpen && (
        <VendorForm 
          vendor={editingVendor}
          onSave={handleSaveVendor}
          onCancel={() => {
            setIsVendorModalOpen(false);
            setEditingVendor(null);
          }}
        />
      )}

      {/* Truck Form Modal */}
      {isTruckModalOpen && (
        <TruckForm 
          truck={editingTruck}
          onSave={handleSaveTruck}
          onCancel={() => {
            setIsTruckModalOpen(false);
            setEditingTruck(null);
          }}
        />
      )}

      {/* Maintenance Form Modal */}
      {isMaintenanceModalOpen && (
        <MaintenanceForm 
          record={editingMaintenance}
          trucks={trucks}
          onSave={handleSaveMaintenance}
          onCancel={() => {
            setIsMaintenanceModalOpen(false);
            setEditingMaintenance(null);
          }}
        />
      )}

      {/* Client Form Modal */}
      {isClientModalOpen && (
        <ClientForm 
          client={editingClient}
          onSave={handleSaveClient}
          onCancel={() => {
            setIsClientModalOpen(false);
            setEditingClient(null);
          }}
        />
      )}

      {/* Employee Form Modal */}
      {isEmployeeModalOpen && (
        <EmployeeForm 
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onCancel={() => {
            setIsEmployeeModalOpen(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {/* Proposal Form Modal */}
      {isProposalModalOpen && (
        <ProposalForm 
          proposal={editingProposal}
          clients={clients}
          contractors={contractors}
          onSave={handleSaveProposal}
          onCancel={() => {
            setIsProposalModalOpen(false);
            setEditingProposal(null);
          }}
        />
      )}
    </div>
  );
}

const NavLink = ({ icon: Icon, label, active, badge, onClick }) => ( // eslint-disable-line no-unused-vars
  <button 
    onClick={(e) => {
      e.preventDefault();
      onClick?.();
    }}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold' : 'text-slate-600 dark:text-slate-500 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'}`}
  >
    <Icon size={20} className={active ? 'text-primary-400' : 'group-hover:text-primary-300'} />
    <span className="font-medium hidden lg:block">{label}</span>
    {badge && <span className="ml-auto bg-primary-600 text-white text-[10px] px-2 py-0.5 rounded-full hidden lg:block">{badge}</span>}
  </button>
);

export default App;
