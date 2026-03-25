import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Target02Icon, WorkoutRunIcon, AppleIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import Colors from "../../constants/Colors";
import ProgressBar from "../../components/ProgressBar";
import { generateFitnessPlan } from "../../services/aiService";
import { updateUserProfile } from "../../services/userService";
import { auth } from "../../utils/firebaseConfig";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

const LOADING_STEPS = [
  { id: 0, icon: Target02Icon, text: "Analyzing your goals..." },
  { id: 1, icon: WorkoutRunIcon, text: "Crafting your workout schedule..." },
  { id: 2, icon: AppleIcon, text: "Optimizing your nutrition plan..." },
];

export default function GeneratingPlan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { refreshProfile } = useAuth();
  const [progress, setProgress] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<('loading' | 'completed' | 'pending')[]>(['loading', 'pending', 'pending']);

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

        // Dummy timers for the first two steps
        setTimeout(() => {
          setStepStatuses(prev => {
            const next = [...prev];
            next[0] = 'completed';
            next[1] = 'loading';
            return next;
          });
        }, 2500);

        setTimeout(() => {
          setStepStatuses(prev => {
            const next = [...prev];
            next[1] = 'completed';
            next[2] = 'loading';
            return next;
          });
        }, 5000);

        const plan = await generateFitnessPlan(userData);
        const user = auth.currentUser;
        
        if (user) {
          await updateUserProfile(user.uid, {
            fitnessPlan: plan,
            onboardingComplete: true,
          });
          // Refresh the global auth state before redirecting
          await refreshProfile();
        }

        // Final step completion
        setStepStatuses(prev => {
          const next = [...prev];
          next[2] = 'completed';
          return next;
        });
        setProgress(1);

        setTimeout(() => {
          router.replace("/");
        }, 1000);
      } catch (error) {
        console.error("Failed to generate plan:", error);
        router.replace("/");
      }
    };

    startGeneration();

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Creating your plan</Text>
          <Text style={styles.subtitle}>Our AI is personalizing your fitness journey based on your unique goals.</Text>
        </View>

        <View style={styles.stepsContainer}>
          {LOADING_STEPS.map((step, index) => {
            const status = stepStatuses[index];
            return (
              <View key={step.id} style={[styles.stepItem, status === 'pending' && styles.pendingStep]}>
                <View style={[styles.iconWrapper, status === 'completed' && styles.completedIconWrapper]}>
                  <HugeiconsIcon 
                    icon={step.icon} 
                    size={24} 
                    color={status === 'completed' ? Colors.white : (status === 'loading' ? Colors.primary : Colors.textMuted)} 
                  />
                </View>
                <Text style={[styles.stepText, status === 'loading' && styles.activeStepText, status === 'pending' && styles.pendingStepText]}>
                  {step.text}
                </Text>
                <View style={styles.statusWrapper}>
                  {status === 'loading' && <ActivityIndicator size="small" color={Colors.primary} />}
                  {status === 'completed' && (
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color={Colors.primary} />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} />
            <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
          </View>

          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            Drinking enough water and getting 7-8 hours of sleep significantly improves fat loss and muscle recovery.
          </Text>
        </View>
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
    padding: 24,
    justifyContent: "space-between",
  },
  headerContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  pendingStep: {
    opacity: 0.5,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  completedIconWrapper: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  activeStepText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  pendingStepText: {
    color: Colors.textMuted,
  },
  statusWrapper: {
    width: 24,
    alignItems: "center",
  },
  footer: {
    marginBottom: 40,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  percentageText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
