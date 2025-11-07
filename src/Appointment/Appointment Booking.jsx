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
    { id: 2, name: 'Neurology', icon: '🧠' },
    { id: 3, name: 'Orthopedics', icon: '🦴' },
    { id: 4, name: 'Pediatrics', icon: '👶' },
    { id: 5, name: 'Dermatology', icon: '🩺' },
    { id: 6, name: 'General Medicine', icon: '⚕️' }
  ];

  const doctors = {
    'Cardiology': ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'],
    'Neurology': ['Dr. David Kumar', 'Dr. Lisa Anderson', 'Dr. James Park'],
    'Orthopedics': ['Dr. Robert Taylor', 'Dr. Jennifer Lee', 'Dr. Mark Williams'],
    'Pediatrics': ['Dr. Amanda Brown', 'Dr. Christopher Davis', 'Dr. Maria Garcia'],
    'Dermatology': ['Dr. Susan Miller', 'Dr. Daniel Wilson', 'Dr. Rachel Moore'],
    'General Medicine': ['Dr. Thomas White', 'Dr. Patricia Hall', 'Dr. Kevin Martin']
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
    // Reset form
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Book an Appointment</h1>
          <p className="text-gray-600">Schedule your visit with our expert doctors</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-sm font-medium ${step >= s ? 'text-blue-600' : 'text-gray-500'}`}>
                    {s === 1 ? 'Select' : s === 2 ? 'Schedule' : 'Details'}
                  </p>
                </div>
              </div>
              {s < 3 && <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div>
            {/* Step 1: Select Department & Doctor */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Department & Doctor</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Department</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {departments.map(dept => (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleInputChange('department', dept.name)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.department === dept.name
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{dept.icon}</div>
                        <div className="text-sm font-medium text-gray-800">{dept.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Doctor</label>
                    <div className="space-y-2">
                      {doctors[formData.department].map(doctor => (
                        <button
                          key={doctor}
                          type="button"
                          onClick={() => handleInputChange('doctor', doctor)}
                          className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                            formData.doctor === doctor
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                              {doctor.split(' ')[1][0]}
                            </div>
                            <div className="ml-4 text-left">
                              <p className="font-medium text-gray-800">{doctor}</p>
                              <p className="text-sm text-gray-600">{formData.department} Specialist</p>
                            </div>
                          </div>
                          {formData.doctor === doctor && <Check className="w-5 h-5 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Date & Time</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {formData.date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleInputChange('time', time)}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            formData.time === time
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Patient Details */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                      placeholder="Age"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Reason for Visit
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    rows="4"
                    placeholder="Brief description of your symptoms or reason for consultation"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`ml-auto px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                    canProceed()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className={`ml-auto px-8 py-3 rounded-lg font-medium transition-colors ${
                    canProceed()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Book Appointment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        {(formData.department || formData.date || formData.patientName) && (
          <div className="mt-6 bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-3">Appointment Summary</h3>
            <div className="space-y-2 text-sm">
              {formData.department && <p><span className="font-medium">Department:</span> {formData.department}</p>}
              {formData.doctor && <p><span className="font-medium">Doctor:</span> {formData.doctor}</p>}
              {formData.date && <p><span className="font-medium">Date:</span> {new Date(formData.date).toLocaleDateString()}</p>}
              {formData.time && <p><span className="font-medium">Time:</span> {formData.time}</p>}
              {formData.patientName && <p><span className="font-medium">Patient:</span> {formData.patientName}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}