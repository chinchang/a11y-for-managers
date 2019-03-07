import { h, Component } from "preact";
import { generateReport } from "../generateReport.js";
import { Card } from "./card";

window.DEBUG = false;

const json = window.DEBUG
  ? {
      documentTitle: "Example Domain",
      pageUrl: "https://example.com/",
      issues: [
        {
          code: "WCAG2AA.Principle3.Guideline3_1.3_1_1.H57.2",
          context: "<html><head>\n    <title>Example Domai...</html>",
          message:
            "The html element should have a lang or xml:lang attribute which describes the language of the document.",
          type: "error",
          typeCode: 1,
          selector: "html"
        }
      ]
    }
  : undefined;
export default class App extends Component {
  state = {
    url: (function() {
      const match = location.search.match(/url\=([^&]*)/);
      return match ? match[1] : "";
    })(),
    isReportLoading: window.DEBUG ? false : undefined
  };
  fetchUsers = count => {
    return fetch(`https://randomuser.me/api/?results=${count}`)
      .then(res => res.json())
      .then(res => res.results);
  };

  inputChangeHandler = e => {
    this.setState({
      url: e.target.value
    });
  };
  submitHandler = e => {
    console.log(this.state.url);
    e.preventDefault();
    this.setState({
      isReportLoading: true
    });
    generateReport(this.state.url).then(async issues => {
      const users = await this.fetchUsers(issues.length);
      this.setState({
        isReportLoading: false,
        issues,
        users
      });
    });
  };
  screenshotSwitchChangeHandler = e => {
    if (e.target.checked) {
      document.body.classList.add("print-mode");
    } else {
      document.body.classList.remove("print-mode");
    }
  };

  render(props, { url, isReportLoading, issues = [], users = [] }) {
    issues = window.DEBUG ? json.issues : issues;
    return (
      <div id="app">
        <h1 class="main-title hide-in-print">
          Accessibility Report for Managers
        </h1>
        <p class="hide-in-print">
          Are you trying to incorporate Accessibility in your organization?
          <br />
          Do you mostly get sided-away with responses like "Do our customers
          really need it?" or "No one is asking for it. We have more important
          things to do right now."?
        </p>
        <p class="hide-in-print">
          Well, now you can use this tool to generate fake customer feedback
          report of real Accessibility issues on your website. Show that report
          to your organization manager and give them what they want. 😀🤟🏼
        </p>
        <p class="hide-in-print">
          And it's not just humour. The generated feedback report also helps
          translate the failing rules into actual understandable problems that
          real users might be facing.
        </p>
        <p class="hide-in-print">
          <form onSubmit={this.submitHandler}>
            <div class="url-form-wrap">
              <label class="">
                <span class="fxs-0">Enter a URL:</span>{" "}
                <input
                  value={url}
                  onInput={this.inputChangeHandler}
                  class="fx-1"
                />{" "}
              </label>
              <button class="btn">Generate Report</button>
            </div>
          </form>
        </p>
        {isReportLoading !== undefined ? <hr /> : null}

        {isReportLoading === true ? (
          <p>
            <span class="loader" aria-hidden="true">
              ⚙️
            </span>{" "}
            Sit tight. I am analysing the page, generating fake responses from
            fake users...
          </p>
        ) : null}
        {isReportLoading === false && !issues.length ? (
          <p>
            No Accessibility issue found that is supported by this tool. I am
            adding more support meanwhile.
          </p>
        ) : null}
        {isReportLoading === false && issues.length ? (
          <section>
            <h2>
              Accessibility feedback for{" "}
              <a href={url} rel="external noopener">
                {url}
              </a>
            </h2>
            <em>Show this to your manager :)</em>
            <p class="hide-in-print">
              <label>
                <input
                  type="checkbox"
                  onChange={this.screenshotSwitchChangeHandler}
                />{" "}
                Prepare report for screenshot (Come back by pressing Space key)
              </label>
            </p>
            <p class="disclaimer hide-in-print">
              <strong>Disclaimer</strong>: Following tweets and it's users are
              fake. But the <u>Accessibility issues are real</u>, as found on
              the page. Any resemblance to any real user is mere coincidence.
            </p>

            <div class="card-container">
              {issues.map((issue, i) => (
                <Card issue={issue} user={users[i]} />
              ))}
            </div>
          </section>
        ) : null}
        <footer class="footer hide-in-print">
          Made by{" "}
          <a href="https://twitter.com/chinchang457" rel="external noopener">
            Kushagra Gour
          </a>{" "}
          with hands <span aria-hidden="true">🙌🏼</span> as a 24 hour product.
          <p>
            <a
              href="https://github.com/chinchang/a11y-for-managers"
              rel="external noopener"
            >
              Contribute
            </a>
            <span class="separator-h" aria-hidden="true">
              •
            </span>
            Build with{" "}
            <a href="https://preactjs.com" rel="external noopener">
              Preact
            </a>{" "}
            &{" "}
            <a href="http://pa11y.org/" rel="external noopener">
              pa11y
            </a>
            <span class="separator-h" aria-hidden="true">
              •
            </span>
            Hosted on{" "}
            <a href="https://zeit.co/now" rel="external noopener">
              Zeit Now
            </a>
          </p>
        </footer>
      </div>
    );
  }
}
