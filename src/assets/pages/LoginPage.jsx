import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const handleLogin = (values) => {
    // Dummy role-based redirect
    const role = values.username === 'admin' ? 'admin' : 'teacher';
    navigate(`/dashboard?role=${role}`);
  };

  return <LoginForm onLogin={handleLogin} />;
}
