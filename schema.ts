export const schema = `#graphql

type Restaurant{
    id: ID!
    nombre: String!
    direccion: String!
    telefono: String!
    temperatura: Int!
    hora: String!
}

type Tiempo{
    hour: String!
    minute: String!
}

type Query{
    getRestaurants: [Restaurant!]!
    getRestaurant( id: ID!): Restaurant!
}

type Mutation{
    addRestaurant(nombre: String!, direccion: String!, ciudad: String!, telefono: String!): Restaurant!
    deleteRestaurant(id: ID!): Boolean!
}


`;
