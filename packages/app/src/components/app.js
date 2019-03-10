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
    reportError: null
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

    // scroll to show loader
    setTimeout(() => {
      window.scrollTo(0, 9999);
    }, 200);
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
      issueFix = {},
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
              <svg style="width:1em;height:1em;" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
                />
              </svg>
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
            <p>
              <label>
                <input
                  type="checkbox"
                  onChange={this.screenshotSwitchChangeHandler}
                />{" "}
                Prepare report for screenshot
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
            <p>{issueFix.fix}</p>
            <p>
              <a
                target="_blank"
                rel="external noopener"
                href={issueFix.readLink}
              >
                Read more about this.
              </a>
              <svg style="width:0.9em;height:0.9em" viewBox="0 0 24 24">
                <path
                  fill="#666"
                  d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
                />
              </svg>
            </p>
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
