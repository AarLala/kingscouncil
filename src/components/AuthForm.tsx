import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else alert('Check your email for a confirmation link!');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        setError('Login failed. Please check your credentials.');
      } else {
        alert('Logged in!');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-bold text-center">{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded"
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full border p-2 rounded"
        autoComplete={isSignUp ? 'new-password' : 'current-password'}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Login'}
      </button>
      <button
        type="button"
        className="w-full text-sm underline text-blue-700"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </button>
    </form>
  );
} 