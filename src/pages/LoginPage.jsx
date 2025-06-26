import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.error || 'Invalid credentials');
        return;
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));

      switch (userData.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'parent':
          navigate('/parent-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
      {loading && <p style={{ color: 'blue' }}>Logging in...</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
}
