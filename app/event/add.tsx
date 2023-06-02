import { Ionicons } from "@expo/vector-icons";
import { mergeIntoObservable } from "@legendapp/state";
import dayjs from "dayjs";
import { Stack, useNavigation } from "expo-router";
import React, { useMemo, useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { StyleSheet, TextInput, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Cell,
  Section,
  Separator,
  TableView,
} from "react-native-tableview-simple";

import { State } from "../../state";

export default function AddEvent() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const nowDate = useMemo(() => new Date(), []);

  const navigation = useNavigation();

  const onSubmit = (data: FieldValues) => {
    const id = (Math.floor(Math.random() * 1000) + 1).toString();

    const { title, datetime } = data;

    const newEvent = { id, title, datetime, participants: {} };

    mergeIntoObservable(State.events, { [id]: newEvent });

    navigation.goBack();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Event",
          headerLeft: () => (
            <TouchableOpacity onPress={navigation.goBack}>
              <Ionicons name="md-close" size={32} color="white" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
              <Ionicons name="md-checkmark-outline" size={32} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <TableView>
          <>
            <Section
              header="Event Title"
              footer={errors.title && "Title is required"}
              footerTextColor="red"
            >
              <Cell
                contentContainerStyle={styles.cellContainer}
                title="Event Title"
                cellContentView={
                  <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={{ height: 40 }}
                        placeholder="Enter event title"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name="title"
                    defaultValue=""
                  />
                }
              />
            </Section>
            <Section header="Event Date">
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Cell
                      onPress={() => setIsDatePickerOpen(true)}
                      cellStyle="RightDetail"
                      detail={dayjs(value).format("YYYY-MM-DD")}
                      title="Date"
                    />
                    <DatePicker
                      modal
                      open={isDatePickerOpen}
                      mode="date"
                      date={value}
                      minimumDate={nowDate}
                      onConfirm={(date) => {
                        onChange(date);
                        setIsDatePickerOpen(false);
                      }}
                      onCancel={() => {
                        setIsDatePickerOpen(false);
                      }}
                    />
                    <Separator />
                    <Cell
                      onPress={() => setIsTimePickerOpen(true)}
                      cellStyle="RightDetail"
                      detail={dayjs(value).format("HH:mm")}
                      title="Time"
                    />
                    <DatePicker
                      modal
                      open={isTimePickerOpen}
                      mode="time"
                      date={value}
                      minimumDate={nowDate}
                      onConfirm={(date) => {
                        onChange(date);
                        setIsTimePickerOpen(false);
                      }}
                      onCancel={() => {
                        setIsTimePickerOpen(false);
                      }}
                    />
                  </>
                )}
                name="datetime"
                defaultValue={nowDate}
              />
            </Section>
          </>
        </TableView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12.5,
  },
  cellTitle: {
    lineHeight: 20,
    fontSize: 15,
    paddingHorizontal: 12.5,
    letterSpacing: 0,
    textAlignVertical: "center",
  },
  cellDetail: {
    fontSize: 15,
  },
});
