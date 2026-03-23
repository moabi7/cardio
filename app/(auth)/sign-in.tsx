import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { signInWithGoogle } from "../../utils/googleAuth";

export default function SignInScreen() {
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSignInPress = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, emailAddress, password);
      // navigation is handled by onAuthStateChanged in _layout.tsx
    } catch (err: any) {
      Alert.alert("Sign In Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignInPress = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // navigation is handled by onAuthStateChanged in _layout.tsx
    } catch (err: any) {
      if (err.code !== "ASYNC_OP_IN_PROGRESS") {
        Alert.alert("Google Sign-In Failed", err.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image source={require("../../assets/images/react-logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue tracking your calories and stay healthy.</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Email Address"
            placeholder="john@example.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <CustomInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton title="Sign In" onPress={onSignInPress} loading={loading} />
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <CustomButton 
            title="Continue with Google" 
            onPress={onGoogleSignInPress} 
            variant="outline"
            loading={googleLoading}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-up" as any)}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Clean, modern background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#FF5E5B",
    fontSize: 14,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    color: "#94A3B8",
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 40,
  },
  footerText: {
    color: "#64748B",
    fontSize: 15,
  },
  footerLink: {
    color: "#FF5E5B",
    fontSize: 15,
    fontWeight: "700",
  },
});
