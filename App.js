"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { View, StyleSheet } from "react-native"

import LoginScreen from "./src/screens/LoginScreen"
import HomeScreen from "./src/screens/HomeScreen"
import CalendarScreen from "./src/screens/CalendarScreen"
import ChatScreen from "./src/screens/ChatScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import NotesScreen from "./src/screens/NotesScreen"
import WellnessScreen from "./src/screens/WellnessScreen"

import FloatingTabBar from "./src/components/FloatingTabBar"

// Import theme context
import { ThemeProvider, useTheme } from "./src/context/ThemeContext"
import { AuthProvider, useAuth } from "./src/context/AuthContext"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function TabNavigator() {
  const { theme, isDark } = useTheme()

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Início" }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: "Calendário" }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: "Chat" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Perfil" }} />
      <Tab.Screen name="Notes" component={NotesScreen} options={{ tabBarLabel: "Notas" }} />
      <Tab.Screen name="Wellness" component={WellnessScreen} options={{ tabBarLabel: "Bem-estar" }} />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { isAuthenticated } = useAuth()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <AppNavigator />
          </View>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
