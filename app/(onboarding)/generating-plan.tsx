import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Target02Icon, WorkoutRunIcon, AppleIcon } from "@hugeicons/core-free-icons";
import Colors from "../../constants/Colors";
import ProgressBar from "../../components/ProgressBar";
import { generateFitnessPlan } from "../../services/aiService";
import { updateUserProfile } from "../../services/userService";
import { auth } from "../../utils/firebaseConfig";

const { width } = Dimensions.get("window");

const LOADING_STEPS = [
  { icon: Target02Icon, text: "Analyzing your goals..." },
  { icon: WorkoutRunIcon, text: "Crafting your workout schedule..." },
  { icon: AppleIcon, text: "Optimizing your nutrition plan..." },
];

export default function GeneratingPlan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Simulate progress while calling AI
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.9) {
          clearInterval(interval);
          return 0.9;
        }
        return prev + 0.1;
      });
    }, 1000);

    // AI Generation
    const startGeneration = async () => {
      try {
        const userData = {
          gender: params.gender as string,
          goal: params.goal as string,
          workoutDays: params.workoutDays as string,
          birthdate: params.birthdate as string,
          height: Number(params.height),
          weight: Number(params.weight),
        };

        const plan = await generateFitnessPlan(userData);
        const user = auth.currentUser;
        
        if (user) {
          await updateUserProfile(user.uid, {
            fitnessPlan: plan,
            onboardingComplete: true,
          });
        }

        setProgress(1);
        setTimeout(() => {
          router.replace("/");
        }, 500);
      } catch (error) {
        console.error("Failed to generate plan:", error);
        // Handle error (maybe retry or skip)
        router.replace("/");
      }
    };

    startGeneration();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(stepInterval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.lottiePlaceholder}>
          <HugeiconsIcon 
            icon={LOADING_STEPS[currentStep].icon} 
            size={80} 
            color={Colors.primary} 
          />
        </View>

        <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
          {LOADING_STEPS[currentStep].text}
        </Animated.Text>

        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} />
          <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
        </View>

        <Text style={styles.tipTitle}>Did you know?</Text>
        <Text style={styles.tipText}>
          Consistency is more important than perfection. Showing up every day is the key to long-term results.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  lottiePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 40,
    height: 60,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 48,
  },
  percentageText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
