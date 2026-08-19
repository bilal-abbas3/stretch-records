"use strict";

// Lesson 4: HTTP and the Fetch API.
// Recorded observations go in this file as comments. The loader and form
// work happens in stretch-records/script.js, against the server you run
// with json-server.

// Step 2: both status codes and the response Content-Type.
// - http://localhost:3000/artists
//   Status Code: 200 OK
//   Content-Type: application/json; charset=utf-8
// - http://localhost:3000/wrong-path
//   Status Code: 404 Not Found
//   Content-Type: application/json; charset=utf-8

// Step 3: ok, status, and one Access-Control-Allow header from the Network tab.
// - ok: true
// - status: 200
// - Access-Control-Allow Header: Access-Control-Allow-Origin: * (or Access-Control-Allow-Credentials: true)

// Step 4: show that the Promise fulfilled anyway on the wrong path.
// Fetching an invalid endpoint like http://localhost:3000/wrong-path returns an HTTP 404 response,
// but the fetch() Promise STILL FULFILLS.
// Proof:
// fetch("http://localhost:3000/wrong-path")
//   .then(response => {
//     console.log("Fulfilled!", response.ok, response.status);
// Logs: Fulfilled! false 404
//
// Step 5: how did the refused connection differ from the 404?
// 404 Not Found: Server is running. The TCP handshake completes and returns an HTTP Response object (ok: false, status: 404). The fetch() Promise FULFILLS.
// Refused Connection (ERR_CONNECTION_REFUSED): Server is down. No TCP connection is made and no Response object is created. The fetch() Promise REJECTS with a native TypeError ("Failed to fetch")
//
// STRETCH, step 8: the public API's endpoint address, the method, one
// parameter, the response shape you would code against, and one stated limit.
// - Endpoint Address: https://musicbrainz.org
// - HTTP Method: GET
// - Query Parameter: ?query=artist:coldplay&fmt=json
// - Response Shape: An object with an "artists" array containing artist entities (e.g., { "artists": [ { "name": "Coldplay", "country": "GB" } ] }).
// - Stated Limit: Rate limited to 1 request per second without an explicit User-Agent header string identifying the application.
