import { Ionicons } from "@expo/vector-icons";
import { observer } from "@legendapp/state/react";
import { Legend } from "@legendapp/state/react-native-components";
import dayjs from "dayjs";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Cell,
  Section,
  Separator,
  TableView,
} from "react-native-tableview-simple";

import CharacterItem from "../../components/common/CharacterItem";
import { State } from "../../state";

const EventDetails = observer(function EventDetails() {
  const params = useLocalSearchParams();
  const { id } = params;

  const event = State.events[id as string].get();
  const participants = State.events[id as string].participants.get();

  const renderItem = ({ item }: { item: string }) => (
    <CharacterItem character={participants[item]} isParticipant />
  );

  const renderHeader = () => (
    <>
      <Section header="Event info">
        <Cell
          cellStyle="RightDetail"
          detail={dayjs(event.datetime).format("YYYY-MM-DD")}
          title="Date"
        />
        <Cell
          cellStyle="RightDetail"
          detail={dayjs(event.datetime).format("HH:mm")}
          title="Time"
        />
      </Section>
      {Object.keys(participants).length > 0 && (
        <Section header="Participants" sectionPaddingBottom={0} hideSeparator />
      )}
    </>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: event.title,
          headerRight: () => (
            <Link
              href={{
                pathname: "/event/participant/add",
                params: { eventId: id },
              }}
              asChild
            >
              <TouchableOpacity>
                <Ionicons name="md-add" size={32} color="white" />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <TableView style={styles.tableView}>
          <Legend.FlatList
            ListHeaderComponent$={renderHeader}
            style={styles.list}
            data={Object.keys(participants)}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            ItemSeparatorComponent={({ highlighted }) => (
              <Separator isHidden={highlighted} />
            )}
          />
        </TableView>
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
    backgroundColor: "#EFEFF4",
    alignItems: "center",
    width: "100%",
  },
  list: { width: "100%" },
});

export default EventDetails;
