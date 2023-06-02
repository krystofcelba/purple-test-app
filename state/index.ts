// Create an observable object that contains an array of events
import { observable } from "@legendapp/state";
import {
  persistObservable,
  configureObservablePersistence,
} from "@legendapp/state/persist";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";

export type SwapiCharacter = {
  id: string;
  name: string;
};

export type SwapiEvent = {
  id: string;
  title: string;
  datetime: Date;
  participants: { [id: string]: SwapiCharacter };
};

export const State = observable({
  events: {} as { [id: string]: SwapiEvent },
});

configureObservablePersistence({
  persistLocal: ObservablePersistMMKV,
});

// Persist the state object to AsyncStorage
// Persist the events array to AsyncStorage
persistObservable(State, {
  local: "state",
});
