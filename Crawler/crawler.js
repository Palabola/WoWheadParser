require("dotenv").config();
const request = require("request");

request.defaults({
  pool: { maxSockets: 10 },
  timeout: 3000,
  forever: false
});

class Crawler {
  constructor(fecth_array, optional_array, timer = 100, thread = 10) {
    this.fecth_array = fecth_array;
    if (optional_array) {
      this.optional_array = optional_array;
    } else {
      this.optional_array = fecth_array;
    }
    this.step = 0;
    this.thread = thread;
    this.thread_array = [];
    this.timer = timer;
  }

  start_fetch(callback) {
    this.callback = callback; // err, res

    this.async_fecth();
  }

  async_fecth() {
    // End of the job
    if (this.step > this.fecth_array.length) {
      this.callback("Finish", null);
      return;
    }
    setTimeout(() => {
      for (let i = 0; i < this.thread; i++) {
        // Init Threads or renew them
        if (this.thread_array[i] == 1 || this.thread_array[i] === undefined) {
          // Set state for 0 until async request done avoid overwrite
          this.thread_array[i] = 0;

          this.fethcing(
            this.fecth_array[this.step],
            this.optional_array[this.step]
          )
            .then(res => {
              this.thread_array[i] = 1;
              this.callback(null, res);
            })
            .catch(err => {
              this.thread_array[i] = 1;
              this.callback(err, null);
            });
          this.step++;
        }
      }

      this.async_fecth(); // Recursive call for creating a loop
    }, this.timer);
  }

  fethcing(uri, optional) {
    return new Promise((resolve, reject) => {
      {
        request(uri, (err, res, body) => {
          if (err) {
            reject(err);
          }

          let result = {};

          result.optional = optional;
          result.body = body;
          result.uri = uri;

          resolve(result);
        });
      }
    });
  }
}

module.exports = Crawler;
