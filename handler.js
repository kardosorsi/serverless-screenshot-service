"use strict";

const puppeteer = require("puppeteer-core");
const chrome = require("@sparticuz/chromium");

module.exports.capture = async (event) => {
  const { queryStringParameters } = event;
  if (
    !queryStringParameters ||
    !queryStringParameters.url ||
    !queryStringParameters.screen
  ) {
    return { statusCode: 403 };
  }

  const { url, screen } = queryStringParameters;
  const [width, height] = screen.split(",");

  if (!width || !height) {
    return { statusCode: 403 };
  }

  const browser = await puppeteer.launch({
    executablePath: await chrome.executablePath(),
    args: chrome.args,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: Number(width), height: Number(height) });

  await page.goto(url);
  const screenshot = await page.screenshot({ encoding: "base64" });

  return {
    statusCode: 200,
    body: `<img src="data:image/png;base64,${screenshot}">`,
    headers: { "Content-Type": "text/html" },
  };
};
