require("hijri-date");

const hijriMonths = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

const getHijriDate = () => {
  let currentDate = new Date();
  // Shia Ramadan Moonsighting factor in Canada 2024
  const smicf = -2;
  currentDate.setDate(currentDate.getDate() + smicf);
  let hijriDate = currentDate.toHijri();
  return hijriDate;
};

const audioPlayer = document.getElementById("audio-player");
const playlistItems = document.getElementById("playlist-items");

// AWS S3 Configuration (replace with your credentials and bucket details)
const s3BucketName = "your-radio-station-bucket";
const s3Region = "your-aws-region"; // e.g., 'us-east-1'
// Function to fetch the current song and update the player
function getCurrentSong() {
  const currentSongUrl = `https://s3.${s3Region}.amazonaws.com/${s3BucketName}/nowplaying.txt`; // Replace with actual file path or API endpoint
  fetch(currentSongUrl)
    .then((response) => response.text())
    .then((data) => {
      audioPlayer.src = data; // Update audio source URL
      songTitleElement.textContent = data.split("/").pop(); // Extract song title from URL
      audioPlayer.load(); // Reload the audio player
      audioPlayer.play(); // Start playing the current song
    })
    .catch((error) => console.error(error));
}

// Function to fetch the upcoming playlist (optional)
function getUpcomingPlaylist() {
  const playlistUrl = `https://s3.${s3Region}.amazonaws.com/${s3BucketName}/playlist.txt`; // Replace with actual file path or API endpoint

  fetch(playlistUrl)
    .then((response) => response.text())
    .then((data) => {
      const playlist = data.split("\n");
      playlistItems.innerHTML = ""; // Clear existing playlist items
      playlist.forEach((song) => {
        const listItem = document.createElement("li");
        listItem.textContent = song;
        playlistItems.appendChild(listItem);
      });
    })
    .catch((error) => console.error(error));
}
//
// getCurrentSong(); // Fetch and play the current song on page load
// getUpcomingPlaylist(); // Uncomment to fetch and display the upcoming playlist

// Optional: Add event listeners for user interactions (e.g., play/pause, volume control)

var modal = document.getElementById("info-modal");
var pollModal = document.getElementById("poll-modal");
var infoBtn = document.getElementById("info-button");
var pollBtn = document.getElementById("poll-button");
var span = document.getElementById("close-button");
var pollSpan = document.getElementById("poll-close-button");
var playBtn = document.getElementById("play-pause-button");
var volumeBtn = document.getElementById("volume-button");
var playingTitle = document.getElementById("playing-title");
var timeLeft = document.getElementById("time-left");
var defaultCity = "st-johns";
let intervalId = null;
let playButtonClicked = false;
let pauseButtonClicked = false;
var citiesInfo = {
  stjohns: {
    coords: [47.5615, -52.7126],
    timeZoneDiff: -3.5,
    text: "سینت جانز",
    timeZone: "America/St_Johns",
    link: "https://azuracast.radio-yas.com:8010/radio.mp3",
  },
  ottawa: {
    coords: [45.3192, -75.6692],
    timeZoneDiff: -5,
    text: "اتاوا",
    timeZone: "America/Toronto",
    link: "https://azuracast.radio-yas.com:8020/radio.mp3",
  },
  windsor: {
    coords: [42.2660, -82.9607],
    timeZoneDiff: -5,
    text: "ویندزور",
    timeZone: "America/Toronto",
    link: "https://azuracast.radio-yas.com:8030/radio.mp3",
  },
  waterloo: {
    coords: [43.4724, -80.5448],
    timeZoneDiff: -5,
    text: "واترلو",
    timeZone: "America/Toronto",
    link: "https://azuracast.radio-yas.com:8040/radio.mp3",
  },
  toronto: {
    coords: [43.6581, -79.3792],
    timeZoneDiff: -5,
    text: "تورنتو",
    timeZone: "America/Toronto",
    link: "https://azuracast.radio-yas.com:8050/radio.mp3",
  },
  quebeccity: {
    coords: [46.8130, -71.2053],
    timeZoneDiff: -5,
    text: "کبک سیتی",
    timeZone: "America/Toronto",
    link: "https://azuracast.radio-yas.com:8060/radio.mp3",
  },
};
const pausePlayer = () => {
  audioPlayer.pause();
  // clear source of the audio player
  audioPlayer.src = "";
  playBtn.innerHTML =
    '<img id="play-pause-logo" src="assets/play.svg" alt="Play/Pause">';
};

const playPlayer = () => {
  
  audioPlayer.src = citiesInfo[getCity()].link;
  audioPlayer.load();
  audioPlayer.play();
  playBtn.innerHTML =
    '<img id="play-pause-logo" src="assets/pause.svg" alt="Play/Pause">';
  // playingTitle.innerHTML = audioPlayer.src.split('/').pop();
};

audioPlayer.addEventListener('play', () => {
  // Force reload of the stream to sync up
  console.log('play event fired, playButtonClicked:', playButtonClicked);
  if(!playButtonClicked) {
    audioPlayer.src = audioPlayer.src;
    audioPlayer.load();
    audioPlayer.play();
  } else {
    playButtonClicked = false;
  }
});

audioPlayer.addEventListener('pause', () => {
  // Force reload of the stream to sync up
  console.log('pause event fired, pauseButtonClicked:', pauseButtonClicked);
  if(!pauseButtonClicked) {
    audioPlayer.src = audioPlayer.src;
    audioPlayer.load();
    audioPlayer.pause();
  } else {
    pauseButtonClicked = false;
  }
});


const getCity = () => {
  try {
    const storedCity =
      !!localStorage.getItem("city") && localStorage.getItem("city");
    if (!storedCity) {
      !!localStorage.setItem("city", defaultCity);
      return defaultCity;
    } else {
      return storedCity;
    }
  } catch {
    return defaultCity;
  }
};

const setCity = (city) => {
  localStorage.setItem("city", city);
};

playBtn.onclick = function () {
  // change the icon to pause or vice versa
  console.log("play button clicked");
  if (audioPlayer.paused) {
    playButtonClicked = true;
    playPlayer();
  } else {
    pauseButtonClicked = true;
    pausePlayer();
  }
};
volumeBtn.onclick = function () {
  // change the icon to mute or vice versa
  console.log("volume button clicked");
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
    volumeBtn.innerHTML =
      '<img id="volume-logo" src="assets/vol-low.svg" alt="Volume">';
    audioPlayer.volume = 0.3;
  } else {
    if (
      volumeBtn.innerHTML ===
      '<img id="volume-logo" src="assets/vol-low.svg" alt="Volume">'
    ) {
      volumeBtn.innerHTML =
        '<img id="volume-logo" src="assets/vol-med.svg" alt="Volume">';
      audioPlayer.volume = 0.6;
    } else if (
      volumeBtn.innerHTML ===
      '<img id="volume-logo" src="assets/vol-med.svg" alt="Volume">'
    ) {
      volumeBtn.innerHTML =
        '<img id="volume-logo" src="assets/vol-high.svg" alt="Volume">';
      audioPlayer.volume = 1.0;
    } else {
      audioPlayer.muted = true;
      volumeBtn.innerHTML =
        '<img id="volume-logo" src="assets/vol-mute.svg" alt="Volume">';
    }
  }
};
infoBtn.onclick = function () {
  modal.style.display = "block";
};
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

pollBtn.onclick = function () {
  pollModal.style.display = "block";
};
window.onclick = function (event) {
  if (event.target == pollModal) {
    pollModal.style.display = "none";
  }
};
pollSpan.onclick = function () {
  pollModal.style.display = "none";
};

function calendar(city) {
  var PT = require("praytimes");
  // Calculation method: "University of Tehran"
  var prayTimes = new PT("Tehran");
  var dateNow = new Date(); // today
  var dst =
    dateNow.getMonth() + 1 >= 4 ||
    (dateNow.getMonth() + 1 == 3) & (dateNow.getDate() >= 10)
      ? 1
      : 0;
  console.log(
    "month:",
    dateNow.getMonth(),
    " day:",
    dateNow.getDate(),
    " dst:",
    dst
  );
  var cityInfo = citiesInfo[city];
  var times = prayTimes.getTimes(
    dateNow,
    cityInfo.coords,
    citiesInfo.timeZoneDiff,
    dst
  );
  var list = ["Fajr", "Sunrise", "Dhuhr", "Sunset", "Maghrib", "Midnight"];
  var persList = [
    "اذان صبح",
    "طلوع آفتاب",
    "اذان ظهر",
    "غروب آفتاب",
    "اذان مغرب",
    "نیمه شب",
  ];
  var html = '<table id="timetable">';
  const dateString = dateNow.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  html += '<tr><th colspan="2">' + dateString + "</th></tr>";
  for (var i in list) {
    html += "<tr><td>" + persList[i] + "</td>";
    html += "<td>" + times[list[i].toLowerCase()] + "</td></tr>";
  }
  html += "</table>";
  // call calcNextPrayerTime every 1 second
  calcNextPrayerTime(times, city);
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    var city = getCity();
    console.log("city in interval:", city);
    calcNextPrayerTime(times, city);
  }, 5000);
  // document.getElementById("table").innerHTML = html;
}

function calcNextPrayerTime(times, city) {
  var dateNow = new Date();
  var list = [
    { key: "Fajr", persian: "اذان صبح", timeStr: times.fajr },
    { key: "Sunrise", persian: "طلوع آفتاب", timeStr: times.sunrise },
    { key: "Dhuhr", persian: "اذان ظهر", timeStr: times.dhuhr },
    { key: "Sunset", persian: "غروب آفتاب", timeStr: times.sunset },
    { key: "Maghrib", persian: "اذان مغرب", timeStr: times.maghrib },
    { key: "Midnight", persian: "نیمه شب", timeStr: times.midnight },
  ];
  // console.log('list:', list);

  list.map((item) => {
    var timeStrings = item.timeStr.split(":");
    var tempTime = new Date();
    tempTime.setHours(timeStrings[0]);
    tempTime.setMinutes(timeStrings[1]);
    if (
      item.key === "Midnight" &&
      tempTime.getHours() < 1 &&
      dateNow.getHours() <= 23
    ) {
      tempTime.setDate(tempTime.getDate() + 1);
    }
    item.time = tempTime;
  });
  // console.log("list:", list);
  const nextIndex = list.findIndex((item, index) => {
    if (item.time > dateNow) {
      nextKey = item.key;
      nextTime = item.time;
      return true;
    }
  });
  if (nextIndex === -1) {
    nextIndex = 0;
    nextKey = list[0].key;
    list[0].time.setDate(list[0].time.getDate() + 1);
    nextTime = list[0].time;
  }
  const diff = nextTime - dateNow;
  // convert diff to hours and minutes and seconds
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  // console.log("diff:", diff, "hours:", hours, "minutes:", minutes);
  hString = hours < 10 ? "0" + hours : hours;
  mString = minutes < 10 ? "0" + minutes : minutes;
  const itsLate = hours == 0 && minutes < 4 && minutes > 0;
  const itsEventTime = hours == 0 && minutes == 0;
  if (itsLate) {
    style = `color: red; animation: blinker 3s linear infinite;`;
  } else if (itsEventTime) {
    style = `color: green;`;
  } else {
    style = `color: black;`;
  }
  console.log("style:", style);

  var leftTimeString = `${hString}:${mString}`;
  leftTimeString += ` تا ${list[nextIndex].persian}`;
  if (itsEventTime) {
    leftTimeString = list[nextIndex].persian;
  }
  console.log("شهر: ", citiesInfo[city].text);
  timeLeft.innerHTML = `
    <text style="${style}">${leftTimeString}</text>
    <text>به افق ${citiesInfo[city].text}</text>`;
  // console.log(leftTimeString);
}

// on city-dropdown change event if the value is ottawa set
// the audio player source to ottawaLink
// else if the value is windsor set the audio player source to windsorLink
// else if the value is st-johns set the audio player source to stJohnsLink
document
  .getElementById("city-dropdown")
  .addEventListener("change", function () {
    console.log("city changed:", this.value);
    pausePlayer();
    city = this.value;
    setCity(city);
    calendar(city);
    audioPlayer.src = citiesInfo[city].link;
    audioPlayer.load();
    pausePlayer();
    console.log("audio player source:", audioPlayer.src);
  });

const imamHasanBirthdays = () => {
  const hijriDate = getHijriDate();
  const month = hijriDate.getMonth();
  const date = hijriDate.getDate();
  return month == 9 && date >= 14 && date <= 16;
};

const imamAliDays = () => {
  const hijriDate = getHijriDate();
  const month = hijriDate.getMonth();
  const day = hijriDate.getDate();
  return month == 9 && day > 16 && day < 22;
};

const lastGhadrNight = () => {
  const hijriDate = getHijriDate();
  const month = hijriDate.getMonth();
  const day = hijriDate.getDate();
  return month == 9 && day >= 22 && day <= 23;
};

const PalDays = () => {
  const hijriDate = getHijriDate();
  const month = hijriDate.getMonth();
  const day = hijriDate.getDate();
  // get day of the week from Date object
  const dayOfWeek = new Date().getDay();
  // if its thursday or friday or Saturday
  const isAroundFriday = dayOfWeek == 4 || dayOfWeek == 5 || dayOfWeek == 6;
  return month == 9 && day >= 24 && isAroundFriday;
};
const fetrDays = () => {
  const hijriDate = getHijriDate();
  const month = hijriDate.getMonth();
  const day = hijriDate.getDate();
  return month == 9 && day >= 29 || month == 10 && day <= 3;
}
const updateBackground = () => {
  // set body backgraound image based on the current date
  let imageString = "";
  if (imamHasanBirthdays()) {
    imageString = "url('assets/back-imam-hasan.jpg')";
  } else if(imamAliDays()) {
    imageString = "url('assets/back-imam-ali.jpg')";
  } else if (lastGhadrNight()) {
    imageString = "url('assets/back-ghadr.jpg')";
  } else if (PalDays()) {
    imageString = "url('assets/back-ghadr-3.jpg')";
  } else if (fetrDays()) {
    imageString = "url('assets/back-fetr.jpg')";
  } else {
    imageString = "url('assets/back-new-year.jpg')";
  }
  document.body.style.backgroundImage = imageString;
};

// on page load check if the local storage has a city value
// if it does set the dropdown to that value
// else set the dropdown to ottawa
// and set the audio player source to based on the value of city
const pageLoad = () => {
  const hijriDate = getHijriDate();
  console.log(
    "Today is:",
    hijriDate.getDate(),
    "of",
    hijriMonths[hijriDate.getMonth() - 1], 
    " day index:", 
    new Date().getDate()
  );
  var city = getCity();
  console.log("default city:", city);
  document.getElementById("city-dropdown").value = city;
  calendar(city);
  audioPlayer.src = citiesInfo[city].link;
  console.log("audio player source:", audioPlayer.src);
  updateBackground();
};

pageLoad();
