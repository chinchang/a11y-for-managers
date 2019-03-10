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
          fix:
            "The html element should have a lang or xml:lang attribute which describes the language of the document.",
          message:
            "Oh man! This site is unusable! -> https://example.com #a11y",
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
    isReportLoading: window.DEBUG ? false : undefined,
    reportError: null,
    issueFix: "",
    isFixVisible: false
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
    // console.log(this.state.url);
    e.preventDefault();
    this.setState({
      isReportLoading: true,
      reportError: null
    });
    generateReport(this.state.url)
      .then(async issues => {
        const users = await this.fetchUsers(issues.length);
        this.setState({
          isReportLoading: false,
          issues,
          users
        });
      })
      .catch(e => {
        this.setState({
          reportError: true,
          isReportLoading: false,
          issues: []
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

  cardClickHandler = fix => {
    this.setState({
      isFixVisible: true,
      issueFix: fix
    });
  };

  keyUpHandler = e => {
    if (e.key === "Escape") {
      this.setState({ isFixVisible: false });
    }
  };
  modalUnderlayClickHandler = e => {
    if (e.target.classList.contains("modal")) {
      this.setState({ isFixVisible: false });
    }
  };

  render(
    props,
    {
      url,
      reportError,
      isReportLoading,
      issues = [],
      users = [],
      issueFix,
      isFixVisible
    }
  ) {
    issues = window.DEBUG ? json.issues : issues;
    return (
      <div id="app" onKeyUp={this.keyUpHandler}>
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
          This tool helps translate the failing Accessibility rules on a website
          into actual understandable problems that real users might be facing by
          generating dummy feedback from dummy users.
        </p>
        <p class="hide-in-print">
          You can always go a step further and show the report to your manager
          and give them what they want. 😀🤟🏼
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
        {reportError ? <p>Oops! I couldn't analyze the page on {url}</p> : null}

        {isReportLoading === true ? (
          <p>
            <span class="loader" aria-hidden="true">
              ⚙️
            </span>{" "}
            Sit tight. I am analysing the page, generating fake responses from
            fake users...
          </p>
        ) : null}
        {isReportLoading === false && !reportError && !issues.length ? (
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
            <p class="info hide-in-print">
              Click on the cards to see how to fix them.
            </p>

            <div class="card-container">
              {issues.map((issue, i) => (
                <Card
                  issue={issue}
                  user={users[i]}
                  onClick={this.cardClickHandler}
                />
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
        <div
          class={`modal ${isFixVisible ? "is-visible" : ""}`}
          onClick={this.modalUnderlayClickHandler}
        >
          <div class="modal__content">
            <h3>Solution</h3>
            <p>{issueFix}</p>
            <button
              type="button"
              onClick={() => this.setState({ isFixVisible: false })}
            >
              Close (or press 'Esc')
            </button>
          </div>
        </div>
      </div>
    );
  }
}
