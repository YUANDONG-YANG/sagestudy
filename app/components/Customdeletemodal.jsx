import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal
} from 'react-native';

const CustomDeleteModal = ({
                               visible,
                               taskName,
                               onCancel,
                               onConfirm
                           }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.warningIcon}>⚠️</Text>
                    </View>

                    <Text style={styles.title}>Delete Task</Text>

                    <Text style={styles.message}>
                        Are you sure you want to delete
                    </Text>
                    <Text style={styles.taskName}>"{taskName}"?</Text>
                    <Text style={styles.subMessage}>
                        This action cannot be undone.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>
                                ✖️ Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.deleteButtonText}>
                                🗑️ Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
        minWidth: 300,
        maxWidth: '90%',
    },
    iconContainer: {
        marginBottom: 15,
    },
    warningIcon: {
        fontSize: 48,
        textAlign: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 5,
    },
    taskName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    subMessage: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 25,
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#FF3B30',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FF3B30',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default CustomDeleteModal;