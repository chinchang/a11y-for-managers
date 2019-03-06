const supportedRules = {
  HEADING_WITHOUT_CONTENT: "WCAG2AA.Principle1.Guideline1_3.1_3_1.H42.2",
  INSUFFICIENT_CONTRAST: "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail"
};

function generateFeedback(issue, url) {
  switch (issue.code) {
    case supportedRules.INSUFFICIENT_CONTRAST: {
      return {
        message: `Hello! I was browsing through your website ${url} and facing issues with reading few texts. I guess it could get a lil' better for people like me if the text color had some more contrast with the background. Happy to reply if any further questions.`
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
  issues = issues.map(issue => {
    if (codes.includes(issue.code)) {
      return generateFeedback(issue, url);
    }
  });
  return issues.filter(issue => issue);
}
export async function generateReport(url) {
  let res = await fetch(
    `https://a11yreport-6ml461tit.now.sh/api/generate?url=${url}`
  );
  res = await res.json();
  const issues = res.issues;

  if (!issues.length) {
    return [];
  }
  return processIssues(issues, url);
}
