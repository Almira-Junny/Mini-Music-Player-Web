/**
 * Render song
 * Scroll Top
 * Play/Pause/seek
 * CD Rotate
 * Next/Prev
 * Random
 * Next/Repeat when ended
 * Active song
 * Scroll Active song into view
 * PLay song when clicked
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var songs = [
  {
    name: "Futari, Hitori",
    singer: "Dai",
    path: "./assets/music/song1.mp3",
    image: "./assets/img/song1.jpg",
  },
  {
    name: "Spring Thief",
    singer: "Yorushika",
    path: "./assets/music/song2.flac",
    image: "./assets/img/song2.jpg",
  },
  {
    name: "Dear",
    singer: "HoneyComeBear",
    path: "./assets/music/song3.flac",
    image: "./assets/img/song3.jpg",
  },
  {
    name: "Departures",
    singer: "Egoist",
    path: "./assets/music/song4.flac",
    image: "./assets/img/song4.jpg",
  },
  {
    name: "Thoughtcrime",
    singer: "Yorushika",
    path: "./assets/music/song5.flac",
    image: "./assets/img/song5.jpg",
  },
  {
    name: "Ghost",
    singer: "Hoshimachi Suisei",
    path: "./assets/music/song6.flac",
    image: "./assets/img/song6.jpg",
  },
  {
    name: "Gunjou",
    singer: "Yoasobi",
    path: "./assets/music/song7.flac",
    image: "./assets/img/song7.jpg",
  },
  {
    name: "Kawaki Wo Ameku",
    singer: "Minami",
    path: "./assets/music/song8.flac",
    image: "./assets/img/song8.jpg",
  },
  {
    name: "Stellar Stellar",
    singer: "Hoshimachi Suisei",
    path: "./assets/music/song9.flac",
    image: "./assets/img/song9.jpg",
  },
];
var currentSongIndex = 0;
var isPlaying = false;
var isRandom = false;
var isRepeat = false;
var isOptionActive = false;

function start() {
  renderSong();
  loadCurrentSong();
  handleEvents();
}

start();

function renderSong() {
  var htmls = songs.map((currentSong, index) => {
    return `<div class="song">
          <div class="thumbnail">
            <img
              src="${currentSong.image}"
              alt=""
            />
          </div>

          <div class="description">
            <div class="title">${currentSong.name}</div>

            <div class="author">${currentSong.singer}</div>
          </div>

          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            <ul class="option-container">
            <li class="delete">Delete</li> 
          </ul>
          </div>
        </div>`;
  });

  var html = htmls.join("\n");
  $("#song-container").innerHTML = html;
}

function getCurrentSong(index) {
  return songs[index];
}

function loadCurrentSong() {
  var name = $("#header h2");
  var image = $("#song-image div");
  var audio = $("#audio");

  name.innerText = getCurrentSong(currentSongIndex).name;
  image.style.backgroundImage = `url(${
    getCurrentSong(currentSongIndex).image
  })`;
  audio.src = getCurrentSong(currentSongIndex).path;
}

function nextSong() {
  if (currentSongIndex == songs.length - 1) {
    currentSongIndex = 0;
  } else {
    currentSongIndex++;
  }
  loadCurrentSong();
}

function previousSong() {
  if (currentSongIndex == 0) {
    currentSongIndex = songs.length - 1;
  } else {
    currentSongIndex--;
  }
  loadCurrentSong();
}

function randomSong() {
  var randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (randomIndex == currentSongIndex);
  currentSongIndex = randomIndex;
  loadCurrentSong();
}

function activeSong() {
  var allSong = $$(".song");
  allSong.forEach((currentSong) => {
    currentSong.classList.remove("active");
  });
  allSong[currentSongIndex].classList.add("active");
}

function scrollIntoActiveSong() {
  $(".song.active").scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

function handleEvents() {
  //Image Zoom
  var songImage = $("#song-image div");
  var songImageWidth = songImage.offsetWidth;
  var songImageHeight = songImage.offsetHeight;

  document.onscroll = () => {
    var scrollTop = window.scrollY;
    var newWidth = songImageWidth - scrollTop;
    var newHeight = songImageHeight - scrollTop;
    if (newWidth >= 30) {
      songImage.style.height = newWidth + "px";
      songImage.style.width = newHeight + "px";
    } else {
      songImage.style.height = 0;
      songImage.style.width = 0;
    }
  };

  // Image Rotation
  var rotation = songImage.animate(
    [
      {
        transform: "rotate(360deg)",
      },
    ],
    {
      duration: 10000,
      iterations: Infinity,
    }
  );
  rotation.pause();

  //Play,Pause,Progress
  var audio = $("#audio");
  var playBtn = $(".btn-play");
  playBtn.onclick = () => {
    if (!isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  };
  audio.onplay = () => {
    var control = $("#control");
    control.classList.add("playing");
    isPlaying = true;
    rotation.play();
  };
  audio.onpause = () => {
    var control = $("#control");
    control.classList.remove("playing");
    isPlaying = false;
    rotation.pause();
  };

  var progressBar = $("#progress");
  progressBar.onclick = (e) => {
    var progressBarWidth = progressBar.clientWidth;
    var clickX = e.offsetX;
    var currentTimeSong = (clickX / progressBarWidth) * audio.duration;
    audio.currentTime = currentTimeSong;
  };

  audio.ontimeupdate = () => {
    if (audio.duration) {
      var progressSong = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progressSong;
    }
  };

  //Next, Back Song
  var forwardBtn = $(".btn-forward");
  var backwardBtn = $(".btn-backward");

  forwardBtn.onclick = () => {
    if (isRandom) {
      randomSong();
    } else {
      nextSong();
    }
    audio.play();
    activeSong();
    scrollIntoActiveSong();
  };
  backwardBtn.onclick = () => {
    if (isRandom) {
      randomSong();
    } else {
      previousSong();
    }
    audio.play();
    activeSong();
    scrollIntoActiveSong();
  };

  //Active Random Song
  var randomBtn = $(".btn-shuffle");
  randomBtn.onclick = () => {
    if (isRandom) {
      randomBtn.classList.remove("active");
      isRandom = false;
    } else {
      randomBtn.classList.add("active");
      isRandom = true;
      repeatBtn.classList.remove("active");
      isRepeat = false;
    }
  };

  //Active Repeat Song
  var repeatBtn = $(".btn-repeat");
  repeatBtn.onclick = () => {
    if (isRepeat) {
      repeatBtn.classList.remove("active");
      isRepeat = false;
    } else {
      repeatBtn.classList.add("active");
      isRepeat = true;
      isRandom = false;
      randomBtn.classList.remove("active");
    }
  };

  //Next Song When Ended
  audio.onended = () => {
    if (isRepeat) {
      audio.play();
    } else {
      forwardBtn.click();
    }
  };

  //Active Song In List
  activeSong();

  //Active Song When Click
  var allSong = $$(".song");
  allSong.forEach((currentSong, index) => {
    currentSong.onclick = (e) => {
      if (!e.target.closest(".option")) {
        currentSongIndex = index;
        loadCurrentSong();
        audio.play();
        activeSong();
      }
    };
  });

  //Show Options
  var options = $$(".option-container .delete");
  var optionBtns = $$(".option");
  optionBtns.forEach((optionBtn, index) => {
    optionBtn.onclick = () => {
      if (isOptionActive) {
        optionBtns.forEach((optionBtn) => {
          optionBtn.classList.remove("active");
        });
      }
      isOptionActive = !isOptionActive;
      optionBtn.classList.toggle("active", isOptionActive);
      console.log(isOptionActive);
    };
  });
  document.onclick = (e) => {
    if (!e.target.closest(".option")) {
      optionBtns.forEach((optionBtn) => {
        optionBtn.classList.remove("active");
      });
      isOptionActive = false;
    }
  };
  options.forEach((option, index) => {
    option.onclick = () => {
      songs = songs.filter((song) => {
        return song != songs[index];
      });
      rotation.cancel();
      start();
      audio.play();
    };
  });
}
