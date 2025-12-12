import AsyncStorage from "@react-native-async-storage/async-storage";
import authApi from "./api/authApi";

const STORAGE_KEYS = {
    USER_TOKEN: "USER_TOKEN",
    USER_PROFILE: "USER_PROFILE",
};

/**
 * 认证服务 - 使用API服务
 */
class AuthService {
    /**
     * 用户注册
     */
    async register(fullName, email, password) {
        return await authApi.register(fullName, email, password);
    }

    /**
     * 用户登录
     */
    async login(email, password) {
        return await authApi.login(email, password);
    }

    /**
     * 用户登出
     */
    async logout() {
        return await authApi.logout();
    }

    /**
     * 获取当前token
     */
    async getToken() {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        } catch (error) {
            if (__DEV__) {
                console.error("Get token error:", error);
            }
            return null;
        }
    }

    /**
     * 获取当前用户信息
     */
    async getCurrentUser() {
        try {
            const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
            return profileJson ? JSON.parse(profileJson) : null;
        } catch (error) {
            if (__DEV__) {
                console.error("Get current user error:", error);
            }
            return null;
        }
    }

    /**
     * 检查是否已登录
     */
    async isAuthenticated() {
        const token = await this.getToken();
        return !!token;
    }

    /**
     * 更新用户密码
     */
    async changePassword(email, oldPassword, newPassword) {
        return await authApi.changePassword(email, oldPassword, newPassword);
    }
}

export default new AuthService();
