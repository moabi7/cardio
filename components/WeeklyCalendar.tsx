import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

const { width } = Dimensions.get("window");
const GAP = 5;
const PADDING = 15;
// Exactly 7 items on screen with 8px gaps and side padding
const ITEM_WIDTH = (width - (2 * PADDING) - (6 * GAP)) / 7;

interface DateItem {
  date: Date;
  id: string;
}

export default function WeeklyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const flatListRef = useRef<FlatList>(null);

  // Generate a range of dates: 30 weeks backward and STOP at today
  const generateDates = () => {
    const dates: DateItem[] = [];
    const today = new Date();

    // We'll generate 210 days backward (30 weeks) and stop at today (i = 0)
    for (let i = -210; i <= 0; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push({
        date: date,
        id: date.toDateString(),
      });
    }
    return dates;
  };

  const [dates] = useState(generateDates());

  // Center the list on today initially (at the very end of the list)
  useEffect(() => {
    const todayIndex = dates.length - 1; // Today is the last element
    if (todayIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        // Scroll so today is on the right side of the screen if possible,
        // or just scroll to the end
        flatListRef.current?.scrollToEnd({
          animated: false,
        });
      }, 300);
    }
  }, []);

  const renderItem = ({ item }: { item: DateItem }) => {
    const isToday = item.date.toDateString() === new Date().toDateString();
    const isSelected = item.date.toDateString() === selectedDate.toDateString();

    const dayName = item.date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = item.date.getDate();

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedDate(item.date)}
        style={[
          styles.dayCard,
          isSelected && styles.selectedCard,
        ]}
      >
        <Text style={[
          styles.dayName,
          isToday && styles.todayText,
          isSelected && styles.selectedText
        ]}>
          {dayName}
        </Text>
        <View style={[
          styles.dateCircle,
          isToday && styles.todayCircle,
          isSelected && styles.selectedCircle,
        ]}>
          <Text style={[
            styles.dayNumber,
            isToday && styles.todayNumberText,
            isSelected && styles.selectedNumberText
          ]}>
            {dayNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dates}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        snapToInterval={ITEM_WIDTH + GAP}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH + GAP,
          offset: (ITEM_WIDTH + GAP) * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listContent: {
    paddingHorizontal: PADDING,
  },
  dayCard: {
    width: ITEM_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.025)",
  },
  selectedCard: {
    borderColor: "rgba(0,0,0,0.05)",
  },
  dayName: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
  },
  // Today Style
  todayText: {
    color: Colors.primary,
    fontWeight: "900",
  },
  todayCircle: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  todayNumberText: {
    color: Colors.primary,
  },
  // Selected Style
  selectedText: {
    color: Colors.text,
  },
  selectedCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedNumberText: {
    color: Colors.white,
  },
});
