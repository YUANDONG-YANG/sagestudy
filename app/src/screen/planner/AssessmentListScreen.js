import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import PurpleHeader from "../../components/PurpleHeader";
import PurpleCard from "../../components/PurpleCard";

import { getAllTasks, updateTask } from "../../storage/TasksStorage";

export default function AssessmentListScreen({ navigation }) {
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadAssessments);
        return unsubscribe;
    }, [navigation]);

    const loadAssessments = async () => {
        const tasks = await getAllTasks();
        const onlyAssessments = tasks.filter((t) => t.type === "assessment");

        // sort by due date
        onlyAssessments.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );

        setAssessments(onlyAssessments);
    };

    const toggleComplete = async (item) => {
        const updated = { ...item, completed: !item.completed };
        await updateTask(updated);
        loadAssessments();
    };

    const timeLeftText = (dueDate) => {
        const now = new Date();
        const target = new Date(dueDate);
        const diff = target - now;

        if (diff <= 0) return "Expired";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Tomorrow";
        return `${days} days left`;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("TaskDetail", { taskId: item.id })
            }
            onLongPress={() => toggleComplete(item)}
        >
            <PurpleCard style={styles.card}>
                <View style={styles.row}>
                    {/* Left icon */}
                    <View style={styles.iconBox}>
                        <Icon
                            name="event"
                            size={28}
                            color="#F5A623"
                        />
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.title,
                                item.completed && {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                },
                            ]}
                        >
                            {item.title}
                        </Text>

                        <Text style={styles.timeText}>
                            Due: {new Date(item.dueDate).toLocaleString()}
                        </Text>

                        <Text
                            style={[
                                styles.timeLeft,
                                timeLeftText(item.dueDate) === "Expired" && {
                                    color: "red",
                                },
                            ]}
                        >
                            {timeLeftText(item.dueDate)}
                        </Text>
                    </View>

                    {/* Status Badge */}
                    <TouchableOpacity
                        style={[
                            styles.statusBadge,
                            item.completed && styles.statusDone,
                        ]}
                        onPress={() => toggleComplete(item)}
                    >
                        <Text style={styles.statusLabel}>
                            {item.completed ? "Done" : "Upcoming"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </PurpleCard>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <PurpleHeader
                title="Assessments"
                onBack={() => navigation.goBack()}
            />

            {/* Empty State */}
            {assessments.length === 0 && (
                <View style={styles.emptyBox}>
                    <Image
                        source={{
                            uri: "https://cdn-icons-png.flaticon.com/512/4076/4076549.png",
                        }}
                        style={styles.emptyImg}
                    />
                    <Text style={styles.emptyText}>No assessments yet</Text>
                    <Text style={styles.emptySub}>You can add assessments from the Planner</Text>
                </View>
            )}

            <FlatList
                data={assessments}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
        </View>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    /* Card */
    card: {
        padding: 16,
        marginBottom: 8,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconBox: {
        width: 40,
        alignItems: "center",
        marginRight: 10,
    },

    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4A3A67",
    },

    timeText: {
        fontSize: 13,
        color: "#777",
        marginTop: 4,
    },

    timeLeft: {
        marginTop: 4,
        color: "#6C4AB6",
        fontWeight: "700",
    },

    statusBadge: {
        backgroundColor: "#EEE",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },

    statusDone: {
        backgroundColor: "#6C4AB6",
    },

    statusLabel: {
        color: "#4A3A67",
        fontWeight: "600",
    },

    /* Empty State */
    emptyBox: {
        alignItems: "center",
        marginTop: 40,
    },

    emptyImg: {
        width: 110,
        height: 110,
        marginBottom: 16,
    },

    emptyText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#4A3A67",
    },

    emptySub: {
        color: "#777",
        marginTop: 4,
    },
});
