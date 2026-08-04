import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SleepLogProvider } from "@/application/useSleepLog";
import { Navigation } from "@/navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <SleepLogProvider>
        <NavigationContainer>
          <Navigation />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SleepLogProvider>
    </SafeAreaProvider>
  );
}
