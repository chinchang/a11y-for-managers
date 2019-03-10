import { random } from "./utils";

const supportedRules = {
  HEADING_WITHOUT_CONTENT: "WCAG2AA.Principle1.Guideline1_3.1_3_1.H42.2",
  INSUFFICIENT_CONTRAST: "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail",
  MISSING_LABEL_ON_FORM_CONTROL: "WCAG2AA.Principle1.Guideline1_3.1_3_1.F68"
};

function generateFeedback(issue, url) {
  switch (issue.code) {
    case supportedRules.MISSING_LABEL_ON_FORM_CONTROL: {
      return {
        message: [
          `Dear Web Developer, I cannot see and browse the web using screen reader. And websites like ${url} on which you dont label your form elements are completely unusable to people like me. #fixtheweb #a11y`,
          `Oh God! It's a disaster browsing websites where the developer simply didn't care to put a label on form controls!! Encountered one such site -> ${url} #accessibility.`,
          `People from ${url}, I am a screen-reader user and I wanted to tell you that I am not able to use your website forms because there are no labels! #a11y #sad`,
          `🤦🏿‍ Not again! ${url}. Devs, LABELS ARE NOT JUST FOR SIGHTED USERS!! There are people who need to hear them. #webisbroken`
        ][random(0, 4)]
      };
    }
    case supportedRules.INSUFFICIENT_CONTRAST: {
      return {
        message: [
          `Hello! I was browsing through your website ${url} and facing issues with reading few texts. I guess it could get a lil' better for people like me if the text color had some more contrast with the background.`,
          `It's such a difficult task to read websites these days. Eg. Missing text contrast here -> ${url} Someone please fix the web. #accessibility`,
          `Ouch, websites getting more and more inaccessible. I have a low vision and now I can't surf anymore with such low contrast texts! ${url} #a11y`,
          `If I can't read texts on your website, don't expect me to become your custom ${url}. I wonder whom are you making those designs for!! #accessibility`
        ][random(0, 4)]
      };
    }
    case supportedRules.HEADING_WITHOUT_CONTENT: {
      return {
        message: `Hi! I am a screen reader user of your website -> ${url} and it seems like the headings on your page aren't well defined. Because my screen reader isn't able to announce few heading properly. Would request checking them again. Thanks!`
      };
    }
    default:
      return issue;
  }
}
function processIssues(issues = [], url) {
  const codes = Object.values(supportedRules);
  const alreadySeenCodes = {};
  issues = issues.map(issue => {
    if (alreadySeenCodes[issue.code]) return;
    if (codes.includes(issue.code)) {
      alreadySeenCodes[issue.code] = true;
      return {
        ...issue,
        fix: issue.message,
        ...generateFeedback(issue, url),
        imageUrl: `/api/image?url=${url}&selector=${encodeURIComponent(
          issue.selector
        )}`
      };
    }
  });
  return issues.filter(issue => issue);
}
export async function generateReport(url) {
  try {
    let res = await fetch(
      `https://a11yformanagers.now.sh/api/generate?url=${url}`
    );
    res = await res.json();
    const issues = res.issues;

    if (!issues.length) {
      return [];
    }
    return processIssues(issues, url);
  } catch (e) {
    return Promise.reject();
  }
}
