const url = require("url");
const pa11y = require("pa11y");
const chrome = require("chrome-aws-lambda");

async function getResults(url) {
  return pa11y(url, {
    chromeLaunchConfig: {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      ignoreHTTPSErrors: false
    }
  });
}

export default async (req, res) => {
  var queryData = url.parse(req.url, true).query;
  const targetUrl = queryData.url;
  console.log(targetUrl, await chrome.executablePath, chrome.headless);

  const result = await getResults(targetUrl);
  console.log(result);
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/json`);
  res.setHeader("Access-Control-Allow-Origin", `*`);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  res.end(JSON.stringify(result));
};
