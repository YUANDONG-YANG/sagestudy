import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * Icon component with emoji fallback
 * Automatically displays emoji if icon loading fails
 */
const iconEmojiMap = {
    // Navigation icons
    "home": "🏠",
    "menu-book": "📚",
    "bar-chart": "📊",
    "person": "👤",
    
    // Common icons
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
    useEmoji = true // Default to emoji to avoid icon loading issues
}) {
    const emoji = iconEmojiMap[name] || "•";
    
    // If forced to use emoji, display emoji directly
    if (useEmoji) {
        return (
            <Text style={[{ fontSize: size * 0.85, color, textAlign: 'center' }, style]}>
                {emoji}
            </Text>
        );
    }
    
    // Try to use icon, fallback to emoji if it fails
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
        // If icon loading fails, display emoji
        return (
            <Text style={[{ fontSize: size * 0.85, color, textAlign: 'center' }, style]}>
                {emoji}
            </Text>
        );
    }
}

