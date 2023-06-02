import { useQuery, gql } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { mergeIntoObservable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator, TableView } from "react-native-tableview-simple";

import CharacterItem from "../../../components/common/CharacterItem";
import { State, SwapiCharacter } from "../../../state";

const GET_CHARACTERS = gql`
  query GetCharacters {
    allPeople {
      people {
        id
        name
      }
    }
  }
`;

const AddParticipant = observer(() => {
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState("");
  const { data } = useQuery(GET_CHARACTERS);
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  const characters = data?.allPeople?.people || [];
  const filteredCharacters = characters.filter((character: SwapiCharacter) =>
    character.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  const participants = State.events[eventId].participants.get();

  const onCharacterPress = (character: SwapiCharacter) => {
    if (participants[character.id]) {
      const updatedParticipants = { ...participants };
      delete updatedParticipants[character.id];
      State.events[eventId].participants.set(updatedParticipants);
    } else {
      mergeIntoObservable(State.events[eventId].participants, {
        [character.id]: { id: character.id, name: character.name },
      });
    }
  };

  const renderItem = ({ item }: { item: SwapiCharacter }) => (
    <CharacterItem
      character={item}
      onPress={onCharacterPress}
      isParticipant={item.id in participants}
    />
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Participants",
          headerRight: () => (
            <TouchableOpacity onPress={navigation.goBack}>
              <Ionicons name="md-checkmark" size={32} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search characters"
          onChangeText={setSearchInput}
          value={searchInput}
        />
        <TableView style={styles.tableView}>
          <FlatList
            data={searchInput ? filteredCharacters : characters}
            renderItem={renderItem}
            style={styles.list}
            extraData={participants}
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
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: "90%",
  },
  list: { width: "100%" },
  tableView: { flex: 1, width: "100%" },
});

export default AddParticipant;
