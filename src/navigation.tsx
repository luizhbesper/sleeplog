import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { AnalysisScreen } from "@/presentation/screens/AnalysisScreen";
import { LogScreen } from "@/presentation/screens/LogScreen";
import { colors } from "@/presentation/theme";

const Tab = createBottomTabNavigator();

const tabIcon = (glyph: string) => (props: { color: string }) => (
  <Text style={{ color: props.color, fontSize: 18 }}>{glyph}</Text>
);

export function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.indigo,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Log"
        component={LogScreen}
        options={{ tabBarIcon: tabIcon("🗒") }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ tabBarIcon: tabIcon("📈") }}
      />
    </Tab.Navigator>
  );
}
