class ClockFutureDate {
  constructor(autoStart) {
    this.autoStart = autoStart !== undefined ? autoStart : true;
    this.startTime = 0;
    this.oldTime = 0;
    this.elapsedTime = 0;
    this.running = false;
  }
  start() {
    this.startTime = (typeof performance === "undefined"
      ? Date
      : performance
    ).now(); // see #10732
    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
  }

  stop() {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  }

  getElapsedTime(futureDate) {
    this.getDelta(futureDate);
    return this.elapsedTime;
  }

  getDelta(futureDate) {
    var diff = 0;

    if (this.autoStart && !this.running) {
      this.start();
      return 0;
    }
    if (this.running) {
      var newTime;

      newTime = (typeof performance === "undefined" ? Date : performance).now();
      // console.log("newTime", Date.now());
      if (Number.isNaN(futureDate) !== Number.isNaN(NaN)) {
        newTime += futureDate;
      }
      // console.log("FutuDate", futureDate);
      diff = (newTime - this.oldTime) / 1000;
      this.oldTime = newTime;
      this.elapsedTime += diff;
    }
    // console.log(newTime);
    return diff;
  }
}

function GetFormattedNowDate() {
  var todayTime = new Date();

  var month = todayTime.getMonth() + 1;
  var day = todayTime.getDate();
  var year = todayTime.getFullYear();
  // return month + "/" + day + "/" + year;
  return year + "/" + month + "/" + day;
}

function GetFormattedNowDateToInputFormat() {
  var todayTime = new Date();

  var month = todayTime.getMonth() + 1;
  var day = todayTime.getDate();
  var year = todayTime.getFullYear();

  return String(
    year +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0")
  );
}

function parseDate(str) {
  // var mdy = str.replaceAll("-", "/").split("/"); did not work on chrome

  var mdy = str.replace(/-/gi, "/").split("/");
  // return new Date(mdy[2], mdy[0] - 1, mdy[1]);
  return new Date(mdy[0], mdy[1] - 1, mdy[2]);
}

function datediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  // return Math.round((second - first) / (1000 * 60 * 60 * 24));
  // console.log("second", second);
  // console.log("first", first);
  // console.log(Math.abs(second - first));
  //return in milliseconds
  return Math.abs(second - first);
}

// Defines functions to solve
//
//  Keplers first, second, and third laws.
//
// Credit for a lot of these go to Marc. A. Murison of US Naval Observatory, Washington, DC
// Link: http://murison.alpheratz.net/dynamics/twobody/KeplerIterations_summary.pdf
//
// var clock = new THREE.Clock();
var clockFutureDate = new ClockFutureDate();
var changedDate_Kepler = false;

var SCALING_TIME = 0.1; // Set by GUI
const SET_SCALING_TIME = 1; //Equalizer as physics has a tendency to run a bit fast.

//Calculate orbital period. Because of lack of similar-mass two-body problems, we only take the largest mass in.
function CalculateN(semimajor_axis, central_mass) {
  var Orbital_Period =
    1 /
    (2 *
      Math.PI *
      Math.sqrt(
        Math.pow(semimajor_axis * 1000, 3) / (GRAV_CONSTANT * central_mass)
      ));
  return Orbital_Period;
}
// Uses Three.js clock. Substitute Clock.getElapsedTime with whatever your chosen timing engine is!
function CalculateMT(n, t) {
  var daysAheadMS = NaN;

  // 2027-06-17
  // console.log(document.getElementById("timeFuture").value);
  // console.log(parseDate(document.getElementById("timeFuture").value));
  // console.log(parseDate(GetFormattedNowDate()));

  if (document.getElementById("timeFuture").value !== "") {
    if (changedDate_Kepler) {
      clockFutureDate = new ClockFutureDate();
      changedDate_Kepler = false;
    }

    var dtNow = [
      moment().format("YYYY"),
      moment().format("MM"),
      moment().format("DD"),
    ];

    var dtFuture = document
      .getElementById("timeFuture")
      .value.replace(/-/gi, "/")
      .split("/");
    dtFuture = [dtFuture[0], dtFuture[1], dtFuture[2]];
    daysAheadMS = moment(dtFuture).diff(dtNow);

    // daysAheadMS = datediff(
    //   parseDate(GetFormattedNowDate()),
    //   parseDate(document.getElementById("timeFuture").value)
    // );
  }

  var Mt =
    n *
    clockFutureDate.getElapsedTime(daysAheadMS) *
    SCALING_TIME *
    SET_SCALING_TIME;
  return Mt;
}

function KeplerStart(e, M) {
  var t33, t35, t34;
  t34 = Math.pow(e, 2);
  t35 = e * t34;
  t33 = Math.cos(M);
  return (
    M + ((-1 / 2) * t35 + e + (t34 + (3 / 2) * t33 * t35) * t33) * Math.sin(M)
  );
}

function eps3(e, M, x) {
  var t1, t2, t3, t4, t5;
  t1 = Math.cos(x);
  t2 = -1 + e * t1;
  t3 = Math.sin(x);
  t4 = e * t3;
  t5 = -x + t4 + M;
  t6 = t5 / (((1 / 2) * t5 * t4) / t2 + t2);
  return t5 / (((1 / 2) * t3 - (1 / 6) * t1 * t6) * e * t6 + t2);
}

function CalculateTrueAnamoly(Eccentric_Anamoly, Eccentricity, Retrograde) {
  var e1, e2, e3, e4, e5;
  e1 = Math.sqrt(1 - Eccentricity);
  e2 = Math.cos(Eccentric_Anamoly / 2);

  e3 = Math.sqrt(1 + Eccentricity);
  e4 = Math.sin(Eccentric_Anamoly / 2);

  e5 = 2 * Math.atan2(e3 * e4, e1 * e2);

  if (Retrograde == true) {
    return -e5;
  } else {
    return e5;
  }
}

function KeplerSolve(e, M) {
  var DE, E, E0, Mnorm, count;
  var tol = 1.0e-14;
  Mnorm = M % (2 * Math.PI);
  E0 = KeplerStart(e, Mnorm);
  DE = tol + 1;

  count = 0;
  while (DE > tol) {
    E = E0 - eps3(e, Mnorm, E0);
    DE = Math.abs(E - E0);
    E0 = E;
    count++;
    if (count == 100) {
      console.log("Too many iterations!");
      break;
    }
  }
  return E;
}
