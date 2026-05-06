import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null as string | null);
  const [success, setSuccess] = React.useState(null as string | null);
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists
      const docRef = doc(db, 'patients', result.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        try {
          await setDoc(docRef, {
            uid: result.user.uid,
            name: result.user.displayName || 'Unnamed Patient',
            email: result.user.email || '',
            role: 'patient',
            createdAt: Date.now()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `patients/${result.user.uid}`);
        }
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/dashboard');
      } else {
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        try {
          await setDoc(doc(db, 'patients', result.user.uid), {
            uid: result.user.uid,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: 'patient',
            createdAt: Date.now()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `patients/${result.user.uid}`);
        }
        
        // Sign out immediately so they have to log in
        await signOut(auth);
        
        setSuccess('Account created successfully! Please log in with your credentials.');
        setIsLogin(true);
        setFormData(prev => ({ ...prev, password: '' })); // Clear password for security
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col lg:flex-row">
      {/* Sidebar decoration */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#1e2e4d] p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2C7BE5] rounded-full -mr-32 -mt-32 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00C9A7] rounded-full -ml-32 -mb-32 opacity-20 blur-3xl"></div>
        
        <Link to="/" className="flex items-center gap-2 group z-10">
          <div className="w-10 h-10 bg-[#2C7BE5] rounded-xl flex items-center justify-center text-white font-bold text-xl font-serif">C</div>
          <span className="text-2xl font-serif font-bold">ClinicBook</span>
        </Link>

        <div className="z-10">
          <h2 className="text-5xl font-serif font-bold leading-tight mb-6">
            Join the future <br /> of healthcare.
          </h2>
          <p className="text-gray-400 text-lg max-w-sm mb-8">
            Access world-class medical scheduling and management tools with just a few clicks.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#00C9A7]">
                <Shield className="w-5 h-5" />
              </div>
              <span>Data Security & HIPAA Compliance</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 z-10 flex justify-between">
          <span>&copy; 2026 ClinicBook</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>

      {/* Main Auth Form */}
      <div className="flex-1 p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-[#6e84a3] hover:text-[#2C7BE5] transition-colors mb-8 lg:hidden">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <h1 className="text-3xl font-serif font-bold text-[#1e2e4d] mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-[#6e84a3] mb-8">
              {isLogin ? 'Log in to manage your appointments.' : 'Start booking smarter today.'}
            </p>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="font-bold">&times;</button>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm mb-6 border border-green-100 flex items-center gap-2">
                <span className="flex-1">{success}</span>
                <button onClick={() => setSuccess(null)} className="font-bold">&times;</button>
              </div>
            )}

            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-[#1e2e4d] mb-6 disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/split-google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="relative mb-8 text-center">
              <hr className="border-gray-100" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-4 bg-[#F8FAFF] text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">Or use email</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        required={!isLogin}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-white border border-gray-100 rounded-xl focus:border-[#2C7BE5] focus:ring-4 focus:ring-[#2C7BE5]/5 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-white border border-gray-100 rounded-xl focus:border-[#2C7BE5] focus:ring-4 focus:ring-[#2C7BE5]/5 outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full h-12 pl-12 pr-4 bg-white border border-gray-100 rounded-xl focus:border-[#2C7BE5] focus:ring-4 focus:ring-[#2C7BE5]/5 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full h-12 pl-12 pr-4 bg-white border border-gray-100 rounded-xl focus:border-[#2C7BE5] focus:ring-4 focus:ring-[#2C7BE5]/5 outline-none transition-all"
                />
              </div>

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-sm font-semibold text-[#2C7BE5] hover:underline">Forgot password?</a>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full h-12 text-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <p className="mt-8 text-center text-[#6e84a3]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccess(null);
                }}
                className="ml-2 font-bold text-[#2C7BE5] hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Shield = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
);

export default AuthPage;
