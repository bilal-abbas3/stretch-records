// Task 4:
// The page load made 3 requests.
// Three requests were: index.html, script.js, and ws.

//Task 5:
//The browser failed to parse the JSON response via response.json() because
//trailing commas are strictly invalid in standard JSON syntax.

const singleArtist = {
  name: "Coldplay",
  genre: "Alternative Rock / Pop",
  photo: "https://mcdn.wallpapersafari.com/medium/91/14/faQKxC.jpg",
  total: "21:30",
  blurb: "British rock band formed in London.",
};

const jsonString = JSON.stringify(singleArtist);
console.log("JSON Stringified:", jsonString);

const parsedArtist = JSON.parse(jsonString);
console.log("Parsed Property (Artist Name):", parsedArtist.name);
