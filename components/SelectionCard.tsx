import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

interface SelectionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  subtitle?: string;
}

export default function SelectionCard({
  label,
  selected,
  onPress,
  icon,
  subtitle,
}: SelectionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, selected && styles.selectedSubtitle]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={[styles.checkbox, selected && styles.selectedCheckbox]}>
        {selected && <View style={styles.checkboxInner} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: Colors.surface,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  selectedLabel: {
    color: Colors.primaryDark,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectedSubtitle: {
    color: Colors.primaryMedium,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCheckbox: {
    borderColor: Colors.primary,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
});
