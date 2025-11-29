import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

const TaskItem = ({todo, onToggle, onDelete}) => {
    // 保持原有的安全检查
    if (!todo) {
        console.warn('TaskItem: No todo provided');
        return null;
    }

    const handleDeletePress = () => {
        console.log('🗑️ DELETE BUTTON CLICKED!');
        console.log('Todo to delete:', todo.text);
        console.log('Todo ID:', todo.id);

        if (onDelete && typeof onDelete === 'function') {
            onDelete(todo.id);
        } else {
            console.error('onDelete is not a function:', onDelete);
            Alert.alert('Error', 'Delete function not found');
        }
    };

    // 保持原有的切换处理
    const handleTogglePress = () => {
        console.log('🔄 TOGGLE BUTTON CLICKED!');
        if (onToggle) {
            onToggle(todo.id);
        }
    };

    return (
        <View style={styles.container}>
            {/* 保持原有的左侧内容区域完全不变 */}
            <TouchableOpacity
                style={styles.todoContent}
                onPress={handleTogglePress}
                activeOpacity={0.7}
            >
                <View style={styles.textContainer}>
                    <Text style={[
                        styles.todoText,
                        todo.completed && styles.todoTextCompleted
                    ]}>
                        {todo.text || 'Untitled Task'}
                    </Text>

                    {todo.description && (
                        <Text style={styles.descriptionText}>
                            📝 {todo.description}
                        </Text>
                    )}
                </View>

                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>
                        {todo.completed ? '✅' : '⏳'}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeletePress}
                activeOpacity={0.2}
                hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}
                delayPressIn={0}
                delayPressOut={0}
            >
                <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
    },
    todoContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    todoText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        lineHeight: 22,
    },
    todoTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    descriptionText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
        lineHeight: 16,
    },
    statusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
    },
    statusText: {
        fontSize: 20,
    },
    // 🔧 只优化删除按钮样式
    deleteButton: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        minWidth: 70,
        zIndex: 999,
        elevation: 1,
    },
    deleteText: {
        fontSize: 20,
        color: '#ffffff',
        textAlign: 'center',
    },
});

export default TaskItem;