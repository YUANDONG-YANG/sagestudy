// src/App.jsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Alert,
    TouchableOpacity,
} from 'react-native';

import TodoForm from './components/ToDoForm';
import ToDoList from './components/ToDoList';
import DogAPI from './components/DogAPI';

const App = () => {
    // ✅ A 画面：JSON 文件任务
    const [jsonTodos, setJsonTodos] = useState([]);
    // ✅ B 画面：Dog API 任务
    const [apiTodos, setApiTodos] = useState([]);

    const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'api' | 'json'

    /* ------------ Option A: JSON tasks ------------ */

    const addJsonTodo = (newTodo) => {
        setJsonTodos((prev) => {
            const updated = [...prev, newTodo];
            console.log('✅ JSON task added:', newTodo);
            return updated;
        });
    };

    const toggleJsonTodoComplete = (todoId) => {
        setJsonTodos((prev) =>
            prev.map((todo) =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteJsonTodo = (todoId) => {
        const todoToDelete = jsonTodos.find((t) => t.id === todoId);
        if (!todoToDelete) return;

        Alert.alert(
            '🗑️ Delete Task',
            `Are you sure you want to delete "${todoToDelete.text}"?`,
            [
                { text: '✖️ Cancel', style: 'cancel' },
                {
                    text: '🗑️ Delete',
                    style: 'destructive',
                    onPress: () => {
                        setJsonTodos((prev) => prev.filter((t) => t.id !== todoId));
                    },
                },
            ]
        );
    };

    /* ------------ Option B: API tasks ------------ */

    const addDogTask = (dogTask) => {
        setApiTodos((prev) => {
            const updated = [...prev, dogTask];
            console.log('🐕 Dog task added:', dogTask);
            return updated;
        });
    };

    const toggleApiTodoComplete = (todoId) => {
        setApiTodos((prev) =>
            prev.map((todo) =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteApiTodo = (todoId) => {
        const todoToDelete = apiTodos.find((t) => t.id === todoId);
        if (!todoToDelete) return;

        Alert.alert(
            '🗑️ Delete Dog Task',
            `Are you sure you want to delete "${todoToDelete.text}"?`,
            [
                { text: '✖️ Cancel', style: 'cancel' },
                {
                    text: '🗑️ Delete',
                    style: 'destructive',
                    onPress: () => {
                        setApiTodos((prev) => prev.filter((t) => t.id !== todoId));
                    },
                },
            ]
        );
    };

    /* ------------ Stats ------------ */

    const jsonStats = {
        total: jsonTodos.length,
        completed: jsonTodos.filter((t) => t.completed).length,
    };
    jsonStats.pending = jsonStats.total - jsonStats.completed;

    const apiStats = {
        total: apiTodos.length,
        completed: apiTodos.filter((t) => t.completed).length,
    };
    apiStats.pending = apiStats.total - apiStats.completed;

    /* ------------ Screens ------------ */

    const renderHomeScreen = () => (
        <View style={styles.homeContainer}>
            <Text style={styles.appTitle}>📱 Todo Lab App</Text>
            <Text style={styles.appSubtitle}>Choose one option to continue:</Text>

            {/* Option A - JSON */}
            <View style={styles.optionCard}>
                <Text style={styles.optionLabel}>Option A</Text>
                <Text style={styles.optionTitle}>Tasks from JSON File</Text>
                <Text style={styles.optionDescription}>
                    Load predefined tasks from a local JSON file and add them randomly to your todo list.
                </Text>
                <TouchableOpacity
                    style={styles.optionButtonPrimary}
                    onPress={() => setCurrentScreen('json')}
                >
                    <Text style={styles.optionButtonText}>📂 Go to JSON Tasks</Text>
                </TouchableOpacity>
            </View>

            {/* Option B - API */}
            <View style={styles.optionCard}>
                <Text style={styles.optionLabel}>Option B</Text>
                <Text style={styles.optionTitle}>Random Dog API</Text>
                <Text style={styles.optionDescription}>
                    Fetch random dogs from the public RandomDog API and turn them into fun todo tasks.
                </Text>
                <TouchableOpacity
                    style={styles.optionButtonSecondary}
                    onPress={() => setCurrentScreen('api')}
                >
                    <Text style={styles.optionButtonText}>🐕 Go to API Screen</Text>
                </TouchableOpacity>
            </View>

            {/* 简单总览：两个列表分开统计 */}
            <View style={styles.homeStatsCard}>
                <Text style={styles.homeStatsTitle}>JSON Tasks</Text>
                <Text style={styles.homeStatsText}>
                    Total: {jsonStats.total}  •  Completed: {jsonStats.completed}  •  Pending: {jsonStats.pending}
                </Text>
                <Text style={[styles.homeStatsTitle, { marginTop: 8 }]}>API Tasks</Text>
                <Text style={styles.homeStatsText}>
                    Total: {apiStats.total}  •  Completed: {apiStats.completed}  •  Pending: {apiStats.pending}
                </Text>
            </View>
        </View>
    );

    const renderApiScreen = () => (
        <View style={styles.screenContainer}>
            <View className="screenHeader" style={styles.screenHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setCurrentScreen('home')}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Option B – Random Dog API</Text>
            </View>

            <View style={styles.screenContent}>
                {/* B 画面：DogAPI + 自己的 ToDoList（只显示 API 生成的任务） */}
                <DogAPI onAddDogTask={addDogTask} />

                <ToDoList
                    todos={apiTodos}
                    onToggleComplete={toggleApiTodoComplete}
                    onDeleteTodo={deleteApiTodo}
                />
            </View>
        </View>
    );

    const renderJsonScreen = () => (
        <View style={styles.screenContainer}>
            <View style={styles.screenHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setCurrentScreen('home')}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Option A – JSON Tasks</Text>
            </View>

            <View style={styles.screenContent}>
                {/* A 画面：JSON 随机任务 + 自己的 TodoList（只显示 JSON 任务） */}
                <TodoForm
                    onAddTodo={addJsonTodo}
                    existingTodos={jsonTodos}
                />
                <ToDoList
                    todos={jsonTodos}
                    onToggleComplete={toggleJsonTodoComplete}
                    onDeleteTodo={deleteJsonTodo}
                />
            </View>
        </View>
    );

    let content;
    if (currentScreen === 'api') {
        content = renderApiScreen();
    } else if (currentScreen === 'json') {
        content = renderJsonScreen();
    } else {
        content = renderHomeScreen();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#f8f9fa"
                translucent={false}
            />
            {content}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },

    /* ---------- Home Screen ---------- */
    homeContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 24,
    },
    appTitle: {
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 6,
        color: '#222',
    },
    appSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    optionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    optionLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#007AFF',
        marginBottom: 4,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
        color: '#111',
    },
    optionDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
    },
    optionButtonPrimary: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    optionButtonSecondary: {
        backgroundColor: '#34C759',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    optionButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    homeStatsCard: {
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#e8f0fe',
    },
    homeStatsTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        color: '#1a3c8b',
    },
    homeStatsText: {
        fontSize: 13,
        color: '#304267',
    },

    /* ---------- Shared Screen Layout ---------- */
    screenContainer: {
        flex: 1,
    },
    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
    },
    backButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    screenTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },
    screenContent: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
});

export default App;
