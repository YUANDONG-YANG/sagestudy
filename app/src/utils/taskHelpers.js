/**
 * 任务相关的工具函数
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const REMINDER_OFFSET_KEY = "REMINDER_OFFSET";

/**
 * 获取默认提醒提前时间（分钟）
 * @returns {Promise<number>} 提前时间（分钟）
 */
export async function getReminderOffset() {
    try {
        const value = await AsyncStorage.getItem(REMINDER_OFFSET_KEY);
        return value ? Number(value) : 0;
    } catch (error) {
        if (__DEV__) {
            console.error("Error getting reminder offset:", error);
        }
        return 0;
    }
}

/**
 * 计算通知时间
 * @param {string|Date} dueDate - 截止日期
 * @param {number} offsetMinutes - 提前时间（分钟）
 * @returns {Date|null} 通知时间，如果时间已过期则返回 null
 */
export function calculateNotificationDate(dueDate, offsetMinutes = 0) {
    const due = new Date(dueDate);
    const notifyDate = new Date(due.getTime() - offsetMinutes * 60 * 1000);
    const now = new Date();
    
    return notifyDate > now ? notifyDate : null;
}


