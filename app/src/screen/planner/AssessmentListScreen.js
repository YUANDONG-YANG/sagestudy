import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    Alert,
} from "react-native";

import PurpleHeader from "../../components/PurpleHeader";
import TaskCard from "../../components/TaskCard";
import EmptyState from "../../components/EmptyState";
import { getAllTasks, updateTask } from "../../data/planner/TasksStorage";

export default function AssessmentListScreen({ navigation }) {
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadAssessments);
        return unsubscribe;
    }, [navigation]);

    const loadAssessments = async () => {
        try {
            const tasks = await getAllTasks();
            const onlyAssessments = tasks.filter((t) => t.type === "assessment");

            // sort by due date
            onlyAssessments.sort(
                (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
            );

            setAssessments(onlyAssessments);
        } catch (error) {
            Alert.alert("Error", "Failed to load assessments. Please try again.");
            if (__DEV__) {
                console.error("Error loading assessments:", error);
            }
        }
    };

    const toggleComplete = async (item) => {
        try {
            const updated = { ...item, completed: !item.completed };
            await updateTask(updated);
            await loadAssessments();
        } catch (error) {
            Alert.alert("Error", "Failed to update assessment. Please try again.");
            if (__DEV__) {
                console.error("Error updating assessment:", error);
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

    return (
        <View style={styles.container}>
            <PurpleHeader
                title="Assessments"
                onBack={() => navigation.goBack()}
            />

            {/* Empty State */}
            {assessments.length === 0 && (
                <EmptyState
                    title="No assessments yet"
                    subtitle="You can add assessments from the Planner"
                />
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
});
