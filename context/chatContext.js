/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useReducer, useState } from "react";
import { useAuth } from "./authContext";
const chatContext = createContext();

export const ChatContextProvider = ({ children }) => {

    const data = '';
    const { currentUser } = useAuth();

    const [users, setUsers] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    const [inputText, setInputText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [editMsg, setEditMsg] = useState(null);
    const [isTyping, setIsTyping] = useState(null);
    const [imageViewer, setImageViewer] = useState(null);
    const [chatGotSelected, setChatGotSelected] = useState(true)
    const INITIAL_STATE = {
        chatId: '',
        user: null
    }
    const resetFooterState = () => {
        setInputText('')
        setAttachment(null)
        setAttachmentPreview(null)
        setEditMsg(null)
        setImageViewer(null)
    }
    const chatReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_USER': return {
                user: action.payload,
                chatId: currentUser?.uid > action?.payload?.uid ? currentUser?.uid + action?.payload?.uid : action?.payload?.uid + currentUser.uid
            }

            case "EMPTY":
                return INITIAL_STATE;
            default: state
        }
    }
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)
    return (
        <chatContext.Provider value={{ chatGotSelected, setChatGotSelected , attachment, resetFooterState, setAttachment, imageViewer, setImageViewer, isTyping, setIsTyping, editMsg, setEditMsg, inputText, setInputText, attachmentPreview, setAttachmentPreview, data: state, dispatch, users, setUsers, chats, setChats, selectedChat, setSelectedChat }}>
            {children}
        </chatContext.Provider>
    );
};

export const useChatContext = () => useContext(chatContext);