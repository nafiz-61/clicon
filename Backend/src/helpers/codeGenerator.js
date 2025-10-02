const QRCode = require("qrcode");
const bwipjs = require("bwip-js");
const { customError } = require("../utils/customError");
// function to generate a Qr code for given product ID
exports.generateProductQrCode = async (link) => {
  try {
    return await QRCode.toDataURL(link, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.log(error);
    throw new customError(500, "QR code generation failed");
  }
};

// barcode generator
exports.generateBarCode = async (code) => {
  try {
    return await bwipjs.toSVG({
      bcid: "code128",
      text: code,
      scale: 3,
      height: 10,
      includetext: true,
      textalign: "center",
    });
  } catch (error) {
    console.log(error);
    throw new customError(500, "Barcode Genaration failed");
  }
};
