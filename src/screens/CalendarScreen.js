"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")

export default function CalendarScreen() {
  const { theme } = useTheme()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [events, setEvents] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    type: "reminder",
    time: "",
  })

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem("etecnotes-events")
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents))
      }
    } catch (error) {
      console.error("Error loading events:", error)
    }
  }

  const saveEvents = async (updatedEvents) => {
    try {
      await AsyncStorage.setItem("etecnotes-events", JSON.stringify(updatedEvents))
      setEvents(updatedEvents)
    } catch (error) {
      console.error("Error saving events:", error)
    }
  }

  const addReminder = () => {
    if (!newReminder.title.trim()) {
      Alert.alert("Erro", "Por favor, digite um título para o lembrete")
      return
    }

    const reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description,
      type: newReminder.type,
      time: newReminder.time,
      date: selectedDay.toISOString(),
    }

    const updatedEvents = [...events, reminder]
    saveEvents(updatedEvents)

    setNewReminder({ title: "", description: "", type: "reminder", time: "" })
    setShowAddModal(false)
  }

  const deleteReminder = (reminderId) => {
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir este lembrete?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          const updatedEvents = events.filter((event) => event.id !== reminderId)
          saveEvents(updatedEvents)
        },
      },
    ])
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const days = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDay = new Date(year, month, 0 - (firstDayOfMonth - i - 1))
      days.push({ date: prevMonthDay, isCurrentMonth: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i)
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === day.getDate() &&
          eventDate.getMonth() === day.getMonth() &&
          eventDate.getFullYear() === day.getFullYear()
        )
      })

      days.push({
        date: day,
        isCurrentMonth: true,
        hasEvent: dayEvents.some((e) => e.type === "event"),
        hasReminder: dayEvents.some((e) => e.type === "reminder"),
        hasExam: dayEvents.some((e) => e.type === "exam"),
        hasNote: dayEvents.some((e) => e.type === "note"),
      })
    }

    return days
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date) => {
    return (
      date.getDate() === selectedDay.getDate() &&
      date.getMonth() === selectedDay.getMonth() &&
      date.getFullYear() === selectedDay.getFullYear()
    )
  }

  const getSelectedDayEvents = () => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === selectedDay.getDate() &&
        eventDate.getMonth() === selectedDay.getMonth() &&
        eventDate.getFullYear() === selectedDay.getFullYear()
      )
    })
  }

  const days = getDaysInMonth(currentMonth)
  const selectedDayEvents = getSelectedDayEvents()
  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendário</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={styles.monthYear}>
            {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </Text>

          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.calendar}>
          <View style={styles.weekDays}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
              <Text key={index} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  !day.isCurrentMonth && styles.inactiveDay,
                  isToday(day.date) && styles.today,
                  isSelected(day.date) && styles.selected,
                ]}
                onPress={() => setSelectedDay(day.date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    !day.isCurrentMonth && styles.inactiveDayText,
                    isToday(day.date) && styles.todayText,
                    isSelected(day.date) && styles.selectedText,
                  ]}
                >
                  {day.date.getDate()}
                </Text>

                <View style={styles.indicators}>
                  {day.hasEvent && <View style={[styles.indicator, { backgroundColor: "#00B2FF" }]} />}
                  {day.hasReminder && <View style={[styles.indicator, { backgroundColor: "#8C43FF" }]} />}
                  {day.hasExam && <View style={[styles.indicator, { backgroundColor: "#FF4D4D" }]} />}
                  {day.hasNote && <View style={[styles.indicator, { backgroundColor: "#4CAF50" }]} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.eventsTitle}>
            {selectedDay.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>

          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Ionicons
                    name={
                      event.type === "event"
                        ? "calendar"
                        : event.type === "reminder"
                          ? "notifications"
                          : event.type === "exam"
                            ? "school"
                            : "document-text"
                    }
                    size={20}
                    color={
                      event.type === "event"
                        ? "#00B2FF"
                        : event.type === "reminder"
                          ? "#8C43FF"
                          : event.type === "exam"
                            ? "#FF4D4D"
                            : "#4CAF50"
                    }
                  />
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <TouchableOpacity onPress={() => deleteReminder(event.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
                {event.time && <Text style={styles.eventTime}>{event.time}</Text>}
                {event.description && <Text style={styles.eventDescription}>{event.description}</Text>}
              </View>
            ))
          ) : (
            <View style={styles.noEvents}>
              <Ionicons name="calendar-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.noEventsText}>Nenhum evento neste dia</Text>
              <TouchableOpacity style={styles.addEventButton} onPress={() => setShowAddModal(true)}>
                <Text style={styles.addEventButtonText}>Adicionar lembrete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legenda</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#00B2FF" }]} />
              <Text style={styles.legendText}>Evento</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#8C43FF" }]} />
              <Text style={styles.legendText}>Lembrete</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#FF4D4D" }]} />
              <Text style={styles.legendText}>Prova</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#4CAF50" }]} />
              <Text style={styles.legendText}>Nota</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Novo Lembrete</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDate, { color: theme.colors.textSecondary }]}>
              {selectedDay.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Título do lembrete"
              placeholderTextColor={theme.colors.textSecondary}
              value={newReminder.title}
              onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
            />

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Descrição (opcional)"
              placeholderTextColor={theme.colors.textSecondary}
              value={newReminder.description}
              onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Horário (opcional)"
              placeholderTextColor={theme.colors.textSecondary}
              value={newReminder.time}
              onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
            />

            <Text style={[styles.typeLabel, { color: theme.colors.text }]}>Tipo:</Text>
            <View style={styles.typeButtons}>
              {[
                { key: "reminder", label: "Lembrete", color: "#8C43FF", icon: "notifications" },
                { key: "exam", label: "Prova", color: "#FF4D4D", icon: "school" },
                { key: "event", label: "Evento", color: "#00B2FF", icon: "calendar" },
                { key: "note", label: "Nota", color: "#4CAF50", icon: "document-text" },
              ].map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeButton,
                    { borderColor: type.color },
                    newReminder.type === type.key && { backgroundColor: type.color + "20" },
                  ]}
                  onPress={() => setNewReminder({ ...newReminder, type: type.key })}
                >
                  <Ionicons name={type.icon} size={16} color={type.color} />
                  <Text style={[styles.typeButtonText, { color: type.color }]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.border }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.primary }]}
                onPress={addReminder}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    deleteButton: {
      padding: 4,
    },
    addEventButton: {
      marginTop: 16,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    addEventButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "500",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: width - 48,
      borderRadius: 16,
      padding: 24,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
    },
    modalDate: {
      fontSize: 14,
      marginBottom: 24,
      textTransform: "capitalize",
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 16,
    },
    textArea: {
      height: 80,
      textAlignVertical: "top",
    },
    typeLabel: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 12,
    },
    typeButtons: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
    },
    typeButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      gap: 6,
    },
    typeButtonText: {
      fontSize: 14,
      fontWeight: "500",
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    cancelButton: {
      borderWidth: 1,
    },
    saveButton: {},
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "500",
    },
    saveButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "500",
    },
    calendarHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    monthYear: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
      textTransform: "capitalize",
    },
    calendar: {
      marginHorizontal: 24,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
    },
    weekDays: {
      flexDirection: "row",
      marginBottom: 16,
    },
    weekDay: {
      flex: 1,
      textAlign: "center",
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayCell: {
      width: (width - 80) / 7,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      borderRadius: 8,
      position: "relative",
    },
    dayText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    inactiveDay: {
      opacity: 0.3,
    },
    inactiveDayText: {
      color: theme.colors.textSecondary,
    },
    today: {
      backgroundColor: "#00B2FF",
    },
    todayText: {
      color: "white",
      fontWeight: "bold",
    },
    selected: {
      backgroundColor: theme.colors.primary,
    },
    selectedText: {
      color: "white",
      fontWeight: "bold",
    },
    indicators: {
      position: "absolute",
      bottom: 4,
      flexDirection: "row",
      gap: 2,
    },
    indicator: {
      width: 4,
      height: 4,
      borderRadius: 2,
    },
    eventsSection: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    eventsTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
      textTransform: "capitalize",
    },
    eventCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginLeft: 12,
      flex: 1,
    },
    eventTime: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    eventDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    noEvents: {
      alignItems: "center",
      paddingVertical: 40,
    },
    noEventsText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 12,
    },
    legend: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    legendTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    legendItems: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    legendText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  })
