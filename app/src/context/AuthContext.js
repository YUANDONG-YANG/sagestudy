import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // 初始化时检查是否已登录
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await authService.getToken();
            const userData = await authService.getCurrentUser();
            if (token && userData) {
                setUserToken(token);
                setUser(userData);
            }
        } catch (error) {
            if (__DEV__) {
                console.error("Error checking auth status:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const result = await authService.login(email, password);
            if (result.success) {
                setUserToken(result.data.token);
                setUser(result.data.user);
                return result;
            }
            return result;
        } catch (error) {
            if (__DEV__) {
                console.error("Login error:", error);
            }
            return { success: false, message: "Login failed. Please try again." };
        }
    };

    const register = async (fullName, email, password) => {
        try {
            const result = await authService.register(fullName, email, password);
            if (result.success) {
                setUserToken(result.data.token);
                setUser(result.data.user);
                return result;
            }
            return result;
        } catch (error) {
            if (__DEV__) {
                console.error("Register error:", error);
            }
            return { success: false, message: "Registration failed. Please try again." };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUserToken(null);
            setUser(null);
        } catch (error) {
            if (__DEV__) {
                console.error("Logout error:", error);
            }
        }
    };

    const value = {
        userToken,
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!userToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
