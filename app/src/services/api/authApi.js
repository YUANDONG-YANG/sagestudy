/**
 * 认证相关API
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
 * 认证API服务
 */
class AuthAPI {
    /**
     * 用户注册
     */
    async register(fullName, email, password) {
        // 本地验证（先验证，再调用API）
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

        // 模拟API调用（不影响实际注册逻辑）
        try {
            await apiClient.post("/auth/register", {
                fullName,
                email,
                password,
            });
        } catch (error) {
            // API调用失败不影响注册，继续执行
            if (__DEV__) {
                console.warn("API call failed, continuing with local registration:", error);
            }
        }

        // 检查用户是否已存在
        const usersData = await this.getAllUsers();
        const existingUser = usersData.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            return { success: false, message: "User with this email already exists" };
        }

        // 创建新用户
        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            createdAt: new Date().toISOString(),
        };

        usersData.push(newUser);
        await AsyncStorage.setItem(STORAGE_KEYS.USERS_DATA, JSON.stringify(usersData));

        // 生成token
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
     * 用户登录（模拟登录，无需真实验证）
     */
    async login(email, password) {
        // 基础验证
        if (!email || !password) {
            return { success: false, message: "Email and password are required" };
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation) {
            return { success: false, message: "Invalid email format" };
        }

        // 模拟API调用
        try {
            await apiClient.post("/auth/login", { email, password });
        } catch (error) {
            // API调用失败不影响登录
            if (__DEV__) {
                console.warn("API call failed, continuing with simulated login:", error);
            }
        }

        // 模拟登录：查找或创建用户
        const usersData = await this.getAllUsers();
        let user = usersData.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        // 如果用户不存在，自动创建一个模拟用户
        if (!user) {
            // 安全地从邮箱提取名字
            let displayName = "User";
            try {
                const emailParts = email.split('@');
                if (emailParts.length > 0 && emailParts[0]) {
                    const emailName = emailParts[0];
                    displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                }
            } catch (e) {
                // 如果提取失败，使用默认名字
                if (__DEV__) {
                    console.warn("Failed to extract name from email:", e);
                }
            }
            
            user = {
                id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                fullName: displayName,
                email: email.trim().toLowerCase(),
                password: password, // 保存密码以便后续使用
                createdAt: new Date().toISOString(),
            };

            // 保存新用户
            usersData.push(user);
            await AsyncStorage.setItem(STORAGE_KEYS.USERS_DATA, JSON.stringify(usersData));
        }

        // 生成token并保存
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
     * 修改密码
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


