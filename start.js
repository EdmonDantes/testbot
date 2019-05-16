let api = require("./api/pixelplanetapi.js");
let image = require("./api/imageapi.js");


function startToDraw(pathToFile, xnet, ynet, callback) {
  let array = [];


  image.forEachPixel(pathToFile, (err, x, y, color, w, h) => {
    if (err) callback(err);
    else {
      array.push({
        x: x,
        y: y,
        color: color,
      });

      if (x == w - 1 && y == h - 1) {

        function startRequests(){
          let val = array.shift();
          if (!val && array.length < 1) return callback(null);

          function check(err, res) {
            if (err) callback(err);
            else if (res) {
              if (!res.success) {
                console.log("Not success request. Count of pixels: " + array.length + "; Waiting time: " + Math.abs(res.waitSeconds) + ";Date: " + new Date().toISOString());
                setTimeout(() => api.setPixel(val.x, val.y, val.color, check), Math.abs(res.waitSeconds) * 1000);
              } else {
                startRequests();
              }
            }
          }

          api.setPixel(val.x, val.y, val.color, check);
        }

        startRequests();
      }
    }
  });
}

api.addFinger("607a6ab1e60a2909711df6722254c45f");
let path = "/home/dantes/test2.png";
startToDraw(path, 21662, -16546, (err) => {
  if (err) console.log(err);
  else {
    console.log("Done");
  }
});

// image.forEachPixel(path, (err, x, y, color) => {
//   console.log("x = " + x + ";y = " + y + ";color = " + color);
// });