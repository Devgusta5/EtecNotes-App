"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Eu sou a IATEC. Como posso ajudar você hoje?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const scrollViewRef = useRef()
  const { theme } = useTheme()

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "Obrigada pela sua mensagem! Como posso ajudar você com seus estudos hoje?",
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>IATEC</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Ionicons name="restaurant" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerButton,
              styles.headerButtonActive,
              { backgroundColor: theme.colors.primaryLight + "20" },
            ]}
          >
            <Ionicons name="fitness" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageContainer, message.isBot ? styles.botMessage : styles.userMessage]}
          >
            <View
              style={[
                styles.messageBubble,
                message.isBot
                  ? [styles.botBubble, { backgroundColor: theme.colors.surfaceSecondary }]
                  : [styles.userBubble, { backgroundColor: theme.colors.primary }],
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isBot ? [styles.botText, { color: theme.colors.text }] : styles.userText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}
      >
        <View
          style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
        >
          <TouchableOpacity style={styles.inputButton}>
            <Ionicons name="attach" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputButton}>
            <Ionicons name="camera" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={[styles.textInput, { color: theme.colors.text }]}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity style={styles.inputButton}>
            <Ionicons name="mic" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.quickReplyButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.quickReplyText}>Oi</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonActive: {
    backgroundColor: "#EDE9FE",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  botMessage: {
    alignItems: "flex-start",
  },
  userMessage: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    // Color will be set dynamically
  },
  userText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  inputButton: {
    marginHorizontal: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 12,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 4,
  },
  quickReplyButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickReplyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
})
