"use strict";

// Lesson 2: Asynchronous JavaScript and the Event Loop.
// Standalone programs and observations go in this file as code and comments.

// ===== Provided program (task step 2): predict before you run =====
// Write your predicted output order as a comment BELOW, before running this
// file with node. Then run it, mark each line of your prediction right or
// wrong, and correct the wrong ones with one sentence each explaining why.

console.log("doors open");
setTimeout(() => console.log("encore"), 1000);
setTimeout(() => console.log("soundcheck"), 0);
console.log("main act");
setTimeout(() => console.log("intermission"), 500);
console.log("lights down");

// Your prediction:
// 1. doors open
// 2. main act
// 3. lights down
// 4. soundcheck
// 5. intermission
// 6. encore

// ===== Provided program (task step 4): trace the call stack =====
// Trace this as a written call stack diagram in comments, listing every push
// and pop in order. Then cause an error inside the innermost function and
// confirm the stack trace in the console matches your diagram, innermost
// first. Keep it commented out while you work on step 2.

function prepare(artist) {
  return "Now playing " + format(artist);
}
function format(artist) {
  return artist.missing.toUpperCase(); //TypeError: Cannot read properties of undefined (reading 'toUpperCase')
  //return artist.name.toUpperCase();
}
try {
  console.log(prepare({ name: "Asake" }));
} catch (error) {
  console.error("VERIFIED CONSOLE STACK TRACE:");
  console.error(error.stack);
}

let count = 10;
console.log(`Countdown starting at: ${count}`);

const timer = setInterval(() => {
  count--;
  console.log(`Countdown: ${count}`);

  if (count === 0) {
    clearInterval(timer);
    console.log("Countdown finished. Interval cleared cleanly.");
  }
}, 1000);
