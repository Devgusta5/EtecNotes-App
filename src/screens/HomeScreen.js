"use client"
import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, PanResponder } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: theme.colors.surface,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
      marginHorizontal: 4,
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme.colors.primary + "20",
    },
    tabText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      overflow: "hidden",
      backgroundColor: theme.colors.background,
    },
    tabContentContainer: {
      padding: 24,
      paddingBottom: 100,
    },
    contentTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 24,
    },
    journalImageContainer: {
      alignItems: "center",
      marginBottom: 24,
    },
    journalImagePlaceholder: {
      width: "100%",
      height: 200,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    journalDescription: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: "justify",
    },
    patchNotesContainer: {
      gap: 16,
    },
    patchNoteCard: {
      borderRadius: 16,
      padding: 20,
    },
    patchVersion: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
    },
    patchItem: {
      fontSize: 16,
      marginBottom: 8,
      lineHeight: 22,
    },
    eventsContainer: {
      gap: 20,
    },
    eventCard: {
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    eventImageContainer: {
      alignItems: "center",
      marginBottom: 16,
    },
    eventImagePlaceholder: {
      width: "100%",
      height: 120,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    eventContent: {
      alignItems: "center",
    },
    eventTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
    },
    eventDate: {
      fontSize: 16,
      marginBottom: 12,
      fontWeight: "500",
    },
    eventDescription: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
    },
  })

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Jornal")
  const { theme } = useTheme()
  const panX = useRef(new Animated.Value(0)).current
  const tabs = ["Jornal", "Patch", "Eventos"]

  const switchTab = (tabName) => {
    const index = tabs.indexOf(tabName)
    setActiveTab(tabName)
    Animated.spring(panX, {
      toValue: -index * width,
      tension: 68,
      friction: 12,
      useNativeDriver: true,
    }).start()
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
      },
      onPanResponderGrant: () => {
        panX.stopAnimation()
        panX.extractOffset()
      },
      onPanResponderMove: (_, gestureState) => {
        const currentIndex = tabs.indexOf(activeTab)
        const newValue = -currentIndex * width + gestureState.dx
        panX.setValue(newValue)
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentIndex = tabs.indexOf(activeTab)
        let newIndex = currentIndex

        // Calcula a velocidade e direção do swipe
        const velocity = Math.abs(gestureState.vx)
        const isQuickSwipe = velocity > 0.3
        const distance = Math.abs(gestureState.dx)
        const direction = gestureState.dx > 0 ? -1 : 1

        // Decide se deve mudar de tab baseado na velocidade ou distância
        if ((isQuickSwipe || distance > width * 0.2) && gestureState.dx !== 0) {
          newIndex = Math.max(0, Math.min(tabs.length - 1, currentIndex + direction))
        }

        Animated.spring(panX, {
          toValue: -newIndex * width,
          tension: 75,
          friction: 15,
          useNativeDriver: true,
        }).start(() => {
          setActiveTab(tabs[newIndex])
        })
      },
    })
  ).current

  const renderContent = () => (
    <Animated.View
      style={[
        createStyles(theme).contentContainer,
        {
          flexDirection: "row",
          width: width * tabs.length,
          transform: [{ translateX: panX }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {tabs.map((tab) => (
        <View key={tab} style={{ width }}>
          <ScrollView 
            style={createStyles(theme).tabContentContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            <Text style={createStyles(theme).contentTitle}>{tabContent[tab].title}</Text>
            {tabContent[tab].content}
          </ScrollView>
        </View>
      ))}
    </Animated.View>
  )

  const tabContent = {
    Jornal: {
      title: "Semana Tecnológica",
      content: (
        <View>
          <View style={createStyles(theme).journalImageContainer}>
            <View
              style={[createStyles(theme).journalImagePlaceholder, { backgroundColor: theme.colors.surfaceSecondary }]}
            >
              <Ionicons name="newspaper" size={48} color={theme.colors.primary} />
            </View>
          </View>
          <Text style={[createStyles(theme).journalDescription, { color: theme.colors.text }]}>
            O Jornal Etec é um periódico voltado para a divulgação de notícias, eventos e atividades da Etec (Escola
            Técnica Estadual). Seu objetivo é manter alunos, professores e a comunidade escolar atualizados sobre o que
            acontece dentro da instituição, além de abordar temas relevantes para o ambiente educacional. O jornal traz
            reportagens, entrevistas e informações sobre cursos, projetos, eventos e muito mais.
          </Text>
        </View>
      ),
    },
    Patch: {
      title: "Patch Notes",
      content: (
        <View style={createStyles(theme).patchNotesContainer}>
          <View style={[createStyles(theme).patchNoteCard, { backgroundColor: theme.colors.primary + "20" }]}>
            <Text style={[createStyles(theme).patchVersion, { color: theme.colors.text }]}>
              Versão 1.2.0 - Abril 2025
            </Text>
            <Text style={[createStyles(theme).patchItem, { color: theme.colors.textSecondary }]}>
              • Novo layout para a aba de Eventos.
            </Text>
            <Text style={[createStyles(theme).patchItem, { color: theme.colors.textSecondary }]}>
              • Animação adicionada nos ícones da Tab Bar.
            </Text>
            <Text style={[createStyles(theme).patchItem, { color: theme.colors.textSecondary }]}>
              • Correções de bugs menores e melhorias de desempenho.
            </Text>
          </View>

          <View style={[createStyles(theme).patchNoteCard, { backgroundColor: theme.colors.primary + "20" }]}>
            <Text style={[createStyles(theme).patchVersion, { color: theme.colors.text }]}>
              Versão 1.1.0 - Março 2025
            </Text>
            <Text style={[createStyles(theme).patchItem, { color: theme.colors.textSecondary }]}>
              • Tela de Chat adicionada.
            </Text>
            <Text style={[createStyles(theme).patchItem, { color: theme.colors.textSecondary }]}>
              • Integração com o sistema de IAT.
            </Text>
          </View>

          <View style={[createStyles(theme).patchNoteCard, { backgroundColor: theme.colors.primary + "20" }]}>
            <Text style={[createStyles(theme).patchVersion, { color: theme.colors.text }]}>
              Versão 1.0.0 - Fevereiro 2025
            </Text>
            <Text style={[createStyles(theme).patchItem, { color: theme.colors.textSecondary }]}>
              • Lançamento inicial do app!
            </Text>
          </View>
        </View>
      ),
    },
    Eventos: {
      title: "Eventos",
      content: (
        <View style={createStyles(theme).eventsContainer}>
          <View style={[createStyles(theme).eventCard, { backgroundColor: theme.colors.surface }]}>
            <View style={createStyles(theme).eventImageContainer}>
              <View
                style={[createStyles(theme).eventImagePlaceholder, { backgroundColor: theme.colors.surfaceSecondary }]}
              >
                <Ionicons name="school" size={32} color={theme.colors.primary} />
              </View>
            </View>
            <View style={createStyles(theme).eventContent}>
              <Text style={[createStyles(theme).eventTitle, { color: theme.colors.text }]}>Semana Tecnológica</Text>
              <Text style={[createStyles(theme).eventDate, { color: theme.colors.primary }]}>
                10 a 14 de Abril de 2025
              </Text>
              <Text style={[createStyles(theme).eventDescription, { color: theme.colors.textSecondary }]}>
                Workshops, palestras e desafios para os alunos da Etec.
              </Text>
            </View>
          </View>

          <View style={[createStyles(theme).eventCard, { backgroundColor: theme.colors.surface }]}>
            <View style={createStyles(theme).eventImageContainer}>
              <View
                style={[createStyles(theme).eventImagePlaceholder, { backgroundColor: theme.colors.surfaceSecondary }]}
              >
                <Ionicons name="briefcase" size={32} color={theme.colors.primary} />
              </View>
            </View>
            <View style={createStyles(theme).eventContent}>
              <Text style={[createStyles(theme).eventTitle, { color: theme.colors.text }]}>Feira de Profissões</Text>
              <Text style={[createStyles(theme).eventDate, { color: theme.colors.primary }]}>Em breve</Text>
              <Text style={[createStyles(theme).eventDescription, { color: theme.colors.textSecondary }]}>
                Conheça as diferentes áreas profissionais e oportunidades de carreira.
              </Text>
            </View>
          </View>
        </View>
      ),
    },
  }

  // Ajuste o estado inicial do panX
  useEffect(() => {
    panX.setValue(-tabs.indexOf(activeTab) * width)
  }, [])

  return (
    <View style={createStyles(theme).container}>
      <View style={createStyles(theme).header}>
        <Text style={createStyles(theme).title}>Início</Text>
      </View>

      <View style={createStyles(theme).tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[createStyles(theme).tab, activeTab === tab && createStyles(theme).activeTab]}
            onPress={() => switchTab(tab)}
          >
            <Text style={[createStyles(theme).tabText, activeTab === tab && createStyles(theme).activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}
    </View>
  )
}