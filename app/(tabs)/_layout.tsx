import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Home01Icon, ChartLineData01Icon, UserIcon, Add01Icon } from "@hugeicons/core-free-icons";
import Colors from "../../constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Using custom tab bar
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: (props: any) => <HugeiconsIcon icon={Home01Icon} {...props} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: (props: any) => <HugeiconsIcon icon={ChartLineData01Icon} {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: (props: any) => <HugeiconsIcon icon={UserIcon} {...props} />,
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarBackground}>
        <View style={styles.tabItems}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Get the icon from options or map via route name
            let icon: any;
            if (route.name === "index") icon = Home01Icon;
            else if (route.name === "analytics") icon = ChartLineData01Icon;
            else if (route.name === "profile") icon = UserIcon;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
              >
                <HugeiconsIcon
                  icon={icon || Home01Icon}
                  size={24}
                  color={isFocused ? Colors.primary : Colors.textMuted}
                />
                {isFocused && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.fab}
            onPress={() => alert("Add new tracking")}
          >
            <HugeiconsIcon icon={Add01Icon} size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 24,
    left: 20,
    right: 20,
    height: 70,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  tabItems: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginHorizontal: 4,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
