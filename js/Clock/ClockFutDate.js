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

      if (typeof futureDate !== "undefined") {
        newTime += futureDate;
      }

      diff = (newTime - this.oldTime) / 1000;

      this.oldTime = newTime;
      this.elapsedTime += diff;
    }
    // console.log(newTime);
    return diff;
  }
}

export { ClockFutureDate };
