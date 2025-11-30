import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from "react-native";

export default function VerifyEmailScreen({ navigation }) {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);

    const [timeLeft, setTimeLeft] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    // 倒计时启动
    useEffect(() => {
        let interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (value, index) => {
        if (/^\d$/.test(value) || value === "") {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleBackspace = (key, index) => {
        if (key === "Backspace" && code[index] === "" && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const verify = () => {
        const fullCode = code.join("");

        if (fullCode.length < 6) {
            alert("Please enter the full 6-digit code.");
            return;
        }

        alert("Email verified successfully!");

        navigation.navigate("Home");
    };

    const resendCode = () => {
        if (!isResendDisabled) {
            setTimeLeft(60);
            setIsResendDisabled(true);
            alert("A new code has been sent to your email.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <Text style={styles.icon}>📧</Text>
                </View>

                <Text style={styles.title}>Verify Your Email</Text>
                <Text style={styles.subtitle}>
                    We've sent a 6-digit code to your email address
                </Text>
            </View>

            <View style={styles.card}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Check your email inbox and enter the verification code
                    </Text>
                </View>

                <View style={styles.codeRow}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputs.current[index] = ref)}
                            value={digit}
                            maxLength={1}
                            keyboardType="number-pad"
                            onChangeText={(v) => handleChange(v, index)}
                            onKeyPress={({ nativeEvent }) =>
                                handleBackspace(nativeEvent.key, index)
                            }
                            style={styles.codeInput}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.verifyButton} onPress={verify}>
                    <Text style={styles.verifyButtonText}>Verify Email</Text>
                </TouchableOpacity>

                <Text style={styles.question}>Didn't receive the code?</Text>

                <TouchableOpacity
                    style={[
                        styles.resendButton,
                        isResendDisabled && { opacity: 0.4 }
                    ]}
                    disabled={isResendDisabled}
                    onPress={resendCode}
                >
                    <Text style={styles.resendButtonText}>Resend Code</Text>
                </TouchableOpacity>

                <Text style={styles.countdown}>
                    Resend available in {timeLeft} seconds
                </Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.backToLogin}>← Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#667eea",
        paddingHorizontal: 24,
        justifyContent: "center"
    },
    header: {
        alignItems: "center",
        marginBottom: 30
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    icon: {
        fontSize: 45
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff"
    },
    subtitle: {
        color: "#fff",
        opacity: 0.8,
        marginTop: 5,
        fontSize: 14,
        textAlign: "center"
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10
    },
    infoBox: {
        backgroundColor: "#e8f0ff",
        padding: 10,
        borderRadius: 12,
        marginBottom: 20
    },
    infoText: {
        color: "#333",
        textAlign: "center"
    },
    codeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    codeInput: {
        width: 50,
        height: 60,
        borderRadius: 12,
        backgroundColor: "#f2f2f2",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold"
    },
    verifyButton: {
        backgroundColor: "#764ba2",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15
    },
    verifyButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600"
    },
    question: {
        textAlign: "center",
        color: "#555",
        marginBottom: 5
    },
    resendButton: {
        borderWidth: 1,
        borderColor: "#764ba2",
        padding: 10,
        borderRadius: 12
    },
    resendButtonText: {
        textAlign: "center",
        fontSize: 16,
        color: "#764ba2"
    },
    countdown: {
        marginTop: 8,
        textAlign: "center",
        fontSize: 14,
        color: "#555"
    },
    backToLogin: {
        marginTop: 20,
        color: "#fff",
        textAlign: "center",
        textDecorationLine: "underline"
    }
});
