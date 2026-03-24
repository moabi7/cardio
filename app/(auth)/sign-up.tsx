import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../utils/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import GoogleButton from "../../components/GoogleButton";
import { signInWithGoogle } from "../../utils/googleAuth";
import { User, UserRole } from "../../models/user";
import { saveUserToFirebase } from "../../services/userService";

export default function SignUpScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);


  const onSignUpPress = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailAddress, password);
      
      const newUser = new User();
      newUser.uid = userCredential.user.uid;
      newUser.email = emailAddress;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.role = UserRole.USER;
      
      await saveUserToFirebase(newUser);
      // navigation handled by onAuthStateChanged in _layout.tsx
    } catch (err: any) {
      Alert.alert("Sign Up Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignInPress = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // navigation handles by onAuthStateChanged in _layout.tsx
    } catch (err: any) {
      if (err.code !== "ASYNC_OP_IN_PROGRESS") {
        Alert.alert("Google Sign-In Failed", err.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image source={require("../../assets/images/react-logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start tracking your calories to reach your fitness goals.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <CustomInput
                label="First Name"
                placeholder="John"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CustomInput
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </View>
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
          
          <CustomButton 
            title="Sign Up" 
            onPress={onSignUpPress} 
            loading={loading} 
            disabled={!firstName || !lastName || !emailAddress || !password}
          />
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <GoogleButton 
            title="Sign up with Google" 
            onPress={onGoogleSignInPress} 
            loading={googleLoading}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-in" as any)}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
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
