import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { CosaModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
  Deno.exit(1);
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();
console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("FinalBackGqlDB");
const CosasCollection = mongoDB.collection<CosaModel>("cosas");

/*const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ CosasCollection }),
});

console.info(`Server ready at ${url}`); */
