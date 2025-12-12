import { Notifications } from "react-native-notifications";
import { Platform, PermissionsAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "../navigation/AppNavigator";

const NOTIFICATION_IDS_KEY = "NOTIFICATION_IDS_MAP";

class NotificationService {
    // 通知ID到任务ID的映射（用于管理通知）
    notificationIdMap = new Map();

    constructor() {
        this.loadNotificationIds();
    }

    /* -----------------------------
     * 加载通知ID映射
     * ----------------------------- */
    async loadNotificationIds() {
        try {
            const stored = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY);
            if (stored) {
                const map = JSON.parse(stored);
                this.notificationIdMap = new Map(Object.entries(map));
            }
        } catch (error) {
            if (__DEV__) {
                console.error("Error loading notification IDs:", error);
            }
        }
    }

    /* -----------------------------
     * 保存通知ID映射
     * ----------------------------- */
    async saveNotificationIds() {
        try {
            const map = Object.fromEntries(this.notificationIdMap);
            await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(map));
        } catch (error) {
            if (__DEV__) {
                console.error("Error saving notification IDs:", error);
            }
        }
    }

    /* -----------------------------
     * ANDROID 13+ 权限请求
     * ----------------------------- */
    async requestPermissions() {
        if (Platform.OS === "ios") {
            // iOS权限请求
            try {
                const authStatus = await Notifications.ios.checkPermissions();
                if (authStatus === Notifications.ios.PermissionStatus.Authorized) {
                    return true;
                }
                const result = await Notifications.ios.requestPermissions();
                return result === Notifications.ios.PermissionStatus.Authorized;
            } catch (error) {
                if (__DEV__) {
                    console.error("Error requesting iOS notification permission:", error);
                }
                return false;
            }
        }

        if (Platform.OS === "android") {
            try {
                if (Platform.Version >= 33) {
                    const result = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );

                    if (__DEV__) {
                        console.log("🔔 Android Notification Permission:", result);
                    }
                    
                    return result === PermissionsAndroid.RESULTS.GRANTED;
                }
                return true;
            } catch (error) {
                if (__DEV__) {
                    console.error("Error requesting notification permission:", error);
                }
                return false;
            }
        }

        return true;
    }

    /* -----------------------------
     * 初始化监听事件
     * ----------------------------- */
    registerListeners() {
        try {
            // 注册成功（接收 token）
            Notifications.events().registerRemoteNotificationsRegistered((event) => {
                if (__DEV__) {
                    console.log("📲 Device Push Token:", event.deviceToken);
                }
            });

            // 注册失败
            Notifications.events().registerRemoteNotificationsRegistrationFailed(
                (event) => {
                    if (__DEV__) {
                        console.log("❌ Failed to register:", event);
                    }
                }
            );

            // 点击通知
            Notifications.events().registerNotificationOpened(
                (notification, completion) => {
                    if (__DEV__) {
                        console.log("🔔 Notification opened:", notification);
                    }
                    
                    // 处理通知点击后的导航
                    const payload = notification.payload || notification.extra || {};
                    const taskId = payload.taskId;

                    if (taskId && navigationRef.current) {
                        // 延迟导航，确保导航容器已准备好
                        setTimeout(() => {
                            try {
                                // 导航到TaskDetail屏幕
                                // 路径: MainTabs -> Profile -> PlannerStack -> TaskDetail
                                navigationRef.current?.navigate("MainTabs", {
                                    screen: "Profile",
                                    params: {
                                        screen: "PlannerStack",
                                        params: {
                                            screen: "TaskDetail",
                                            params: { taskId },
                                        },
                                    },
                                });
                            } catch (error) {
                                if (__DEV__) {
                                    console.error("Error navigating from notification:", error);
                                }
                            }
                        }, 500);
                    }
                    
                    completion();
                }
            );

            // 收到通知
            Notifications.events().registerNotificationReceivedForeground(
                (notification, completion) => {
                    if (__DEV__) {
                        console.log("📨 Notification received in foreground:", notification);
                    }
                    completion({ alert: true, sound: true, badge: false });
                }
            );
        } catch (error) {
            if (__DEV__) {
                console.error("Error registering notification listeners:", error);
            }
        }
    }

    /* -----------------------------
     * 发送即时通知
     * ----------------------------- */
    sendImmediateNotification(title, body, payload = {}) {
        try {
            Notifications.postLocalNotification({
                title,
                body,
                sound: "default",
                silent: false,
                extra: payload,
            });
        } catch (error) {
            if (__DEV__) {
                console.error("Error sending notification:", error);
            }
        }
    }

    /* -----------------------------
     * 发送定时通知
     * ----------------------------- */
    scheduleNotification(title, body, date, payload = {}) {
        try {
            if (!date || date <= new Date()) {
                if (__DEV__) {
                    console.warn("Cannot schedule notification in the past or invalid date");
                }
                return null;
            }

            // 生成唯一通知ID
            const notificationId = `${payload.taskId || 'task'}_${date.getTime()}`;
            
            Notifications.postLocalNotification({
                identifier: notificationId, // 使用identifier以便后续取消
                title,
                body,
                fireDate: date.getTime(), // 毫秒时间戳
                sound: "default",
                silent: false,
                extra: {
                    ...payload,
                    notificationId,
                },
            });

            // 保存通知ID映射
            if (payload.taskId) {
                this.notificationIdMap.set(notificationId, payload.taskId);
                this.saveNotificationIds();
            }

            if (__DEV__) {
                console.log(`📅 Scheduled notification: ${title} at ${date.toLocaleString()}`);
            }

            return notificationId;
        } catch (error) {
            if (__DEV__) {
                console.error("Error scheduling notification:", error);
            }
            return null;
        }
    }

    /* -----------------------------
     * 取消特定任务的所有通知
     * ----------------------------- */
    async cancelTaskNotifications(taskId) {
        try {
            // 找到该任务的所有通知ID
            const notificationIds = [];
            for (const [notifId, tId] of this.notificationIdMap.entries()) {
                if (tId === taskId) {
                    notificationIds.push(notifId);
                    this.notificationIdMap.delete(notifId);
                }
            }

            // 取消这些通知
            for (const notifId of notificationIds) {
                try {
                    // 尝试不同的取消方法
                    if (Notifications.cancelLocalNotification) {
                        Notifications.cancelLocalNotification(notifId);
                    } else if (Notifications.cancelNotification) {
                        Notifications.cancelNotification(notifId);
                    }
                } catch (error) {
                    if (__DEV__) {
                        console.warn(`Failed to cancel notification ${notifId}:`, error);
                    }
                }
            }

            await this.saveNotificationIds();

            if (__DEV__) {
                console.log(`🗑️ Cancelled ${notificationIds.length} notifications for task ${taskId}`);
            }
        } catch (error) {
            if (__DEV__) {
                console.error("Error canceling task notifications:", error);
            }
        }
    }

    /* -----------------------------
     * 取消所有通知
     * ----------------------------- */
    async cancelAll() {
        try {
            // 直接使用逐个取消的方式，避免使用有问题的批量取消API
            // 这是最安全可靠的方法
            const allIds = Array.from(this.notificationIdMap.keys());
            let cancelledCount = 0;
            
            for (const notifId of allIds) {
                try {
                    // 尝试不同的取消API
                    if (typeof Notifications.cancelLocalNotification === 'function') {
                        Notifications.cancelLocalNotification(notifId);
                        cancelledCount++;
                    } else if (typeof Notifications.cancelNotification === 'function') {
                        Notifications.cancelNotification(notifId);
                        cancelledCount++;
                    }
                } catch (e) {
                    // 忽略单个取消错误，继续处理其他通知
                    if (__DEV__) {
                        console.warn(`Failed to cancel notification ${notifId}:`, e.message);
                    }
                }
            }
            
            // 清除映射，无论是否成功取消
            this.notificationIdMap.clear();
            await this.saveNotificationIds();
            
            if (__DEV__) {
                console.log(`🗑️ Cancelled ${cancelledCount} notifications`);
            }
        } catch (error) {
            // 即使出错也清除映射，避免数据不一致
            this.notificationIdMap.clear();
            try {
                await this.saveNotificationIds();
            } catch (e) {
                // 忽略保存错误
            }
            
            if (__DEV__) {
                // 只记录警告，不记录错误，因为这不是致命问题
                console.warn("Some notifications may not have been cancelled (non-critical):", error.message);
            }
        }
    }

    /* -----------------------------
     * 重新调度所有未完成任务的通知
     * ----------------------------- */
    async rescheduleAllTaskNotifications(getReminderOffset, getAllTasks, calculateNotificationDate) {
        try {
            // 先取消所有现有通知
            await this.cancelAll();

            // 获取所有未完成的任务
            const tasks = await getAllTasks();
            const reminderOffset = await getReminderOffset();
            const now = new Date();

            let scheduledCount = 0;

            for (const task of tasks) {
                // 只调度未完成且未过期的任务
                if (!task.completed && new Date(task.dueDate) > now) {
                    const notifyDate = calculateNotificationDate(task.dueDate, reminderOffset);
                    if (notifyDate) {
                        const title = task.type === "assessment" 
                            ? "Upcoming Assessment" 
                            : "Upcoming Task";
                        
                        this.scheduleNotification(
                            title,
                            task.title,
                            notifyDate,
                            { taskId: task.id }
                        );
                        scheduledCount++;
                    }
                }
            }

            if (__DEV__) {
                console.log(`📅 Rescheduled ${scheduledCount} task notifications`);
            }

            return scheduledCount;
        } catch (error) {
            if (__DEV__) {
                console.error("Error rescheduling notifications:", error);
            }
            return 0;
        }
    }
}

export const NotificationServiceInstance = new NotificationService();
