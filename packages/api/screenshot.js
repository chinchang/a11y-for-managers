import chrome from "chrome-aws-lambda";
const puppeteer = require('puppeteer-core');

const padding = 10;

export async function getScreenshot(url, selector) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const page = await browser.newPage();
  await page.goto(url);

  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const { x, y, width, height } = element.getBoundingClientRect();
    return { left: x, top: y, width, height };
  }, selector);

  const file = await page.screenshot({
    type: "png",
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    }
  });

  await browser.close();
  return file;
}
