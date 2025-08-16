import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    // detectBot({
    //   mode: "LIVE",
    //   allow: [
    //     "CATEGORY:SEARCH_ENGINE",
    //     "PostmanRuntime/*",
    //     "CATEGORY:API", // This should cover Postman and other API testing tools
    //     "*Postman*", // More flexible Postman matching
    //   ],
    // }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export default aj;
