import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { DatabaseProvider } from "@/hooks/use-database";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <DatabaseProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Facilities",
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="[id]"
            options={{
              title: "Facility Details",
              headerBackTitle: "Back",
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DatabaseProvider>
  );
}
