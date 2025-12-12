/**
 * 工具函数集合
 */

/**
 * 计算任务剩余时间标签
 * @param {string|Date} dueDate - 截止日期
 * @returns {string} 时间标签
 */
export function getTimeLeftLabel(dueDate) {
    const now = new Date();
    const target = new Date(dueDate);
    const diff = target - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days left`;
}

/**
 * 检查时间标签是否为过期
 * @param {string|Date} dueDate - 截止日期
 * @returns {boolean}
 */
export function isExpired(dueDate) {
    return getTimeLeftLabel(dueDate) === "Expired";
}

/**
 * 获取任务类型对应的图标名称
 * @param {string} type - 任务类型 ('task' | 'assessment')
 * @returns {string} 图标名称
 */
export function getTaskIconName(type) {
    return type === "assessment" ? "event" : "check-circle";
}

/**
 * 获取任务类型对应的图标颜色
 * @param {string} type - 任务类型 ('task' | 'assessment')
 * @returns {string} 颜色代码
 */
export function getTaskIconColor(type) {
    return type === "assessment" ? "#F5A623" : "#6C4AB6";
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
    if (!date) return "";
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            // 无效日期
            return "";
        }
        return d.toISOString().split("T")[0];
    } catch (error) {
        if (__DEV__) {
            console.error("Error formatting date:", error);
        }
        return "";
    }
}

/**
 * 安全的异步操作包装器
 * @param {Function} asyncFn - 异步函数
 * @param {string} errorMessage - 错误消息
 * @returns {Promise} 执行结果
 */
export async function safeAsync(asyncFn, errorMessage = "操作失败") {
    try {
        return await asyncFn();
    } catch (error) {
        if (__DEV__) {
            console.error(`[${errorMessage}]`, error);
        }
        throw error;
    }
}


