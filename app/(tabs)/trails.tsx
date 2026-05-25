import { ScrollView, Text, View } from "react-native";

import { Card } from "@/components/card";
import { Screen } from "@/components/screen";
import { colors } from "@/theme/colors";

const trailTypes = ["Foraged In", "Used Resources", "Trail Transfer"];

export default function TrailsScreen() {
  return (
    <Screen>
      <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12, padding: 20, paddingBottom: 32 }}>
          <Card tone="primary">
            <Text selectable style={{ color: colors.cream, fontSize: 20, fontWeight: "800" }}>
              Trail Entry Guardrails
            </Text>
            <Text selectable style={{ color: colors.mist, fontSize: 14, lineHeight: 20 }}>
              Trail writes will validate amount, type, chamber ownership, category ownership, and
              transfer destination on both device and Supabase.
            </Text>
          </Card>
          {trailTypes.map((type) => (
            <Card key={type}>
              <Text selectable style={{ color: colors.darkText, fontSize: 18, fontWeight: "800" }}>
                {type}
              </Text>
              <Text selectable style={{ color: colors.barkBrown, fontSize: 14, lineHeight: 20 }}>
                This scaffold reserves the route. The money form should be built after SQLite and
                Supabase validation contracts are finalized.
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
