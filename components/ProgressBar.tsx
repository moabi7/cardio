import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Colors from "../constants/Colors";

interface ProgressBarProps {
  progress: number; // 0 to 1
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const animatedValue = React.useRef(new Animated.Value(progress)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: progress,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [progress]);

  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    width: "100%",
  },
  background: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
});
