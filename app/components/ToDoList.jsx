import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet
} from 'react-native';
import TaskItem from './TaskItem';

const ToDoList = ({todos = [], onToggleComplete, onDeleteTodo}) => {
    // 添加默认值和安全检查
    const safeTodos = todos || [];
    const totalTasks = safeTodos.length;
    const completedTasks = safeTodos.filter(todo => todo && todo.completed).length;

    const renderTodoItem = ({item}) => {
        if (!item) return null; // 安全检查

        return (
            <TaskItem
                todo={item}
                onToggle={onToggleComplete}
                onDelete={onDeleteTodo}
            />
        );
    };

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📱</Text>
            <Text style={styles.emptyTitle}>No Tasks Yet</Text>
            <Text style={styles.emptyText}>
                Tap the "Generate Random Task" button above to get started!
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📋 My Todo List</Text>

                {totalTasks > 0 && (
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>
                            Total: {totalTasks} | Completed: {completedTasks} | Pending: {totalTasks - completedTasks}
                        </Text>
                    </View>
                )}
            </View>

            <FlatList
                data={safeTodos}
                keyExtractor={(item, index) => {
                    // 更安全的key提取
                    if (item && item.id) {
                        return item.id.toString();
                    }
                    return index.toString();
                }}
                renderItem={renderTodoItem}
                style={styles.list}
                contentContainerStyle={safeTodos.length === 0 ? styles.emptyListContainer : null}
                ListEmptyComponent={EmptyState}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#ffffff',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 16,
    },
    statsContainer: {
        alignItems: 'center',
    },
    statsText: {
        fontSize: 14,
        color: '#666',
    },
    list: {
        flex: 1,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default ToDoList;