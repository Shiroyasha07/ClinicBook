import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  LogOut, 
  Settings, 
  User, 
  Search, 
  Bell, 
  ChevronRight, 
  Plus,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock3,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Appointment, AppointmentStatus, PatientProfile } from '../types';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

const Dashboard: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, 'patients', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as PatientProfile);
        } else {
          // Check if staff
          const staffRef = doc(db, 'staff', u.uid);
          const staffSnap = await getDoc(staffRef);
          if (staffSnap.exists()) {
            setProfile(staffSnap.data() as PatientProfile);
          }
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  React.useEffect(() => {
    if (!user || !profile) return;

    let q;
    if (profile.role === 'patient') {
      q = query(collection(db, 'appointments'), where('patientId', '==', user.uid));
    } else {
      q = collection(db, 'appointments'); // Staff sees all
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appts: Appointment[] = [];
      snapshot.forEach((doc) => {
        appts.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setAppointments(appts.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'appointments');
    });

    return () => unsubscribe();
  }, [user, profile]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const updateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status: newStatus,
        updatedAt: Date.now()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2C7BE5] animate-spin" />
      </div>
    );
  }

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#e3ebf6] flex-col p-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 mb-10 px-2 group cursor-pointer">
          <div className="w-8 h-8 bg-[#2C7BE5] rounded-lg flex items-center justify-center text-white font-bold font-serif transition-transform group-hover:scale-105">C</div>
          <span className="text-xl font-serif font-bold text-[#1e2e4d]">ClinicBook</span>
        </Link>

        <nav className="flex-1 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#2C7BE5]/10 text-[#2C7BE5] rounded-xl font-semibold">
            <BarChart3 className="w-5 h-5" /> Overivew
          </Link>
          <Link to="/booking" className="flex items-center gap-3 px-4 py-3 text-[#6e84a3] hover:bg-gray-50 hover:text-[#1e2e4d] rounded-xl transition-all">
            <Calendar className="w-5 h-5" /> Appointments
          </Link>
          {isStaff && (
            <Link to="/patients" className="flex items-center gap-3 px-4 py-3 text-[#6e84a3] hover:bg-gray-50 hover:text-[#1e2e4d] rounded-xl transition-all">
              <User className="w-5 h-5" /> Patients
            </Link>
          )}
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-[#6e84a3] hover:bg-gray-50 hover:text-[#1e2e4d] rounded-xl transition-all">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>

        <div className="pt-6 border-t border-[#e3ebf6] mt-auto">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-[#2C7BE5] flex items-center justify-center text-white font-bold">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-[#1e2e4d] truncate">{profile?.name}</p>
              <p className="text-xs text-[#6e84a3] uppercase tracking-wider font-bold">{profile?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold"
          >
            <LogOut className="w-5 h-5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#e3ebf6] sticky top-0 z-30">
          <div className="px-6 lg:px-10 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1e2e4d]">
                {isStaff ? 'Clinic Management' : 'My Health Journey'}
              </h1>
              <p className="text-sm text-[#6e84a3]">Welcome back, {profile?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-gray-50 border border-[#e3ebf6] rounded-xl px-4 py-2 w-64">
                <Search className="w-4 h-4 text-[#6e84a3] mr-2" />
                <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-full" />
              </div>
              <button className="w-10 h-10 rounded-full bg-gray-50 border border-[#e3ebf6] flex items-center justify-center relative hover:bg-white transition-all">
                <Bell className="w-5 h-5 text-[#6e84a3]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Visits', value: appointments.length, icon: <CheckCircle className="text-green-500" />, trend: '+12%' },
              { label: 'Upcoming', value: appointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length, icon: <Clock3 className="text-blue-500" />, trend: 'Scheduled' },
              { label: 'Pending', value: appointments.filter(a => a.status === AppointmentStatus.PENDING).length, icon: <Clock className="text-orange-500" />, trend: 'Needs action' },
              { label: 'Cancelled', value: appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length, icon: <XCircle className="text-red-500" />, trend: '-3%' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-[#e3ebf6] shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">{stat.icon}</div>
                  <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">{stat.trend}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1e2e4d]">{stat.value}</h3>
                <p className="text-sm text-[#6e84a3]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Appointments Table */}
          <section className="bg-white rounded-2xl border border-[#e3ebf6] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#e3ebf6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#1e2e4d]">Recent Appointments</h2>
                <p className="text-sm text-[#6e84a3]">Manage and view latest activity</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none btn btn-outline py-2 px-4 h-auto text-sm border-gray-200 text-[#6e84a3] hover:bg-gray-50">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <Link to="/booking" className="flex-1 sm:flex-none btn btn-primary py-2 px-4 h-auto text-sm">
                  <Plus className="w-4 h-4" /> New Booking
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[#6e84a3] text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Patient / Doctor</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3ebf6]">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-[#6e84a3]">
                        <div className="flex flex-col items-center">
                          <Calendar className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium">No appointments found</p>
                          <Link to="/booking" className="text-[#2C7BE5] hover:underline">Book your first visit</Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2C7BE5] flex items-center justify-center font-bold">
                              {isStaff ? appt.patientName?.charAt(0) : appt.doctorName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#1e2e4d]">{isStaff ? appt.patientName : `Dr. ${appt.doctorName}`}</p>
                              <p className="text-xs text-[#6e84a3]">{isStaff ? 'Patient' : 'Attending Doctor'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-[#1e2e4d]">
                            {appt.service}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-[#1e2e4d]">
                            {new Date(appt.date).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-[#6e84a3]">
                            <Clock className="w-3 h-3" /> {appt.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {isStaff && appt.status === AppointmentStatus.PENDING && (
                              <>
                                <button 
                                  onClick={() => updateStatus(appt.id, AppointmentStatus.CONFIRMED)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                  title="Confirm"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => updateStatus(appt.id, AppointmentStatus.CANCELLED)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Cancel"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button className="p-2 text-gray-400 hover:text-[#1e2e4d] hover:bg-gray-100 rounded-lg transition-all">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-gray-50/50 border-t border-[#e3ebf6] flex justify-between items-center">
              <p className="text-sm text-[#6e84a3]">Showing {appointments.length} entries</p>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>Previous</button>
                <button className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const configs = {
    [AppointmentStatus.PENDING]: { bg: 'bg-orange-50', text: 'text-orange-500', label: 'Pending' },
    [AppointmentStatus.CONFIRMED]: { bg: 'bg-blue-50', text: 'text-blue-500', label: 'Confirmed' },
    [AppointmentStatus.CANCELLED]: { bg: 'bg-red-50', text: 'text-red-500', label: 'Cancelled' },
    [AppointmentStatus.COMPLETED]: { bg: 'bg-green-50', text: 'text-green-500', label: 'Completed' },
  };

  const config = configs[status];

  return (
    <span className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-bold uppercase tracking-wider`}>
      {config.label}
    </span>
  );
};

export default Dashboard;
