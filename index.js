var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): Restaurant
  restaurants: [Restaurant]
},
type Restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input RestaurantInput{
  id: Int
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setRestaurant(input: RestaurantInput): Restaurant
  deleteRestaurant(id: Int!): DeleteResponse
  editRestaurant(id: Int!, name: String!): Restaurant
}
`);
// The root provides a resolver function for each API endpoint

/****************************************************************
 * The videos and starter code sometimes identify each restaurant by its id field
 * and sometimes by its index into the array of restaurants.  These need not be the
 * same.  For consistency, my code identifies each restaurant by its id field and
 * uses the function index(arr, id) to compute the index of this restaurant in the
 * restaurants array from its id field.  I have also added the id field to
 * RestaurantInput so that we can specify an id for any new restaurant that is added.
 ****************************************************************/
function index(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id)
      return i;
  }

  return null;
}

var root = {
  restaurant: (arg) => {
    // Your code goes here
    let x = index(restaurants, arg.id);
    return restaurants[x];
  },
  restaurants: () => {
    // Your code goes here
    return restaurants;
  },
  setRestaurant: ({ input }) => {
    // Your code goes here
    restaurants.push({id: input.id, name:input.name, description:input.description});
    return input;
  },
  deleteRestaurant: ({ id }) => {
    // Your code goes here
    const ok = (index(restaurants, id) !== null);
    restaurants = restaurants.filter(r => r.id !== id);
    return {ok};
  },
  editRestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    let x = index(restaurants, id);
    if (x == null) {
      throw new Error("restaurant doesn't exist");
    }
    restaurants[x] = {...restaurants[x], ...restaurant};
    return restaurants[x];
  },
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

// export default root;
