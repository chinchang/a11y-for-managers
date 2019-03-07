import { getScreenshot } from "./screenshot";

const url = require("url");

export default async (req, res) => {
  var queryData = url.parse(req.url, true).query;
  const targetUrl = queryData.url;
  const selector = decodeURIComponent(queryData.selector);
  console.log(targetUrl, selector);

  const result = await getScreenshot(targetUrl, selector);
  res.statusCode = 200;
  res.setHeader("Content-Type", `image/png`);

  res.end(result);
};
