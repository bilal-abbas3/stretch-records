// Task 4:
// The page load made 3 requests.
// Three requests were: index.html, script.js, and ws.

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
