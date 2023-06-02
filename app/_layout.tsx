import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { observer, enableLegendStateReact } from "@legendapp/state/react";
import { Stack } from "expo-router";
import React from "react";

enableLegendStateReact();

const client = new ApolloClient({
  uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",
  cache: new InMemoryCache(),
});

export default observer(function HomeLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "purple",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="event/add"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="event/participant/add"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </ApolloProvider>
  );
});
