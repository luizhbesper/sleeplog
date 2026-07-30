import { useEffect, useRef } from "react";
import { Animated, type ViewStyle } from "react-native";
import { colors, radius } from "@/presentation/theme";

export function Skeleton({
  height,
  style,
  color = colors.skeleton,
}: {
  height: number;
  style?: ViewStyle;
  color?: string;
}) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { height, backgroundColor: color, borderRadius: radius.sm, opacity },
        style,
      ]}
    />
  );
}
