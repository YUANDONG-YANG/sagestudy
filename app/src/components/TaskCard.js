import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import IconWithFallback from "./IconWithFallback";
import PurpleCard from "./PurpleCard";
import { getTimeLeftLabel, isExpired, getTaskIconName, getTaskIconColor } from "../utils/helpers";

/**
 * 任务卡片组件
 * @param {Object} task - 任务对象
 * @param {Function} onPress - 点击回调
 * @param {Function} onLongPress - 长按回调（可选）
 * @param {Function} onToggleComplete - 切换完成状态回调（可选）
 * @param {boolean} showStatusBadge - 是否显示状态徽章
 */
export default function TaskCard({ 
    task, 
    onPress, 
    onLongPress, 
    onToggleComplete,
    showStatusBadge = true 
}) {
    const timeLeft = getTimeLeftLabel(task.dueDate);
    const expired = isExpired(task.dueDate);
    const iconName = getTaskIconName(task.type);
    const iconColor = getTaskIconColor(task.type);

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <PurpleCard style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <IconWithFallback
                            name={iconName}
                            size={28}
                            color={iconColor}
                            useEmoji={true}
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.title,
                                task.completed && {
                                    textDecorationLine: "line-through",
                                    opacity: 0.5,
                                },
                            ]}
                        >
                            {task.title}
                        </Text>

                        <Text style={styles.timeText}>
                            Due: {new Date(task.dueDate).toLocaleString()}
                        </Text>

                        <Text
                            style={[
                                styles.timeLeft,
                                expired && { color: "red" },
                            ]}
                        >
                            {timeLeft}
                        </Text>
                    </View>

                    {showStatusBadge && (
                        <TouchableOpacity
                            style={[
                                styles.statusBadge,
                                task.completed && styles.statusDone,
                            ]}
                            onPress={onToggleComplete}
                        >
                            <Text style={styles.statusText}>
                                {task.completed ? "Done" : "Pending"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </PurpleCard>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
});

