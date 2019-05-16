let jimp = require("jimp");

function rgb(r, g, b) {
  return (r << 16) + (g << 8) + b;
};

function hex(hex) {
  return {
    r: (hex & 0xff0000) >> 16,
    g: (hex & 0x00ff00) >> 8,
    b: (hex & 0x0000ff)
  };
}

module.exports = {
  colorRGBToHex: rgb,
  colorHexToObjectRGB: hex,
  colorObjectRGBToHex: function (obj) {
    return rgb(obj.r, obj.g, obj.b);
  },
  colorRGBAToObjectRGB(r, g, b, a, background_r, background_g, background_b) {
    return {
      r: (1 - a / 255) * background_r + (a / 255) * r,
      g: (1 - a / 255) * background_g + (a / 255) * g,
      b: (1 - a / 255) * background_b + (a / 255) * b,
    }
  },
  colors: {},
  forEachPixel: function (pathToFile, callback) {
    jimp.read(pathToFile, (err, image) => {
      if (err) callback(err);
      else {
        let parent = this;
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
          callback(null, x, y,
            parent.colors[
              parent.colorObjectRGBToHex(
                parent.closerColor(
                  parent.colorRGBAToObjectRGB(
                    image.bitmap.data[idx],
                    image.bitmap.data[idx + 1],
                    image.bitmap.data[idx + 2],
                    image.bitmap.data[idx + 3],
                    255,
                    255,
                    255)
                ))
              ],
            image.bitmap.width,
            image.bitmap.height
          );
        });
      }
    });
  },
  closerColor(color) {

    function colorDistanse(color1, color2) {
      return Math.sqrt(Math.pow(color1.r - color2.r, 2) + Math.pow(color1.g - color2.g, 2) + Math.pow(color1.b - color2.b, 2));
    }

    let result = {r: 255, g: 255, b: 255};
    let min = colorDistanse(color, result);
    for (let tmp0 in this.colors) {
      let tmp = this.colorHexToObjectRGB(parseInt(tmp0));
      if (colorDistanse(color, tmp) < min) {
        result = tmp;
        min = colorDistanse(color, tmp);
      }
    }
    return result;
  }
};

module.exports.colors[rgb(255, 255, 255)] = 2;
module.exports.colors[rgb(228, 228, 228)] = 3;
module.exports.colors[rgb(136, 136, 136)] = 4;
module.exports.colors[rgb(78, 78, 78)] = 5;
module.exports.colors[rgb(0, 0, 0)] = 6;
module.exports.colors[rgb(244, 179, 174)] = 7;
module.exports.colors[rgb(255, 167, 209)] = 8;
module.exports.colors[rgb(255, 101, 101)] = 9;
module.exports.colors[rgb(229, 0, 0)] = 10;
module.exports.colors[rgb(254, 164, 96)] = 11;
module.exports.colors[rgb(229, 149, 0)] = 12;
module.exports.colors[rgb(160, 106, 66)] = 13;
module.exports.colors[rgb(245, 223, 176)] = 14;
module.exports.colors[rgb(229, 217, 0)] = 15;
module.exports.colors[rgb(148, 224, 68)] = 16;
module.exports.colors[rgb(2, 190, 1)] = 17;
module.exports.colors[rgb(0, 101, 19)] = 18;
module.exports.colors[rgb(202, 227, 255)] = 19;
module.exports.colors[rgb(0, 211, 211)] = 20;
module.exports.colors[rgb(0, 131, 199)] = 21;
module.exports.colors[rgb(0, 0, 234)] = 22;
module.exports.colors[rgb(25, 25, 115)] = 23;
module.exports.colors[rgb(207, 110, 228)] = 24;
module.exports.colors[rgb(130, 0, 128)] = 25;