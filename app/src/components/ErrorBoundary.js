import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        if (__DEV__) {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Oops! Something went wrong</Text>
                    <Text style={styles.message}>
                        {this.state.error?.message || "An unexpected error occurred"}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            this.setState({ hasError: false, error: null });
                        }}
                    >
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});

