fetch("artists.json")
  .then((response) => response.json())
  .then((artists) => renderArtists(artists));

function renderArtists(artists) {
  const navUl = document.querySelector(".artist-nav ul");
  const container = document.getElementById("artists-container");

  // 1. Navigation oben dynamisch aus allen Künstlern generieren
  if (navUl) {
    navUl.innerHTML = artists
      .map((artist) => {
        const artistId = artist.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        return `<li><a href="#${artistId}">${artist.name}</a></li>`;
      })
      .join("");
  }

  // 2. Künstler-Karten dynamisch unten generieren
  if (container) {
    container.innerHTML = artists
      .map((artist) => {
        const artistId = artist.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

        const songsHTML = artist.songs
          .map((song, index) => {
            const songNum = String(index + 1).padStart(2, "0");
            const langAttr = song.lang ? `lang="${song.lang}"` : "";
            return `
          <div class="song-card">
            <img class="song-cover" src="${song.cover}" alt="${song.title}">
            <div class="song-meta">
              <div class="song-number-title">
                <span class="song-number">${songNum}</span>
                <span class="song-title" ${langAttr}>${song.title}</span>
              </div>
              <span class="song-duration">${song.duration}</span>
            </div>
          </div>
        `;
          })
          .join("");

        return `
        <article class="artist-card" id="${artistId}">
          <img class="artist-avatar" src="${artist.photo}" alt="${artist.name}">
          <p class="artist-genre">${artist.genre}</p>
          <h2 class="artist-name">${artist.name}</h2>
          <p class="artist-stats">5 SONGS · ${artist.total} TOTAL RUNTIME</p>
          <p class="artist-blurb">${artist.blurb}</p>
          
          <div class="songs-grid">
            ${songsHTML}
          </div>
        </article>
      `;
      })
      .join("");
  }
}
