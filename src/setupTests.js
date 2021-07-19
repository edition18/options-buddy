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

  // it("DEV Server - test if user route is working", async () => {
  //   await fetch("http://localhost:5000/api/users", {
  //     method: "GET",
  //   }).then((res) => {
  //     if (res.ok) {
  //       expect(res.status).toBe(Number(200));
  //       return res;
  //     }
  //   });
  // });

  // it("DEV Server - Error should be thrown for registering an existing user", async () => {
  //   let data = {
  //     name: "Test Person A",
  //     email: "testpersonA@gmail.com",
  //     password: "testpersonA",
  //     balance: "0",
  //   };

  //   data = JSON.stringify(data);
  //   await fetch("http://localhost:5000/api/users", {
  //     method: "POST",
  //     headers: { "Content-type": "application/json" },
  //     body: data,
  //   }).then((res) => {
  //     // if anything but 200, this res.ok does not run
  //     expect(res.status).toBe(Number(400));
  //     // if (res.ok) {
  //     //   return res.status;
  //     // }
  //   });
  // });

  // it("DEV Server - jwt token should be generated for logging in an existing user", async () => {
  //   let data = {
  //     email: "testpersonA@gmail.com",
  //     password: "testpersonA",
  //   };

  //   data = JSON.stringify(data);
  //   await fetch("http://localhost:5000/api/auth", {
  //     method: "POST",
  //     headers: { "Content-type": "application/json" },
  //     body: data,
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => expect(Boolean(data["token"])).toBe(true));
  // });

  describe("DEV Server - Log in, get generated token, and retrieve own profile", () => {
    let data = {
      email: "testpersonA@gmail.com",
      password: "testpersonA",
    };
    let changeProfileTo = {
      interests: "golfing,gaming",
      bio: "I am now not interested in stocks",
    };
    let token, retrievedProfile, updatedProfile, revertProfile;
    it("DEV Server - jwt token should be generated for logging in an existing user", async () => {
      let data = {
        email: "testpersonA@gmail.com",
        password: "testpersonA",
      };

      token = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => {
          console.log(res.status);
          return res.json();
        })
        .then((data) => data["token"]);
    });

    it("DEV Server - use generated token to retrieve current profile", async () => {
      retrievedProfile = await fetch("http://localhost:5000/api/profile/me", {
        method: "GET",
        headers: { "x-auth-token": token },
      })
        .then((res) => {
          console.log(res.status);
          return res.json();
        })
        .then((data) => data);
    });

    it("DEV Server - make changes to current profile", async () => {
      updatedProfile = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "x-auth-token": token, "Content-Type": "application/json" },
        body: JSON.stringify(changeProfileTo),
      })
        .then((res) => {
          console.log(res.status);
          return res.json();
        })
        .then((data) =>
          // use strict equal instead of to be as we are comparing objects
          // not primitives
          expect(data["interests"]).toStrictEqual(
            changeProfileTo["interests"].split(",")
          )
        );
    });
  });

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
