/**
 * Toast 上下文 - 全局Toast管理
 */
import React, { createContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "info",
    });

    const showToast = useCallback((message, type = "info", duration = 3000) => {
        setToast({
            visible: true,
            message,
            type,
            duration,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, visible: false }));
    }, []);

    const showSuccess = useCallback((message, duration) => {
        showToast(message, "success", duration);
    }, [showToast]);

    const showError = useCallback((message, duration) => {
        showToast(message, "error", duration);
    }, [showToast]);

    const showWarning = useCallback((message, duration) => {
        showToast(message, "warning", duration);
    }, [showToast]);

    const showInfo = useCallback((message, duration) => {
        showToast(message, "info", duration);
    }, [showToast]);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                showSuccess,
                showError,
                showWarning,
                showInfo,
                hideToast,
            }}
        >
            {children}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onHide={hideToast}
            />
        </ToastContext.Provider>
    );
}


