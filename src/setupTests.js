import "@testing-library/jest-dom";
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { MongoMemoryServer } from "mongodb-memory-server";
const { MongoClient } = require("mongodb");
const User = require("../models/User"); // user Model
const globalSetup = require("../config/global-setup"); // dev server teardown
const globalTeardown = require("../config/global-teardown"); // dev server teardown

describe("Local Development server interactions test", () => {
  //   let connection;
  //   let db;

  beforeAll(async () => {
    await globalSetup();
  });

  it("DEV Server - test if user route is user", async () => {
    const body = {
      name: "Test Person 2",
      email: "Testperson@email.com",
      password: "testings",
    };

    await fetch("http://localhost:5000/api/users", {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          console.log("success");
        }
      })
      .then((data) => console.log(data))
      .catch((err) => console.log("Error!!!!" + err));
    // });

    // await fetch("https://pokeapi.co/api/v2/ability/4", {
    //   method: "GET",
    // })
    //   .then((res) => {
    //     if (res.ok) {
    //       return res.json();
    //     }
    //   })
    //   .then((data) => console.log(data))
    //   .catch((err) => console.log("Error!!!!" + err));
  });

  it("DEV Server - register a user", async () => {});

  afterAll(async () => {
    await globalTeardown();
  });
});

// describe("MongoDB MOCK server interactions test", () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     // set up the MongoDB Memory Server
//     const mongod = await MongoMemoryServer.create();
//     const uri = mongod.getUri();

//     // connect to the server
//     connection = await MongoClient.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // await DB response
//     db = await connection.db();
//   });

//   it("MOCK Mongo Server - register user and check if email is the same", async () => {
//     const users = db.collection("users");

//     let testUserRegistrationDetails = {
//       name: "Test Person",
//       email: "test@mail.com",
//       password: "iamfake",
//       balance: 0,
//     };

//     const { name, email, password, balance } = testUserRegistrationDetails; // destructure

//     let testUser = new User({
//       name,
//       email,
//       password,
//       balance,
//     });
//     await users.insertOne(testUser);

//     const insertedUser = await users.findOne({
//       email: testUserRegistrationDetails.email,
//     });

//     expect(insertedUser.email).toEqual(testUser.email);
//   });

//   afterAll(async () => {
//     await connection.close();
//   });
// });
