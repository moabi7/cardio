import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  Dumbbell01Icon,
  EquipmentGym01Icon,
  Female02Icon,
  Male02Icon,
  RulerIcon,
  Target02Icon,
  UserIcon,
  WeightIcon,
  WorkoutRunIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import ProgressBar from "../../components/ProgressBar";
import SelectionCard from "../../components/SelectionCard";
import Colors from "../../constants/Colors";

const { width } = Dimensions.get("window");

const STEPS = [
  { id: 1, title: "Select Gender", subtitle: "Help us customize your experience" },
  { id: 2, title: "What's your Goal?", subtitle: "Choose what you want to achieve" },
  { id: 3, title: "Workout Detail", subtitle: "How many days do you workout?" },
  { id: 4, title: "When's your Birthday?", subtitle: "We need this for calorie calculation" },
  { id: 5, title: "Body Metrics", subtitle: "Enter your current height and weight" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState({
    gender: "",
    goal: "",
    workoutDays: "",
    birthdate: { day: "", month: "", year: "" },
    height: "",
    weight: "",
  });

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      Animated.timing(scrollX, {
        toValue: currentStep * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      handleFinish();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      Animated.timing(scrollX, {
        toValue: (currentStep - 2) * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleFinish = () => {
    const birthdateStr = `${formData.birthdate.year}-${formData.birthdate.month.padStart(2, "0")}-${formData.birthdate.day.padStart(2, "0")}`;

    router.push({
      pathname: "/(onboarding)/generating-plan",
      params: {
        gender: formData.gender,
        goal: formData.goal,
        workoutDays: formData.workoutDays,
        birthdate: birthdateStr,
        height: formData.height,
        weight: formData.weight,
      },
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!formData.gender;
      case 2: return !!formData.goal;
      case 3: return !!formData.workoutDays;
      case 4: return !!formData.birthdate.day && !!formData.birthdate.month && formData.birthdate.year.length === 4;
      case 5: return !!formData.height && !!formData.weight;
      default: return false;
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <SelectionCard
        label="Male"
        selected={formData.gender === "Male"}
        onPress={() => setFormData({ ...formData, gender: "Male" })}
        icon={<HugeiconsIcon icon={Male02Icon} size={24} color={formData.gender === "Male" ? Colors.primary : Colors.textSecondary} />}
      />
      <SelectionCard
        label="Female"
        selected={formData.gender === "Female"}
        onPress={() => setFormData({ ...formData, gender: "Female" })}
        icon={<HugeiconsIcon icon={Female02Icon} size={24} color={formData.gender === "Female" ? Colors.primary : Colors.textSecondary} />}
      />
      <SelectionCard
        label="Other"
        selected={formData.gender === "Other"}
        onPress={() => setFormData({ ...formData, gender: "Other" })}
        icon={<HugeiconsIcon icon={UserIcon} size={24} color={formData.gender === "Other" ? Colors.primary : Colors.textSecondary} />}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <SelectionCard
        label="Lose Weight"
        subtitle="Burn fat and get leaner"
        selected={formData.goal === "Lose Weight"}
        onPress={() => setFormData({ ...formData, goal: "Lose Weight" })}
        icon={<HugeiconsIcon icon={ArrowDown01Icon} size={24} color={formData.goal === "Lose Weight" ? Colors.primary : Colors.textSecondary} />}
      />
      <SelectionCard
        label="Maintain Weight"
        subtitle="Keep your current weight"
        selected={formData.goal === "Maintain"}
        onPress={() => setFormData({ ...formData, goal: "Maintain" })}
        icon={<HugeiconsIcon icon={Target02Icon} size={24} color={formData.goal === "Maintain" ? Colors.primary : Colors.textSecondary} />}
      />
      <SelectionCard
        label="Gain Weight"
        subtitle="Build muscle and bulk up"
        selected={formData.goal === "Gain Weight"}
        onPress={() => setFormData({ ...formData, goal: "Gain Weight" })}
        icon={<HugeiconsIcon icon={ArrowUp01Icon} size={24} color={formData.goal === "Gain Weight" ? Colors.primary : Colors.textSecondary} />}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <SelectionCard
        label="2-3 Days"
        subtitle="Light activity"
        selected={formData.workoutDays === "2-3 Days"}
        onPress={() => setFormData({ ...formData, workoutDays: "2-3 Days" })}
        icon={<HugeiconsIcon icon={Dumbbell01Icon} size={24} color={formData.workoutDays === "2-3 Days" ? Colors.primary : Colors.textSecondary} />}
      />
      <SelectionCard
        label="3-4 Days"
        subtitle="Moderate activity"
        selected={formData.workoutDays === "3-4 Days"}
        onPress={() => setFormData({ ...formData, workoutDays: "3-4 Days" })}
        icon={<HugeiconsIcon icon={WorkoutRunIcon} size={24} color={formData.workoutDays === "3-4 Days" ? Colors.primary : Colors.textSecondary} />}
      />
      <SelectionCard
        label="5-6 Days"
        subtitle="Very active"
        selected={formData.workoutDays === "5-6 Days"}
        onPress={() => setFormData({ ...formData, workoutDays: "5-6 Days" })}
        icon={<HugeiconsIcon icon={EquipmentGym01Icon} size={24} color={formData.workoutDays === "5-6 Days" ? Colors.primary : Colors.textSecondary} />}
      />
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconHeader}>
        <HugeiconsIcon icon={Calendar03Icon} size={48} color={Colors.primary} />
      </View>
      <View style={styles.dateRow}>
        <View style={styles.dateInputContainer}>
          <Text style={styles.dateInputLabel}>Day</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="DD"
            keyboardType="number-pad"
            placeholderTextColor={Colors.black}
            maxLength={2}
            value={formData.birthdate.day}
            onChangeText={(val) => setFormData({ ...formData, birthdate: { ...formData.birthdate, day: val } })}
          />
        </View>
        <View style={styles.dateInputContainer}>
          <Text style={styles.dateInputLabel}>Month</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="MM"
            keyboardType="number-pad"
            placeholderTextColor={Colors.black}
            maxLength={2}
            value={formData.birthdate.month}
            onChangeText={(val) => setFormData({ ...formData, birthdate: { ...formData.birthdate, month: val } })}
          />
        </View>
        <View style={styles.dateInputContainer}>
          <Text style={styles.dateInputLabel}>Year</Text>
          <TextInput
            style={[styles.dateInput, { width: 80 }]}
            placeholder="YYYY"
            placeholderTextColor={Colors.black}
            keyboardType="number-pad"
            maxLength={4}
            value={formData.birthdate.year}
            onChangeText={(val) => setFormData({ ...formData, birthdate: { ...formData.birthdate, year: val } })}
          />
        </View>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.metricRow}>
        <View style={styles.iconCircle}>
          <HugeiconsIcon icon={RulerIcon} size={24} color={Colors.primary} />
        </View>
        <View style={styles.metricInputContainer}>
          <Text style={styles.metricLabel}>Height (Feet)</Text>
          <TextInput
            style={styles.metricInput}
            placeholder="0.0"
            placeholderTextColor={Colors.black}
            keyboardType="decimal-pad"
            value={formData.height}
            onChangeText={(val) => setFormData({ ...formData, height: val })}
          />
        </View>
      </View>

      <View style={[styles.metricRow, { marginTop: 24 }]}>
        <View style={styles.iconCircle}>
          <HugeiconsIcon icon={WeightIcon} size={24} color={Colors.primary} />
        </View>
        <View style={styles.metricInputContainer}>
          <Text style={styles.metricLabel}>Weight (Kg)</Text>
          <TextInput
            style={styles.metricInput}
            placeholder="0.0"
            placeholderTextColor={Colors.black}
            keyboardType="decimal-pad"
            value={formData.weight}
            onChangeText={(val) => setFormData({ ...formData, weight: val })}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={prevStep} style={styles.backButton} disabled={currentStep === 1}>
            {currentStep > 1 && <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={Colors.text} />}
          </TouchableOpacity>
          <View style={styles.progressHeader}>
            <ProgressBar progress={currentStep / 5} />
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{STEPS[currentStep - 1].title}</Text>
            <Text style={styles.subtitle}>{STEPS[currentStep - 1].subtitle}</Text>
          </View>

          <Animated.View style={[styles.stepsWrapper, { transform: [{ translateX: scrollX.interpolate({ inputRange: [0, width, width * 2, width * 3, width * 4], outputRange: [0, -width, -width * 2, -width * 3, -width * 4] }) }] }]}>
            <View style={styles.stepOuter}>{renderStep1()}</View>
            <View style={styles.stepOuter}>{renderStep2()}</View>
            <View style={styles.stepOuter}>{renderStep3()}</View>
            <View style={styles.stepOuter}>{renderStep4()}</View>
            <View style={styles.stepOuter}>{renderStep5()}</View>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <CustomButton
            title={currentStep === 5 ? "Finish" : "Continue"}
            onPress={nextStep}
            disabled={!isStepValid()}
            loading={loading}
            icon={currentStep < 5 ? <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="white" /> : undefined}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: Platform.OS === "ios" ? 10 : 30, // Better notch clearance
    height: 60,
  },
  progressHeader: {
    flex: 1,
    paddingHorizontal: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingTop: 20,
    overflow: "hidden", // Clip lateral steps
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  stepsWrapper: {
    flexDirection: "row",
    width: width * 5,
  },
  stepOuter: {
    width: width,
    paddingHorizontal: 24,
  },
  stepContainer: {
    width: "100%",
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  iconHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInputContainer: {
    alignItems: "center",
  },
  dateInputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  dateInput: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.background,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  metricInputContainer: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metricInput: {
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    height: 40,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    padding: 0,
  },
});
