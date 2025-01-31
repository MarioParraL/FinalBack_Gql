import { Collection } from "mongodb";
import {
  APICity,
  APIPhone,
  APITime,
  APIWeather,
  RestaurantModel,
} from "./types.ts";
import { ObjectId } from "mongodb";
import { GraphQLError } from "graphql";
type Context = {
  RestaurantsCollection: Collection<RestaurantModel>;
};

type QueryGetRestauntArgs = {
  id: string;
};

type MutationDeleteRestaurantArgs = {
  id: string;
};

type MutationAddRestaurantArgs = {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
};

export const resolvers = {
  Query: {
    getRestaurants: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<RestaurantModel[]> => {
      return await ctx.RestaurantsCollection.find().toArray();
    },

    getRestaurant: async (
      _: unknown,
      args: QueryGetRestauntArgs,
      ctx: Context,
    ): Promise<RestaurantModel | null> => {
      return await ctx.RestaurantsCollection.findOne(
        { _id: new ObjectId(args.id) },
      );
    },
  },

  Mutation: {
    addRestaurant: async (
      _: unknown,
      args: MutationAddRestaurantArgs,
      ctx: Context,
    ): Promise<RestaurantModel> => {
      const { nombre, direccion, ciudad, telefono } = args;

      const existeRestaurante = await ctx.RestaurantsCollection.countDocuments({
        nombre,
      });
      if (existeRestaurante >= 1) {
        throw new GraphQLError("El Restaurante ya existe");
      }

      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new GraphQLError("API_KEY ERROR");

      const url =
        `https://api.api-ninjas.com/v1/validatephone?number=${telefono}`;
      const data = await fetch(url, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      if (data.status !== 200) throw new GraphQLError("API NINJAS ERROR");

      const response: APIPhone = await data.json();
      if (!response.is_valid) throw new GraphQLError("Telefono no valido");

      const { insertedId } = await ctx.RestaurantsCollection.insertOne({
        nombre,
        direccion,
        ciudad,
        telefono,
      });

      return {
        _id: insertedId,
        nombre,
        direccion,
        ciudad,
        telefono,
      };
    },

    deleteRestaurant: async (
      _: unknown,
      args: MutationDeleteRestaurantArgs,
      ctx: Context,
    ): Promise<boolean> => {
      const { deletedCount } = await ctx.RestaurantsCollection.deleteOne({
        _id: new ObjectId(args.id),
      });

      return deletedCount === 1;
    },
  },

  Restaurant: {
    id: (parent: RestaurantModel) => {
      return parent._id!.toString();
    },

    temperatura: async (
      parent: RestaurantModel,
      _: unknown,
      ctx: Context,
    ): Promise<number> => {
      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new GraphQLError("API_KEY ERROR");
      const ciudad = parent.ciudad;

      const url = `https://api.api-ninjas.com/v1/city?name=${ciudad}`;
      const data = await fetch(url, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      const response: APICity[] = await data.json();
      const latitude = response[0].latitude;
      const longitude = response[0].longitude;

      const url2 =
        `https://api.api-ninjas.com/v1/weather?lat=${latitude}&lon=${longitude}`;

      const data2 = await fetch(url2, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      const response2: APIWeather = await data2.json();
      return response2.temp;
    },

    hora: async (
      parent: RestaurantModel,
      _: unknown,
      ctx: Context,
    ): Promise<string> => {
      const telefono = parent.telefono;

      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new GraphQLError("API_KEY ERROR");

      const url =
        `https://api.api-ninjas.com/v1/validatephone?number=${telefono}`;
      const data = await fetch(url, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      const response: APIPhone = await data.json();
      const timezones = response.timezones[0];

      const url2 =
        `https://api.api-ninjas.com/v1/worldtime?timezone=${timezones}`;

      const data2 = await fetch(url2, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      const response2: APITime = await data2.json();
      return response2.datetime;
    },
  },
};
