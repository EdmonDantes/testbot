let api = require("./pixelplanetapi.js");
let image = require("./imageapi.js");

function createRandomString(length) {
  let result = "";
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


api.addFinger(createRandomString(32));

module.exports = {
  __pointsArray: [],
  drawOnServer: function (pathToFile, x, y, callback) {
    let parent = this;
    image.forEachPixel(pathToFile, (err, xPoint, yPoint, color, w, h) => {
      if (err) return callback(err);

      parent.__pointsArray.push({
        x: xPoint,
        y: yPoint,
        color: color
      });

      if (xPoint == w - 1 && yPoint == h - 1) {
        console.log("Ended load bitmap for file: " + pathToFile);

        function startRequests() {
          let val = parent.__pointsArray.shift();
          if (!val && parent.__pointsArray.length < 1) return callback(null);

          function check(err, res) {
            if (err) callback(err);
            else if (res) {
              if (!res.success) {
                console.log("Not success request. Count of pixels: " +  parent.__pointsArray.length + "; Waiting time: " + Math.abs(res.waitSeconds) + ";Date: " + new Date().toISOString());
                setTimeout(() => api.setPixel(val.x, val.y, val.color, check), Math.abs(res.waitSeconds) * 1000);
              } else {
                startRequests();
              }
            }
          }

          api.setPixel(x + val.x, y + val.y, val.color, check);
        }

        startRequests();
      }
    });
  }
};