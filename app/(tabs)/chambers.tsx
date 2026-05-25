import { ScrollView, Text, View } from "react-native";

import { Card } from "@/components/card";
import { Screen } from "@/components/screen";
import { colors } from "@/theme/colors";
import { formatCurrency } from "@/theme/format";

const chambers = [
  { id: "cash", name: "Cash Chamber", type: "cash", balance: 24000 },
  { id: "bank", name: "Bank Chamber", type: "bank", balance: 128750 },
  { id: "ewallet", name: "E-Wallet Chamber", type: "e-wallet", balance: 31500 },
];

export default function ChambersScreen() {
  return (
    <Screen>
      <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12, padding: 20, paddingBottom: 32 }}>
          {chambers.map((chamber) => (
            <Card key={chamber.id}>
              <Text selectable style={{ color: colors.darkText, fontSize: 18, fontWeight: "800" }}>
                {chamber.name}
              </Text>
              <Text
                selectable
                style={{ color: colors.barkBrown, fontSize: 13, textTransform: "uppercase" }}
              >
                {chamber.type}
              </Text>
              <Text
                selectable
                style={{
                  color: colors.forestGreen,
                  fontSize: 26,
                  fontVariant: ["tabular-nums"],
                  fontWeight: "800",
                }}
              >
                {formatCurrency(chamber.balance)}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
