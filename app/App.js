import React, { useEffect } from "react";
import { AppState } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import { ToastProvider } from "./src/context/ToastContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { NotificationServiceInstance } from "./src/notifications/Notifications";
import { getAllTasks } from "./src/data/planner/TasksStorage";
import { getReminderOffset, calculateNotificationDate } from "./src/utils/taskHelpers";

export default function App() {
    useEffect(() => {
        // 初始化通知服务
        initializeNotifications();
    }, []);

    const initializeNotifications = async () => {
        try {
            // 请求通知权限
            const hasPermission = await NotificationServiceInstance.requestPermissions();
            
            if (hasPermission) {
                // 注册通知监听器
                NotificationServiceInstance.registerListeners();
                
                // 重新调度所有任务的通知（应用启动时）
                await NotificationServiceInstance.rescheduleAllTaskNotifications(
                    getReminderOffset,
                    getAllTasks,
                    calculateNotificationDate
                );

                if (__DEV__) {
                    console.log("✅ Notification service initialized");
                }
            } else {
                if (__DEV__) {
                    console.warn("⚠️ Notification permission not granted");
                }
            }
        } catch (error) {
            if (__DEV__) {
                console.error("Error initializing notifications:", error);
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
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <AppNavigator />
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}
