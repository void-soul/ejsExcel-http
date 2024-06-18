const http = require('http');
const https = require('https');
const URL = require('url').URL;
exports.downloadImageToBuffer = async function (url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const moduleToUse = parsedUrl.protocol === 'https:' ? https : http;

    const request = moduleToUse.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get image, status code: ${response.statusCode}`));
      }

      // 创建一个空的Buffer来累积数据块
      let chunks = [];

      response.on('data', chunk => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        } catch (error) {
          reject(error);
        }
      });

      response.on('error', error => {
        reject(error);
      });
    });

    request.on('error', error => {
      reject(error);
    });
  });
}
