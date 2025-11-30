import { Notifications } from "react-native-notifications";
import { Platform, PermissionsAndroid } from "react-native";

class NotificationService {

    /* -----------------------------
     * ANDROID 13+ 权限请求
     * ----------------------------- */
    async requestPermissions() {
        if (Platform.OS !== "android") return;

        if (Platform.Version >= 33) {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );

            console.log("🔔 Android Notification Permission:", result);
        }
    }

    /* -----------------------------
     * 初始化监听事件
     * ----------------------------- */
    registerListeners() {
        // 注册成功（接收 token）
        Notifications.events().registerRemoteNotificationsRegistered((event) => {
            console.log("📲 Device Push Token:", event.deviceToken);
        });

        // 注册失败
        Notifications.events().registerRemoteNotificationsRegistrationFailed(
            (event) => {
                console.log("❌ Failed to register:", event);
            }
        );

        // 点击通知
        Notifications.events().registerNotificationOpened(
            (notification, completion) => {
                console.log("🔔 Notification opened:", notification);
                completion();
            }
        );

        // 收到通知
        Notifications.events().registerNotificationReceivedForeground(
            (notification, completion) => {
                console.log("📨 Notification received in foreground:", notification);
                completion({ alert: true, sound: true, badge: false });
            }
        );
    }

    /* -----------------------------
     * 发送即时通知
     * ----------------------------- */
    sendImmediateNotification(title, body, payload = {}) {
        Notifications.postLocalNotification({
            title,
            body,
            sound: "default",
            silent: false,
            extra: payload,
        });
    }

    /* -----------------------------
     * 发送定时通知
     * ----------------------------- */
    scheduleNotification(title, body, date, payload = {}) {
        Notifications.postLocalNotification({
            title,
            body,
            fireDate: date.getTime(), // 毫秒时间戳
            sound: "default",
            silent: false,
            extra: payload,
        });
    }

    /* -----------------------------
     * 取消所有通知
     * ----------------------------- */
    cancelAll() {
        Notifications.cancelAllLocalNotifications();
    }
}

export const NotificationServiceInstance = new NotificationService();
