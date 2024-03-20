(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
* PrayTimes - v0.0.5 - 2019-04-06
* https://github.com/brothersincode/praytimes/
* http://praytimes.org/wiki/Code_Manual
*/

/**
  PrayTimes.js: Prayer Times Calculator (ver 2.5)
  Copyright (C) 2007-2017 PrayTimes.org

  Developer: Hamid Zarrabi-Zadeh
  License: GNU LGPL v3.0

  TERMS OF USE:
    Permission is granted to use this code, with or
    without modification, in any website or application
    provided that credit is given to the original work
    with a link back to PrayTimes.org.

  This program is distributed in the hope that it will
  be useful, but WITHOUT ANY WARRANTY.

  PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.
**/

(function (name, global, definition) {
  if (typeof module !== 'undefined') module.exports = definition();
  else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
  else if (typeof window !== 'undefined') window[name] = definition();
  else global[name] = definition();
}('PrayTimes', this, function () {
  function PrayTimes (method, options) {
    if (!(this instanceof PrayTimes)) {
      return new PrayTimes(method, options);
    }

    return this.init(method);
  }

  PrayTimes.prototype = {

    // Time Names
    timeNames: {
      imsak: 'Imsak',
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      sunset: 'Sunset',
      maghrib: 'Maghrib',
      isha: 'Isha',
      midnight: 'Midnight'
    },

    // Calculation Methods
    methods: {
      MWL: {
        name: 'Muslim World League',
        params: {
          fajr: 18,
          isha: 17,
          maghrib: '0 min',
          midnight: 'Standard'
        }
      },
      ISNA: {
        name: 'Islamic Society of North America (ISNA)',
        params: {
          fajr: 15,
          isha: 15,
          maghrib: '0 min',
          midnight: 'Standard'
        }
      },
      Egypt: {
        name: 'Egyptian General Authority of Survey',
        params: {
          fajr: 19.5,
          isha: 17.5,
          maghrib: '0 min',
          midnight: 'Standard'
        }
      },
      Makkah: { // fajr was 19 degrees before 1430 hijri
        name: 'Umm Al-Qura University, Makkah',
        params: {
          fajr: 18.5,
          isha: '90 min',
          maghrib: '0 min',
          midnight: 'Standard'
        }
      },
      Karachi: {
        name: 'University of Islamic Sciences, Karachi',
        params: {
          fajr: 18,
          isha: 18,
          maghrib: '0 min',
          midnight: 'Standard'
        }
      },
      Tehran: { // isha is not explicitly specified in this method
        name: 'Institute of Geophysics, University of Tehran',
        params: {
          fajr: 17.7,
          isha: 14,
          maghrib: 4.5,
          midnight: 'Jafari'
        }
      },
      Jafari: {
        name: 'Shia Ithna-Ashari, Leva Institute, Qum',
        params: {
          fajr: 16,
          isha: 14,
          maghrib: 4,
          midnight: 'Jafari'
        }
      }
    },

    /// Default Settings -------------------------------------------------------
    calcMethod: 'MWL',

    // do not change anything here; use adjust method instead
    setting: {
      imsak: '10 min',
      dhuhr: '0 min',
      asr: 'Standard',
      highLats: 'NightMiddle'
    },

    timeFormat: '24h',
    timeSuffixes: [ 'am', 'pm' ],
    invalidTime: '-----',

    numIterations: 1,
    offset: {},

    // coordinates
    lat: undefined,
    lng: undefined,
    elv: undefined,

    // time variables
    timeZone: undefined,
    timestamp: undefined,
    jDate: undefined,

    init: function init (method) {
      this.setMethod(method);

      // init time offsets
      for (var o in this.timeNames) {
        this.offset[o] = 0;
      }

      return this;
    },

    /// Public Functions -------------------------------------------------------

    /**
     * Set Calculation Method
     *
     * There are several conventions for calculating prayer times.
     * The default convention used in PrayTimes is Muslim World League.
     *
     * More information on the above calculation methods is provided
     * [here](http://praytimes.org/wiki/Calculation_Methods).
     *
     * Example: prayTimes.setMethod('Makkah');
     *
     * @param  {string} method can be any of the followings:
     *
     * | Method  | Description                                    |
     * | ------- | ---------------------------------------------- |
     * | MWL     |  Muslim World League                           |
     * | ISNA    |  Islamic Society of North America              |
     * | Egypt   |  Egyptian General Authority of Survey          |
     * | Makkah  |  Umm al-Qura University, Makkah                |
     * | Karachi |  University of Islamic Sciences, Karachi       |
     * | Tehran  |  Institute of Geophysics, University of Tehran |
     * | Jafari  |  Shia Ithna Ashari (Ja`fari)                   |
     *
     * @return {null}
     */
    setMethod: function (method) {
      if (this.methods[method]) {
        this.adjust(this.methods[method].params);
        this.calcMethod = method;
      }
    },

    /**
     * Adjusting Parameters
     *
     * The calculating parameters can be adjusted using this function.
     *
     * | Parameter | Values  | Description                              | Sample Value |
     * | --------- | ------- | ---------------------------------------- | ------------ |
     * | imsak     | degrees | twilight angle                           | 18           |
     * |           | minutes | minutes before fajr                      | 10 min       |
     * | fajr      | degrees | twilight angle                           | 15           |
     * | dhuhr     | minutes | minutes after mid-day                    | 1 min        |
     * | asr       | method  | asr juristic method; see the table above | Standard     |
     * |           | factor  | shadow length factor for realizing asr   | 1.7          |
     * | maghrib   | degrees | twilight angle                           | 4            |
     * |           | minutes | minutes after sunset                     | 15 min       |
     * | isha      | degrees | twilight angle                           | 18           |
     * |           | minutes | minutes after maghrib                    | 90 min       |
     * | midnight  | method  | midnight method; see the table above     | Standard     |
     * | highLats  | method  | higher latitudes adjustment; see above   | None         |
     *
     * asr methods, [more info](http://praytimes.org/wiki/Calculation#Asr):
     * | Method   | Description                                            |
     * | -------- | ------------------------------------------------------ |
     * | Standard | Shafii, Maliki, Jafari and Hanbali (shadow factor = 1) |
     * | Hanafi   | Hanafi school of tought (shadow factor = 2)            |
     *
     * midnight methods:
     * | Method   | Description                          |
     * | -------- | ------------------------------------ |
     * | Standard | The mean time from Sunset to Sunrise |
     * | Jafari   | The mean time from Maghrib to Fajr   |
     *
     * higher latitudes methods,
     * [more info](http://praytimes.org/wiki/Calculation#Higher_Latitudes):
     * | Method      | Description                          |
     * | ----------- | ------------------------------------ |
     * | None        | No adjustments                       |
     * | NightMiddle | The middle of the night method       |
     * | OneSeventh  | The 1/7th of the night method        |
     * | AngleBased  | The angle-based method (recommended) |
     *
     * @param  {array} params is an associative array composed of any number
     *                         of the above parameters.
     *
     * @return {null}
     */
    adjust: function adjust (params) {
      for (var id in params) {
        this.setting[id] = params[id];
      }
    },

    /**
     * Tuning Times
     *
     * You can further tune calculated prayer times (for precaution).
     *
     * By default, PrayTimes rounds minutes to the nearest values. To round
     * a specific time up, you can tune it by +0.5 minutes, and to
     * round it down, you can tune it by -0.5 minutes.
     *
     * Tuning is the last step after calculating step, and thus, it has
     * no effect on the calculation parameters. For example, if Isha is
     * set to be 90 minutes after sunset, tuning sunset by 5 minutes
     * will not push Isha forward.
     *
     * Example: prayTimes.tune( {sunrise: -1, sunset: 3.5} );
     *
     * @param  {array} timeOffsets is an associative array containing time
     *                              offsets in minutes for each prayer time.
     *
     * @return {null}
     */
    tune: function tune (timeOffsets) {
      for (var i in timeOffsets) {
        this.offset[i] = timeOffsets[i];
      }
    },

    /**
     * Get Prayer Times
     *
     * The following function is used to retrieve prayer times for a given date
     * and location.
     *
     * Example: prayTimes.getTimes(new Date(), [43, -80], -5);
     *
     * @param  {mixed} date     The date for which prayer times are calculated.
     *                          You can use `new Date()` to specify today. Date
     *                          can be also entered as a triple
     *                          `[year, month, day]`. For example,
     *                          `[2009, 2, 26]` specifies February 26, 2009.
     *
     * @param  {array} coords   Specifies the coordinates of the input location
     *                          as a triple `[latitude, longitude, elevation]`.
     *                          Latitude is a real number between -90 and 90,
     *                          longitude is between -180 and 180, and elevation
     *                          is a positive number, specifying the height in
     *                          meters with respect to the surrounding terrain.
     *                          The elevation parameter is optional.
     *                          Examples of valid coordinates are
     *                          `[-43.2, 80.6]` and `[12.5, -25.8, 300]`.
     *
     * @param  {int} timezone   The difference to Greenwich time (GMT) in hours.
     *                          If omitted or set to 'auto', timezone is
     *                          extracted from the system.
     *
     * @param  {int} dst        Daylight Saving Time: 1 if date is in daylight
     *                          saving time, 0 otherwise. If omitted or set to
     *                          'auto', dst is extracted from the system.
     *
     * @param  {string} format  Output time format, according to the following:
     *                          | Format | Description                   | Example |
     *                          | ------ | ----------------------------- | ------- |
     *                          | 24h    | 24-hour time format           | 16:45   |
     *                          | 12h    | 12-hour time format           | 4:45 pm |
     *                          | 12hNS  | 12-hour format with no suffix | 4:45    |
     *                          | Float  | Floating point number         | 16.75   |
     *
     * @return {array}          an associative array containing 9 prayer times
     *                          (see here for the list of times and their definition).
     *                          Each time can be accessed thorough its name.
     *                          For example, if the output of getTimes function
     *                          is stored in an object times, the time for
     *                          sunrise can be accessed through times.sunrise.
     */
    getTimes: function (date, coords, timezone, dst, format) {
      this.lat = +coords[0];
      this.lng = +coords[1];
      this.elv = coords[2] ? +coords[2] : 0;
      this.timeFormat = format || this.timeFormat;

      if (date.constructor === Date) {
        date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
      }

      if (typeof (timezone) === 'undefined' || timezone === 'auto') {
        timezone = this.getTimeZone(date);
      }

      if (typeof (dst) === 'undefined' || dst === 'auto') {
        dst = this.getDst(date);
      }

      this.timeZone = +timezone + (+dst ? 1 : 0);
      this.timestamp = (new Date(Date.UTC(date[0], date[1] - 1, date[2]))).getTime();
      this.jDate = this.julian(date[0], date[1], date[2]) - this.lng / 360;

      return this.computeTimes();
    },

    // convert float time to the given format (see timeFormats)
    getFormattedTime: function (time, format, suffixes) {
      if (isNaN(time)) {
        return this.invalidTime;
      }

      if (format === 'Float') {
        return time;
      }

      if (format === 'Timestamp') {
        return this.timestamp + Math.floor((time - this.timeZone) * 60 * 60 * 1000);
      }

      suffixes = suffixes || this.timeSuffixes;
      time = this.dMathfixHour(time + 0.5 / 60); // add 0.5 minutes to round

      var hours = Math.floor(time);
      var minutes = Math.floor((time - hours) * 60);
      var suffix = (format === '12h') ? suffixes[hours < 12 ? 0 : 1] : '';
      var hour = (format === '24h') ? this.twoDigitsFormat(hours) : ((hours + 12 - 1) % 12 + 1);

      return hour + ':' + this.twoDigitsFormat(minutes) + (suffix ? ' ' + suffix : '');
    },

    /// Calculation Functions --------------------------------------------------

    // compute mid-day time
    midDay: function (time) {
      return this.dMathfixHour(12 - this.sunPosition(this.jDate + time).equation);
    },

    // compute the time at which sun reaches a specific angle below horizon
    sunAngleTime: function (angle, time, direction) {
      var decl = this.sunPosition(this.jDate + time).declination;
      var noon = this.midDay(time);
      var t = 1 / 15 * this.dMathArcCos((-this.dMathSin(angle) - this.dMathSin(decl) * this.dMathSin(this.lat)) / (this.dMathCos(decl) * this.dMathCos(this.lat)));

      return noon + (direction === 'ccw' ? -t : t);
    },

    // compute asr time
    asrTime: function (factor, time) {
      var decl = this.sunPosition(this.jDate + time).declination;
      var angle = -(this.dMathArcCot(factor + this.dMathTan(Math.abs(this.lat - decl))));
      return this.sunAngleTime(angle, time);
    },

    // compute declination angle of sun and equation of time
    // @REF: https://aa.usno.navy.mil/faq/docs/SunApprox.php
    sunPosition: function (jd) {
      var D = jd - 2451545.0;
      var g = this.dMathfixAngle(357.529 + 0.98560028 * D);
      var q = this.dMathfixAngle(280.459 + 0.98564736 * D);
      var L = this.dMathfixAngle(q + 1.915 * this.dMathSin(g) + 0.020 * this.dMathSin(2 * g));
      // var R = 1.00014 - 0.01671 * this.dMathCos(g) - 0.00014 * this.dMathCos(2 * g);
      var e = 23.439 - 0.00000036 * D;
      var RA = this.dMathArcTan2(this.dMathCos(e) * this.dMathSin(L), this.dMathCos(L)) / 15;

      return {
        declination: this.dMathArcSin(this.dMathSin(e) * this.dMathSin(L)),
        equation: q / 15 - this.dMathfixHour(RA)
      };
    },

    // convert Gregorian date to Julian day
    // @REF: Astronomical Algorithms by Jean Meeus
    julian: function (year, month, day) {
      if (month <= 2) {
        year -= 1;
        month += 12;
      }

      var A = Math.floor(year / 100);
      var B = 2 - A + Math.floor(A / 4);

      return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    },

    /// Compute Prayer Times ---------------------------------------------------

    // compute prayer times at given julian date
    computePrayerTimes: function (hours) {
      var times = this.dayPortions(hours);

      return {
        imsak: this.sunAngleTime(this.value(this.setting.imsak), times.imsak, 'ccw'),
        fajr: this.sunAngleTime(this.value(this.setting.fajr), times.fajr, 'ccw'),
        sunrise: this.sunAngleTime(this.riseSetAngle(), times.sunrise, 'ccw'),
        dhuhr: this.midDay(times.dhuhr),
        asr: this.asrTime(this.asrFactor(this.setting.asr), times.asr),
        sunset: this.sunAngleTime(this.riseSetAngle(), times.sunset),
        maghrib: this.sunAngleTime(this.value(this.setting.maghrib), times.maghrib),
        isha: this.sunAngleTime(this.value(this.setting.isha), times.isha)
      };
    },

    // compute prayer times
    computeTimes: function () {
      // default times
      var times = {
        imsak: 5,
        fajr: 5,
        sunrise: 6,
        dhuhr: 12,
        asr: 13,
        sunset: 18,
        maghrib: 18,
        isha: 18
      };

      // main iterations
      for (var i = 1; i <= this.numIterations; i++) {
        times = this.computePrayerTimes(times);
      }

      times = this.adjustTimes(times);

      // add midnight time
      times.midnight = (this.setting.midnight === 'Jafari')
        ? times.sunset + this.timeDiff(times.sunset, times.fajr + 24) / 2
        : times.sunset + this.timeDiff(times.sunset, times.sunrise + 24) / 2;

      times = this.tuneTimes(times);

      return this.modifyFormats(times);
    },

    // adjust times
    adjustTimes: function (times) {
      var params = this.setting;

      for (var i in times) {
        times[i] += this.timeZone - this.lng / 15;
      }

      if (params.highLats !== 'None') {
        times = this.adjustHighLats(times);
      }

      if (this.isMin(params.imsak)) {
        times.imsak = times.fajr - this.value(params.imsak) / 60;
      }

      if (this.isMin(params.maghrib)) {
        times.maghrib = times.sunset + this.value(params.maghrib) / 60;
      }

      if (this.isMin(params.isha)) {
        times.isha = times.maghrib + this.value(params.isha) / 60;
      }

      times.dhuhr += this.value(params.dhuhr) / 60;

      return times;
    },

    // get asr shadow factor
    asrFactor: function (asrParam) {
      var factor = { Standard: 1, Hanafi: 2 }[asrParam];
      return factor || this.value(asrParam);
    },

    // return sun angle for sunset/sunrise
    riseSetAngle: function () {
      // var earthRad = 6371009; // in meters
      // var angle = this.dMathArcCos(earthRad/(earthRad + this.elv));

      var angle = 0.0347 * Math.sqrt(this.elv); // an approximation

      return 0.833 + angle;
    },

    // apply offsets to the times
    tuneTimes: function (times) {
      for (var i in times) {
        times[i] += this.offset[i] / 60;
      }

      return times;
    },

    // convert times to given time format
    modifyFormats: function (times) {
      for (var i in times) {
        times[i] = this.getFormattedTime(times[i], this.timeFormat);
      }

      return times;
    },

    // adjust times for locations in higher latitudes
    adjustHighLats: function (times) {
      var params = this.setting;
      var nightTime = this.timeDiff(times.sunset, times.sunrise);

      times.imsak = this.adjustHLTime(times.imsak, times.sunrise, this.value(params.imsak), nightTime, 'ccw');
      times.fajr = this.adjustHLTime(times.fajr, times.sunrise, this.value(params.fajr), nightTime, 'ccw');
      times.isha = this.adjustHLTime(times.isha, times.sunset, this.value(params.isha), nightTime);
      times.maghrib = this.adjustHLTime(times.maghrib, times.sunset, this.value(params.maghrib), nightTime);

      return times;
    },

    // adjust a time for higher latitudes
    adjustHLTime: function (time, base, angle, night, direction) {
      var portion = this.nightPortion(angle, night);

      var timeDiff = (direction === 'ccw')
        ? this.timeDiff(time, base)
        : this.timeDiff(base, time);

      if (isNaN(time) || timeDiff > portion) {
        time = base + (direction === 'ccw' ? -portion : portion);
      }

      return time;
    },

    // the night portion used for adjusting times in higher latitudes
    nightPortion: function (angle, night) {
      var method = this.setting.highLats;
      var portion = 1 / 2; // MidNight

      if (method === 'AngleBased') {
        portion = 1 / 60 * angle;
      }

      if (method === 'OneSeventh') {
        portion = 1 / 7;
      }

      return portion * night;
    },

    // convert hours to day portions
    dayPortions: function (hours) {
      for (var i in hours) {
        hours[i] /= 24;
      }
      return hours;
    },

    // Time Zone Functions -----------------------------------------------------

    // get local time zone
    getTimeZone: function (date) {
      return Math.min(this.gmtOffset([date[0], 0, 1]), this.gmtOffset([date[0], 6, 1]));
    },

    // get daylight saving for a given date
    getDst: function (date) {
      return 1 * (this.gmtOffset(date) !== this.getTimeZone(date));
    },

    // GMT offset for a given date
    gmtOffset: function (date) {
      var localDate = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
      var GMTString = localDate.toGMTString();
      var GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ') - 1));
      return (localDate - GMTDate) / (1000 * 60 * 60);
    },

    /// Misc Functions ---------------------------------------------------------

    // convert given string into a number
    value: function (str) {
      return 1 * (str + '').split(/[^0-9.+-]/)[0];
    },

    // detect if input contains 'min'
    isMin: function (arg) {
      return (arg + '').indexOf('min') !== -1;
    },

    // compute the difference between two times
    timeDiff: function (time1, time2) {
      return this.dMathfixHour(time2 - time1);
    },

    // add a leading 0 if necessary
    twoDigitsFormat: function (num) {
      return num < 10 ? '0' + num : num;
    },

    // Degree-Based Math -------------------------------------------------------

    // dtr
    dMathDTR: function (d) {
      return (d * Math.PI) / 180.0;
    },

    // rtd
    dMathRTD: function (r) {
      return (r * 180.0) / Math.PI;
    },

    // sin
    dMathSin: function (d) {
      return Math.sin(this.dMathDTR(d));
    },

    // cos
    dMathCos: function (d) {
      return Math.cos(this.dMathDTR(d));
    },

    // tan
    dMathTan: function (d) {
      return Math.tan(this.dMathDTR(d));
    },

    // arcsin
    dMathArcSin: function (d) {
      return this.dMathRTD(Math.asin(d));
    },

    // arccos
    dMathArcCos: function (d) {
      return this.dMathRTD(Math.acos(d));
    },

    // arctan
    dMathArcTan: function (d) {
      return this.dMathRTD(Math.atan(d));
    },

    // arccot
    dMathArcCot: function (x) {
      return this.dMathRTD(Math.atan(1 / x));
    },

    // arctan2
    dMathArcTan2: function (y, x) {
      return this.dMathRTD(Math.atan2(y, x));
    },

    // fixAngle
    dMathfixAngle: function (a) {
      return this.dMathFix(a, 360);
    },

    // fixHour
    dMathfixHour: function (a) {
      return this.dMathFix(a, 24);
    },

    // fix
    dMathFix: function (a, b) {
      a = a - b * (Math.floor(a / b));
      return (a < 0) ? a + b : a;
    }
  };

  return PrayTimes;
}));

},{}],2:[function(require,module,exports){
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
  // document.getElementById("table").innerHTML = html;
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
    // console.log('temp Date:', tempTime.toLocaleTimeString())
    // console.log("key:", key, times[key], tempTime > dateNow);
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
  // timeLeft.innerHTML = `<p id="left-time">${leftTimeString}</p>`;
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
city = localStorage.getItem("city") || 'st-johns';
document.getElementById("city-dropdown").value = city;
calendar(city);
audioPlayer.src = citiesInfo[city].link;
console.log("audio player source:", audioPlayer.src);

},{"praytimes":1}]},{},[2]);
