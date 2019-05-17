let bot = require("./api/bot.js");


bot.drawOnServer("./test.png",-11367,21217, err => {
  if (err) console.log(err);
  else console.log("Done");
});

// image.forEachPixel(path, (err, x, y, color) => {
//   console.log("x = " + x + ";y = " + y + ";color = " + color);
// });
