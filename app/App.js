import React, { useEffect } from "react";
import { AppState } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import { ToastProvider } from "./src/context/ToastContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { NotificationServiceInstance } from "./src/notifications/Notifications";
import { getAllTasks } from "./src/data/planner/TasksStorage";
import { getReminderOffset, calculateNotificationDate } from "./src/utils/taskHelpers";
import { ErrorBoundary } from "./src/components/ErrorBoundary";

export default function App() {
    useEffect(() => {
        // 延迟初始化通知服务，避免阻塞应用启动
        const timer = setTimeout(() => {
            initializeNotifications();
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    const initializeNotifications = async () => {
        try {
            // 请求通知权限
            const hasPermission = await NotificationServiceInstance.requestPermissions();
            
            if (hasPermission) {
                // 注册通知监听器
                NotificationServiceInstance.registerListeners();
                
                // 延迟重新调度通知，避免阻塞启动
                setTimeout(async () => {
                    try {
                        await NotificationServiceInstance.rescheduleAllTaskNotifications(
                            getReminderOffset,
                            getAllTasks,
                            calculateNotificationDate
                        );
                    } catch (error) {
                        if (__DEV__) {
                            console.error("Error rescheduling notifications:", error);
                        }
                    }
                }, 1000);

                if (__DEV__) {
                    console.log("✅ Notification service initialized");
                }
            } else {
                if (__DEV__) {
                    console.warn("⚠️ Notification permission not granted");
                }
            }
        } catch (error) {
            // 通知初始化失败不应该阻止应用启动
            if (__DEV__) {
                console.error("Error initializing notifications (non-critical):", error);
            }
        }
    };

    // 监听应用状态变化，重新调度通知
    useEffect(() => {
        const subscription = AppState.addEventListener("change", async (nextAppState) => {
            if (nextAppState === "active") {
                // 应用从后台回到前台时，重新调度通知
                try {
                    await NotificationServiceInstance.rescheduleAllTaskNotifications(
                        getReminderOffset,
                        getAllTasks,
                        calculateNotificationDate
                    );
                } catch (error) {
                    if (__DEV__) {
                        console.error("Error rescheduling on app state change:", error);
                    }
                }
            }
        });

        return () => subscription?.remove();
    }, []);

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <AppNavigator />
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
