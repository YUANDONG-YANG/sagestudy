import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

/**
 * 空状态组件
 * @param {string} title - 主标题
 * @param {string} subtitle - 副标题
 * @param {string} imageUri - 图片URI（可选）
 */
export default function EmptyState({ title, subtitle, imageUri }) {
    const defaultImageUri = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png";

    return (
        <View style={styles.container}>
            {imageUri && (
                <Image
                    source={{ uri: imageUri || defaultImageUri }}
                    style={styles.image}
                    onError={() => {
                        // 静默处理图片加载错误
                    }}
                />
            )}
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 40,
    },
    image: {
        width: 110,
        height: 110,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#4A3A67",
    },
    subtitle: {
        marginTop: 6,
        color: "#777",
    },
});

