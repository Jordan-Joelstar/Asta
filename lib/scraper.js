const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cheerio = require("cheerio");
const API = "https://pure-badlands-26930-091903776676.herokuapp.com/";

async function facebook(query) {
 const trimmedQuery = query.trim();
 const url = `download/facebook?url=${encodeURIComponent(trimmedQuery)}`;
 const response = await axios.get(API + url, { responseType: "json" });
 const hdUrl = response.data.data.hd;
 const videoResponse = await axios.get(hdUrl, { responseType: "arraybuffer" });
 return Buffer.from(videoResponse.data);
}

async function twitter(query) {
 const trimmedQuery = query.trim();
 const url = `download/twitter?url=${encodeURIComponent(trimmedQuery)}`;
 const response = await axios.get(API + url, { responseType: "json" });
 const media = response.data.url;
 const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
 return Buffer.from(videoResponse.data);
}

async function tiktok(query) {
 const trimmedQuery = query.trim();
 const url = `download/tiktok?url=${encodeURIComponent(trimmedQuery)}`;
 const response = await axios.get(API + url, { responseType: "json" });
 const media = response.data.url;
 const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
 return Buffer.from(videoResponse.data);
}

async function spotify(query) {
 const trimmedQuery = query.trim();
 const url = `download/spotify?url=${encodeURIComponent(trimmedQuery)}`;
 const response = await axios.get(API + url, { responseType: "json" });
 const music = response.data.data.link;
 const videoResponse = await axios.get(music, { responseType: "arraybuffer" });
 return Buffer.from(videoResponse.data);
}

async function pinterest(query) {
 const trimmedQuery = query.trim();
 const url = `download/pinterest?query=${encodeURIComponent(trimmedQuery)}`;
 const response = await axios.get(API + url, { responseType: "json" });
 const images = response.data.results;
 const randomIndex = Math.floor(Math.random() * images.length);
 const imageUrl = images[randomIndex];
 const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
 return Buffer.from(imageResponse.data);
}

async function youtube(query) {
 const trimmedQuery = query.trim();
 const url = `download/youtube?url=${encodeURIComponent(trimmedQuery)}`;
 const response = await axios.get(API + url, { responseType: "json" });
 const media = response.data.url;
 const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
 return Buffer.from(videoResponse.data);
}

async function ytmp3(query) {
 const trimmedQuery = query.trim();
 const url = `download/ytmp3?url=${encodeURIComponent(trimmedQuery)}`;
 const response = await axios.get(API + url, { responseType: "json" });
 const media = response.data.audio;
 const videoResponse = await axios.get(media, { responseType: "arraybuffer" });
 return Buffer.from(videoResponse.data);
}

function Telegraph(filePath) {
 return new Promise(async (resolve, reject) => {
  if (!fs.existsSync(filePath)) {
   return reject(new Error("File not found"));
  }

  try {
   const form = new FormData();
   form.append("file", fs.createReadStream(filePath));

   const response = await axios({
    url: "https://telegra.ph/upload",
    method: "POST",
    headers: {
     ...form.getHeaders(),
    },
    data: form,
   });

   const fileUrl = "https://telegra.ph" + response.data[0].src;
   resolve(fileUrl);
  } catch (error) {
   reject(new Error(error.message));
  }
 });
}

async function uploadToUguu(filePath) {
 return new Promise(async (resolve, reject) => {
  const form = new FormData();
  form.append("files[]", fs.createReadStream(filePath));

  try {
   const response = await axios({
    url: "https://uguu.se/upload.php",
    method: "POST",
    headers: {
     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
     ...form.getHeaders(),
    },
    data: form,
   });

   resolve(response.data.files[0]);
  } catch (error) {
   reject(error);
  }
 });
}

function WebpToMp4(filePath) {
 return new Promise((resolve, reject) => {
  const form = new FormData();
  form.append("new-image-url", "");
  form.append("new-image", fs.createReadStream(filePath));

  axios({
   method: "POST",
   url: "https://s6.ezgif.com/webp-to-mp4",
   data: form,
   headers: {
    "Content-Type": "multipart/form-data; boundary=" + form._boundary,
   },
  })
   .then(({ data: initialResponse }) => {
    const form2 = new FormData();
    const $ = cheerio.load(initialResponse);
    const fileValue = $("input[name='file']").attr("value");

    form2.append("file", fileValue);
    form2.append("convert", "Convert WebP to MP4!");

    axios({
     method: "POST",
     url: "https://ezgif.com/webp-to-mp4/" + fileValue,
     data: form2,
     headers: {
      "Content-Type": "multipart/form-data; boundary=" + form2._boundary,
     },
    })
     .then(({ data: conversionResponse }) => {
      const $ = cheerio.load(conversionResponse);
      const mp4Url = "https:" + $("div#output > p.outfile > video > source").attr("src");

      resolve({
       status: true,
       message: "Created By MRHRTZ",
       result: mp4Url,
      });
     })
     .catch(reject);
   })
   .catch(reject);
 });
}
module.exports = {
 facebook,
//  instagram,
 twitter,
 tiktok,
 spotify,
 pinterest,
 youtube,
 ytmp3,
 Telegraph,
 uploadToUguu,
 WebpToMp4,
};
