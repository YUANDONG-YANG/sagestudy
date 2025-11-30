import PushNotification from "react-native-push-notification";
import { PermissionsAndroid, Platform } from "react-native";

/* -----------------------------
   Android 13+ 通知权限（必须）
-------------------------------- */
if (Platform.OS === "android" && Platform.Version >= 33) {
    PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    ).catch(() => {});
}

/* -----------------------------
    创建通知频道
-------------------------------- */
PushNotification.createChannel(
    {
        channelId: "study_planner",
        channelName: "Study Planner Notifications",
        importance: 4,
        vibrate: true,
        playSound: true,
        soundName: "default",
    },
    (created) =>
        console.log("[Notification Channel]:", created ? "created" : "exists")
);

/* -----------------------------
    创建计划提醒通知
-------------------------------- */
export function scheduleTaskNotification(task) {
    try {
        if (!task.reminderTime) return;

        const reminderDate = new Date(task.reminderTime);
        const now = new Date();
        if (reminderDate <= now) return;

        PushNotification.localNotificationSchedule({
            channelId: "study_planner",
            id: String(task.id),
            title:
                task.type === "assessment"
                    ? "Assessment Reminder"
                    : "Task Reminder",
            message:
                task.type === "assessment"
                    ? `Your assessment "${task.title}" is coming soon.`
                    : `Your task "${task.title}" is due at ${new Date(
                        task.dueDate
                    ).toLocaleTimeString()}.`,
            date: reminderDate,
            allowWhileIdle: true,
            playSound: true,
            soundName: "default",
        });
    } catch (e) {
        console.log("scheduleTaskNotification error:", e);
    }
}

/* -----------------------------
    取消单个通知
-------------------------------- */
export function cancelNotificationById(id) {
    PushNotification.cancelLocalNotification({ id: String(id) });
}

/* -----------------------------
    更新通知（先删除再添加）
-------------------------------- */
export function updateTaskNotification(task) {
    cancelNotificationById(task.id);
    scheduleTaskNotification(task);
}

/* -----------------------------
    清空所有任务通知
-------------------------------- */
export function cancelAllTaskNotifications() {
    PushNotification.cancelAllLocalNotifications();
}
