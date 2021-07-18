// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { MongoMemoryServer } from "mongodb-memory-server";
const { MongoClient } = require("mongodb");
const User = require("../models/User"); // user Model

describe("MongoDB server interactions test", () => {
  let connection;
  let db;

  beforeAll(async () => {
    // set up the MongoDB Memory Server
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // connect to the server
    connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // await DB response
    db = await connection.db();
  });

  it("register user", async () => {
    const users = db.collection("users");

    let testUserRegistrationDetails = {
      name: "Test Person",
      email: "test@mail.com",
      password: "iamfake",
      balance: 0,
    };
    await users.insertOne(testUserRegistrationDetails);

    const insertedUser = await users.findOne({ name: "Test Person" });
    expect(insertedUser).toEqual(testUserRegistrationDetails);
  });

  afterAll(async () => {
    await connection.close();
  });
});
