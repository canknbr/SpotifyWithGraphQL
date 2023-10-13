import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

const client = new ApolloClient({
  uri: "https://itaperucu.stepzen.net/api/olfactory-wildebeest/__graphql",
  headers: {
    Authorization:
      "apikey itaperucu::stepzen.net+1000::d4e42159c8880dd79fcdb6fb18b622b8efcd8f6dc01cf3614a817ea97c280fd3",
  },
  cache: new InMemoryCache(),
});

const ApolloClientProvider = ({ children }: PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvider;
