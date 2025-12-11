import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import IconWithFallback from "../../components/IconWithFallback";

import PurpleHeader from "../../components/PurpleHeader";
import PurpleCard from "../../components/PurpleCard";
import { getTaskIconName, getTaskIconColor } from "../../utils/helpers";
import { getAllTasks } from "../../data/planner/TasksStorage";

export default function CalendarScreen({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadTasks);
        return unsubscribe;
    }, [navigation]);

    const loadTasks = async () => {
        try {
            const data = await getAllTasks();
            setTasks(data);

            // Ensure selected date stays valid
            const today = new Date().toISOString().split("T")[0];
            if (!selectedDate) setSelectedDate(today);
        } catch (error) {
            Alert.alert("Error", "Failed to load tasks. Please try again.");
            if (__DEV__) {
                console.error("Error loading tasks:", error);
            }
        }
    };

    const tasksForDate = tasks.filter((t) => {
        if (!t.dueDate) return false;
        const d = t.dueDate.split("T")[0];
        return d === selectedDate;
    });

    /* ----------------- Marked Dates (Calendar dots) ----------------- */
    const marked = {};

    tasks.forEach((t) => {
        if (!t.dueDate) return;
        const dateKey = t.dueDate.split("T")[0];
        if (!marked[dateKey]) {
            marked[dateKey] = { dots: [] };
        }

        marked[dateKey].dots.push({
            key: t.id,
            color: getTaskIconColor(t.type),
        });
    });

    // Highlight selected date
    marked[selectedDate] = {
        ...(marked[selectedDate] || {}),
        selected: true,
        selectedColor: "#6C4AB6",
        selectedTextColor: "#fff",
    };

    const renderTask = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
        >
            <PurpleCard style={styles.taskCard}>
                <View style={styles.taskRow}>
                    {/* Icon */}
                    <IconWithFallback
                        name={getTaskIconName(item.type)}
                        size={26}
                        color={getTaskIconColor(item.type)}
                        style={{ marginRight: 12 }}
                        useEmoji={true}
                    />

                    {/* Text */}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text style={styles.taskTime}>
                            {new Date(item.dueDate).toLocaleTimeString()}
                        </Text>
                    </View>
                </View>
            </PurpleCard>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <PurpleHeader
                title="Calendar"
                onBack={() => navigation.goBack()}
            />

            {/* Calendar */}
            <Calendar
                markingType={"multi-dot"}
                markedDates={marked}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                theme={{
                    todayTextColor: "#6C4AB6",
                    arrowColor: "#6C4AB6",
                    monthTextColor: "#4A3A67",
                    textDayFontWeight: "600",
                    textMonthFontWeight: "700",
                    textDayHeaderFontWeight: "700",
                }}
                style={styles.calendar}
            />

            {/* Tasks for selected day */}
            <Text style={styles.sectionTitle}>
                Tasks on {selectedDate}
            </Text>

            {tasksForDate.length === 0 ? (
                <Text style={styles.noTaskText}>No tasks for this day</Text>
            ) : (
                <FlatList
                    data={tasksForDate}
                    renderItem={renderTask}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            )}
        </View>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    calendar: {
        margin: 10,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: "#fff",
        paddingBottom: 10,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#4A3A67",
        marginLeft: 18,
        marginTop: 10,
        marginBottom: 6,
    },

    noTaskText: {
        textAlign: "center",
        marginTop: 10,
        color: "#777",
    },

    taskCard: {
        padding: 18,
        marginHorizontal: 16,
        marginBottom: 8,
    },

    taskRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    taskTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4A3A67",
    },

    taskTime: {
        fontSize: 12,
        marginTop: 4,
        color: "#777",
    },
});
