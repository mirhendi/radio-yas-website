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
getCurrentSong(); // Fetch and play the current song on page load
// getUpcomingPlaylist(); // Uncomment to fetch and display the upcoming playlist

// Optional: Add event listeners for user interactions (e.g., play/pause, volume control)

var modal = document.getElementById("info-modal");
var infoBtn = document.getElementById("info-button");
var span = document.getElementById("close-button");
var playBtn = document.getElementById("play-pause-button");
var volumeBtn = document.getElementById("volume-button");
var playingTitle = document.getElementById("playing-title");
var timeLeft = document.getElementById("time-left");
var citiesInfo = {
  "ottawa": { 
    coords: [45.4215, -75.6972], 
    timezone: -5,
    link: "https://azuracast.radio-yas.com:8000/radio.mp3"},
  "windsor": { coords: [42.3149, -83.0364], timezone: -5,
    link: "https://azuracast.radio-yas.com:8010/radio.mp3"},
  "st-johns": { coords: [47.5615, -52.7126], timezone: -3.5,
    link: "https://azuracast.radio-yas.com:8030/radio.mp3"},
};
var ottawaLink = "https://azuracast.radio-yas.com:8000/radio.mp3";
var windsorLink = "https://azuracast.radio-yas.com:8010/radio.mp3";
var stJohnsLink = "https://azuracast.radio-yas.com:8030/radio.mp3";

const pausePlayer = () => {
  audioPlayer.pause();
  playBtn.innerHTML =
    '<img id="play-pause-logo" src="assets/play.svg" alt="Play/Pause">';
};

const playPlayer = () => {
  audioPlayer.load();
  audioPlayer.play();
  playBtn.innerHTML =
    '<img id="play-pause-logo" src="assets/pause.svg" alt="Play/Pause">';
  // playingTitle.innerHTML = audioPlayer.src.split('/').pop();
};

playBtn.onclick = function () {
  // change the icon to pause or vice versa
  console.log("play button clicked");
  if (audioPlayer.paused) {
    playPlayer();
  } else {
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

function calendar(city) {
  var PT = require("praytimes");
  var prayTimes = new PT('Tehran');
  var dateNow = new Date(); // today
  var dst = dateNow.getMonth()+1 >= 4 || dateNow.getMonth()+1 == 3 & dateNow.getDate() >= 10 ? 1 : 0;
  console.log("month:", dateNow.getMonth(), ' day:', dateNow.getDate(), " dst:", dst);
  var city = citiesInfo[city];
  var times = prayTimes.getTimes(dateNow, city.coords, city.timezone, dst,  );
  var list = ["Fajr", "Sunrise", "Dhuhr", "Sunset", "Maghrib", "Midnight"];
  var persList = ["اذان صبح", "طلوع آفتاب", "اذان ظهر", "غروب آفتاب", "اذان مغرب", "نیمه شب"]
  var html = '<table id="timetable">';
  const dateString = dateNow.toLocaleDateString('en-US', 
  { year: 'numeric', month: 'short', day: 'numeric' })
  html += '<tr><th colspan="2">' + dateString + "</th></tr>";
  for (var i in list) {
    html += "<tr><td>" + persList[i] + "</td>";
    html += "<td>" + times[list[i].toLowerCase()] + "</td></tr>";
  }
  html += "</table>";
  // call calcNextPrayerTime every 1 second
  calcNextPrayerTime(times);
  setInterval(() => {
    var city = localStorage.getItem("city") || 'ottawa';
    calcNextPrayerTime(times, city);
  }, 10000);
  document.getElementById("table").innerHTML = html;
}

 function calcNextPrayerTime(times, city) {
  var dateNow = new Date();
  var list = ["Fajr", "Sunrise", "Dhuhr", "Sunset", "Maghrib", "Midnight"];
  var persList = ["اذان صبح", "طلوع آفتاب", "اذان ظهر", "غروب آفتاب", "اذان مغرب", "نیمه شب"]
  var nextIndex = Object.values(times).find((date) => date > dateNow);
  var nextKey = Object.keys(times)[nextIndex];
  nextKey = "fajr";
  nextIndex = 0;
  nextTime = dateNow
  list.some((key, index) => {
    key = key.toLowerCase();
    var timeStrings = times[key].split(":");
    var tempTime = new Date();
    tempTime.setHours(timeStrings[0]);
    tempTime.setMinutes(timeStrings[1]);
    tempTime.setSeconds(0);
    console.log('temp Date:', tempTime.toLocaleTimeString())
    console.log("key:", key, times[key], tempTime > dateNow);
    if (tempTime > dateNow) {
      nextKey = key;
      nextIndex = index;
      nextTime = tempTime;
      return true;
    }
  });
  const diff = nextTime - dateNow;
  // convert diff to hours and minutes and seconds
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  hString = hours < 10 ? "0" + hours : hours;
  mString = minutes < 10 ? "0" + minutes : minutes;
  var leftTimeString = `${hString}:${mString}`;
  leftTimeString += ` تا ${persList[nextIndex]}`;
  timeLeft.innerHTML = `<p id="left-time">${leftTimeString}</p>`;
  console.log("city:", city, "next key:", nextKey, nextIndex, ' diff:', hours, minutes);
};

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
    localStorage.setItem("city", city);
    calendar(city);
    console.log("city:", city, " link:", citiesInfo[city].link)
    audioPlayer.src = citiesInfo[city].link;
    audioPlayer.load();
    pausePlayer();
    console.log("audio player source:", audioPlayer.src);
  });

// on page load check if the local storage has a city value
// if it does set the dropdown to that value
// else set the dropdown to ottawa
// and set the audio player source to based on the value of city
city = localStorage.getItem("city") || 'ottawa';
document.getElementById("city-dropdown").value = city;
calendar(city);
audioPlayer.src = citiesInfo[city].link;
console.log("audio player source:", audioPlayer.src);
