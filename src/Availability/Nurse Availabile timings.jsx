import React, { useState } from 'react';
import { UserPlus, Stethoscope, Activity, Clipboard, Calendar } from 'lucide-react';

// Nurses grouped by department, each with timings
const INITIAL_NURSES = {
  'Cardiology': [
    { id: 1, name: 'Nurse Emma Wilson', experience: '8 years', status: 'Available', timing: '9 AM - 5 PM' },
    { id: 2, name: 'Nurse John Martinez', experience: '6 years', status: 'Available', timing: '10 AM - 6 PM' },
    { id: 3, name: 'Nurse Sophie Taylor', experience: '10 years', status: 'Busy', timing: '8 AM - 4 PM' }
  ],
  'Orthopedics': [
    { id: 4, name: 'Nurse Michael Brown', experience: '7 years', status: 'Available', timing: '9 AM - 5 PM' },
    { id: 5, name: 'Nurse Lisa Anderson', experience: '5 years', status: 'Available', timing: '10 AM - 6 PM' },
    { id: 6, name: 'Nurse James Clark', experience: '9 years', status: 'Available', timing: '8 AM - 4 PM' }
  ],
  'Pediatrics': [
    { id: 7, name: 'Nurse Rachel Green', experience: '12 years', status: 'Available', timing: '9 AM - 5 PM' },
    { id: 8, name: 'Nurse David Lee', experience: '4 years', status: 'Available', timing: '10 AM - 6 PM' },
    { id: 9, name: 'Nurse Anna White', experience: '6 years', status: 'Busy', timing: '8 AM - 4 PM' }
  ],
  'Neurology': [
    { id: 10, name: 'Nurse Thomas Miller', experience: '11 years', status: 'Available', timing: '9 AM - 5 PM' },
    { id: 11, name: 'Nurse Sarah Davis', experience: '8 years', status: 'Available', timing: '10 AM - 6 PM' }
  ],
  'Oncology': [
    { id: 12, name: 'Nurse Patricia Moore', experience: '15 years', status: 'Available', timing: '9 AM - 5 PM' },
    { id: 13, name: 'Nurse Robert Garcia', experience: '7 years', status: 'Available', timing: '10 AM - 6 PM' }
  ]
};

const completedPatients = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    department: 'Cardiology',
    doctor: 'Dr. Sarah Johnson',
    treatmentDate: '2025-11-08',
    diagnosis: 'Hypertension management',
    status: 'Treatment Completed'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    department: 'Orthopedics',
    doctor: 'Dr. Robert Taylor',
    treatmentDate: '2025-11-09',
    diagnosis: 'Knee injury recovery',
    status: 'Treatment Completed'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    age: 28,
    gender: 'Male',
    department: 'Pediatrics',
    doctor: 'Dr. Amanda Brown',
    treatmentDate: '2025-11-10',
    diagnosis: 'Routine checkup',
    status: 'Treatment Completed'
  },
  {
    id: 4,
    name: 'Emily Davis',
    age: 55,
    gender: 'Female',
    department: 'Neurology',
    doctor: 'Dr. David Kumar',
    treatmentDate: '2025-11-10',
    diagnosis: 'Migraine treatment',
    status: 'Treatment Completed'
  },
  {
    id: 5,
    name: 'Robert Wilson',
    age: 62,
    gender: 'Male',
    department: 'Cardiology',
    doctor: 'Dr. Michael Chen',
    treatmentDate: '2025-11-09',
    diagnosis: 'Cardiac monitoring post-surgery',
    status: 'Treatment Completed'
  },
  {
    id: 6,
    name: 'Sarah Martinez',
    age: 38,
    gender: 'Female',
    department: 'Oncology',
    doctor: 'Dr. Rachel Foster',
    treatmentDate: '2025-11-08',
    diagnosis: 'Chemotherapy follow-up',
    status: 'Treatment Completed'
  }
];

const groupByDepartment = (patients) => {
  const result = {};
  patients.forEach(p => {
    if (!result[p.department]) result[p.department] = [];
    result[p.department].push(p);
  });
  return result;
};

export default function DoctorPortal() {
  // Nurses will keep status changes in local state!
  const [deptNurses, setDeptNurses] = useState(INITIAL_NURSES);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState({
    careType: '',
    duration: '',
    startDate: '',
    instructions: ''
  });

  const patientsByDept = groupByDepartment(completedPatients);
  const departmentList = Object.keys(patientsByDept);

  // When nurse is assigned, update status only for their department
  const handleNurseAssignment = () => {
    if (selectedPatient && selectedNurse && assignmentDetails.careType && assignmentDetails.duration) {
      alert(`✅ Nurse Successfully Assigned!\n\nPatient: ${selectedPatient.name}\nNurse: ${selectedNurse.name}\nCare Type: ${assignmentDetails.careType}\nDuration: ${assignmentDetails.duration} days\nStart Date: ${assignmentDetails.startDate || 'Today'}\nTiming: ${selectedNurse.timing}`);
      // Nurse shows as Busy now
      setDeptNurses(prev => {
        const updated = { ...prev };
        updated[selectedPatient.department] = updated[selectedPatient.department].map(nurse =>
          nurse.id === selectedNurse.id ? { ...nurse, status: 'Busy' } : nurse
        );
        return updated;
      });
      setSelectedPatient(null);
      setSelectedNurse(null);
      setAssignmentDetails({ careType: '', duration: '', startDate: '', instructions: '' });
    }
  };

  return (
    <>
      <style>{`
      * { box-sizing: border-box; }
      .container { min-height: 100vh; background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #cffafe 100%);
        padding: 2rem 1rem; }
      .wrapper { max-width: 1200px; margin: 0 auto; }
      .header { text-align: center; margin-bottom: 2rem; }
      .title { font-size: 2.5rem; font-weight: bold; color: #1f2937;
        margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
      .subtitle { color: #6b7280; font-size: 1.1rem; }
      .main-card { background: white; border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); padding: 2rem; }
      .step-content { display: flex; flex-direction: column; gap: 1.5rem; }
      .step-title { font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 1rem; }
      .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.75rem; }
      .patient-list { display: flex; flex-direction: column; gap: 0.75rem; }
      .patient-card {
        width: 100%; padding: 1.25rem; border-radius: 0.75rem;
        border: 2px solid #e5e7eb; background: white; cursor: pointer;
        transition: all 0.2s ease; display: flex; align-items: center; justify-content: space-between;
      }
      .patient-card:hover {
        border-color: #93c5fd; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transform: translateY(-2px);
      }
      .patient-info { display: flex; align-items: center; flex: 1; }
      .patient-avatar {
        width: 3.5rem; height: 3.5rem; border-radius: 50%;
        background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: 600; font-size: 1.5rem;
      }
      .patient-details { margin-left: 1rem; text-align: left; flex: 1; }
      .patient-name { font-weight: 600; color: #1f2937; font-size: 1.125rem; margin-bottom: 0.25rem; }
      .patient-meta { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
      .status-badge {
        padding: 0.375rem 0.875rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;
      }
      .status-completed { background-color: #dcfce7; color: #166534; }
      .status-available { background-color: #dcfce7; color: #166534; }
      .status-busy { background-color: #fee2e2; color: #991b1b; }
      .text-input {
        width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb;
        border-radius: 0.5rem; font-size: 1rem; transition: border-color 0.2s ease;
      }
      .text-input:focus { outline: none; border-color: #2563eb; }
      .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .textarea-input {
        width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb;
        border-radius: 0.5rem; font-size: 1rem; font-family: inherit; resize: vertical;
        transition: border-color 0.2s ease;
      }
      .textarea-input:focus { outline: none; border-color: #2563eb; }
      .btn {
        padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 500; font-size: 1rem;
        cursor: pointer; border: none; transition: all 0.2s ease;
        display: flex; align-items: center; gap: 0.5rem;
      }
      .btn-secondary { background-color: #e5e7eb; color: #374151; }
      .btn-secondary:hover { background-color: #d1d5db; }
      .btn-success { background-color: #16a34a; color: white; padding: 0.875rem 2rem; }
      .btn-success:hover { background-color: #15803d; }
      .btn.disabled { background-color: #e5e7eb; color: #9ca3af; cursor: not-allowed; }
      .summary-card {
        background-color: #eff6ff; border-radius: 0.75rem; padding: 1.5rem; border: 2px solid #bfdbfe;
      }
      .summary-title { font-weight: 600; color: #1f2937; margin-bottom: 0.75rem; font-size: 1.125rem; }
      .summary-content { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem; }
      .summary-label { font-weight: 500; }
      .nurse-meta { font-size: 0.85rem; color: #374151; margin-top: 2px; }
      .nurse-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem; }
      @media (min-width: 768px) { .nurse-grid { grid-template-columns: repeat(2, 1fr); } }
      .nurse-card {
        padding: 1.25rem; border-radius: 0.75rem; border: 2px solid #e5e7eb;
        background: white; cursor: pointer; transition: all 0.2s ease;
      }
      .nurse-card:hover { border-color: #93c5fd; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
      .nurse-card.selected { border-color: #2563eb; background-color: #eff6ff; }
      .nurse-card.unavailable { opacity: 0.5; cursor: not-allowed; }
      .nurse-header {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;
      }
      .nurse-name { font-weight: 600; color: #1f2937; font-size: 1rem; }
      .nurse-experience { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
      .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
      .info-text { color: #6b7280; margin-bottom: 1rem; font-size: 0.95rem; }
      @media (max-width: 640px) {
        .title { font-size: 2rem; }
        .main-card { padding: 1.5rem; }
        .form-row { grid-template-columns: 1fr; }
        .patient-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
      }
      `}</style>
      <div className="container">
        <div className="wrapper">
          <div className="header">
            <h1 className="title">
              <Stethoscope className="w-10 h-10" />
              Doctor Portal
            </h1>
            <p className="subtitle">Select a department, assign nurses from that department to patients</p>
          </div>
          <div className="main-card">
            <div className="step-content">
              {!selectedDepartment ? (
                <>
                  <div>
                    <h2 className="step-title">
                      <Activity className="w-6 h-6 inline mr-2" />
                      All Departments
                    </h2>
                    <p className="info-text">Choose a department to view its patients</p>
                  </div>
                  <div className="patient-list">
                    {departmentList.map(depName => (
                      <button
                        key={depName}
                        className="patient-card"
                        type="button"
                        onClick={() => setSelectedDepartment(depName)}
                      >
                        <div className="patient-info">
                          <div className="patient-avatar">{depName[0]}</div>
                          <div className="patient-details">
                            <p className="patient-name">{depName}</p>
                            <p className="patient-meta">
                              {patientsByDept[depName].length} completed patient{patientsByDept[depName].length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )
              : !selectedPatient ? (
                <>
                  <div className="header-row">
                    <h2 className="step-title">
                      <Activity className="w-6 h-6 inline mr-2" />
                      {selectedDepartment} – Completed Patients
                    </h2>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedDepartment(null)}
                    >
                      ← Back to Departments
                    </button>
                  </div>
                  <div className="patient-list">
                    {patientsByDept[selectedDepartment].map(patient => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className="patient-card"
                      >
                        <div className="patient-info">
                          <div className="patient-avatar">{patient.name.split(' ')[0][0]}</div>
                          <div className="patient-details">
                            <p className="patient-name">{patient.name}</p>
                            <p className="patient-meta">
                              Age: {patient.age} • {patient.gender}
                            </p>
                            <p className="patient-meta"><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                            <p className="patient-meta"><strong>Doctor:</strong> {patient.doctor}</p>
                            <p className="patient-meta">Treated on {patient.treatmentDate}</p>
                          </div>
                        </div>
                        <div>
                          <span className="status-badge status-completed">{patient.status}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )
              : (
                <>
                  <div className="header-row">
                    <h2 className="step-title">
                      <UserPlus className="w-6 h-6 inline mr-2" />
                      Assign Nurse for {selectedPatient.name}
                    </h2>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedPatient(null);
                        setSelectedNurse(null);
                        setAssignmentDetails({ careType: '', duration: '', startDate: '', instructions: '' });
                      }}
                    >
                      ← Back to Patients
                    </button>
                  </div>
                  <div className="summary-card" style={{ marginTop: 0 }}>
                    <h3 className="summary-title">Patient Information</h3>
                    <div className="summary-content">
                      <p><span className="summary-label">Name:</span> {selectedPatient.name}</p>
                      <p><span className="summary-label">Age:</span> {selectedPatient.age} • {selectedPatient.gender}</p>
                      <p><span className="summary-label">Department:</span> {selectedPatient.department}</p>
                      <p><span className="summary-label">Diagnosis:</span> {selectedPatient.diagnosis}</p>
                      <p><span className="summary-label">Treatment Date:</span> {selectedPatient.treatmentDate}</p>
                      <p><span className="summary-label">Attending Doctor:</span> {selectedPatient.doctor}</p>
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      <Clipboard className="w-4 h-4 inline mr-2" /> Select Nurse from {selectedDepartment} Department
                    </label>
                    <div className="nurse-grid">
                      {(deptNurses[selectedDepartment] || []).map(nurse => (
                        <button
                          key={nurse.id}
                          type="button"
                          onClick={() => nurse.status === 'Available' && setSelectedNurse(nurse)}
                          className={`nurse-card ${selectedNurse?.id === nurse.id ? 'selected' : ''} ${nurse.status !== 'Available' ? 'unavailable' : ''}`}
                          disabled={nurse.status !== 'Available'}
                        >
                          <div className="nurse-header">
                            <div className="nurse-name">{nurse.name}</div>
                            <span className={`status-badge ${nurse.status === 'Available' ? 'status-available' : 'status-busy'}`}>
                              {nurse.status}
                            </span>
                          </div>
                          <div className="nurse-experience">
                            Experience: {nurse.experience}
                          </div>
                          <div className="nurse-meta">
                            <strong>Timing:</strong> {nurse.timing}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedNurse && (
                    <>
                      <div>
                        <label className="label">Type of Care Required *</label>
                        <select
                          value={assignmentDetails.careType}
                          onChange={e => setAssignmentDetails(prev => ({
                            ...prev, careType: e.target.value
                          }))}
                          className="text-input"
                        >
                          <option value="">Select care type</option>
                          <option value="Post-Operative Care">Post-Operative Care</option>
                          <option value="Medication Administration">Medication Administration</option>
                          <option value="Wound Care">Wound Care</option>
                          <option value="Vitals Monitoring">Vitals Monitoring</option>
                          <option value="Rehabilitation Support">Rehabilitation Support</option>
                          <option value="General Nursing Care">General Nursing Care</option>
                          <option value="IV Therapy">IV Therapy</option>
                          <option value="Pain Management">Pain Management</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <div>
                          <label className="label">Duration (Days) *</label>
                          <input
                            type="number"
                            value={assignmentDetails.duration}
                            onChange={e => setAssignmentDetails(prev => ({
                              ...prev, duration: e.target.value
                            }))}
                            className="text-input"
                            placeholder="e.g., 7"
                            min="1"
                            max="365"
                          />
                        </div>
                        <div>
                          <label className="label">
                            <Calendar className="w-4 h-4 inline mr-2" /> Start Date
                          </label>
                          <input
                            type="date"
                            value={assignmentDetails.startDate}
                            onChange={e => setAssignmentDetails(prev => ({
                              ...prev, startDate: e.target.value
                            }))}
                            className="text-input"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label">Special Instructions & Care Notes</label>
                        <textarea
                          value={assignmentDetails.instructions}
                          onChange={e => setAssignmentDetails(prev => ({
                            ...prev, instructions: e.target.value
                          }))}
                          className="textarea-input"
                          rows="5"
                          placeholder="Enter detailed care instructions including:
• Medication schedule and dosage
• Wound care procedures
• Activity restrictions
• Diet requirements
• Warning signs to monitor
• Emergency contact protocols"
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                          onClick={handleNurseAssignment}
                          disabled={!assignmentDetails.careType || !assignmentDetails.duration}
                          className={`btn ${assignmentDetails.careType && assignmentDetails.duration ? 'btn-success' : 'disabled'}`}
                        >
                          <UserPlus className="w-5 h-5" />
                          Assign Nurse to Patient
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
