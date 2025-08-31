"use client"

import { useRef, useEffect } from "react"
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

export default function FloatingTabBar({ state, descriptors, navigation }) {
  const { theme } = useTheme()
  const labelAnim = useRef(new Animated.Value(0)).current
  const iconAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Animar o ícone
    Animated.sequence([
      Animated.timing(iconAnim, {
        toValue: 0.8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(iconAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start()

    // Animar o texto
    Animated.spring(labelAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start()

    // Resetar animações quando mudar de tab
    return () => {
      labelAnim.setValue(0)
    }
  }, [state.index])

  const getTabIcon = (routeName, focused) => {
    let iconName
    switch (routeName) {
      case "Home":
        return focused ? "home" : "home-outline"
      case "Calendar":
        return focused ? "calendar" : "calendar-outline"
      case "Chat":
        return focused ? "chatbubble" : "chatbubble-outline"
      case "Profile":
        return focused ? "person" : "person-outline"
      case "Notes":
        return focused ? "book" : "book-outline"
      case "Wellness":
        return focused ? "fitness" : "fitness-outline"
      default:
        return "circle"
    }
  }

  const getTabLabel = (routeName) => {
    switch (routeName) {
      case "Home":
        return "Início"
      case "Calendar":
        return "Calendário"
      case "Chat":
        return "Chat"
      case "Profile":
        return "Perfil"
      case "Notes":
        return "Notas"
      case "Wellness":
        return "Bem-estar"
      default:
        return routeName
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { backgroundColor: theme.colors.surface }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  isFocused && {
                    transform: [{ scale: iconAnim }],
                  },
                ]}
              >
                <Ionicons
                  name={getTabIcon(route.name, isFocused)}
                  size={24}
                  color={
                    isFocused
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
                {isFocused && (
                  <Animated.Text
                    style={[
                      styles.label,
                      {
                        color: theme.colors.primary,
                        transform: [
                          {
                            translateX: labelAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            }),
                          },
                          {
                            scale: labelAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1],
                            }),
                          },
                        ],
                        opacity: labelAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ]}
                  >
                    {getTabLabel(route.name)}
                  </Animated.Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: "row",
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
})
