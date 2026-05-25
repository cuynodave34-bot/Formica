import { PropsWithChildren } from "react";
import { View, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";

type CardProps = PropsWithChildren<{
  style?: ViewStyle;
  tone?: "default" | "primary" | "warning";
}>;

export function Card({ children, style, tone = "default" }: CardProps) {
  const backgroundColor =
    tone === "primary"
      ? colors.forestGreen
      : tone === "warning"
        ? colors.lightAmber
        : colors.surface;

  return (
    <View
      style={[
        {
          backgroundColor,
          borderColor: tone === "default" ? colors.softBark : "transparent",
          borderCurve: "continuous",
          borderRadius: 20,
          borderWidth: 1,
          boxShadow: "0 8px 20px rgba(38, 51, 45, 0.08)",
          gap: 10,
          padding: 18,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
