import { ScrollView, Text, View } from "react-native";

import { Card } from "@/components/card";
import { Screen } from "@/components/screen";
import { colors } from "@/theme/colors";

export default function MoundsScreen() {
  return (
    <Screen>
      <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12, padding: 20, paddingBottom: 32 }}>
          <Card>
            <Text selectable style={{ color: colors.darkText, fontSize: 20, fontWeight: "800" }}>
              Resource Piles
            </Text>
            <Text selectable style={{ color: colors.barkBrown, fontSize: 14, lineHeight: 20 }}>
              Mounds will track savings goals without turning the screen into a pressure dashboard.
              Progress should be calm, clear, and optional.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
