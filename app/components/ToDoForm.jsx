import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';

// 正确的导入路径：从 components 文件夹到 src/data/tasks.json
import tasksData from '../src/data/tasks.json';

const TodoForm = ({onAddTodo, existingTodos = []}) => {
    // State management
    const [taskInput, setTaskInput] = useState('');
    const [availableTasks, setAvailableTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);

    // Load tasks from JSON file using useEffect
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Load tasks from imported JSON
                const tasks = tasksData.tasks;

                if (tasks && Array.isArray(tasks)) {
                    setAvailableTasks(tasks);
                    console.log('✅ Tasks loaded from JSON file:', tasks.length);
                } else {
                    throw new Error('Invalid task data format');
                }
            } catch (error) {
                console.error('❌ Error loading tasks:', error);
                Alert.alert('Error', 'Failed to load task data.');
                setAvailableTasks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // 🔄 监听existingTodos变化，实时更新组件状态
    useEffect(() => {
        console.log('🔄 TodoForm detected existingTodos change:', existingTodos.length);

        // 如果当前选中的任务已经存在于列表中，清除选择
        if (selectedTask && isTaskDuplicate(selectedTask.title)) {
            console.log('🧹 Clearing selected task because it now exists in the list');
            setSelectedTask(null);
            setTaskInput('');
        }
    }, [existingTodos]); // 每当existingTodos改变时触发

    // 🔍 检查任务是否已存在（不区分大小写，去除前后空格）
    const isTaskDuplicate = (taskTitle) => {
        if (!taskTitle) return false;
        return existingTodos.some(todo =>
            todo.text && todo.text.toLowerCase().trim() === taskTitle.toLowerCase().trim()
        );
    };

    // 🎯 获取未添加的任务（过滤掉已存在的）
    const getAvailableUnaddedTasks = () => {
        return availableTasks.filter(task => !isTaskDuplicate(task.title));
    };

    // 📊 获取实时任务统计信息
    const getTaskStatistics = () => {
        const unaddedTasks = getAvailableUnaddedTasks();
        const addedCount = existingTodos.length;
        const totalAvailable = availableTasks.length;
        const completedCount = existingTodos.filter(todo => todo.completed).length;
        const pendingCount = addedCount - completedCount;

        return {
            total: totalAvailable,
            available: unaddedTasks.length,
            added: addedCount,
            completed: completedCount,
            pending: pendingCount,
            completionPercentage: totalAvailable > 0 ? Math.round((addedCount / totalAvailable) * 100) : 0
        };
    };

    // 🎲 随机选择一个未添加的任务
    const handleGenerateRandomTask = () => {
        const unaddedTasks = getAvailableUnaddedTasks();

        // 检查是否还有未添加的任务
        if (unaddedTasks.length === 0) {
            Alert.alert(
                '🎉 All Tasks Completed!',
                'Congratulations! You have added all available tasks to your list.\n\n🏆 Great job on your productivity!',
                [{text: '🌟 Awesome!', style: 'default'}]
            );
            return;
        }

        try {
            // 随机选择一个未添加的任务
            const randomIndex = Math.floor(Math.random() * unaddedTasks.length);
            const randomTask = unaddedTasks[randomIndex];

            console.log('🎲 Random task selected (not duplicate):', randomTask);

            setTaskInput(randomTask.title);
            setSelectedTask(randomTask);

            const stats = getTaskStatistics();

            Alert.alert(
                '🎲 Random Task Generated!',
                `Task: ${randomTask.title}\n\nDescription: ${randomTask.description}\n\n📊 Current Progress:\n• Added: ${stats.added}/${stats.total} (${stats.completionPercentage}%)\n• Completed: ${stats.completed}\n• Pending: ${stats.pending}\n• Available: ${stats.available - 1} after adding this`,
                [{text: '👍 Got it!', style: 'default'}]
            );
        } catch (error) {
            console.error('❌ Error generating random task:', error);
            Alert.alert(
                '⚠️ Error',
                'Unable to generate a random task. Please try again.',
                [{text: 'OK', style: 'default'}]
            );
        }
    };

    // ➕ 处理添加任务到列表
    const handleAddTaskToList = () => {
        const trimmedInput = taskInput.trim();

        // 检查输入是否为空
        if (trimmedInput === '') {
            Alert.alert(
                '⚠️ Empty Task',
                'Please generate a task first by clicking the "Generate Random Task" button.',
                [{text: 'OK', style: 'default'}]
            );
            return;
        }

        // 🚫 关键：防止添加重复任务
        if (isTaskDuplicate(trimmedInput)) {
            Alert.alert(
                '⚠️ Duplicate Task Detected!',
                `The task "${trimmedInput}" has already been added to your list.\n\nWould you like to generate a different task?`,
                [
                    {
                        text: '🎲 Generate New Task',
                        onPress: handleGenerateRandomTask,
                        style: 'default'
                    },
                    {
                        text: '❌ Cancel',
                        style: 'cancel'
                    }
                ]
            );
            return;
        }

        // 创建新任务对象
        const newTodo = {
            id: Date.now().toString(),
            text: trimmedInput,
            completed: false,
            ...(selectedTask && {
                description: selectedTask.description,
                originalId: selectedTask.id
            })
        };

        // 添加任务到列表
        onAddTodo(newTodo);

        // 清理状态
        setTaskInput('');
        setSelectedTask(null);

        // 显示成功信息
        const stats = getTaskStatistics();
        const newStats = {
            added: stats.added + 1,
            available: stats.available - 1,
            total: stats.total
        };
        const newPercentage = Math.round((newStats.added / newStats.total) * 100);

        Alert.alert(
            '✅ Task Added Successfully!',
            `Task has been added to your list!\n\n📊 Updated Progress:\n• Added: ${newStats.added}/${newStats.total} (${newPercentage}%)\n• Available: ${newStats.available} remaining`,
            [{text: '🚀 Continue!', style: 'default'}]
        );
    };

    // 🔄 处理文本输入变化
    const handleTextInputChange = (text) => {
        setTaskInput(text);

        // 如果用户清空了输入，也清空选中的任务
        if (text.trim() === '') {
            setSelectedTask(null);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF"/>
                <Text style={styles.loadingText}>Loading task data...</Text>
            </View>
        );
    }

    // 🔄 实时计算统计数据
    const taskStats = getTaskStatistics();
    const isDuplicate = isTaskDuplicate(taskInput);
    const isEmpty = taskInput.trim() === '';

    console.log('📊 Real-time TodoForm stats:', taskStats);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Task</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    📋 Available Tasks: {taskStats.available}/{taskStats.total}
                </Text>
                {taskStats.added > 0 && (
                    <Text style={styles.progressText}>
                        🎯 Progress: {taskStats.completionPercentage}% Complete ({taskStats.added} added)
                    </Text>
                )}
            </View>

            <TextInput
                style={[
                    styles.input,
                    isDuplicate && styles.inputDuplicate
                ]}
                placeholder="Click the button below to generate a random task..."
                value={taskInput}
                onChangeText={handleTextInputChange}
                multiline={true}
                editable={true}
            />

            {/* 🚨 重复警告 */}
            {isDuplicate && (
                <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>
                        ⚠️ This task already exists in your list!
                    </Text>
                </View>
            )}

            {selectedTask && !isDuplicate && (
                <View style={styles.selectedTaskContainer}>
                    <Text style={styles.selectedTaskTitle}>📌 Selected Task Details:</Text>
                    <Text style={styles.selectedTaskDetail}>Title: {selectedTask.title}</Text>
                    <Text style={styles.selectedTaskDetail}>Description: {selectedTask.description}</Text>
                </View>
            )}

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.randomButton,
                        taskStats.available === 0 && styles.buttonDisabled
                    ]}
                    onPress={handleGenerateRandomTask}
                    activeOpacity={0.7}
                    disabled={taskStats.available === 0}
                >
                    <Text style={styles.randomButtonText}>
                        {taskStats.available > 0 ? '🎲 Generate Random Task' : '🎉 All Tasks Added!'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.addButton,
                        (isEmpty || isDuplicate) && styles.addButtonDisabled
                    ]}
                    onPress={handleAddTaskToList}
                    disabled={isEmpty || isDuplicate}
                >
                    <Text style={styles.addButtonText}>
                        {isDuplicate ? '⚠️ Task Already Exists' :
                            isEmpty ? '➕ Add to List' : '➕ Add to List'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        padding: 20,
        margin: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    infoContainer: {
        backgroundColor: '#f0f8ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    infoText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '600',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        minHeight: 80,
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    inputDuplicate: {
        borderColor: '#FF3B30',
        borderWidth: 2,
        backgroundColor: '#ffe6e6',
    },
    warningContainer: {
        backgroundColor: '#ffe6e6',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#FF3B30',
    },
    warningText: {
        fontSize: 14,
        color: '#FF3B30',
        fontWeight: '600',
        textAlign: 'center',
    },
    selectedTaskContainer: {
        backgroundColor: '#e8f5e8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    selectedTaskTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2e7d2e',
        marginBottom: 8,
    },
    selectedTaskDetail: {
        fontSize: 12,
        color: '#333',
        marginBottom: 3,
    },
    buttonsContainer: {
        gap: 12,
    },
    randomButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    randomButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    addButton: {
        backgroundColor: '#34C759',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#34C759',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonDisabled: {
        backgroundColor: '#cccccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        margin: 15,
        borderRadius: 15,
        elevation: 5,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
    },
});

export default TodoForm;