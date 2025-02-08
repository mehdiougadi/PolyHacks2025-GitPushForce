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
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.messageContainer}>
                        {Array.isArray(message) ? (
                            message.map((msg, index) => (
                                <Text key={index} style={styles.message}>
                                    {msg}
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.message}>{message}</Text>
                        )}
                    </View>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    messageContainer: {
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#2b9348',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
        minWidth: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});