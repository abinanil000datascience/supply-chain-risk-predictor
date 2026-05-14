import { useState } from 'react';
import { Truck, Package, MapPin, AlertCircle, ArrowRight, BarChart3, LogOut } from 'lucide-react';

const DeliveryPredictor = ({ onLogout }) => {
  const [formData, setFormData] = useState({
    'Order Date': '',
    'Carrier': '',
    'Service Level': '',
    'Origin Port': '',
    'Destination Port': '',
    'Plant Code': '',
    'Customer': '',
    'Weight': '',
    'Unit quantity': '',
    'TPT': ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const [year, month, day] = formData['Order Date'].split('-');
      const formattedDate = `${day}-${month}-${year}`;

      const payload = {
        ...formData,
        "Order Date": formattedDate,
        "Weight": parseFloat(formData["Weight"]) || 0,
        "Unit quantity": parseInt(formData["Unit quantity"], 10) || 0,
        "TPT": parseInt(formData["TPT"], 10) || 0
      };

      const response = await fetch('http://127.0.0.1:8000/api/predict_delivery/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Connection failed. Ensure Django is running.");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // NEW LIGHT & AIRY DESIGN SYSTEM
  const styles = {
    page: { position: 'relative', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: '"Inter", system-ui, sans-serif', color: '#1f2937' },
    hero: {
      height: '340px',
      // Bright, daytime aerial view of a logistics port
      backgroundImage: `linear-gradient(to right, rgba(30, 58, 138, 0.9), rgba(59, 130, 246, 0.4)), url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '60px',
      color: 'white',
      textAlign: 'center'
    },
    wrapper: { maxWidth: '1000px', margin: '-120px auto 40px auto', padding: '0 20px', position: 'relative', zIndex: 10 },
    card: { backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
    sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #f3f4f6' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#6b7280' },
    input: { backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '10px', padding: '12px 16px', color: '#1f2937', fontSize: '15px', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' },
    button: { width: '100%', padding: '20px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 10px 20px -5px rgba(79, 70, 229, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'transform 0.2s' },
    resultCard: (isLate) => ({ marginTop: '32px', padding: '32px', borderRadius: '20px', backgroundColor: isLate ? '#fef2f2' : '#f0fdf4', border: `1px solid ${isLate ? '#fecaca' : '#bbf7d0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' })
  };

  return (
    <div style={styles.page}>
      
      {/* NEW SECURE LOGOUT BUTTON */}
      <button 
        onClick={onLogout}
        style={{ position: 'absolute', top: '24px', right: '32px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'background-color 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
      >
        <LogOut size={16} /> Sign Out
      </button>

      {/* Top Hero Section */}
      <div style={styles.hero}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
          <BarChart3 size={18} /> Enterprise ML Pipeline
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-0.03em' }}>Supply Chain Prediction</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '600px', margin: 0 }}>Predict shipment delays before they occur.</p>
      </div>

      {/* Main Form Overlapping the Hero */}
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            
            {/* Section 1: Route & Timing */}
            <div style={styles.sectionTitle}><MapPin size={18} color="#4f46e5" /> Route & Schedule</div>
            <div style={styles.grid3}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Order Date</label>
                <input style={styles.input} type="date" name="Order Date" onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Origin Port</label>
                <input style={styles.input} type="text" name="Origin Port" placeholder="e.g. PORT04" onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Destination Port</label>
                <input style={styles.input} type="text" name="Destination Port" placeholder="e.g. PORT09" onChange={handleChange} required />
              </div>
            </div>

            {/* Section 2: Carrier Details */}
            <div style={styles.sectionTitle}><Truck size={18} color="#4f46e5" /> Carrier Specifications</div>
            <div style={styles.grid3}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Carrier ID</label>
                <input style={styles.input} type="text" name="Carrier" placeholder="V44_3" onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Service Level</label>
                <input style={styles.input} type="text" name="Service Level" placeholder="DTP / CRF" onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Transit Time (TPT)</label>
                <input style={styles.input} type="number" name="TPT" placeholder="Days" onChange={handleChange} required />
              </div>
            </div>

            {/* Section 3: Cargo & Client */}
            <div style={styles.sectionTitle}><Package size={18} color="#4f46e5" /> Cargo Details</div>
            <div style={styles.grid2}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Plant Code</label>
                <input style={styles.input} type="text" name="Plant Code" placeholder="PLANT16" onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Customer ID</label>
                <input style={styles.input} type="text" name="Customer" placeholder="V55555_53" onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Total Weight (kg)</label>
                <input style={styles.input} type="number" step="0.1" name="Weight" placeholder="0.0" onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Unit Quantity</label>
                <input style={styles.input} type="number" name="Unit quantity" placeholder="0" onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Processing via XGBoost..." : "Calculate Delivery Risk"} 
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Error State */}
          {error && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} /> <b>Connection Error:</b> {error}
            </div>
          )}

          {/* Redesigned Horizontal Result Card */}
          {result && (
            <div style={styles.resultCard(result.prediction === 'LATE')}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: result.prediction === 'LATE' ? '#b91c1c' : '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Final Assessment
                </div>
                <div style={{ fontSize: '48px', fontWeight: '900', color: result.prediction === 'LATE' ? '#ef4444' : '#10b981', lineHeight: '1.1', marginTop: '4px' }}>
                  {result.prediction}
                </div>
              </div>
              
              <div style={{ textAlign: 'right', borderLeft: `2px solid ${result.prediction === 'LATE' ? '#fecaca' : '#bbf7d0'}`, paddingLeft: '32px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>Risk Probability</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827' }}>
                  {result.risk_percentage}%
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DeliveryPredictor;