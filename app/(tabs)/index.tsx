import { ScrollView, Text, View } from "react-native";

import { Card } from "@/components/card";
import { Screen } from "@/components/screen";
import { colors } from "@/theme/colors";
import { formatCurrency } from "@/theme/format";

const recentTrails = [
  { id: "1", label: "Foraged In", detail: "Allowance", amount: 12500 },
  { id: "2", label: "Used Resources", detail: "Groceries", amount: -4200 },
  { id: "3", label: "Trail Transfer", detail: "Cash to savings", amount: 5000 },
];

export default function NestOverviewScreen() {
  return (
    <Screen>
      <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
        <View style={{ gap: 16, padding: 20, paddingBottom: 32 }}>
          <Card tone="primary">
            <Text selectable style={{ color: colors.cream, fontSize: 14, fontWeight: "700" }}>
              Nest Value
            </Text>
            <Text
              selectable
              style={{
                color: colors.cream,
                fontSize: 42,
                fontVariant: ["tabular-nums"],
                fontWeight: "800",
              }}
            >
              {formatCurrency(184250)}
            </Text>
            <Text selectable style={{ color: colors.mist, fontSize: 15 }}>
              Across 4 Chambers. Last local sync is waiting for Supabase setup.
            </Text>
          </Card>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Card style={{ flex: 1 }}>
              <Text selectable style={{ color: colors.barkBrown, fontSize: 13, fontWeight: "700" }}>
                Foraged In
              </Text>
              <Text selectable style={{ color: colors.leafGreen, fontSize: 24, fontWeight: "800" }}>
                {formatCurrency(12500)}
              </Text>
            </Card>
            <Card style={{ flex: 1 }}>
              <Text selectable style={{ color: colors.barkBrown, fontSize: 13, fontWeight: "700" }}>
                Used Resources
              </Text>
              <Text
                selectable
                style={{ color: colors.warningRed, fontSize: 24, fontWeight: "800" }}
              >
                {formatCurrency(4200)}
              </Text>
            </Card>
          </View>

          <Card>
            <Text selectable style={{ color: colors.darkText, fontSize: 18, fontWeight: "800" }}>
              Recent Trails
            </Text>
            <View style={{ gap: 12 }}>
              {recentTrails.map((trail) => (
                <View
                  key={trail.id}
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      selectable
                      style={{ color: colors.darkText, fontSize: 15, fontWeight: "700" }}
                    >
                      {trail.label}
                    </Text>
                    <Text selectable style={{ color: colors.barkBrown, fontSize: 13 }}>
                      {trail.detail}
                    </Text>
                  </View>
                  <Text
                    selectable
                    style={{
                      color: trail.amount < 0 ? colors.warningRed : colors.leafGreen,
                      fontSize: 16,
                      fontVariant: ["tabular-nums"],
                      fontWeight: "800",
                    }}
                  >
                    {formatCurrency(Math.abs(trail.amount))}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          <Card tone="warning">
            <Text selectable style={{ color: colors.darkText, fontSize: 16, fontWeight: "800" }}>
              Scout Warning
            </Text>
            <Text selectable style={{ color: colors.barkBrown, fontSize: 14, lineHeight: 20 }}>
              Supabase credentials are configured through environment variables only. Rotate the
              previously shared secret keys before any production release.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
