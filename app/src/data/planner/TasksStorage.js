import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

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

// 获取所有任务（别名函数，保持兼容性）
export async function getAllTasks() {
    return await getTasks();
}

// 根据ID获取任务
export async function getTaskById(taskId) {
    try {
        const tasks = await getTasks();
        return tasks.find((t) => t.id === taskId) || null;
    } catch (err) {
        console.log("Error getting task by id:", err);
        return null;
    }
}

export async function saveTask(task) {
    try {
        const tasks = await getTasks();
        // 如果任务已经有ID，使用它；否则生成新ID
        const newTask = task.id 
            ? { ...task } 
            : { ...task, id: uuid.v4() };
        tasks.push(newTask);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return newTask;
    } catch (err) {
        console.log("Error saving task:", err);
        throw err; // 抛出错误以便调用者处理
    }
}

export async function updateTask(updatedTask) {
    try {
        const tasks = await getTasks();
        const newList = tasks.map((t) =>
            t.id === updatedTask.id ? updatedTask : t
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        return updatedTask;
    } catch (err) {
        console.log("Error updating task:", err);
        throw err;
    }
}

export async function deleteTask(taskId) {
    try {
        const tasks = await getTasks();
        const newList = tasks.filter((t) => t.id !== taskId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
        console.log("Error deleting task:", err);
        throw err;
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
        throw err;
    }
}

export async function getTasksByDate(dateString) {
    try {
        const tasks = await getTasks();
        return tasks.filter(
            (t) => t.dueDate && t.dueDate.split("T")[0] === dateString
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
