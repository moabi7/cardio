import { Text, View, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Track your performance trends.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
