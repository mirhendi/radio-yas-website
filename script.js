const audioPlayer = document.getElementById('audio-player');
const songTitleElement = document.getElementById('song-title');
const playlistItems = document.getElementById('playlist-items');

// AWS S3 Configuration (replace with your credentials and bucket details)
const s3BucketName = 'your-radio-station-bucket';
const s3Region = 'your-aws-region'; // e.g., 'us-east-1'

// Function to fetch the current song and update the player
function getCurrentSong() {
  const currentSongUrl = `https://s3.${s3Region}.amazonaws.com/${s3BucketName}/nowplaying.txt`; // Replace with actual file path or API endpoint

  fetch(currentSongUrl)
    .then(response => response.text())
    .then(data => {
      audioPlayer.src = data; // Update audio source URL
      songTitleElement.textContent = data.split('/').pop(); // Extract song title from URL
      audioPlayer.load(); // Reload the audio player
      audioPlayer.play(); // Start playing the current song
    })
    .catch(error => console.error(error));
}

// Function to fetch the upcoming playlist (optional)
function getUpcomingPlaylist() {
  const playlistUrl = `https://s3.${s3Region}.amazonaws.com/${s3BucketName}/playlist.txt`; // Replace with actual file path or API endpoint

  fetch(playlistUrl)
    .then(response => response.text())
    .then(data => {
      const playlist = data.split('\n');
      playlistItems.innerHTML = ''; // Clear existing playlist items
      playlist.forEach(song => {
        const listItem = document.createElement('li');
        listItem.textContent = song;
        playlistItems.appendChild(listItem);
      });
    })
    .catch(error => console.error(error));
}

getCurrentSong(); // Fetch and play the current song on page load
// getUpcomingPlaylist(); // Uncomment to fetch and display the upcoming playlist

// Optional: Add event listeners for user interactions (e.g., play/pause, volume control)

var modal = document.getElementById("info-modal");
var btn = document.getElementById("info-button");
var span = document.getElementById("close-button");
var playBtn = document.getElementById("play-pause-button");
var volumeBtn = document.getElementById("volume-button");

playBtn.onclick = function() {
  // change the icon to pause or vice versa
  console.log('play button clicked')
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.innerHTML = '<img id="play-pause-logo" src="pause.svg" alt="Play/Pause">';
  } else {
    audioPlayer.pause();
    playBtn.innerHTML = '<img id="play-pause-logo" src="play.svg" alt="Play/Pause">';
  }
}
volumeBtn.onclick = function() {
  // change the icon to mute or vice versa
  console.log('volume button clicked')
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
    volumeBtn.innerHTML = '<img id="volume-logo" src="vol-low.svg" alt="Volume">';
    audioPlayer.volume = 0.3;
  } else {
    if(volumeBtn.innerHTML === '<img id="volume-logo" src="vol-low.svg" alt="Volume">') {
      volumeBtn.innerHTML = '<img id="volume-logo" src="vol-med.svg" alt="Volume">';
      audioPlayer.volume = 0.6;
    } else if (volumeBtn.innerHTML === '<img id="volume-logo" src="vol-med.svg" alt="Volume">') {
      volumeBtn.innerHTML = '<img id="volume-logo" src="vol-high.svg" alt="Volume">';
      audioPlayer.volume = 1.0;
    } else {
      audioPlayer.muted = true;
      volumeBtn.innerHTML = '<img id="volume-logo" src="vol-mute.svg" alt="Volume">';
    }
  }
}
btn.onclick = function() {
  modal.style.display = "block";
}


span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}