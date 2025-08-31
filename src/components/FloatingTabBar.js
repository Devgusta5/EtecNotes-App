"use client"

import { useRef, useEffect } from "react"
import { View, TouchableOpacity, Animated, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

export default function FloatingTabBar({ state, descriptors, navigation }) {
  const { theme } = useTheme()
  const animatedValues = useRef(state.routes.map(() => new Animated.Value(0))).current
  const textAnimatedValues = useRef(state.routes.map(() => new Animated.Value(0))).current

  useEffect(() => {
    // Animate icons on tab change
    animatedValues.forEach((animValue, index) => {
      Animated.timing(animValue, {
        toValue: state.index === index ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    })

    textAnimatedValues.forEach((textAnimValue, index) => {
      Animated.timing(textAnimValue, {
        toValue: state.index === index ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })
  }, [state.index])

  const getTabIcon = (routeName, focused) => {
    let iconName
    switch (routeName) {
      case "Home":
        iconName = focused ? "home" : "home-outline"
        break
      case "Calendar":
        iconName = focused ? "calendar" : "calendar-outline"
        break
      case "Chat":
        iconName = focused ? "chatbubble" : "chatbubble-outline"
        break
      case "Profile":
        iconName = focused ? "person" : "person-outline"
        break
      case "Notes":
        iconName = focused ? "book" : "book-outline"
        break
      case "Wellness":
        iconName = focused ? "fitness" : "fitness-outline"
        break
      default:
        iconName = "circle"
    }
    return iconName
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

  const getTabColor = (routeName) => {
    switch (routeName) {
      case "Home":
        return "#8B5CF6" // Purple
      case "Calendar":
        return "#8B5CF6" // Purple
      case "Chat":
        return "#EC4899" // Pink
      case "Profile":
        return "#06B6D4" // Cyan
      case "Notes":
        return "#8B5CF6" // Purple
      case "Wellness":
        return "#F59E0B" // Amber
      default:
        return theme.colors.primary
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.text,
          },
        ]}
      >
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

          const animatedStyle = {
            transform: [
              {
                scale: animatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                }),
              },
            ],
          }

          const textAnimatedStyle = {
            opacity: textAnimatedValues[index],
            transform: [
              {
                translateY: textAnimatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                }),
              },
              {
                scale: textAnimatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }

          const tabColor = getTabColor(route.name)
          const iconColor = isFocused ? "#FFFFFF" : theme.colors.textSecondary

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  animatedStyle,
                  {
                    width: isFocused ? "auto" : 40,
                    paddingHorizontal: isFocused ? 16 : 0,
                    minWidth: isFocused ? 80 : 40,
                  },
                ]}
              >
                {isFocused && <View style={[styles.activeIndicator, { backgroundColor: tabColor }]} />}
                <View style={styles.contentContainer}>
                  <Ionicons name={getTabIcon(route.name, isFocused)} size={22} color={iconColor} />
                  {isFocused && (
                    <Animated.Text style={[styles.tabLabel, { color: iconColor }, textAnimatedStyle]} numberOfLines={1}>
                      {getTabLabel(route.name)}
                    </Animated.Text>
                  )}
                </View>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 0,
    justifyContent: "space-around",
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    height: 40,
    borderRadius: 20,
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 200,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
    textAlign: "center",
    flexShrink: 0,
  },
})
