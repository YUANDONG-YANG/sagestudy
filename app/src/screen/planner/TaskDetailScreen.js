import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";

import PurpleHeader from "../../components/PurpleHeader";
import PurpleCard from "../../components/PurpleCard";
import PurpleInput from "../../components/PurpleInput";
import PurpleButton from "../../components/PurpleButton";

import {
    getTaskById,
    updateTask,
    deleteTask,
} from "../../data/planner/TasksStorage";

import { NotificationServiceInstance } from "../../notifications/Notifications";
import { getReminderOffset, calculateNotificationDate } from "../../utils/taskHelpers";

export default function TaskDetailScreen({ route, navigation }) {
    const { taskId } = route.params;

    const [task, setTask] = useState(null);

    const [showDuePicker, setShowDuePicker] = useState(false);

    useEffect(() => {
        loadTask();
    }, []);

    const loadTask = async () => {
        try {
            const t = await getTaskById(taskId);
            if (!t) {
                Alert.alert("Error", "Task not found");
                navigation.goBack();
                return;
            }
            setTask({
                ...t,
                dueDate: new Date(t.dueDate),
            });
        } catch (error) {
            Alert.alert("Error", "Failed to load task. Please try again.");
            if (__DEV__) {
                console.error("Error loading task:", error);
            }
            navigation.goBack();
        }
    };

    if (!task) return null;

    /* -----------------------------
     * 保存修改（含通知更新）
     * ----------------------------- */
    const saveChanges = async () => {
        try {
            const updated = {
                ...task,
                dueDate: task.dueDate.toISOString(),
            };

            await updateTask(updated);

            // Cancel all notifications for this task
            await NotificationServiceInstance.cancelTaskNotifications(updated.id);

        if (!updated.completed) {
            const reminderOffset = await getReminderOffset();
            const notifyDate = calculateNotificationDate(updated.dueDate, reminderOffset);
            
            if (notifyDate) {
                NotificationServiceInstance.scheduleNotification(
                    "Updated Task",
                    updated.title,
                    notifyDate,
                    { taskId: updated.id }
                );
            }
        }

            Alert.alert("Success", "Task updated");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update task. Please try again.");
            if (__DEV__) {
                console.error("Error updating task:", error);
            }
        }
    };

    /* -----------------------------
     * 切换完成状态（并更新通知）
     * ----------------------------- */
    const toggleComplete = async () => {
        try {
            const updated = {
                ...task,
                completed: !task.completed,
            };

            await updateTask(updated);

            // Complete task → cancel notification
            await NotificationServiceInstance.cancelTaskNotifications(updated.id);

        // Restore task → reschedule notification
        if (!updated.completed) {
            const reminderOffset = await getReminderOffset();
            const notifyDate = calculateNotificationDate(updated.dueDate, reminderOffset);
            
            if (notifyDate) {
                NotificationServiceInstance.scheduleNotification(
                    "Upcoming Task",
                    updated.title,
                    notifyDate,
                    { taskId: updated.id }
                );
            }
        }

            setTask(updated);
        } catch (error) {
            Alert.alert("Error", "Failed to update task. Please try again.");
            if (__DEV__) {
                console.error("Error toggling task completion:", error);
            }
        }
    };

    /* -----------------------------
     * 删除任务（并取消通知）
     * ----------------------------- */
    const confirmDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: removeTask },
            ]
        );
    };

    const removeTask = async () => {
        try {
            await deleteTask(task.id);

            // Cancel all notifications for this task
            await NotificationServiceInstance.cancelTaskNotifications(task.id);

            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to delete task. Please try again.");
            if (__DEV__) {
                console.error("Error deleting task:", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <PurpleHeader title="Task Detail" onBack={() => navigation.goBack()} />

            <PurpleCard>
                {/* Title */}
                <PurpleInput
                    label="Title"
                    value={task.title}
                    onChangeText={(v) => setTask({ ...task, title: v })}
                />

                {/* Description */}
                <PurpleInput
                    label="Description"
                    value={task.desc}
                    placeholder="Add notes..."
                    onChangeText={(v) => setTask({ ...task, desc: v })}
                    multiline
                />

                {/* Type */}
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeRow}>
                    <TouchableOpacity
                        style={[
                            styles.typeBtn,
                            task.type === "task" && styles.typeActive,
                        ]}
                        onPress={() => setTask({ ...task, type: "task" })}
                    >
                        <Text
                            style={[
                                styles.typeText,
                                task.type === "task" && styles.typeTextActive,
                            ]}
                        >
                            Task
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeBtn,
                            task.type === "assessment" && styles.typeActive,
                        ]}
                        onPress={() =>
                            setTask({ ...task, type: "assessment" })
                        }
                    >
                        <Text
                            style={[
                                styles.typeText,
                                task.type === "assessment" && styles.typeTextActive,
                            ]}
                        >
                            Assessment
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Due Date */}
                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowDuePicker(true)}
                >
                    <Text style={styles.dateText}>
                        {task.dueDate.toLocaleString()}
                    </Text>
                </TouchableOpacity>

                {showDuePicker && (
                    <DateTimePicker
                        value={task.dueDate}
                        mode="datetime"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selected) => {
                            setShowDuePicker(false);
                            if (selected)
                                setTask({ ...task, dueDate: selected });
                        }}
                    />
                )}

                <PurpleButton
                    label={task.completed ? "Mark as Pending" : "Mark as Complete"}
                    onPress={toggleComplete}
                />

                <PurpleButton label="Save Changes" onPress={saveChanges} />

                <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                    <Text style={styles.deleteText}>Delete Task</Text>
                </TouchableOpacity>
            </PurpleCard>
        </View>
    );
}

/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    label: {
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 6,
        marginTop: 10,
    },

    typeRow: {
        flexDirection: "row",
        marginBottom: 10,
    },
    typeBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: "#EEE",
        marginRight: 8,
        alignItems: "center",
    },
    typeActive: {
        backgroundColor: "#6C4AB6",
    },
    typeText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#555",
    },
    typeTextActive: {
        color: "white",
    },

    dateBtn: {
        backgroundColor: "#F3EFFF",
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
    },
    dateText: {
        color: "#4A3A67",
        fontWeight: "500",
    },

    deleteBtn: {
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: "#FF4D4D",
    },
    deleteText: {
        textAlign: "center",
        color: "white",
        fontWeight: "700",
        fontSize: 15,
    },
});
