import { useState } from 'react';

function LoginPage() {
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Logged in as ${data.role}`);
    } else {
      setError(data.error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 space-y-4">
      <input name="username" className="border p-2 w-full" placeholder="Username" />
      <input name="password" type="password" className="border p-2 w-full" placeholder="Password" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default LoginPage;
