const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

// Set up Credentials
const CLIENT_ID =
  "945311753846-1en0caiqqbvnce2c8p0oms3fudpln274.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04LyuUJveX153CgYIARAAGAQSNwF-L9IrtSaeCxArftGscVQ-6ncDfxNdS98WHcgTRPuDTH1_ZxAVVxPQcueSszkW1nn1EDk8xXE";

// Perform Authentication
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

// Access drive with oauth2Client
const drive = google.drive({ version: "v3", auth: oauth2Client });

/*
Function to Upload an image from disk to Client's Google Drive
*/
async function uploadFile(filePath) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "minionb.jpg",
        mimeType: "image/jpg",
      },
      media: {
        mimeType: "image/jpg",
        body: fs.createReadStream("minion.jpg"),
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}
// uploadFile();

/*
Function to List all the files on Client's Google Drive
*/
async function listFiles() {
  try {
    const response = await drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    });
  } catch (error) {
    console.log(error.message);
  }
}
// listFiles();

/*
Function to Get Desired File on Client's Google Drive and 
Storing it in a Temporary Location
*/
async function getFile(fileId) {
    return drive.files
      .get({fileId, mimeType:'image/jpeg',alt: 'media'}, {responseType: 'stream'})
      .then(res => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(__dirname, './tmp/', fileId+ '.jpg');
          console.log(`writing to ${filePath}`);
          const dest = fs.createWriteStream(filePath);
          let progress = 0;
  
          res.data
            .on('end', () => {
              console.log('Done downloading file.');
              resolve(filePath);
            })
            .on('error', err => {
              console.error('Error downloading file.');
              reject(err);
            })
            .on('data', d => {
              progress += d.length;
              if (process.stdout.isTTY) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`Downloaded ${progress} bytes`);
              }
            })
            .pipe(dest);
        });
      });
  }

getFile('1pq5JFMCdHah-l8eMd0xtwxjF2NAZJ0jA');
getFile('18LSNx6BRBcyolvbs35_fyyYBHmb3g8fS');
getFile('18JGYg6Op6YjPVIKcqUAfRuCt3fCJw85H');

/*
Function to Convert Array Buffer to Base64 String
*/
// function base64ArrayBuffer(arrayBuffer) {
//     var base64 = "";
//     var encodings =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

//     var bytes = new Uint8Array(arrayBuffer);
//     var byteLength = bytes.byteLength;
//     var byteRemainder = byteLength % 3;
//     var mainLength = byteLength - byteRemainder;

//     var a, b, c, d;
//     var chunk;

//     // Main loop deals with bytes in chunks of 3
//     for (var i = 0; i < mainLength; i = i + 3) {
//       // Combine the three bytes into a single integer
//       chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

//       // Use bitmasks to extract 6-bit segments from the triplet
//       a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
//       b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
//       c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
//       d = chunk & 63; // 63       = 2^6 - 1

//       // Convert the raw binary segments to the appropriate ASCII encoding
//       base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
//     }

//     // Deal with the remaining bytes and padding
//     if (byteRemainder == 1) {
//       chunk = bytes[mainLength];

//       a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

//       // Set the 4 least significant bits to zero
//       b = (chunk & 3) << 4; // 3   = 2^2 - 1

//       base64 += encodings[a] + encodings[b] + "==";
//     } else if (byteRemainder == 2) {
//       chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

//       a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
//       b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
//       // Set the 2 least significant bits to zero
//       c = (chunk & 15) << 2; // 15    = 2^4 - 1
//       base64 += encodings[a] + encodings[b] + encodings[c] + "=";
//     }

//     return base64;
//   }
// function convertURIToImageData(URI) {
//     return new Promise(function(resolve, reject) {
//       if (URI == null) return reject();
//       var canvas = document.createElement('canvas'),
//           context = canvas.getContext('2d'),
//           image = new Image();
//       image.addEventListener('load', function() {
//         canvas.width = image.width;
//         canvas.height = image.height;
//         context.drawImage(image, 0, 0, canvas.width, canvas.height);
//         resolve(context.getImageData(0, 0, canvas.width, canvas.height));
//       }, false);
//       image.src = URI;
//     });
//   }

/*
Function to Perform Direct Request 
and Show the Response using DOM,
however this will not work with NODE backend.
*/
// xhr
// var xhr = new XMLHttpRequest();
//     xhr.open(
//       "GET",
//       "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media",
//       true
//     );
//     xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
//     xhr.responseType = "arraybuffer";

//     xhr.onload = function () {
//       //base64ArrayBuffer from https://gist.github.com/jonleighton/958841
//       var base64 = "data:image/jpg;base64," + base64ArrayBuffer(xhr.response);
//         return base64;
//     //   console.log(base64);
//     //   document.getElementById("image").innerHTML = '<img src="' + base64 + '">';
//     };
//     xhr.send();