/**
 * 表单验证工具函数
 */

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效邮箱
 */
export function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {{valid: boolean, message: string}} 验证结果
 */
export function validatePassword(password) {
    if (!password) {
        return { valid: false, message: "Password is required" };
    }
    
    if (password.length < 6) {
        return { valid: false, message: "Password must be at least 6 characters" };
    }
    
    return { valid: true, message: "" };
}

/**
 * 验证密码是否匹配
 * @param {string} password - 密码
 * @param {string} confirmPassword - 确认密码
 * @returns {boolean} 是否匹配
 */
export function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

/**
 * 验证任务标题
 * @param {string} title - 任务标题
 * @returns {{valid: boolean, message: string}} 验证结果
 */
export function validateTaskTitle(title) {
    if (!title || !title.trim()) {
        return { valid: false, message: "Task title is required" };
    }
    
    if (title.trim().length < 2) {
        return { valid: false, message: "Task title must be at least 2 characters" };
    }
    
    return { valid: true, message: "" };
}

/**
 * 验证词汇单词
 * @param {string} word - 单词
 * @returns {{valid: boolean, message: string}} 验证结果
 */
export function validateWord(word) {
    if (!word || !word.trim()) {
        return { valid: false, message: "Word is required" };
    }
    
    if (word.trim().length < 1) {
        return { valid: false, message: "Word cannot be empty" };
    }
    
    return { valid: true, message: "" };
}

/**
 * 验证姓名
 * @param {string} name - 姓名
 * @returns {{valid: boolean, message: string}} 验证结果
 */
export function validateName(name) {
    if (!name || !name.trim()) {
        return { valid: false, message: "Name is required" };
    }
    
    if (name.trim().length < 2) {
        return { valid: false, message: "Name must be at least 2 characters" };
    }
    
    return { valid: true, message: "" };
}


