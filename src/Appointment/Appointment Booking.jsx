import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, ChevronRight, Check } from 'lucide-react';

export default function AppointmentBooking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    reason: ''
  });

  const departments = [
    { id: 1, name: 'Cardiology', icon: '❤️' },
    { id: 2, name: 'Orthopedics', icon: '🦴' },
    { id: 3, name: 'Pediatrics', icon: '👶' },
    { id: 4, name: 'Neurology', icon: '🧠' },
    { id: 5, name: 'Oncology', icon: '🎗️' },
    { id: 6, name: 'Dermatology', icon: '🩺' },
    { id: 7, name: 'Gynecology', icon: '👩‍⚕️' },
    { id: 8, name: 'ENT', icon: '👂' },
    { id: 9, name: 'Gastroenterology', icon: '🫀' },
    { id: 10, name: 'Urology', icon: '💧' },
    { id: 11, name: 'Ophthalmology', icon: '👁️' },
    { id: 12, name: 'Psychiatry', icon: '🧘' }
  ];

  const doctors = {
    'Cardiology': ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'],
    'Orthopedics': ['Dr. Robert Taylor', 'Dr. Jennifer Lee', 'Dr. Mark Williams'],
    'Pediatrics': ['Dr. Amanda Brown', 'Dr. Christopher Davis', 'Dr. Maria Garcia'],
    'Neurology': ['Dr. David Kumar', 'Dr. Lisa Anderson', 'Dr. James Park'],
    'Oncology': ['Dr. Rachel Foster', 'Dr. Steven Mitchell', 'Dr. Patricia Wright'],
    'Dermatology': ['Dr. Susan Miller', 'Dr. Daniel Wilson', 'Dr. Rachel Moore'],
    'Gynecology': ['Dr. Elizabeth Turner', 'Dr. Jessica Collins', 'Dr. Margaret Hill'],
    'ENT': ['Dr. Anthony Scott', 'Dr. Nancy Phillips', 'Dr. Brian Carter'],
    'Gastroenterology': ['Dr. Thomas White', 'Dr. Patricia Hall', 'Dr. Kevin Martin'],
    'Urology': ['Dr. Richard Adams', 'Dr. Laura Nelson', 'Dr. George Campbell'],
    'Ophthalmology': ['Dr. Helen Parker', 'Dr. Charles Evans', 'Dr. Michelle Roberts'],
    'Psychiatry': ['Dr. William Green', 'Dr. Diana Brooks', 'Dr. Andrew Peterson']
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    alert('Appointment booked successfully! You will receive a confirmation email shortly.');
    setFormData({
      department: '',
      doctor: '',
      date: '',
      time: '',
      patientName: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      reason: ''
    });
    setStep(1);
  };

  const canProceed = () => {
    if (step === 1) return formData.department && formData.doctor;
    if (step === 2) return formData.date && formData.time;
    if (step === 3) return formData.patientName && formData.age && formData.gender && formData.phone;
    return false;
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
        
        .appointment-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #cffafe 100%);
          padding: 2rem 1rem;
        }
        
        .appointment-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .subtitle {
          color: #6b7280;
          font-size: 1.1rem;
        }
        
        .progress-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .progress-step {
          display: flex;
          align-items: center;
        }
        
        .step-circle {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          background-color: #e5e7eb;
          color: #6b7280;
          transition: all 0.3s ease;
        }
        
        .step-circle.active {
          background-color: #2563eb;
          color: white;
        }
        
        .step-label {
          margin-left: 0.5rem;
        }
        
        .step-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
        }
        
        .step-text.active {
          color: #2563eb;
        }
        
        .step-line {
          width: 4rem;
          height: 0.25rem;
          margin: 0 0.5rem;
          background-color: #e5e7eb;
          transition: all 0.3s ease;
        }
        
        .step-line.active {
          background-color: #2563eb;
        }
        
        .main-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 2rem;
        }
        
        .step-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .step-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }
        
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.75rem;
        }
        
        .department-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        @media (min-width: 768px) {
          .department-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .department-card {
          padding: 1rem;
          border-radius: 0.5rem;
          border: 2px solid #e5e7eb;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .department-card:hover {
          border-color: #93c5fd;
        }
        
        .department-card.selected {
          border-color: #2563eb;
          background-color: #eff6ff;
        }
        
        .department-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .department-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
        }
        
        .doctor-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .doctor-card {
          width: 100%;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 2px solid #e5e7eb;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .doctor-card:hover {
          border-color: #93c5fd;
        }
        
        .doctor-card.selected {
          border-color: #2563eb;
          background-color: #eff6ff;
        }
        
        .doctor-info {
          display: flex;
          align-items: center;
        }
        
        .doctor-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.25rem;
        }
        
        .doctor-details {
          margin-left: 1rem;
          text-align: left;
        }
        
        .doctor-name {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        
        .doctor-specialty {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .date-input, .text-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        
        .date-input:focus, .text-input:focus {
          outline: none;
          border-color: #2563eb;
        }
        
        .time-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        
        @media (min-width: 768px) {
          .time-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .time-slot {
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 2px solid #e5e7eb;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s ease;
        }
        
        .time-slot:hover {
          border-color: #93c5fd;
        }
        
        .time-slot.selected {
          border-color: #2563eb;
          background-color: #eff6ff;
          color: #1e40af;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .textarea-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s ease;
        }
        
        .textarea-input:focus {
          outline: none;
          border-color: #2563eb;
        }
        
        .button-container {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-secondary {
          background-color: #e5e7eb;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background-color: #d1d5db;
        }
        
        .btn-primary {
          background-color: #2563eb;
          color: white;
          margin-left: auto;
        }
        
        .btn-primary:hover {
          background-color: #1d4ed8;
        }
        
        .btn-success {
          background-color: #16a34a;
          color: white;
          margin-left: auto;
          padding: 0.75rem 2rem;
        }
        
        .btn-success:hover {
          background-color: #15803d;
        }
        
        .btn.disabled {
          background-color: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .summary-card {
          margin-top: 1.5rem;
          background-color: #eff6ff;
          border-radius: 0.75rem;
          padding: 1.5rem;
          border: 2px solid #bfdbfe;
        }
        
        .summary-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }
        
        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .summary-label {
          font-weight: 500;
        }
        
        @media (max-width: 640px) {
          .title {
            font-size: 2rem;
          }
          
          .main-card {
            padding: 1.5rem;
          }
          
          .step-label {
            display: none;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="appointment-container">
        <div className="appointment-wrapper">
          <div className="header">
            <h1 className="title">Book an Appointment</h1>
            <p className="subtitle">Schedule your visit with our expert doctors</p>
          </div>

          <div className="progress-container">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="progress-step">
                  <div className={`step-circle ${step >= s ? 'active' : ''}`}>
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  <div className="step-label">
                    <p className={`step-text ${step >= s ? 'active' : ''}`}>
                      {s === 1 ? 'Select' : s === 2 ? 'Schedule' : 'Details'}
                    </p>
                  </div>
                </div>
                {s < 3 && <div className={`step-line ${step > s ? 'active' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="main-card">
            <div className="step-content">
              {step === 1 && (
                <>
                  <h2 className="step-title">Select Department & Doctor</h2>
                  
                  <div>
                    <label className="label">Department</label>
                    <div className="department-grid">
                      {departments.map(dept => (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => handleInputChange('department', dept.name)}
                          className={`department-card ${formData.department === dept.name ? 'selected' : ''}`}
                        >
                          <div className="department-icon">{dept.icon}</div>
                          <div className="department-name">{dept.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.department && (
                    <div>
                      <label className="label">Select Doctor</label>
                      <div className="doctor-list">
                        {doctors[formData.department].map(doctor => (
                          <button
                            key={doctor}
                            type="button"
                            onClick={() => handleInputChange('doctor', doctor)}
                            className={`doctor-card ${formData.doctor === doctor ? 'selected' : ''}`}
                          >
                            <div className="doctor-info">
                              <div className="doctor-avatar">
                                {doctor.split(' ')[1][0]}
                              </div>
                              <div className="doctor-details">
                                <p className="doctor-name">{doctor}</p>
                                <p className="doctor-specialty">{formData.department} Specialist</p>
                              </div>
                            </div>
                            {formData.doctor === doctor && <Check className="w-5 h-5 text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="step-title">Select Date & Time</h2>
                  
                  <div>
                    <label className="label">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="date-input"
                    />
                  </div>

                  {formData.date && (
                    <div>
                      <label className="label">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Select Time Slot
                      </label>
                      <div className="time-grid">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleInputChange('time', time)}
                            className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="step-title">Patient Details</h2>
                  
                  <div>
                    <label className="label">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className="text-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-row">
                    <div>
                      <label className="label">Age *</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="text-input"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="label">Gender *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="text-input"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="text-input"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="text-input"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Reason for Visit
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      className="textarea-input"
                      rows="4"
                      placeholder="Brief description of your symptoms or reason for consultation"
                    />
                  </div>
                </>
              )}

              <div className="button-container">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className={`btn ${canProceed() ? 'btn-primary' : 'disabled'}`}
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className={`btn ${canProceed() ? 'btn-success' : 'disabled'}`}
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            </div>
          </div>

          {(formData.department || formData.date || formData.patientName) && (
            <div className="summary-card">
              <h3 className="summary-title">Appointment Summary</h3>
              <div className="summary-content">
                {formData.department && <p><span className="summary-label">Department:</span> {formData.department}</p>}
                {formData.doctor && <p><span className="summary-label">Doctor:</span> {formData.doctor}</p>}
                {formData.date && <p><span className="summary-label">Date:</span> {new Date(formData.date).toLocaleDateString()}</p>}
                {formData.time && <p><span className="summary-label">Time:</span> {formData.time}</p>}
                {formData.patientName && <p><span className="summary-label">Patient:</span> {formData.patientName}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}