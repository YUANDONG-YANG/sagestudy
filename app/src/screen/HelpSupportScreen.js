import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function HelpSupportScreen({ navigation }) {
    const [search, setSearch] = useState("");
    const [filteredFAQ, setFilteredFAQ] = useState([]);
    const [form, setForm] = useState({
        issueType: "",
        subject: "",
        message: "",
        email: "",
    });
    const [open, setOpen] = useState(null);

    const FAQ = [
        {
            q: "How do I set my daily learning goal?",
            a: "Go to Settings > Daily Goal. Choose between 10–50 words per day.",
        },
        {
            q: "How does the spaced repetition system work?",
            a: "SageStudy shows words just before you forget them. Difficult words appear more frequently.",
        },
        {
            q: "Can I use SageStudy offline?",
            a: "Yes! SageStudy works fully offline. All progress is saved on your device.",
        },
        {
            q: "How do I export my learning data?",
            a: "Go to Settings > Export Data to save your word list and stats in CSV format.",
        },
        {
            q: "What should I do if I encounter a bug?",
            a: "Go to Help > Report Issue and describe the problem. We will respond within 24 hours.",
        },
    ];

    const toggle = (index) => {
        LayoutAnimation.easeInEaseOut();
        setOpen(open === index ? null : index);
    };

    const submitForm = () => {
        if (!form.email || !form.subject || !form.message) {
            alert("Please fill all required fields.");
            return;
        }
        alert("Message sent! We will reply within 24 hours.");
        setForm({ issueType: "", subject: "", message: "", email: "" });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Help & Support</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>

                {/* Search */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        <Icon name="search" size={20} color="#6C4AB6" /> Search Help Topics
                    </Text>

                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            placeholder="What can we help you with?"
                            value={search}
                            onChangeText={setSearch}
                            onSubmitEditing={handleSearch}
                        />
                        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                            <Icon name="search" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FAQ */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        <Icon name="question-answer" size={20} color="#6C4AB6" /> Frequently Asked Questions
                    </Text>

                    {filteredFAQ.length === 0 ? (
                        <View style={styles.emptySearchContainer}>
                            <Text style={styles.emptySearchText}>
                                No results found for "{search}"
                            </Text>
                        </View>
                    ) : (
                        filteredFAQ.map((item, i) => {
                            // 找到原始FAQ中的索引用于toggle
                            const originalIndex = FAQ.findIndex(faq => faq.q === item.q);
                            return (
                                <View key={i} style={styles.faqItem}>
                                    <TouchableOpacity onPress={() => toggle(originalIndex)} style={styles.faqHeader}>
                                        <Text style={styles.faqQuestion}>{item.q}</Text>
                                        <Icon
                                            name={open === originalIndex ? "expand-less" : "expand-more"}
                                            size={26}
                                            color="#777"
                                        />
                                    </TouchableOpacity>

                                    {open === originalIndex && (
                                        <Text style={styles.faqAnswer}>{item.a}</Text>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Quick Help Grid */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        <Icon name="flash-on" size={20} color="#6C4AB6" /> Quick Help
                    </Text>

                    <View style={styles.quickGrid}>
                        {[
                            { icon: "play-circle-filled", label: "Getting Started", sub: "Learn basics" },
                            { icon: "menu-book", label: "Study Tips", sub: "Improve learning" },
                            { icon: "settings", label: "Settings Guide", sub: "Customize app" },
                            { icon: "security", label: "Privacy", sub: "Data safety" },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.quickItem}>
                                <View style={styles.quickIconBox}>
                                    <Icon name={item.icon} size={32} color="#6C4AB6" />
                                </View>
                                <Text style={styles.quickLabel}>{item.label}</Text>
                                <Text style={styles.quickSub}>{item.sub}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Contact Support */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        <Icon name="headset-mic" size={20} color="#6C4AB6" /> Contact Support
                    </Text>

                    <Text style={styles.label}>Issue Type</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Bug / Feature Request / Account / Other"
                        value={form.issueType}
                        onChangeText={(v) => setForm({ ...form, issueType: v })}
                    />

                    <Text style={styles.label}>Subject</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Brief issue description"
                        value={form.subject}
                        onChangeText={(v) => setForm({ ...form, subject: v })}
                    />

                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, { height: 100 }]}
                        placeholder="Describe the issue..."
                        multiline
                        value={form.message}
                        onChangeText={(v) => setForm({ ...form, message: v })}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="your@email.com"
                        value={form.email}
                        onChangeText={(v) => setForm({ ...form, email: v })}
                    />

                    <TouchableOpacity onPress={submitForm} style={styles.primaryBtn}>
                        <Text style={styles.primaryBtnText}>Send Message</Text>
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        <Icon name="info" size={20} color="#6C4AB6" /> App Information
                    </Text>

                    <View style={styles.infoRow}>
                        {[
                            { title: "Version", value: "1.0.0" },
                            { title: "Build", value: "2025.01" },
                            { title: "Platform", value: "Mobile" },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.infoItem}>
                                <Text style={styles.infoTitle}>{item.title}</Text>
                                <Text style={styles.infoValue}>{item.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

/* ====================== Styles ======================= */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },

    /* Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6C4AB6",
        paddingVertical: 18,
        paddingHorizontal: 18,
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },
    headerText: {
        color: "white",
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 12,
    },

    /* Cards */
    card: {
        backgroundColor: "#ffffff",
        marginHorizontal: 18,
        marginTop: 20,
        padding: 20,
        borderRadius: 22,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 15,
    },

    /* Search */
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        backgroundColor: "#F3EFFF",
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,
        color: "#4A3A67",
    },
    searchBtn: {
        backgroundColor: "#6C4AB6",
        padding: 12,
        borderRadius: 14,
        marginLeft: 10,
    },

    /* FAQ */
    faqItem: {
        marginBottom: 10,
    },
    faqHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: "600",
        color: "#4A3A67",
        flex: 1,
    },
    faqAnswer: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        color: "#555",
        fontSize: 14,
        lineHeight: 20,
    },

    /* Quick Help Grid */
    quickGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    quickItem: {
        width: "48%",
        backgroundColor: "#F3EFFF",
        padding: 18,
        borderRadius: 16,
        marginBottom: 14,
        alignItems: "center",
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    quickIconBox: {
        backgroundColor: "#ffffff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
    },
    quickLabel: { fontWeight: "700", marginTop: 4, color: "#4A3A67" },
    quickSub: { color: "#777", fontSize: 12 },

    /* Contact */
    label: {
        fontWeight: "700",
        color: "#4A3A67",
        marginBottom: 6,
        marginTop: 4,
    },
    primaryBtn: {
        backgroundColor: "#6C4AB6",
        paddingVertical: 14,
        borderRadius: 18,
        marginTop: 12,
        shadowColor: "#6C4AB6",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    primaryBtnText: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },

    /* App Info */
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    infoItem: {
        flex: 1,
        alignItems: "center",
    },
    infoTitle: {
        color: "#6C4AB6",
        fontWeight: "700",
    },
    infoValue: {
        marginTop: 4,
        color: "#555",
    },
    emptySearchContainer: {
        padding: 20,
        alignItems: "center",
    },
    emptySearchText: {
        fontSize: 16,
        color: "#666",
        fontStyle: "italic",
    },
});
