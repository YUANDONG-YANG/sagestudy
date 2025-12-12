/**
 * Authentication related API
 */
import apiClient from "../apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateEmail, validatePassword, validateName } from "../../utils/validators";

const STORAGE_KEYS = {
    USER_TOKEN: "USER_TOKEN",
    USER_PROFILE: "USER_PROFILE",
    USERS_DATA: "USERS_DATA",
};

/**
 * Authentication API service
 */
class AuthAPI {
    /**
     * User registration
     */
    async register(fullName, email, password) {
        // Local validation (validate first, then call API)
        const nameValidation = validateName(fullName);
        if (!nameValidation.valid) {
            return { success: false, message: nameValidation.message };
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation) {
            return { success: false, message: "Invalid email format" };
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return { success: false, message: passwordValidation.message };
        }

        // Simulate API call (doesn't affect actual registration logic)
        try {
            await apiClient.post("/auth/register", {
                fullName,
                email,
                password,
            });
        } catch (error) {
            // API call failure doesn't affect registration, continue execution
            if (__DEV__) {
                console.warn("API call failed, continuing with local registration:", error);
            }
        }

        // Check if user already exists
        const usersData = await this.getAllUsers();
        const existingUser = usersData.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            return { success: false, message: "User with this email already exists" };
        }

        // Create new user
        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            createdAt: new Date().toISOString(),
        };

        usersData.push(newUser);
        await AsyncStorage.setItem(STORAGE_KEYS.USERS_DATA, JSON.stringify(usersData));

        // Generate token
        const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(
            STORAGE_KEYS.USER_PROFILE,
            JSON.stringify({
                id: newUser.id,
                name: newUser.fullName,
                email: newUser.email,
            })
        );

        return {
            success: true,
            message: "Account created successfully",
            data: {
                token,
                user: { id: newUser.id, name: newUser.fullName, email: newUser.email },
            },
        };
    }

    /**
     * User login (simulated login, no real validation required)
     */
    async login(email, password) {
        // Basic validation
        if (!email || !password) {
            return { success: false, message: "Email and password are required" };
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation) {
            return { success: false, message: "Invalid email format" };
        }

        // Simulate API call
        try {
            await apiClient.post("/auth/login", { email, password });
        } catch (error) {
            // API call failure doesn't affect login
            if (__DEV__) {
                console.warn("API call failed, continuing with simulated login:", error);
            }
        }

        // Simulated login: find or create user
        const usersData = await this.getAllUsers();
        let user = usersData.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        // If user doesn't exist, automatically create a simulated user
        if (!user) {
            // Safely extract name from email
            let displayName = "User";
            try {
                const emailParts = email.split('@');
                if (emailParts.length > 0 && emailParts[0]) {
                    const emailName = emailParts[0];
                    displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                }
            } catch (e) {
                // If extraction fails, use default name
                if (__DEV__) {
                    console.warn("Failed to extract name from email:", e);
                }
            }
            
            user = {
                id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                fullName: displayName,
                email: email.trim().toLowerCase(),
                password: password, // Save password for later use
                createdAt: new Date().toISOString(),
            };

            // Save new user
            usersData.push(user);
            await AsyncStorage.setItem(STORAGE_KEYS.USERS_DATA, JSON.stringify(usersData));
        }

        // Generate token and save
        const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(
            STORAGE_KEYS.USER_PROFILE,
            JSON.stringify({
                id: user.id,
                name: user.fullName,
                email: user.email,
            })
        );

        return {
            success: true,
            message: "Login successful",
            data: { token, user: { id: user.id, name: user.fullName, email: user.email } },
        };
    }

    /**
     * Change password
     */
    async changePassword(email, oldPassword, newPassword) {
        const apiResponse = await apiClient.post("/auth/change-password", {
            email,
            oldPassword,
            newPassword,
        });

        if (!apiResponse.success) {
            return { success: false, message: apiResponse.error };
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            return { success: false, message: passwordValidation.message };
        }

        const usersData = await this.getAllUsers();
        const userIndex = usersData.findIndex(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === oldPassword
        );

        if (userIndex === -1) {
            return { success: false, message: "Current password is incorrect" };
        }

        usersData[userIndex].password = newPassword;
        await AsyncStorage.setItem(STORAGE_KEYS.USERS_DATA, JSON.stringify(usersData));

        return { success: true, message: "Password changed successfully" };
    }

    /**
     * 获取所有用户（内部方法）
     */
    async getAllUsers() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DATA);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            if (__DEV__) {
                console.error("Get all users error:", error);
            }
            return [];
        }
    }

    /**
     * 登出
     */
    async logout() {
        const apiResponse = await apiClient.post("/auth/logout");
        
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
            return { success: true, message: "Logged out successfully" };
        } catch (error) {
            return { success: false, message: "Failed to logout" };
        }
    }
}

export default new AuthAPI();


