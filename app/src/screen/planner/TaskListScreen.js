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
import { getAllTasks, updateTask, deleteTask } from "../../storage/TasksStorage";

export default function TaskListScreen({ navigation }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadTasks);
        return unsubscribe;
    }, [navigation]);

    const loadTasks = async () => {
        const data = await getAllTasks();
        setTasks(data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
    };

    const toggleComplete = async (task) => {
        const updated = { ...task, completed: !task.completed };
        await updateTask(updated);
        loadTasks();
    };

    const timeLeftLabel = (due) => {
        const now = new Date();
        const target = new Date(due);
        const diff = target - now;

        if (diff <= 0) return "Expired";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Tomorrow";
        return `${days} days left`;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
            onLongPress={() => toggleComplete(item)}
        >
            <PurpleCard style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Icon
                            name={item.type === "assessment" ? "event" : "check-circle"}
                            size={28}
                            color={item.type === "assessment" ? "#F5A623" : "#6C4AB6"}
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.title,
                                item.completed && { textDecorationLine: "line-through", opacity: 0.5 },
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
                                timeLeftLabel(item.dueDate) === "Expired" && { color: "red" },
                            ]}
                        >
                            {timeLeftLabel(item.dueDate)}
                        </Text>
                    </View>

                    {/* Completed Toggle Badge */}
                    <TouchableOpacity
                        style={[
                            styles.statusBadge,
                            item.completed && styles.statusDone,
                        ]}
                        onPress={() => toggleComplete(item)}
                    >
                        <Text style={styles.statusText}>
                            {item.completed ? "Done" : "Pending"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </PurpleCard>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <PurpleHeader title="My Tasks" onBack={() => navigation.goBack()} />

            {/* 空状态 */}
            {tasks.length === 0 && (
                <View style={styles.emptyBox}>
                    <Image
                        source={{
                            uri: "https://cdn-icons-png.flaticon.com/512/4076/4076549.png",
                        }}
                        style={styles.emptyImg}
                    />
                    <Text style={styles.emptyText}>No tasks yet</Text>
                    <Text style={styles.emptySub}>Tap + to add a new task</Text>
                </View>
            )}

            {/* 列表 */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            {/* FAB 按钮 */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("AddTask")}
            >
                <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    /* 卡片 */
    card: {
        padding: 16,
        marginBottom: 6,
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
        color: "#6C4AB6",
        fontWeight: "700",
        marginTop: 4,
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

    statusText: {
        color: "#4A3A67",
        fontWeight: "600",
    },

    /* 空状态 */
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
        marginTop: 6,
        color: "#777",
    },

    /* FAB */
    fab: {
        position: "absolute",
        bottom: 30,
        right: 26,
        backgroundColor: "#6C4AB6",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
    },
});
