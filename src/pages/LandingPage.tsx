import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle, Clock, Shield, Users, ArrowRight, Menu, X, Star, Smartphone, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-[#2C7BE5]" />,
      title: "Online Booking",
      desc: "Manage appointments 24/7. No more waiting on hold or phone tag."
    },
    {
      icon: <Clock className="w-6 h-6 text-[#00C9A7]" />,
      title: "Real-time Access",
      desc: "View available slots instantly and book in seconds from any device."
    },
    {
      icon: <Shield className="w-6 h-6 text-[#2C7BE5]" />,
      title: "Secure Records",
      desc: "Your data is protected with industry-standard encryption and privacy controls."
    },
    {
      icon: <Activity className="w-6 h-6 text-[#00C9A7]" />,
      title: "Reporting",
      desc: "Generate appointment and patient visit reports for data-driven clinic management."
    }
  ];

  const objectives = [
    "Empower patients to book, reschedule, or cancel online",
    "Streamline daily schedules with a robust staff dashboard",
    "Automate reminders to reduce no-show rates",
    "Generate comprehensive reports for clinic insight"
  ];

  const stats = [
    { value: "10k+", label: "Appointments Booked" },
    { value: "50+", label: "Partner Clinics" },
    { value: "98%", label: "Patient Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/80 backdrop-blur-md py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-[#2C7BE5] rounded-xl flex items-center justify-center text-white font-bold text-xl font-serif transition-transform group-hover:scale-105">C</div>
            <span className="text-2xl font-serif font-bold text-[#1e2e4d]">ClinicBook</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[#1e2e4d] font-medium">
            <a href="#features" className="hover:text-[#2C7BE5] transition-colors">Features</a>
            <a href="#solutions" className="hover:text-[#2C7BE5] transition-colors">Solutions</a>
            <a href="#about" className="hover:text-[#2C7BE5] transition-colors">About</a>
            <Link to="/login" className="btn btn-outline border-none">Log In</Link>
            <Link to="/booking" className="btn btn-primary">Book Now</Link>
          </div>

          <button className="md:hidden text-[#1e2e4d]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4"
          >
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#solutions" onClick={() => setIsMenuOpen(false)}>Solutions</a>
            <Link to="/login" className="btn btn-outline w-full" onClick={() => setIsMenuOpen(false)}>Log In</Link>
            <Link to="/booking" className="btn btn-primary w-full" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C7BE5]/10 text-[#2C7BE5] rounded-full text-sm font-semibold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-[#2C7BE5]"></span>
                Trusted by 50+ Local Communities
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-[#1e2e4d] leading-tight mb-6">
                Book Smarter. <br />
                <span className="text-[#2C7BE5]">Care Better.</span>
              </h1>
              <p className="text-xl text-[#6e84a3] mb-10 max-w-lg leading-relaxed">
                Empower your clinic with the next generation of patient scheduling. Reduce wait times, eliminate double bookings, and focus on what matters most: patient health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking" className="btn btn-primary text-lg px-8 py-4">
                  Get Started for Free <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-4 px-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-[#6e84a3] font-medium">4.9/5 from 2k+ patients</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#00C9A7]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#2C7BE5]/10 rounded-full blur-3xl"></div>
              
              <div className="bg-white rounded-3xl shadow-2xl p-6 relative overflow-hidden backdrop-blur-sm border border-white/20">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-[#1e2e4d]">Schedule Overview</h3>
                    <p className="text-sm text-[#6e84a3]">Today, May 5, 2026</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#6e84a3]">
                    <Menu className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "John Smith", time: "09:00 AM", service: "General Checkup", color: "bg-blue-500" },
                    { name: "Sarah Williams", time: "10:30 AM", service: "Dental Cleaning", color: "bg-teal-500" },
                    { name: "Robert Jones", time: "01:15 PM", service: "Consultation", color: "bg-purple-500" }
                  ].map((appt, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all cursor-pointer border border-transparent hover:border-gray-100">
                      <div className={`w-12 h-12 rounded-xl ${appt.color} flex items-center justify-center text-white font-bold`}>
                        {appt.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#1e2e4d]">{appt.name}</p>
                        <p className="text-sm text-[#6e84a3]">{appt.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#2C7BE5]">{appt.time}</p>
                        <div className="flex items-center justify-end text-[10px] text-green-500 font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3 mr-1" /> Confirmed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <h3 className="text-4xl font-bold text-[#1e2e4d] mb-2">{stat.value}</h3>
                <p className="text-[#6e84a3] font-medium uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold text-[#1e2e4d] mb-4">Everything your clinic needs.</h2>
            <p className="text-lg text-[#6e84a3]">Simple to use for patients, powerful management for staff. ClinicBook streamlines the entire healthcare experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-3xl shadow-xl shadow-blue-500/5 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1e2e4d] mb-4">{feature.title}</h3>
                <p className="text-[#6e84a3] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-24 bg-[#f1f5f9]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-serif font-bold text-[#1e2e4d] mb-8 leading-tight">Our Core Mission & <br /><span className="text-[#2C7BE5]">Specific Objectives</span></h2>
              <div className="space-y-6">
                {objectives.map((obj, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-[#00C9A7] flex items-center justify-center text-white shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-lg text-[#1e2e4d] font-medium">{obj}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-[#2C7BE5] rounded-3xl blur-2xl opacity-10"></div>
                <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                  <div className="flex items-center gap-2 mb-8">
                    <Activity className="text-[#2C7BE5]" />
                    <span className="font-bold uppercase tracking-widest text-xs text-[#6e84a3]">System Aim</span>
                  </div>
                  <p className="text-2xl font-serif font-bold text-[#1e2e4d] mb-6 leading-relaxed">
                    "To develop a web-based appointment scheduling and management system that streamlines the booking process for both clinic staff and patients."
                  </p>
                  <p className="text-[#6e84a3]">Streamlining inefficient manual workflows to provide better healthcare outcomes for everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-[#1e2e4d] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-12 italic">"ClinicBook changed the way we manage our patient records and daily schedule. Efficiency has improved by 40%."</h2>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-[#2C7BE5]">
              <img src="https://i.pravatar.cc/150?u=doc" alt="Doctor" referrerPolicy="no-referrer" />
            </div>
            <p className="font-bold">Dr. Maria Clara Santos</p>
            <p className="text-[#6e84a3] text-sm">Medical Director, Malasakit Community Clinic</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6 group cursor-pointer">
                <div className="w-8 h-8 bg-[#2C7BE5] rounded-lg flex items-center justify-center text-white font-bold font-serif transition-transform group-hover:scale-105">C</div>
                <span className="text-xl font-serif font-bold text-[#1e2e4d]">ClinicBook</span>
              </Link>
              <p className="text-[#6e84a3] max-w-sm mb-6 leading-relaxed">
                Streamlining healthcare appointments for clinics and patients in our community. Dedicated to making every booking simple, secure, and stress-free.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-[#2C7BE5] hover:text-white transition-all cursor-pointer"><Smartphone className="w-5 h-5"/></div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-[#2C7BE5] hover:text-white transition-all cursor-pointer"><Activity className="w-5 h-5"/></div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-[#2C7BE5] hover:text-white transition-all cursor-pointer"><Users className="w-5 h-5"/></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#1e2e4d] mb-6 font-serif">Platform</h4>
              <ul className="space-y-4 text-[#6e84a3]">
                <li><a href="#" className="hover:text-[#2C7BE5]">For Patients</a></li>
                <li><a href="#" className="hover:text-[#2C7BE5]">For Staff</a></li>
                <li><a href="#" className="hover:text-[#2C7BE5]">Security</a></li>
                <li><a href="#" className="hover:text-[#2C7BE5]">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#1e2e4d] mb-6 font-serif">Support</h4>
              <ul className="space-y-4 text-[#6e84a3]">
                <li><a href="#" className="hover:text-[#2C7BE5]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#2C7BE5]">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#2C7BE5]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#2C7BE5]">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-[#6e84a3] text-sm pt-10 border-t border-gray-100">
            &copy; {new Date().getFullYear()} ClinicBook Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
