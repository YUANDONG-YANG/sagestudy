/**
 * API 客户端 - 模拟真实的API调用
 * 包含网络延迟、错误处理和重试机制
 */

const API_CONFIG = {
    BASE_URL: "https://api.sagestudy.com/v1", // 模拟API地址
    TIMEOUT: 10000, // 10秒超时
    RETRY_COUNT: 3, // 重试次数
    RETRY_DELAY: 1000, // 重试延迟（毫秒）
    // 模拟网络延迟范围（毫秒）
    MIN_DELAY: 200,
    MAX_DELAY: 800,
};

/**
 * 模拟网络延迟
 */
const simulateDelay = () => {
    const delay = Math.random() * (API_CONFIG.MAX_DELAY - API_CONFIG.MIN_DELAY) + API_CONFIG.MIN_DELAY;
    return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * 模拟网络错误（5%的概率）
 */
const shouldSimulateError = () => {
    return Math.random() < 0.05; // 5% 错误率
};

/**
 * API响应格式
 */
class APIResponse {
    constructor(success, data, error = null, statusCode = 200) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
    }

    static success(data, statusCode = 200) {
        return new APIResponse(true, data, null, statusCode);
    }

    static error(error, statusCode = 500) {
        return new APIResponse(false, null, error, statusCode);
    }
}

/**
 * API客户端类
 */
class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * 执行API请求
     * @param {string} endpoint - API端点
     * @param {object} options - 请求选项
     * @returns {Promise<APIResponse>}
     */
    async request(endpoint, options = {}) {
        const { method = "GET", body = null, retryCount = 0 } = options;

        try {
            // 模拟网络延迟
            await simulateDelay();

            // 模拟随机网络错误（仅在实际API调用时，本地存储不模拟错误）
            if (shouldSimulateError() && __DEV__) {
                throw new Error("Network request failed");
            }

            // 构建完整URL
            const url = `${this.baseURL}${endpoint}`;

            // 模拟实际的fetch请求
            const fetchOptions = {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    ...options.headers,
                },
            };

            if (body) {
                fetchOptions.body = JSON.stringify(body);
            }

            // 实际应用中这里会使用真实的fetch
            // const response = await fetch(url, fetchOptions);
            // const data = await response.json();

            // 返回成功响应（实际数据由各个服务方法提供）
            return APIResponse.success(null);

        } catch (error) {
            // 重试机制
            if (retryCount < API_CONFIG.RETRY_COUNT) {
                await new Promise((resolve) => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
                return this.request(endpoint, { ...options, retryCount: retryCount + 1 });
            }

            // 错误分类
            let statusCode = 500;
            let errorMessage = error.message || "An unexpected error occurred";

            if (error.message.includes("Network")) {
                statusCode = 503;
                errorMessage = "Network error. Please check your connection.";
            } else if (error.message.includes("timeout")) {
                statusCode = 504;
                errorMessage = "Request timeout. Please try again.";
            }

            return APIResponse.error(errorMessage, statusCode);
        }
    }

    /**
     * GET请求
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: "GET" });
    }

    /**
     * POST请求
     */
    async post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: "POST", body });
    }

    /**
     * PUT请求
     */
    async put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: "PUT", body });
    }

    /**
     * DELETE请求
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: "DELETE" });
    }
}

export default new APIClient();
export { APIResponse };


