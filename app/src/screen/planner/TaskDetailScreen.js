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
} from "../../storage/TasksStorage";

import {
    scheduleTaskNotification,
    cancelNotificationById,
} from "../../notifications/Notifications";

export default function TaskDetailScreen({ route, navigation }) {
    const { taskId } = route.params;

    const [task, setTask] = useState(null);

    const [showDuePicker, setShowDuePicker] = useState(false);
    const [showReminderPicker, setShowReminderPicker] = useState(false);

    useEffect(() => {
        loadTask();
    }, []);

    const loadTask = async () => {
        const t = await getTaskById(taskId);
        if (!t) {
            alert("Task not found");
            navigation.goBack();
            return;
        }
        setTask({
            ...t,
            dueDate: new Date(t.dueDate),
            reminderTime: new Date(t.reminderTime),
        });
    };

    const saveChanges = async () => {
        const updated = {
            ...task,
            dueDate: task.dueDate.toISOString(),
            reminderTime: task.reminderTime.toISOString(),
        };

        await updateTask(updated);
        scheduleTaskNotification(updated);

        alert("Task updated");
        navigation.goBack();
    };

    const toggleComplete = async () => {
        const updated = {
            ...task,
            completed: !task.completed,
        };
        await updateTask(updated);
        scheduleTaskNotification(updated);
        setTask(updated);
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: removeTask,
                },
            ]
        );
    };

    const removeTask = async () => {
        await deleteTask(task.id);
        cancelNotificationById(task.id);
        navigation.goBack();
    };

    if (!task) return null;

    return (
        <View style={styles.container}>
            <PurpleHeader title="Task Details" onBack={() => navigation.goBack()} />

            <PurpleCard>
                <PurpleInput
                    label="Title"
                    value={task.title}
                    onChangeText={(v) => setTask({ ...task, title: v })}
                />

                <PurpleInput
                    label="Description"
                    value={task.desc}
                    placeholder="Add notes..."
                    multiline
                    onChangeText={(v) => setTask({ ...task, desc: v })}
                />

                {/* Type Selector */}
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
                        onPress={() => setTask({ ...task, type: "assessment" })}
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
                            if (selected) setTask({ ...task, dueDate: selected });
                        }}
                    />
                )}

                {/* Reminder */}
                <Text style={styles.label}>Reminder Time</Text>
                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowReminderPicker(true)}
                >
                    <Text style={styles.dateText}>
                        {task.reminderTime.toLocaleString()}
                    </Text>
                </TouchableOpacity>

                {showReminderPicker && (
                    <DateTimePicker
                        value={task.reminderTime}
                        mode="datetime"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selected) => {
                            setShowReminderPicker(false);
                            if (selected)
                                setTask({ ...task, reminderTime: selected });
                        }}
                    />
                )}

                {/* Completed Button */}
                <PurpleButton
                    label={task.completed ? "Mark as Pending" : "Mark as Complete"}
                    onPress={toggleComplete}
                />

                {/* Save Changes */}
                <PurpleButton label="Save Changes" onPress={saveChanges} />

                {/* Delete */}
                <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                    <Text style={styles.deleteText}>Delete Task</Text>
                </TouchableOpacity>
            </PurpleCard>
        </View>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },

    label: {
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 6,
        marginTop: 10,
    },

    /* Type selection */
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
    typeActive: { backgroundColor: "#6C4AB6" },

    typeText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#555",
    },
    typeTextActive: { color: "white" },

    /* Date selector */
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

    /* Delete */
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
