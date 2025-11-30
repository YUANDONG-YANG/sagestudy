import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid";

import PurpleHeader from "../../components/PurpleHeader";
import PurpleCard from "../../components/PurpleCard";
import PurpleInput from "../../components/PurpleInput";
import PurpleButton from "../../components/PurpleButton";

import { saveTask } from "../../storage/TasksStorage";
import { scheduleTaskNotification } from "../../notifications/Notifications";

export default function AddTaskScreen({ navigation }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [type, setType] = useState("task");

    const [dueDate, setDueDate] = useState(new Date());
    const [showDuePicker, setShowDuePicker] = useState(false);

    const [reminderTime, setReminderTime] = useState(new Date());
    const [showReminderPicker, setShowReminderPicker] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        const id = uuid.v4(); // FIX: Generate unique id

        const newTask = {
            id,
            title,
            desc,
            type,
            dueDate: dueDate.toISOString(),
            reminderTime: reminderTime.toISOString(),
            completed: false,
        };

        await saveTask(newTask);
        scheduleTaskNotification(newTask);

        alert("Task saved!");
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <PurpleHeader title="Add New Task" onBack={() => navigation.goBack()} />

            <PurpleCard>
                <PurpleInput
                    label="Task Title"
                    value={title}
                    placeholder="Enter task name"
                    onChangeText={setTitle}
                />

                <PurpleInput
                    label="Description"
                    value={desc}
                    placeholder="Notes (optional)"
                    onChangeText={setDesc}
                    multiline
                />

                {/* Type Selector */}
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeRow}>
                    <TouchableOpacity
                        style={[styles.typeBtn, type === "task" && styles.typeActive]}
                        onPress={() => setType("task")}
                    >
                        <Text
                            style={[
                                styles.typeText,
                                type === "task" && styles.typeTextActive,
                            ]}
                        >
                            Task
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.typeBtn, type === "assessment" && styles.typeActive]}
                        onPress={() => setType("assessment")}
                    >
                        <Text
                            style={[
                                styles.typeText,
                                type === "assessment" && styles.typeTextActive,
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
                    <Text style={styles.dateText}>{dueDate.toLocaleString()}</Text>
                </TouchableOpacity>

                {showDuePicker && (
                    <DateTimePicker
                        value={dueDate}
                        mode="datetime"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selected) => {
                            setShowDuePicker(false);
                            if (selected) setDueDate(selected);
                        }}
                    />
                )}

                {/* Reminder Time */}
                <Text style={styles.label}>Reminder Time</Text>
                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowReminderPicker(true)}
                >
                    <Text style={styles.dateText}>{reminderTime.toLocaleString()}</Text>
                </TouchableOpacity>

                {showReminderPicker && (
                    <DateTimePicker
                        value={reminderTime}
                        mode="datetime"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selected) => {
                            setShowReminderPicker(false);
                            if (selected) setReminderTime(selected);
                        }}
                    />
                )}

                <PurpleButton label="Save Task" onPress={handleSave} />
            </PurpleCard>
        </View>
    );
}

/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    label: {
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 6,
        marginTop: 10,
    },

    /* Type Buttons */
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

    /* Date Buttons */
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
});
