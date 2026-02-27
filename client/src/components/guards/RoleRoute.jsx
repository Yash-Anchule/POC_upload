import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function RoleRoute({ children, roles = [] }) {
    const user = useAuthStore((s) => s.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
