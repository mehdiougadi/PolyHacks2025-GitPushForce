import React, { createContext, useCallback, useContext, useState } from 'react';
import MessagePopUp from '@client/components/popups/msg-popup';

type MessagePopupState = {
    visible: boolean;
    title?: string;
    message: string | string[];
};

type MessageContextType = {
    showMessage: (message: string | string[], title?: string) => void;
    hideMessage: () => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
    const [messageState, setMessageState] = useState<MessagePopupState>({
        visible: false,
        message: '',
    });

    const showMessage = useCallback((message: string | string[], title?: string) => {
        setMessageState({ 
            visible: true, 
            message,
            title 
        });
    }, []);

    const hideMessage = useCallback(() => {
        setMessageState(prev => ({ ...prev, visible: false }));
    }, []);

    return (
        <MessageContext.Provider value={{ showMessage, hideMessage }}>
            {children}
            <MessagePopUp
                visible={messageState.visible}
                message={messageState.message}
                title={messageState.title}
                onClose={hideMessage}
            />
        </MessageContext.Provider>
    );
}

export function useMessage() {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
}