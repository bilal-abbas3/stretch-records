document.addEventListener("DOMContentLoaded", () => {
  loadAndRenderArtists();

  // Deliberately blocking loop behind a button
  const blockBtn = document.getElementById("block-btn");
  if (blockBtn) {
    blockBtn.addEventListener("click", () => {
      console.log("Starting 5s blocking loop...");
      const start = Date.now();
      while (Date.now() - start < 5000) {} // Freeze call stack for 5 sec
      console.log("Blocking loop finished!");
    });
  }

  // Step 6: Form Submit Event Listener
  const artistForm = document.getElementById("add-artist-form");
  if (artistForm) {
    artistForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(artistForm);
      const newArtist = {
        name: formData.get("name"),
        genre: formData.get("genre"),
        photo: formData.get("photo"),
        blurb: formData.get("blurb"),
        total: "0:00",
        songs: [],
      };

      try {
        const response = await fetch("http://localhost:3000/artists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newArtist),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to create artist. Status: ${response.status}`,
          );
        }

        const createdArtist = await response.json();
        console.log("Successfully created artist:", createdArtist);

        // Reset form and re-fetch artist list to display new entry
        artistForm.reset();
        await loadAndRenderArtists();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    });
  }
});

async function loadAndRenderArtists() {
  const loadingEl = document.getElementById("loading");

  if (loadingEl) loadingEl.style.display = "block";

  try {
    // Step 7: Fetch resources concurrently using Promise.all
    const [artistsRes, secondaryRes] = await Promise.all([
      fetch("http://localhost:3000/artists"),
      fetch("http://localhost:3000/artists"), // Concurrent duplicate/secondary fetch demo
    ]);

    // Ensure BOTH responses are successful
    if (!artistsRes.ok || !secondaryRes.ok) {
      throw new Error(
        `HTTP Error! Primary status: ${artistsRes.status}, Secondary status: ${secondaryRes.status}`,
      );
    }

    const artists = await artistsRes.json();
    console.log("Fetched concurrently via Promise.all:", artists);

    renderArtists(artists);
  } catch (error) {
    console.error("Error loading artists:", error);
  } finally {
    if (loadingEl) loadingEl.style.display = "none";
  }
}

function renderArtists(artists) {
  const navUl = document.querySelector(".artist-nav ul");
  const container = document.getElementById("artists-container");

  if (navUl) {
    navUl.innerHTML = artists
      .map((artist) => {
        const artistId = artist.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        return `<li><a href="#${artistId}">${artist.name}</a></li>`;
      })
      .join("");
  }

  if (container) {
    container.innerHTML = artists
      .map((artist) => {
        const artistId = artist.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

        const songsHTML = (artist.songs || [])
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
            <p class="artist-stats">${artist.songs ? artist.songs.length : 0} SONGS · ${artist.total} TOTAL RUNTIME</p>
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
