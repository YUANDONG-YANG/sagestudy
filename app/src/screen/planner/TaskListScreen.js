import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
} from "react-native";
import IconWithFallback from "../../components/IconWithFallback";

import PurpleHeader from "../../components/PurpleHeader";
import TaskCard from "../../components/TaskCard";
import EmptyState from "../../components/EmptyState";
import { getAllTasks, updateTask, deleteTask } from "../../data/planner/TasksStorage";

export default function TaskListScreen({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadTasks);
        loadTasks(); // Initial load
        return unsubscribe;
    }, [navigation]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await getAllTasks();
            setTasks(data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
        } catch (error) {
            Alert.alert("Error", "Failed to load tasks. Please try again.");
            if (__DEV__) {
                console.error("Error loading tasks:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleComplete = async (task) => {
        try {
            const updated = { ...task, completed: !task.completed };
            await updateTask(updated);
            await loadTasks();
        } catch (error) {
            Alert.alert("Error", "Failed to update task. Please try again.");
            if (__DEV__) {
                console.error("Error updating task:", error);
            }
        }
    };

    const renderItem = ({ item }) => (
        <TaskCard
            task={item}
            onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
            onLongPress={() => toggleComplete(item)}
            onToggleComplete={() => toggleComplete(item)}
        />
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <PurpleHeader title="My Tasks" onBack={() => navigation.goBack()} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6C4AB6" />
                    <Text style={styles.loadingText}>Loading tasks...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PurpleHeader title="My Tasks" onBack={() => navigation.goBack()} />

            {/* Empty state */}
            {tasks.length === 0 && (
                <EmptyState
                    title="No tasks yet"
                    subtitle="Tap + to add a new task"
                />
            )}

            {/* List */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={10}
            />

            {/* FAB button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("AddTask")}
            >
                <IconWithFallback name="add" size={30} color="#fff" useEmoji={true} />
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
    /* Loading */
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        color: "#777",
        fontSize: 14,
    },
});
