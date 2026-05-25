import { Tabs } from "expo-router";

import { colors } from "@/theme/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.darkText,
        tabBarActiveTintColor: colors.forestGreen,
        tabBarInactiveTintColor: colors.barkBrown,
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.softBark,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Nest Overview" }} />
      <Tabs.Screen name="chambers" options={{ title: "Chambers" }} />
      <Tabs.Screen name="trails" options={{ title: "Trails" }} />
      <Tabs.Screen name="mounds" options={{ title: "Mounds" }} />
      <Tabs.Screen name="reports" options={{ title: "Colony Report" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
