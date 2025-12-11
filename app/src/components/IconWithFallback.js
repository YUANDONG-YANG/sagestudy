import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * 带emoji备用的图标组件
 * 如果图标加载失败，自动显示emoji
 */
const iconEmojiMap = {
    // 导航图标
    "home": "🏠",
    "menu-book": "📚",
    "bar-chart": "📊",
    "person": "👤",
    
    // 常用图标
    "search": "🔍",
    "arrow-back": "←",
    "close": "✕",
    "add": "➕",
    "check-circle": "✓",
    "event": "📅",
    "chevron-right": "›",
    "settings": "⚙️",
    "email": "📧",
    "lock": "🔒",
    "volume-up": "🔊",
    "lightbulb": "💡",
    "local-fire-department": "🔥",
    "star": "⭐",
    "emoji-events": "🏆",
    "workspace-premium": "💎",
    "question-answer": "💬",
    "flash-on": "⚡",
    "headset-mic": "🎧",
    "info": "ℹ️",
    "bookmark": "🔖",
    "arrow-forward": "→",
    "schedule": "⏰",
    "notifications": "🔔",
    "policy": "📋",
    "color-lens": "🎨",
    "language": "🌐",
    "help": "❓",
    "logout": "🚪",
    "school": "🎓",
    "history": "🕐",
};

export default function IconWithFallback({ 
    name, 
    size = 24, 
    color = "#6C4AB6", 
    style,
    useEmoji = true // 默认使用emoji，避免图标加载问题
}) {
    const emoji = iconEmojiMap[name] || "•";
    
    // 如果强制使用emoji，直接显示emoji
    if (useEmoji) {
        return (
            <Text style={[{ fontSize: size * 0.85, color, textAlign: 'center' }, style]}>
                {emoji}
            </Text>
        );
    }
    
    // 尝试使用图标，如果失败则回退到emoji
    try {
        return (
            <Icon
                name={name}
                size={size}
                color={color}
                style={style}
            />
        );
    } catch (error) {
        // 如果图标加载失败，显示emoji
        return (
            <Text style={[{ fontSize: size * 0.85, color, textAlign: 'center' }, style]}>
                {emoji}
            </Text>
        );
    }
}

