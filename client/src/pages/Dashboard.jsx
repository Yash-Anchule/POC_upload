import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { pocService } from '../services/endpoints';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';

export default function Dashboard() {
    const user = useAuthStore((s) => s.user);
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
    const [recentPocs, setRecentPocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const allRes = await pocService.getAll({ page: 1, limit: 5 });
            const pocs = allRes.data.pocs;
            const total = allRes.data.pagination.total;

            const publishedRes = await pocService.getAll({ page: 1, limit: 1, status: 'published' });
            const published = publishedRes.data.pagination.total;

            setStats({ total, published, drafts: total - published });
            setRecentPocs(pocs);
        } catch {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    if (loading) return <Spinner size="lg" className="mt-24" />;
    if (error) return <ErrorState message={error} onRetry={fetchDashboard} />;

    const statCards = [
        { label: 'Total POCs', value: stats.total, color: 'from-terracotta-400 to-terracotta-500', icon: '🚀' },
        { label: 'Published', value: stats.published, color: 'from-emerald-400 to-emerald-500', icon: '✅' },
        { label: 'Drafts', value: stats.drafts, color: 'from-amber-400 to-amber-500', icon: '📝' },
    ];

    return (
        <div className="space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-800">
                    Hello, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-charcoal-500 mt-1">Here's what's happening with your POCs</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((s) => (
                    <Card key={s.label} hover={false} className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-charcoal-500">{s.label}</p>
                                <p className="text-3xl font-bold text-charcoal-800 mt-1">{s.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-sm`}>
                                {s.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent POCs */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-charcoal-800">Recent POCs</h2>
                    <Link to="/pocs">
                        <Button variant="ghost" size="sm">View all →</Button>
                    </Link>
                </div>

                {recentPocs.length === 0 ? (
                    <Card hover={false} className="p-8 text-center">
                        <p className="text-charcoal-500">No POCs yet.</p>
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link to="/pocs/new">
                                <Button variant="outline" size="sm" className="mt-3">Submit your first POC</Button>
                            </Link>
                        )}
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {recentPocs.map((poc) => (
                            <Link key={poc._id} to={`/pocs/${poc._id}`}>
                                <Card className="p-4 flex items-center gap-4">
                                    {poc.thumbnail ? (
                                        <img
                                            src={poc.thumbnail}
                                            alt={poc.title}
                                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sand-200 to-sand-300 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-charcoal-800 truncate">{poc.title}</h3>
                                        <p className="text-sm text-charcoal-500 truncate">{poc.description}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Badge color={poc.status === 'published' ? 'green' : 'amber'}>
                                                {poc.status}
                                            </Badge>
                                            {poc.techStack?.slice(0, 3).map((t) => (
                                                <Badge key={t} color="sand">{t}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
