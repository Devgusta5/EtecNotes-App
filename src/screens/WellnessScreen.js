"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

export default function WellnessScreen() {
  const { theme } = useTheme()

  const wellnessOptions = [
    {
      id: 1,
      title: "Vídeos",
      icon: "play",
      color: "#8B5CF6",
      description: "Vídeos relaxantes e motivacionais",
    },
    {
      id: 2,
      title: "Músicas",
      icon: "musical-notes",
      color: "#8B5CF6",
      description: "Playlist para concentração e relaxamento",
    },
    {
      id: 3,
      title: "Jogos",
      icon: "game-controller",
      color: "#8B5CF6",
      description: "Jogos educativos e de relaxamento",
    },
  ]

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Wellness Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconBackground, { backgroundColor: theme.colors.surfaceSecondary }]}>
            <Ionicons name="fitness" size={48} color={theme.colors.primary} />
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.wellnessTitle, { color: theme.colors.primary }]}>Bem-estar</Text>
          <Text style={[styles.wellnessSubtitle, { color: theme.colors.textSecondary }]}>
            Relaxe com vídeos, músicas e jogos!
          </Text>
        </View>

        {/* Wellness Options */}
        <View style={styles.optionsContainer}>
          {wellnessOptions.map((option) => (
            <TouchableOpacity key={option.id} style={[styles.optionCard, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name={option.icon} size={32} color="#FFFFFF" />
              </View>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coming Soon Message */}
        <View style={[styles.comingSoonContainer, { backgroundColor: theme.colors.warning + "20" }]}>
          <Text style={[styles.comingSoonText, { color: theme.colors.textSecondary }]}>
            * Em breve: navegue por conteúdos relaxantes recomendados especialmente para você!
          </Text>
        </View>

        {/* Additional Features */}
        <View style={styles.featuresContainer}>
          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="heart" size={24} color={theme.colors.primary} />
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Mindfulness</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                Exercícios de respiração e meditação
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="moon" size={24} color={theme.colors.primary} />
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Relaxamento</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                Sons da natureza para dormir melhor
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="flash" size={24} color={theme.colors.primary} />
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Energia</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                Exercícios rápidos para revigorar
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonActive: {
    backgroundColor: "#EDE9FE",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  wellnessTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  wellnessSubtitle: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  optionCard: {
    width: (width - 72) / 3,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  comingSoonContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  comingSoonText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
})
