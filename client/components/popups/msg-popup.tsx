import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

type MessagePopUpProps = {
    visible: boolean;
    message: string | string[];
    onClose: () => void;
    title?: string;
};

export default function MessagePopUp({ 
    visible, 
    message, 
    onClose,
    title = "Message" 
}: MessagePopUpProps) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.messageContainer}>
                        {Array.isArray(message) ? (
                            message.map((msg, index) => (
                                <Text key={index} style={styles.message}>
                                    • {msg}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.message}>{message}</Text>
                        )}
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden',
    },
    header: {
        width: '100%',
        padding: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'left',
    },
    messageContainer: {
        padding: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        textAlign: 'left',
        marginBottom: 8,
    },
    footer: {
        padding: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        alignItems: 'flex-end',
    },
    button: {
        backgroundColor: '#2b9348',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});