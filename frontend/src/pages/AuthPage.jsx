import { useState } from 'react';
import { Mail, Lock, User, Building, Ship, ArrowRight, ShieldCheck, Globe2, AlertCircle } from 'lucide-react';

const AuthPage = ({ onLoginSuccess }) => {
  // --- STATE VARIABLES ---
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(''); // This is the variable that was missing!
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAuthError(''); // Clear errors when user types
  };

  // --- REAL DJANGO DATABASE LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    try {
      if (!isLogin) {
        // SIGN UP
        const response = await fetch('http://127.0.0.1:8000/api/signup/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Signup failed.");
        }

        alert(`Account securely created for ${formData.name}! Please log in.`);
        setIsLogin(true);
        setFormData({ ...formData, password: '' });

      } else {
        // LOG IN
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed.");
        }

        // Database verified the password successfully!
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', fontFamily: '"Inter", system-ui, sans-serif' },
    brandPanel: {
      flex: '1', position: 'relative', display: 'none', 
      '@media (min-width: 1024px)': { display: 'flex' },
      flexDirection: 'column', justifyContent: 'space-between', padding: '60px', color: 'white',
      backgroundImage: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(37, 99, 235, 0.4)), url('https://images.unsplash.com/photo-1494412519320-ce625bef04c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
      backgroundSize: 'cover', backgroundPosition: 'center',
    },
    logoBox: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' },
    iconBox: { backgroundColor: '#3b82f6', padding: '10px', borderRadius: '12px' },
    brandTextContainer: { maxWidth: '480px' },
    headline: { fontSize: '48px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' },
    subheadline: { fontSize: '18px', color: '#cbd5e1', lineHeight: '1.6' },
    formPanel: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px', backgroundColor: '#ffffff', maxWidth: '100%' },
    formWrapper: { width: '100%', maxWidth: '440px', margin: '0 auto' },
    header: { marginBottom: '40px' },
    title: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' },
    subtitle: { color: '#64748b', fontSize: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', position: 'relative' },
    label: { fontSize: '13px', fontWeight: '600', color: '#475569' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '16px', color: '#94a3b8' },
    input: { width: '100%', padding: '14px 16px 14px 48px', fontSize: '15px', color: '#0f172a', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' },
    button: { width: '100%', padding: '16px', marginTop: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'background-color 0.2s', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)' },
    toggleText: { marginTop: '32px', textAlign: 'center', color: '#64748b', fontSize: '15px' },
    toggleLink: { color: '#2563eb', fontWeight: '700', cursor: 'pointer', border: 'none', background: 'none', padding: '0', marginLeft: '6px' },
    securityBadge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '40px', color: '#94a3b8', fontSize: '13px', fontWeight: '500' },
    errorBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '10px', fontSize: '14px', fontWeight: '500', marginBottom: '20px', border: '1px solid #fecaca' }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.brandPanel, '@media (max-width: 1023px)': { display: 'none' } }}>
        <div style={styles.logoBox}>
          <div style={styles.iconBox}><Ship size={24} color="white" /></div>
          SupplyChain AI
        </div>
        <div style={styles.brandTextContainer}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '30px', backdropFilter: 'blur(10px)', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
            <Globe2 size={16} color="#60a5fa" /> Global Network Live
          </div>
          <h1 style={styles.headline}>Intelligence for your entire supply chain.</h1>
          <p style={styles.subheadline}>Connect your ports, carriers, and historical data to predict delivery delays with enterprise-grade machine learning.</p>
        </div>
      </div>

      <div style={styles.formPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.header}>
            <h2 style={styles.title}>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p style={styles.subtitle}>{isLogin ? 'Enter your details to access your dashboard.' : 'Start predicting shipment risks today.'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {authError && (
              <div style={styles.errorBox}>
                <AlertCircle size={18} /> {authError}
              </div>
            )}

            {!isLogin && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <div style={styles.inputWrapper}>
                    <User size={18} style={styles.inputIcon} />
                    <input style={styles.input} type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required={!isLogin} />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Company Name</label>
                  <div style={styles.inputWrapper}>
                    <Building size={18} style={styles.inputIcon} />
                    <input style={styles.input} type="text" name="company" placeholder="Acme Logistics Ltd." value={formData.company} onChange={handleChange} required={!isLogin} />
                  </div>
                </div>
              </>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input style={styles.input} type="email" name="email" placeholder="john@company.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input style={styles.input} type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div style={styles.toggleText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button style={styles.toggleLink} onClick={() => { setIsLogin(!isLogin); setAuthError(''); }} type="button">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

          <div style={styles.securityBadge}>
            <ShieldCheck size={16} /> Secure 256-bit Enterprise Encryption
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AuthPage;