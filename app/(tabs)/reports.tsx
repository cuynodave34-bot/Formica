import { ScrollView, Text, View } from "react-native";

import { Card } from "@/components/card";
import { Screen } from "@/components/screen";
import { colors } from "@/theme/colors";

export default function ReportsScreen() {
  return (
    <Screen>
      <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12, padding: 20, paddingBottom: 32 }}>
          <Card>
            <Text selectable style={{ color: colors.darkText, fontSize: 20, fontWeight: "800" }}>
              Colony Report
            </Text>
            <Text selectable style={{ color: colors.barkBrown, fontSize: 14, lineHeight: 20 }}>
              Reports should use local aggregates, paginated queries, or Supabase views. Avoid
              fetching every Trail just to calculate a dashboard summary.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
