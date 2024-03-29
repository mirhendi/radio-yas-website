(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require('./lib/index.js');

},{"./lib/index.js":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weekDay = weekDay;
function intPart(floatNum) {
  if (floatNum < -0.0000001) {
    return Math.ceil(floatNum - 0.0000001);
  }
  return Math.floor(floatNum + 0.0000001);
}
var delta = 1;

function GregToIsl(arg) {

  var d = parseInt(arg.CDay.value);
  var m = parseInt(arg.CMonth.value);
  var y = parseInt(arg.CYear.value);
  var jd = void 0,
      l = void 0,
      jd1 = void 0,
      n = void 0,
      j = void 0,
      delta = 1;
  if (y > 1582 || y == 1582 && m > 10 || y == 1582 && m == 10 && d > 14) {
    jd = intPart(1461 * (y + 4800 + intPart((m - 14) / 12)) / 4) + intPart(367 * (m - 2 - 12 * intPart((m - 14) / 12)) / 12) - intPart(3 * intPart((y + 4900 + intPart((m - 14) / 12)) / 100) / 4) + d - 32075 + delta;
  } else {
    jd = 367 * y - intPart(7 * (y + 5001 + intPart((m - 9) / 7)) / 4) + intPart(275 * m / 9) + d + 1729777 + delta;
  }

  jd1 = jd - delta;
  l = jd - 1948440 + 10632;
  n = intPart((l - 1) / 10631);
  l = l - 10631 * n + 354;
  j = intPart((10985 - l) / 5316) * intPart(50 * l / 17719) + intPart(l / 5670) * intPart(43 * l / 15238);
  l = l - intPart((30 - j) / 15) * intPart(17719 * j / 50) - intPart(j / 16) * intPart(15238 * j / 43) + 29;
  m = intPart(24 * l / 709);
  d = l - intPart(709 * m / 24);
  y = 30 * n + j - 30;

  return {
    d: d,
    m: m,
    y: y,
    dateOfWeek: jd1 % 7,
    dayName: weekDay(jd1 % 7)
  };
}

function IslToGreg(arg) {

  var d = parseInt(arg.HDay.value);
  var m = parseInt(arg.HMonth.value);
  var y = parseInt(arg.HYear.value);

  var jd = intPart((11 * y + 3) / 30) + 354 * y + 30 * m - intPart((m - 1) / 2) + d + 1948440 - 385 - delta;

  var l = void 0,
      n = void 0,
      i = void 0,
      j = void 0,
      k = void 0;

  if (jd > 2299160) {
    l = jd + 68569;
    n = intPart(4 * l / 146097);
    l = l - intPart((146097 * n + 3) / 4);
    i = intPart(4000 * (l + 1) / 1461001);
    l = l - intPart(1461 * i / 4) + 31;
    j = intPart(80 * l / 2447);
    d = l - intPart(2447 * j / 80);
    l = intPart(j / 11);
    m = j + 2 - 12 * l;
    y = 100 * (n - 49) + i + l;
  } else {
    j = jd + 1402;
    k = intPart((j - 1) / 1461);
    l = j - 1461 * k;
    n = intPart((l - 1) / 365) - intPart(l / 1461);
    i = l - 365 * n + 30;
    j = intPart(80 * i / 2447);
    d = i - intPart(2447 * j / 80);
    i = intPart(j / 11);
    m = j + 2 - 12 * i;
    y = 4 * k + n + i - 4716;
  }

  return {
    d: d,
    m: m,
    y: y,
    dateOfWeek: jd % 7,
    dayName: weekDay(jd % 7)
  };
}

function weekDay(wdn) {
  if (wdn == 0) {
    return "Mon";
  }
  if (wdn == 1) {
    return "Tue";
  }
  if (wdn == 2) {
    return "Wed";
  }
  if (wdn == 3) {
    return "Thu";
  }
  if (wdn == 4) {
    return "Fri";
  }
  if (wdn == 5) {
    return "Sat";
  }
  if (wdn == 6) {
    return "Sun";
  }
  return "";
}

function GregToHijri(gregDate) {
  var hijriDate = GregToIsl({
    CDay: {
      value: gregDate.getDate()
    },
    CYear: {
      value: gregDate.getFullYear()
    },
    CMonth: {
      value: gregDate.getMonth() + 1
    }
  });

  return {
    year: hijriDate.y,
    month: hijriDate.m,
    date: hijriDate.d,
    hours: gregDate.getHours(),
    minutes: gregDate.getMinutes(),
    seconds: gregDate.getSeconds(),
    milliseconds: gregDate.getMilliseconds(),
    day: hijriDate.dateOfWeek,
    dayName: hijriDate.dayName
  };
};

function HijriToGreg(hijriDate) {
  var gregDate = IslToGreg({
    HDay: {
      value: hijriDate._date || hijriDate.date
    },
    HYear: {
      value: hijriDate._year || hijriDate.year
    },
    HMonth: {
      value: hijriDate._month || hijriDate.month
    }
  });

  return new Date(gregDate.y, gregDate.m - 1, gregDate.d, hijriDate.getHours(), hijriDate.getMinutes(), hijriDate.getSeconds(), hijriDate.getMilliseconds());
};

exports.GregToHijri = GregToHijri;
exports.HijriToGreg = HijriToGreg;
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
      timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
      timezoneClip = /[^-+\dA-Z]/g,
      pad = function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = "0" + val;
    }return val;
  };

  return function (date, mask) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      utc: false
    };

    var _require$default = require('./HijriDate').default,
        locales = _require$default.locales,
        defaultLocale = _require$default.defaultLocale;

    options.locale = options.locale || defaultLocale;
    if (!locales[options.locale]) {
      throw new Error("Locale " + options.locale + " is not supported yet .\n          Please, try to extend \"HijriDate.locales\" :\n             i.e: HijriDate.locales." + options.locale + " = {dayNames:[..14 items..], monthNames:[..24 items..]}\n        ");
      return;
    }

    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    mask = String(masks[mask] || mask || masks["default"]);

    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      options.utc = true;
    }

    var _ = options.utc ? "getUTC" : "get",
        d = date[_ + "Date"](),
        D = date[_ + "Day"](),
        m = date[_ + "Month"](),
        mIndex = date[_ + "MonthIndex"](),
        y = date[_ + "FullYear"](),
        H = date[_ + "Hours"](),
        M = date[_ + "Minutes"](),
        s = date[_ + "Seconds"](),
        L = date[_ + "Milliseconds"](),
        o = options.utc ? 0 : date.getTimezoneOffset(),
        flags = {
      d: d,
      dd: pad(d),
      ddd: locales[options.locale].dayNames[D === 7 ? 0 : D + 1],
      dddd: locales[options.locale].dayNames[(D === 7 ? 0 : D + 1) + 7],
      m: m,
      mm: pad(m),
      mmm: locales[options.locale].monthNames[mIndex],
      mmmm: locales[options.locale].monthNames[mIndex + 12],
      yy: String(y).slice(2),
      yyyy: y,
      h: H % 12 || 12,
      hh: pad(H % 12 || 12),
      H: H,
      HH: pad(H),
      M: M,
      MM: pad(M),
      s: s,
      ss: pad(s),
      l: pad(L, 3),
      L: pad(L > 99 ? Math.round(L / 10) : L),
      t: H < 12 ? "a" : "p",
      tt: H < 12 ? "am" : "pm",
      T: H < 12 ? "A" : "P",
      TT: H < 12 ? "AM" : "PM",

      o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
      S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

var masks = exports.masks = {
  "default": "ddd mmm dd yyyy HH:MM:ss",
  shortDate: "m/d/yy",
  mediumDate: "mmm d, yyyy",
  longDate: "mmmm d, yyyy",
  fullDate: "dddd, mmmm d, yyyy",
  shortTime: "h:MM TT",
  mediumTime: "h:MM:ss TT",
  longTime: "h:MM:ss TT Z",
  isoDate: "yyyy-mm-dd",
  isoTime: "HH:MM:ss",
  isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

exports.default = dateFormat;
},{"./HijriDate":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateProps = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DateConverter = require('./DateConverter');

var _initializer = require('./initializer');

var _initializer2 = _interopRequireDefault(_initializer);

var _FormatDate = require('./FormatDate');

var _FormatDate2 = _interopRequireDefault(_FormatDate);

var _locales = require('./locales');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HijriDate = function () {
  function HijriDate() {
    _classCallCheck(this, HijriDate);

    return this.init.apply(this, arguments);
  }

  _createClass(HijriDate, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var props = {};
      if (!arguments.length) {
        props = _initializer2.default.initDefault();
      } else {
        try {
          var methodNameSuffix = Array.from(arguments).map(function (arg) {
            return typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
          }).join('_');
          props = _initializer2.default['init_' + methodNameSuffix].apply(_initializer2.default, arguments);
        } catch (e) {
          throw new TypeError(hijriTypeErrorMessage + '\n--- Details:\n' + e);
        }
      }

      Object.keys(props).forEach(function (prop) {
        _this['_' + prop] = props[prop];
      });
      this.__proxy__ = (0, _DateConverter.HijriToGreg)(this);
      this.initDayOfWeek();
      return this;
    }
  }, {
    key: 'initDayOfWeek',
    value: function initDayOfWeek() {
      if (!this.__proxy__) return;
      this._day = this._day || this.__proxy__.getDay();
      this._dayName = this._dayName || (0, _DateConverter.weekDay)(this._day);
    }
  }, {
    key: 'getFullYear',
    value: function getFullYear() {
      return this.year;
    }
  }, {
    key: 'getMonthIndex',
    value: function getMonthIndex() {
      return this.month - 1;
    }
  }, {
    key: 'getMonth',
    value: function getMonth() {
      return this.month;
    }
  }, {
    key: 'getDate',
    value: function getDate() {
      return this.date;
    }
  }, {
    key: 'getDay',
    value: function getDay() {
      return this.day;
    }
  }, {
    key: 'getHours',
    value: function getHours() {
      return this.hours;
    }
  }, {
    key: 'getMinutes',
    value: function getMinutes() {
      return this.minutes;
    }
  }, {
    key: 'getSeconds',
    value: function getSeconds() {
      return this.seconds;
    }
  }, {
    key: 'getMilliseconds',
    value: function getMilliseconds() {
      return this.milliseconds;
    }
  }, {
    key: 'getTime',
    value: function getTime() {
      return this.time;
    }
  }, {
    key: 'getTimezoneOffset',
    value: function getTimezoneOffset() {
      return this.timezoneOffset;
    }
  }, {
    key: 'addDay',
    value: function addDay() {
      return this.addHours(24);
    }
  }, {
    key: 'addDays',
    value: function addDays(days) {
      var _this2 = this;

      if (typeof days === 'number') Array.from({
        length: days
      }, function (v, k) {
        return k + 1;
      }).forEach(function (i) {
        return _this2.addDay();
      });
      return this;
    }
  }, {
    key: 'addHours',
    value: function addHours(n) {
      return this.addMinutes(n * 60);
    }
  }, {
    key: 'addMinutes',
    value: function addMinutes(n) {
      return this.addSeconds(n * 60);
    }
  }, {
    key: 'addSeconds',
    value: function addSeconds(n) {
      return this.addMilliseconds(1000 * n);
    }
  }, {
    key: 'addMilliseconds',
    value: function addMilliseconds(n) {
      this.time += n;
      return this;
    }
  }, {
    key: 'subtractDays',
    value: function subtractDays(days) {
      var _this3 = this;

      Array.from({
        length: days
      }, function (v, k) {
        return k + 1;
      }).forEach(function (i) {
        return _this3.subtractDay();
      });
      return this;
    }
  }, {
    key: 'subtractDay',
    value: function subtractDay() {
      return this.subtractHours(24);
    }
  }, {
    key: 'subtractHours',
    value: function subtractHours(n) {
      return this.subtractMinutes(n * 60);
    }
  }, {
    key: 'subtractMinutes',
    value: function subtractMinutes(n) {
      return this.subtractSeconds(n * 60);
    }
  }, {
    key: 'subtractSeconds',
    value: function subtractSeconds(n) {
      return this.subtractMilliseconds(1000 * n);
    }
  }, {
    key: 'subtractMilliseconds',
    value: function subtractMilliseconds(n) {
      return this.addMilliseconds(-n);
    }
  }, {
    key: 'updateProxy',
    value: function updateProxy() {
      this.__proxy__ = (0, _DateConverter.HijriToGreg)(this);
      return this;
    }
  }, {
    key: 'toGregorian',
    value: function toGregorian() {
      return this.__proxy__;
    }
  }, {
    key: 'format',
    value: function format(mask, options) {
      return _FormatDate2.default.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: 'ignoreTime',
    value: function ignoreTime() {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.milliseconds = 0;
      this.updateProxy();
      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new HijriDate(this.time);
    }
  }, {
    key: 'is',
    value: function is() {
      var _arguments = arguments,
          _this4 = this;

      if (!arguments.length) throw new Error('function cannot be called without arguments');
      if (arguments.length === 1 && _typeof(arguments[0]) === 'object' && Object.keys(arguments[0]).length) return Object.keys(arguments[0]).every(function (prop) {
        return parseInt(_arguments[0][prop]) === parseInt(_this4[prop]);
      });
      return Array.from(arguments).every(function (arg, i) {
        return arg === _this4[dateProps[i]];
      });
    }
  }, {
    key: 'isToday',
    value: function isToday() {
      return HijriDate.today().time == this.clone().ignoreTime().time;
    }
  }, {
    key: 'isYesterday',
    value: function isYesterday() {
      return HijriDate.yesterday().time == this.clone().ignoreTime().time;
    }
  }, {
    key: 'isTomorrow',
    value: function isTomorrow() {
      return HijriDate.tomorrow().time == this.clone().ignoreTime().time;
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      return this.getTime();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.format('default');
    }
  }, {
    key: 'year',
    get: function get() {
      return this._year;
    },
    set: function set(newYear) {
      this._year = newYear;
      this.updateProxy();
    }
  }, {
    key: 'month',
    get: function get() {
      return this._month;
    },
    set: function set(newMonth) {
      this._month = newMonth;
      this.updateProxy();
    }
  }, {
    key: 'date',
    get: function get() {
      return this._date;
    },
    set: function set(newDate) {
      this._date = newDate;
      this.updateProxy();
    }
  }, {
    key: 'time',
    get: function get() {
      return this.__proxy__.getTime();
    },
    set: function set(newTime) {
      var _this5 = this;

      var props = _initializer2.default.init_number(newTime);
      Object.keys(props).forEach(function (prop) {
        _this5['_' + prop] = props[prop];
      });
      this.__proxy__ = new Date(newTime);
    }
  }, {
    key: 'hours',
    get: function get() {
      return this._hours || 0;
    },
    set: function set(hours) {
      this._hours = hours;
      this.updateProxy();
    }
  }, {
    key: 'minutes',
    get: function get() {
      return this._minutes || 0;
    },
    set: function set(minutes) {
      this._minutes = minutes;
      this.updateProxy();
    }
  }, {
    key: 'seconds',
    get: function get() {
      return this._seconds || 0;
    },
    set: function set(seconds) {
      this._seconds = seconds;
      this.updateProxy();
    }
  }, {
    key: 'milliseconds',
    get: function get() {
      return this._milliseconds || 0;
    },
    set: function set(milliseconds) {
      this._milliseconds = milliseconds;
      this.updateProxy();
    }
  }, {
    key: 'timezoneOffset',
    get: function get() {
      return this.__proxy__.getTimezoneOffset();
    }
  }, {
    key: 'day',
    get: function get() {
      return this._day;
    }
  }, {
    key: 'dayName',
    get: function get() {
      return this._dayName;
    }
  }], [{
    key: 'now',
    value: function now() {
      return Date.now();
    }
  }, {
    key: 'today',
    value: function today() {
      return new HijriDate().ignoreTime();
    }
  }, {
    key: 'yesterday',
    value: function yesterday() {
      return this.today().subtractDay();
    }
  }, {
    key: 'tomorrow',
    value: function tomorrow() {
      return this.today().addDay();
    }
  }]);

  return HijriDate;
}();

HijriDate.locales = {
  ar: _locales.ar,
  en: _locales.en
};
HijriDate.defaultLocale = 'ar';

var hijriTypeErrorMessage = '\n  Wrong call of constructor !\n  Please, try to use of the following constructors:\n    \u21E2 new HijriDate() ; //current date\n      or\n    \u21E2 new HijriDate(year, month, day [, hour][, minutes][, seconds][, milliseconds]);\n         .i.e: new HijriDate(1438, 12, 23)\n      or\n    \u21E2 new HijriDate(date[, format])\n         .i.e: new HijriDate(\'1438-12-23\', \'yyyy-mm-dd\')\n  ';

var dateProps = exports.dateProps = ['year', 'month', 'date', 'hours', 'minutes', 'seconds', 'milliseconds'];
exports.default = HijriDate;
},{"./DateConverter":2,"./FormatDate":3,"./initializer":7,"./locales":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringDateParser = function () {
  function StringDateParser() {
    _classCallCheck(this, StringDateParser);
  }

  _createClass(StringDateParser, null, [{
    key: 'extract',
    value: function extract(string, format, formatChunk) {
      var ignoreCase = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var targetFormat = ignoreCase ? format.toLowerCase() : format;
      if (targetFormat.includes(formatChunk)) {
        return parseInt(string.substr(targetFormat.indexOf(formatChunk), formatChunk.length));
      }
    }
  }, {
    key: 'extractYear',
    value: function extractYear(dateString, format) {
      var year = this.extract.apply(this, Array.prototype.slice.call(arguments).concat(['yyyy']));
      if (!year) {
        year = this.extract.apply(this, Array.prototype.slice.call(arguments).concat(['yy']));
        if (year) year = Number('14' + year);
      }
      return year;
    }
  }, {
    key: 'extractMonth',
    value: function extractMonth(dateString, format) {
      var month = this.extract.apply(this, Array.prototype.slice.call(arguments).concat(['mm', false]));
      if (month) return month;
      return 1;
    }
  }, {
    key: 'extractDate',
    value: function extractDate(dateString, format) {
      var date = this.extract.apply(this, Array.prototype.slice.call(arguments).concat(['dd', false]));
      if (date) return date;
      return 1;
    }
  }, {
    key: 'extractHours',
    value: function extractHours(dateString, format) {
      var hours = this.extract.apply(this, Array.prototype.slice.call(arguments).concat(['hh']));
      if (hours) return hours;
      return 0;
    }
  }, {
    key: 'extractMinutes',
    value: function extractMinutes(dateString, format) {
      var minutes = this.extract.apply(this, Array.prototype.slice.call(arguments).concat(['MM', false]));
      if (minutes) return minutes;
      return 0;
    }
  }, {
    key: 'extractSeconds',
    value: function extractSeconds(dateString, format) {

      var seconds = this.extract.apply(this, Array.prototype.slice.call(arguments).concat(['ss', false]));
      if (seconds) return seconds;
      return 0;
    }
  }, {
    key: 'extractMilliseconds',
    value: function extractMilliseconds(dateString, format) {

      var milliseconds = this.extract.apply(this, Array.prototype.slice.call(arguments).concat(['SS', false]));
      if (milliseconds) return milliseconds;
      return 0;
    }
  }]);

  return StringDateParser;
}();

exports.default = StringDateParser;
},{}],6:[function(require,module,exports){
(function (global){(function (){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _safe = require('./safe');

var _safe2 = _interopRequireDefault(_safe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalScope = function () {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
    return window;
  }
  if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object') {
    return global;
  }
  return {};
}();

globalScope.HijriDate = _safe2.default;

Date.prototype.toHijri = function () {
  return (0, _safe.toHijri)(this);
};

exports.default = _safe2.default;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./safe":9}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DateConverter = require('./DateConverter');

var _StringDateParser = require('./StringDateParser');

var _StringDateParser2 = _interopRequireDefault(_StringDateParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultFormat = 'yyyy/mm/dd';
var defaultProps = {
  month: 1,
  date: 1,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0
};

var Initializer = function () {
  function Initializer() {
    _classCallCheck(this, Initializer);
  }

  _createClass(Initializer, null, [{
    key: 'initDefault',
    value: function initDefault() {
      return (0, _DateConverter.GregToHijri)(new Date());
    }
  }, {
    key: 'init_number',
    value: function init_number(number) {
      return (0, _DateConverter.GregToHijri)(new Date(number));
    }
  }, {
    key: 'init_number_number',
    value: function init_number_number(year, month) {

      return this.init_number_number_number(year, month, 1);
    }
  }, {
    key: 'init_number_number_number',
    value: function init_number_number_number() {
      return this.initFromNumbers.apply(this, arguments);
    }
  }, {
    key: 'init_number_number_number_number',
    value: function init_number_number_number_number() {
      return this.initFromNumbers.apply(this, arguments);
    }
  }, {
    key: 'init_number_number_number_number_number',
    value: function init_number_number_number_number_number() {
      return this.initFromNumbers.apply(this, arguments);
    }
  }, {
    key: 'init_number_number_number_number_number_number',
    value: function init_number_number_number_number_number_number() {
      return this.initFromNumbers.apply(this, arguments);
    }
  }, {
    key: 'init_number_number_number_number_number_number_number',
    value: function init_number_number_number_number_number_number_number() {
      return this.initFromNumbers.apply(this, arguments);
    }
  }, {
    key: 'init_string',
    value: function init_string() {
      return this.initFromStrings.apply(this, arguments);
    }
  }, {
    key: 'init_string_string',
    value: function init_string_string() {
      return this.initFromStrings.apply(this, arguments);
    }
  }, {
    key: 'init_object',
    value: function init_object(object) {
      return Object.assign({}, defaultProps, object);
    }
  }, {
    key: 'initFromNumbers',
    value: function initFromNumbers(year, month, date) {
      var hours = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var minutes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var _arguments = arguments;
      var seconds = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var milliseconds = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

      Array.from(arguments).forEach(function (arg, index) {
        _arguments[index] = parseInt(arg);
      });

      return {
        year: year,
        month: month,
        date: date,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds
      };
    }
  }, {
    key: 'initFromStrings',
    value: function initFromStrings(dateString) {
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFormat;

      var props = {};
      props.year = _StringDateParser2.default.extractYear(dateString, format);
      props.month = _StringDateParser2.default.extractMonth(dateString, format);
      props.date = _StringDateParser2.default.extractDate(dateString, format);
      return Object.assign({}, defaultProps, props);
    }
  }]);

  return Initializer;
}();

Initializer.defaultFormat = defaultFormat;

exports.default = Initializer;
},{"./DateConverter":2,"./StringDateParser":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ar = exports.ar = {
  dayNames: ["أحد", "اثن", "ثلا", "ارب", "خم", "جم", "سبت", "الأحد", "الإثنين", "الثلاثاء", "الإربعاء", "الخميس", "الجمعة", "السبت"],
  monthNames: ["مح", "صف", "ربع١", "ربع٢", "جم١", "جم٢", "رجب", "شعب", "رمض", "شو", "ذو ق", "ذو ح", "محرّم", "صفر", "ربيع أول", "ربيع الآخر", "جمادى أولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجّة"]
};

var en = exports.en = {
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  monthNames: ["Muha", "Saf", "Rab1", "Rab2", "Jumd1", "Jumd2", "Rajb", "Shbn", "Rmdn", "Shwl", "Qada", "Hija", "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir", "Jumadal Ula", "Jumadal Akhira", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul Qa'ada", "Dhul Hijja"]
};
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toHijri = undefined;

var _HijriDate = require('./HijriDate');

var _HijriDate2 = _interopRequireDefault(_HijriDate);

var _DateConverter = require('./DateConverter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toHijri = exports.toHijri = function toHijri(gregDate) {
  var _GregToHijri = (0, _DateConverter.GregToHijri)(gregDate),
      year = _GregToHijri.year,
      month = _GregToHijri.month,
      date = _GregToHijri.date;

  return new _HijriDate2.default(year, month, date, gregDate.getHours(), gregDate.getMinutes(), gregDate.getSeconds(), gregDate.getMilliseconds());
};
exports.default = _HijriDate2.default;
},{"./DateConverter":2,"./HijriDate":4}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
var infoBtn = document.getElementById("info-button");
var span = document.getElementById("close-button");
var playBtn = document.getElementById("play-pause-button");
var volumeBtn = document.getElementById("volume-button");
var playingTitle = document.getElementById("playing-title");
var timeLeft = document.getElementById("time-left");
var defaultCity = "st-johns";
let intervalId = null;
var citiesInfo = {
  ottawa: {
    coords: [45.3192, -75.6692],
    timeZoneDiff: -5,
    text: "اتاوا",
    timeZone: "America/Toronto",
    link: "https://azuracast.radio-yas.com:8000/radio.mp3",
  },
  windsor: {
    coords: [42.266, -82.9607],
    timeZoneDiff: -5,
    text: "ویندزور",
    timeZone: "America/Toronto",
    link: "https://azuracast.radio-yas.com:8010/radio.mp3",
  },
  "st-johns": {
    coords: [47.5615, -52.7126],
    timeZoneDiff: -3.5,
    text: "سینت جانز",
    timeZone: "America/St_Johns",
    link: "https://azuracast.radio-yas.com:8030/radio.mp3",
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

  list.map((item) => {
    var timeStrings = item.timeStr.split(":");
    var tempTime = new Date();
    tempTime.setHours(timeStrings[0]);
    tempTime.setMinutes(timeStrings[1]);
    tempTime.setSeconds(0);
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
const updateBackground = () => {
  // set body backgraound image based on the current date
  let imageString = "";
  if (imamHasanBirthdays()) {
    imageString = "url('assets/back-imam-hasan.jpg')";
  } else if(imamAliDays()) {
    imageString = "url('assets/back-imam-ali.jpg')";
  } else if (lastGhadrNight()) {
    imageString = "url('assets/back-ghadr.jpg')";
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
    hijriMonths[hijriDate.getMonth() - 1]
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

},{"hijri-date":1,"praytimes":10}]},{},[11]);
