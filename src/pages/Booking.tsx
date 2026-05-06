import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { AppointmentStatus, PatientProfile } from '../types';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

const DOCTORS = [
  { id: '1', name: 'Maria Clara Santos', specialty: 'General Physician', image: 'https://i.pravatar.cc/150?u=doc1' },
  { id: '2', name: 'Jose Dela Cruz', specialty: 'Dentist', image: 'https://i.pravatar.cc/150?u=doc2' },
  { id: '3', name: 'Andres Mapue', specialty: 'Dermatologist', image: 'https://i.pravatar.cc/150?u=doc3' },
  { id: '4', name: 'Liza Soberano', specialty: 'Pediatrician', image: 'https://i.pravatar.cc/150?u=doc4' },
];

const SERVICES = [
  { id: '1', name: 'General Consultation', duration: '30 min', price: '₱500' },
  { id: '2', name: 'Follow-up Visit', duration: '15 min', price: '₱300' },
  { id: '3', name: 'Deep Cleaning', duration: '60 min', price: '₱1,200' },
  { id: '4', name: 'Skin Examination', duration: '30 min', price: '₱800' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

const Booking: React.FC = () => {
  const [step, setStep] = React.useState(1);
  const [user, setUser] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<PatientProfile | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const navigate = useNavigate();

  const [selection, setSelection] = React.useState({
    doctor: DOCTORS[0],
    service: SERVICES[0],
    date: '',
    time: '',
    notes: ''
  });

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, 'patients', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as PatientProfile);
        }
      } else {
        // Allow browsing but force login on confirm
      }
    });
    return () => unsubscribe();
  }, []);

  const handleConfirm = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: profile?.name || user.displayName || 'Guest User',
        doctorName: selection.doctor.name,
        doctorSpecialty: selection.doctor.specialty,
        service: selection.service.name,
        date: selection.date,
        time: selection.time,
        notes: selection.notes,
        status: AppointmentStatus.PENDING,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'appointments');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1e2e4d] mb-2 text-center lg:text-left">Select a Specialist</h2>
              <p className="text-[#6e84a3] text-center lg:text-left">Choose the healthcare professional you'd like to see.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOCTORS.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => { setSelection({...selection, doctor: doc}); setStep(2); }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${selection.doctor.id === doc.id ? 'border-[#2C7BE5] bg-[#2C7BE5]/5' : 'border-[#e3ebf6] hover:border-gray-300 bg-white'}`}
                >
                  <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-[#1e2e4d]">Dr. {doc.name}</p>
                    <p className="text-sm text-[#6e84a3]">{doc.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1e2e4d] mb-2">Select Service</h2>
              <p className="text-[#6e84a3]">What kind of care do you need today?</p>
            </div>
            <div className="space-y-3">
              {SERVICES.map((srv) => (
                <div 
                  key={srv.id}
                  onClick={() => { setSelection({...selection, service: srv}); setStep(3); }}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${selection.service.id === srv.id ? 'border-[#2C7BE5] bg-[#2C7BE5]/5' : 'border-[#e3ebf6] hover:border-gray-300 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#2C7BE5]">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1e2e4d]">{srv.name}</p>
                      <p className="text-sm text-[#6e84a3]">{srv.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1e2e4d]">{srv.price}</p>
                    <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[#6e84a3] hover:text-[#2C7BE5] transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Change Doctor
            </button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#1e2e4d] mb-2">Pick a Date</h2>
                  <input 
                    type="date" 
                    onChange={(e) => setSelection({...selection, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full h-12 px-4 bg-white border-2 border-[#e3ebf6] rounded-xl outline-none focus:border-[#2C7BE5] transition-all"
                  />
                </div>
                
                {selection.date && (
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#1e2e4d] mb-4">Available Time</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelection({...selection, time: slot})}
                          className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${selection.time === slot ? 'bg-[#2C7BE5] border-[#2C7BE5] text-white shadow-lg' : 'bg-white border-[#e3ebf6] text-[#6e84a3] hover:border-gray-300'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:w-80 bg-[#1e2e4d] rounded-3xl p-6 text-white self-start sticky top-24">
                <h3 className="text-xl font-serif font-bold mb-6 pb-4 border-b border-white/10">Booking Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Specialist:</span>
                    <span className="font-bold">Dr. {selection.doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service:</span>
                    <span className="font-bold">{selection.service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-bold">{selection.service.duration}</span>
                  </div>
                  {selection.date && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="font-bold">{new Date(selection.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selection.time && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="font-bold">{selection.time}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-white/10 flex justify-between text-lg">
                    <span className="font-serif">Total:</span>
                    <span className="font-bold text-[#00C9A7]">{selection.service.price}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleConfirm}
                  disabled={!selection.date || !selection.time || submitting}
                  className="w-full btn btn-accent mt-8 py-4 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : (user ? 'Confirm Booking' : 'Log in to Book')}
                </button>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[#6e84a3] hover:text-[#2C7BE5] transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-green-100"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1e2e4d] mb-4">Appointment Scheduled!</h2>
          <p className="text-[#6e84a3] mb-8 leading-relaxed">
            Your appointment with <strong>Dr. {selection.doctor.name}</strong> on <strong>{new Date(selection.date).toLocaleDateString()}</strong> at <strong>{selection.time}</strong> has been successfully booked.
          </p>
          <div className="text-sm text-[#6e84a3] animate-pulse">Redirecting to your dashboard...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white border-b border-[#e3ebf6] sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-[#2C7BE5] rounded-lg flex items-center justify-center text-white font-bold font-serif transition-transform group-hover:scale-105">C</div>
            <span className="text-xl font-serif font-bold text-[#1e2e4d]">ClinicBook</span>
          </Link>
          
          <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest hidden md:flex">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#2C7BE5]' : 'text-gray-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-[#2C7BE5]' : 'border-gray-200'}`}>1</span>
              Specialist
            </div>
            <div className="w-8 h-px bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#2C7BE5]' : 'text-gray-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-[#2C7BE5]' : 'border-gray-200'}`}>2</span>
              Service
            </div>
            <div className="w-8 h-px bg-gray-200"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#2C7BE5]' : 'text-gray-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-[#2C7BE5]' : 'border-gray-200'}`}>3</span>
              Schedule
            </div>
          </div>

          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <AlertCircle className="w-6 h-6 text-[#6e84a3]" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Booking;
