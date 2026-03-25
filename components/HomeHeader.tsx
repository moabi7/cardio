import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Notification03Icon } from "@hugeicons/core-free-icons";
import { getCachedProfile } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import Colors from "../constants/Colors";

export default function HomeHeader() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const cached = await getCachedProfile();
      if (cached) {
        setProfile(cached);
      }
    };
    loadProfile();
  }, []);

  const displayName = profile?.firstName || user?.displayName?.split(" ")[0] || "User";
  const displayImage = profile?.imageUrl || user?.photoURL;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.imageContainer}>
          {displayImage ? (
            <Image source={{ uri: displayImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.nameText}>{displayName}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.notificationButton}>
        <HugeiconsIcon icon={Notification03Icon} size={24} color={Colors.text} />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
  },
  welcomeContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
});
