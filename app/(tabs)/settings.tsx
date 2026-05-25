import { ScrollView, Text, View } from "react-native";

import { Card } from "@/components/card";
import { Screen } from "@/components/screen";
import { isSupabaseConfigured } from "@/db/supabase/client";
import { colors } from "@/theme/colors";

export default function SettingsScreen() {
  return (
    <Screen>
      <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12, padding: 20, paddingBottom: 32 }}>
          <Card>
            <Text selectable style={{ color: colors.darkText, fontSize: 20, fontWeight: "800" }}>
              Colony Settings
            </Text>
            <Text selectable style={{ color: colors.barkBrown, fontSize: 14, lineHeight: 20 }}>
              Supabase client configured: {isSupabaseConfigured ? "yes" : "no"}
            </Text>
          </Card>
          <Card tone="warning">
            <Text selectable style={{ color: colors.darkText, fontSize: 16, fontWeight: "800" }}>
              Privacy Defaults
            </Text>
            <Text selectable style={{ color: colors.barkBrown, fontSize: 14, lineHeight: 20 }}>
              App lock, hidden balances, background blur, and redacted logs are required before
              production release.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
