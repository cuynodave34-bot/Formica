import { PropsWithChildren } from "react";
import { View } from "react-native";

import { colors } from "@/theme/colors";

export function Screen({ children }: PropsWithChildren) {
  return <View style={{ backgroundColor: colors.cream, flex: 1 }}>{children}</View>;
}
