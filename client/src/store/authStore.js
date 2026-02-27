import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('poc_user') || 'null'),
    accessToken: localStorage.getItem('poc_access_token') || null,
    refreshToken: localStorage.getItem('poc_refresh_token') || null,

    setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('poc_user', JSON.stringify(user));
        localStorage.setItem('poc_access_token', accessToken);
        localStorage.setItem('poc_refresh_token', refreshToken);
        set({ user, accessToken, refreshToken });
    },

    setUser: (user) => {
        localStorage.setItem('poc_user', JSON.stringify(user));
        set({ user });
    },

    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('poc_access_token', accessToken);
        localStorage.setItem('poc_refresh_token', refreshToken);
        set({ accessToken, refreshToken });
    },

    logout: () => {
        localStorage.removeItem('poc_user');
        localStorage.removeItem('poc_access_token');
        localStorage.removeItem('poc_refresh_token');
        set({ user: null, accessToken: null, refreshToken: null });
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('poc_access_token');
    },

    hasRole: (roles) => {
        const user = JSON.parse(localStorage.getItem('poc_user') || 'null');
        return user ? roles.includes(user.role) : false;
    },
}));

export default useAuthStore;
