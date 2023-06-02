import { Ionicons } from "@expo/vector-icons";
import { observer } from "@legendapp/state/react";
import { Legend } from "@legendapp/state/react-native-components";
import dayjs from "dayjs";
import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cell, Separator } from "react-native-tableview-simple";

import { State, SwapiEvent } from "../state";

const EventsList = observer(function EventsList() {
  const eventsDict = State.events.get();
  const events: SwapiEvent[] = Object.keys(eventsDict)
    .map(id => eventsDict[id])
    .filter(e => dayjs(e.datetime).isAfter(dayjs()));

  events.sort((a, b) => dayjs(a.datetime).diff(dayjs(b.datetime)));

  const renderItem = ({ item }: { item: SwapiEvent }) => (
    <Link
      href={{
        pathname: "/event/detail",
        params: { id: item.id },
      }}
      asChild
    >
      <Cell
        cellStyle="Subtitle"
        title={item.title}
        detail={`Date: ${dayjs(item.datetime).format("YYYY-MM-DD HH:mm")}`}
      />
    </Link>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Events",
          headerRight: () => (
            <Link href="/event/add" asChild>
              <TouchableOpacity>
                <Ionicons name="md-add" size={32} color="white" />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <Legend.FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={events}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={({ highlighted }) => (
            <Separator isHidden={highlighted} />
          )}
        />
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  tableView: { flex: 1, width: "100%" },
  title: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    flexGrow: 1,
  },
  list: { width: "100%" },
  listContainer: { flexGrow: 1 },
});

export default EventsList;
