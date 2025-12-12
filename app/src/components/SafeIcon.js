import React from "react";
import { Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * 安全的图标组件，如果图标加载失败则显示emoji备用
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

export default function SafeIcon({ name, size = 24, color = "#6C4AB6", style, fallback }) {
    const emoji = iconEmojiMap[name] || fallback || "•";
    
    return (
        <Icon
            name={name}
            size={size}
            color={color}
            style={style}
            onError={() => {
                // 图标加载失败时的处理
            }}
        />
    );
}

/**
 * 带emoji备用的图标组件
 */
export function IconWithFallback({ name, size = 24, color = "#6C4AB6", style }) {
    const emoji = iconEmojiMap[name] || "•";
    
    return (
        <Text style={[{ fontSize: size, color }, style]}>
            {emoji}
        </Text>
    );
}


