import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/endpoints';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        if (form.password.length < 6) errs.password = 'At least 6 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setError('');
        setLoading(true);
        try {
            await authService.register(form);
            navigate('/login', { state: { registered: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-terracotta-400 to-coral-400 shadow-lg mb-4">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal-800">Create Account</h1>
                    <p className="text-charcoal-500 mt-1">Join the POC Showcase platform</p>
                </div>

                <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 sm:p-8">
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-coral-50 border border-coral-200 text-sm text-coral-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="Jane Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            error={errors.name}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@company.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            error={errors.email}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            error={errors.password}
                            required
                        />
                        <Button type="submit" loading={loading} className="w-full mt-2">
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-charcoal-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-terracotta-500 font-medium hover:text-terracotta-600">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
