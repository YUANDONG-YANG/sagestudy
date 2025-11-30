import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "TASKS_DATA";

export async function getTasks() {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (err) {
        console.log("Error reading tasks:", err);
        return [];
    }
}

export async function saveTask(task) {
    try {
        const tasks = await getTasks();
        const newTask = { ...task, id: uuidv4() };
        tasks.push(newTask);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return newTask;
    } catch (err) {
        console.log("Error saving task:", err);
    }
}

export async function updateTask(updatedTask) {
    try {
        const tasks = await getTasks();
        const newList = tasks.map((t) =>
            t.id === updatedTask.id ? updatedTask : t
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
        console.log("Error updating task:", err);
    }
}

export async function deleteTask(taskId) {
    try {
        const tasks = await getTasks();
        const newList = tasks.filter((t) => t.id !== taskId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
        console.log("Error deleting task:", err);
    }
}

export async function toggleComplete(taskId) {
    try {
        const tasks = await getTasks();
        const newList = tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
        console.log("Toggle complete error:", err);
    }
}

export async function getTasksByDate(dateString) {
    try {
        const tasks = await getTasks();
        return tasks.filter(
            (t) => t.dueDate.split("T")[0] === dateString
        );
    } catch (err) {
        console.log("Get tasks by date error:", err);
        return [];
    }
}

export async function getUpcomingAssessments() {
    try {
        const tasks = await getTasks();
        const now = new Date();
        return tasks.filter(
            (t) => t.type === "assessment" && new Date(t.dueDate) >= now
        );
    } catch (err) {
        console.log("Upcoming assessments error:", err);
        return [];
    }
}
