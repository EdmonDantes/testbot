let https = require("https");
let zlib = require("zlib");

module.exports = {
  __fingersPrints: {},


  __requestDefaultOptions: {
    headers: {
      "accept": "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/json",
      "cookie": "__cfduid=d6bb0241d7609764cbfb90f957b1f52831557990453",
      "origin": "https://pixelplanet.fun",
      "referer": "https://pixelplanet.fun/",
      "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36"
    }
  },


  addFinger: function (str) {
    if (!this.__fingersPrints[str])
      this.__fingersPrints[str] = {
        a: 1130,
        date: new Date(0)
      };
  },


  getNextFinger: function (callback) {
    if (Object.keys(this.__fingersPrints).length < 1)
      callback("Not found fingers");

    let max = null;
    let result = null;
    for (let [key, value] of Object.entries(this.__fingersPrints)) {
      let tmp = Date.now() - value.date;
      if (max && tmp > max || !max) {
        max = tmp;
        result = key;
      }
    }
    let parent = this;
    if (max != null)
      if (max < 4000)
        setTimeout(() => {
          parent.__fingersPrints[result].date = new Date();
          callback(null, result);
        }, 4000 - max);
      else {
        callback(null, result);
        parent.__fingersPrints[result].date = new Date();
      }
    else callback("Not found fingers");
  },

  setPixel: function (x, y, color, callback, needToRepeat = 15) {
    let parent = this;

    this.getNextFinger((err, finger) => {
      if (err) return callback(err);

      parent.__requestDefaultOptions.hostname = "pixelplanet.fun";
      parent.__requestDefaultOptions.path = "/api/pixel";
      parent.__requestDefaultOptions.method = "POST";
      parent.__requestDefaultOptions.port = 443;

      let result = Buffer.alloc(0);

      let req = https.request(parent.__requestDefaultOptions, (res) => {
        if (res.statusCode == 200) {

          res.on("data", (data) => {
            result = Buffer.concat([result, data]);
          });

          res.on("end", () => {
            if (res.headers["content-encoding"] == "gzip") {
              zlib.gunzip(result, (err, dez) => {
                if (err) callback(err);
                else callback(null, JSON.parse(dez.toString()));
              });
            } else {
              try {
                callback(null, JSON.parse(result.toString()));
              } catch (err) {
                callback("Wrong content-encoding");
              }
            }
          });
        } else if (res.statusCode == 502 && needToRepeat > 0) {
          setTimeout(() => {
            parent.setPixel(x, y, color, callback, needToRepeat - 1);
          }, 1000);
        }
      });

      req.on("error", (e) => {
        callback(e);
      });

      req.write(JSON.stringify({
        x: x,
        y: y,
        color: color,
        fingerprint: finger,
        token: null,
        a: parent.__fingersPrints[finger].a++
      }));

      req.end();
    });
  },
};