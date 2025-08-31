"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")
const TABS = ["Jornal", "Horários", "Patch", "Eventos"] // Added "Horários"
const INITIAL_TAB = 2 // Updated to keep Patch as initial tab

export default function HomeScreen() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState(INITIAL_TAB)
  const scrollX = useRef(new Animated.Value(-width * INITIAL_TAB)).current
  const scrollViewRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)

  // Controlador de gestos otimizado
  const handleTouchStart = (event) => {
    isDragging.current = true
    startX.current = event.nativeEvent.pageX
  }

  const handleTouchMove = (event) => {
    if (!isDragging.current) return

    const currentX = event.nativeEvent.pageX
    const diff = currentX - startX.current
    const newPosition = -width * activeTab + diff

    // Limita o scroll nas extremidades
    if (
      (activeTab === 0 && diff > 0) || 
      (activeTab === TABS.length - 1 && diff < 0)
    ) {
      return
    }

    scrollX.setValue(newPosition)
  }

  const handleTouchEnd = (event) => {
    if (!isDragging.current) return
    isDragging.current = false

    const currentX = event.nativeEvent.pageX
    const diff = currentX - startX.current
    const moveThreshold = width * 0.2

    let newIndex = activeTab
    if (Math.abs(diff) > moveThreshold) {
      newIndex = diff > 0 ? Math.max(0, activeTab - 1) : Math.min(TABS.length - 1, activeTab + 1)
    }

    switchTab(newIndex)
  }

  const switchTab = (index) => {
    setActiveTab(index)
    Animated.spring(scrollX, {
      toValue: -width * index,
      tension: 68,
      friction: 12,
      useNativeDriver: true,
    }).start()
  }

  const renderContent = (tab) => {
    switch (tab) {
      case "Jornal":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.contentTitle, { color: theme.colors.primary }]}>
              Semana Tecnológica
            </Text>
            <View style={styles.journalImageContainer}>
              <View style={[styles.journalImagePlaceholder, { backgroundColor: theme.colors.surfaceSecondary }]}>
                <Ionicons name="newspaper" size={48} color={theme.colors.primary} />
              </View>
            </View>
            <Text style={[styles.journalDescription, { color: theme.colors.text }]}>
              O Jornal Etec é um periódico voltado para a divulgação de notícias, eventos e atividades da Etec. 
              Seu objetivo é manter alunos, professores e a comunidade escolar atualizados sobre o que acontece 
              dentro da instituição, além de abordar temas relevantes para o ambiente educacional.
            </Text>
          </View>
        )

      case "Horários":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.contentTitle, { color: theme.colors.primary }]}>
              Horários da Semana
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scheduleScrollView}>
              {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((day, dayIndex) => (
                <View key={day} style={[styles.dayCard, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.dayTitle, { color: theme.colors.primary }]}>{day}</Text>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Morning Classes */}
                    <View style={styles.classBlock}>
                      <ClassItem
                        time="08:00 - 08:50"
                        subject="P.W. I, II, III"
                        teacher="Prof. Paulo e William G."
                        theme={theme}
                      />
                      <ClassItem
                        time="08:50 - 09:40"
                        subject="P.W. I, II, III"
                        teacher="Prof. Paulo e William G."
                        theme={theme}
                      />
                      <View style={[styles.breakItem, { backgroundColor: theme.colors.primary + "20" }]}>
                        <Text style={[styles.breakText, { color: theme.colors.primary }]}>Intervalo (09:40 - 10:00)</Text>
                      </View>
                      <ClassItem
                        time="10:00 - 10:50"
                        subject="E.A.C.N.T."
                        teacher="Prof. Elza e Prof. Andreia"
                        theme={theme}
                      />
                      <ClassItem
                        time="10:50 - 11:40"
                        subject="E.A.C.N.T."
                        teacher="Prof. Elza e Prof. Andreia"
                        theme={theme}
                      />
                      <ClassItem
                        time="11:40 - 12:30"
                        subject="Matematica"
                        teacher="Prof. Santos"
                        theme={theme}
                      />
                      <View style={[styles.breakItem, { backgroundColor: theme.colors.primary + "20" }]}>
                        <Text style={[styles.breakText, { color: theme.colors.primary }]}>Almoço (12:30 - 13:30)</Text>
                      </View>
                      <ClassItem
                        time="13:30 - 14:20"
                        subject="Inglês"
                        teacher="Prof. Fidélis"
                        theme={theme}
                      />
                      <ClassItem
                        time="14:20 - 15:10"
                        subject="Matematica"
                        teacher="Prof. William B."
                        theme={theme}
                      />
                      <ClassItem
                        time="15:10 - 16:00"
                        subject="Matematica"
                        teacher="Prof. William B."
                        theme={theme}
                      />
                    </View>
                  </ScrollView>
                </View>
              ))}
            </ScrollView>
          </View>
        )

      case "Patch":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.contentTitle, { color: theme.colors.primary }]}>Patch Notes</Text>
            <View style={styles.patchNotesContainer}>
              {[
                {
                  version: "1.2.0",
                  date: "Abril 2025",
                  notes: [
                    "Novo layout para a aba de Eventos",
                    "Animação adicionada nos ícones da Tab Bar",
                    "Correções de bugs menores e melhorias de desempenho",
                  ],
                },
                // ...outros patch notes...
              ].map((patch, index) => (
                <View key={index} style={[styles.patchNoteCard, { backgroundColor: theme.colors.primary + "20" }]}>
                  <Text style={[styles.patchVersion, { color: theme.colors.text }]}>
                    Versão {patch.version} - {patch.date}
                  </Text>
                  {patch.notes.map((note, i) => (
                    <Text key={i} style={[styles.patchItem, { color: theme.colors.textSecondary }]}>
                      • {note}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )

      case "Eventos":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.contentTitle, { color: theme.colors.primary }]}>Eventos</Text>
            <View style={styles.eventsContainer}>
              {[
                {
                  title: "Semana Tecnológica",
                  date: "10 a 14 de Abril de 2025",
                  description: "Workshops, palestras e desafios para os alunos da Etec.",
                  icon: "school",
                },
                // ...outros eventos...
              ].map((event, index) => (
                <View key={index} style={[styles.eventCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.eventImageContainer}>
                    <View style={[styles.eventImagePlaceholder, { backgroundColor: theme.colors.surfaceSecondary }]}>
                      <Ionicons name={event.icon} size={32} color={theme.colors.primary} />
                    </View>
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: theme.colors.text }]}>{event.title}</Text>
                    <Text style={[styles.eventDate, { color: theme.colors.primary }]}>{event.date}</Text>
                    <Text style={[styles.eventDescription, { color: theme.colors.textSecondary }]}>
                      {event.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )
    }
  }

  // Modifica o estilo dos títulos e adiciona navegação por tabs
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Início</Text>
      </View>

      {/* Tabs de navegação */}
      <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => switchTab(TABS.indexOf(tab))}
            style={[
              styles.tab,
              { 
                backgroundColor: activeTab === TABS.indexOf(tab) 
                  ? `${theme.colors.primary}20`
                  : 'transparent'
              }
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { 
                  color: activeTab === TABS.indexOf(tab) 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary,
                  fontWeight: activeTab === TABS.indexOf(tab) ? '600' : '500'
                }
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo deslizante */}
      <Animated.View
        style={[styles.scrollContainer, { transform: [{ translateX: scrollX }] }]}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {TABS.map((tab) => (
          <View key={tab} style={styles.page}>
            {renderContent(tab)}
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

// Component for individual class items
const ClassItem = ({ time, subject, teacher, theme }) => (
  <View style={[styles.classItem, { backgroundColor: theme.colors.surfaceSecondary }]}>
    <View style={styles.classHeader}>
      <Text style={[styles.classSubject, { color: theme.colors.text }]}>{subject}</Text>
      <Text style={[styles.classTime, { color: theme.colors.textSecondary }]}>{time}</Text>
    </View>
    <Text style={[styles.classTeacher, { color: theme.colors.textSecondary }]}>{teacher}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s',
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width * TABS.length,
  },
  page: {
    width: width,
    overflow: 'hidden',
  },
  tabContent: {
    flex: 1,
    padding: 24,
    paddingBottom: 100,
  },
  journalImageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  journalImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  patchNotesContainer: {
    marginTop: 16,
  },
  patchNoteCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  patchVersion: {
    fontSize: 14,
    fontWeight: "bold",
  },
  patchItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  eventsContainer: {
    marginTop: 16,
  },
  eventCard: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
  },
  contentTitle: {
    fontSize: 32, // Aumentado de 28 para 32
    fontWeight: "800", // Mais bold
    marginBottom: 24,
    textAlign: 'center', // Centralizado
    paddingHorizontal: 24,
  },
  scheduleScrollView: {
    paddingHorizontal: 12,
  },
  dayCard: {
    width: width - 80,
    marginHorizontal: 8,
    borderRadius: 16,
    padding: 16,
    height: 580,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  classBlock: {
    gap: 8,
  },
  classItem: {
    padding: 12,
    borderRadius: 8,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  classSubject: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  classTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  classTeacher: {
    fontSize: 12,
  },
  breakItem: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  breakText: {
    fontSize: 12,
    fontWeight: "500",
  },
})