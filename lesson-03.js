"use strict";

// Lesson 3: Promises, async, and await.
// Standalone programs and observations go in this file as code and comments.
// The loader work happens in stretch-records/script.js.
//
// Step 3, the ordering puzzle: write a program mixing plain logs, a zero
// delay timer, and a settled Promise reaction. Predict the full output order
// in comments before running, then explain in one sentence why the Promise
// beat the timer.

// PREDICTED OUTPUT ORDER:
// Synchronous start
// Synchronous end
// Promise resolved
// Timeout 0ms finished

console.log("Synchronous start");

setTimeout(() => {
  console.log("Timeout 0ms finished");
}, 0);

Promise.resolve("Promise resolved").then((res) => {
  console.log(res);
});

console.log("Synchronous end");

/* 
   EXPLANATION:
   The Promise reaction ran before the timer because settled Promise callbacks 
   are placed in the high-priority Microtask Queue, which the Event Loop drains 
   completely before processing any Macrotask Queue callbacks like setTimeout.
*/

// Step 6: paste the final rethrown message that reached the top

class MissingDataError extends Error {
  constructor(field) {
    super("Required data is missing " + field);
    this.name = "MissingDataError";
  }
}

function checkArtist(artist) {
  if (!artist || !artist.name) {
    throw new MissingDataError("name");
  }
  return artist;
}

/* ==========================================================================
   STEP 5 & 6: Rethrowing with Context & Final Top Message
   ========================================================================== */

function loadArtistData() {
  try {
    const badArtist = { genre: "Pop" }; // Missing 'name'
    checkArtist(badArtist);
  } catch (error) {
    // Add page and operation context, then throw onward
    throw new Error("Artist load failed for the roster page. " + error.message);
  }
}

// Triggering the function to catch the rethrown message at the top
try {
  loadArtistData();
} catch (error) {
  console.error("Top level caught:", error.message);
}

/*
    FINAL RETHROWN MESSAGE THAT REACHED THE TOP:
   "Artist load failed for the roster page. Required data is missing name"
*/

//STEP 7: Promise.all() vs Promise.allSettled()

// Helper function simulating a delayed asynchronous task
const delayedTask = (name, delay, shouldReject = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error(`because '${name}' failed.`));
      } else {
        resolve(`Result from ${name}`);
      }
    }, delay);
  });
};

// 1. Running three independent delayed tasks successfully with Promise.all()
async function runPromiseAllSuccess() {
  try {
    const results = await Promise.all([
      delayedTask("Task A", 100),
      delayedTask("Task B", 200),
      delayedTask("Task C", 150),
      delayedTask("Task D", 200, true),
    ]);
    console.log("Promise.all success results:", results);
  } catch (error) {
    console.error("Promise.all failed", error.message);
  }
}

// Switching to Promise.allSettled() to capture all outcomes and keep survivors:

async function runPromiseAllSettledDemo() {
  try {
    await Promise.all([
      delayedTask("Task E", 100),
      delayedTask("Task F", 200, true), // Fails!
      delayedTask("Task G", 150),
    ]);
  } catch (error) {
    console.log(
      "Promise.all short-circuited and caught rejection:",
      error.message,
    );
  }
}
const outcomes = await Promise.allSettled([
  delayedTask("Task E", 100),
  delayedTask("Task F", 200, true), // Fails!
  delayedTask("Task G", 150),
]);

console.log("Promise.allSettled outcomes:", outcomes);

// Filtering out the survivors (fulfilled tasks)
const survivors = outcomes
  .filter((outcome) => outcome.status === "fulfilled")
  .map((outcome) => outcome.value);

console.log("Surviving results kept:", survivors);

(async () => {
  await runPromiseAllSuccess();
  await runPromiseAllSettledDemo();
})();
