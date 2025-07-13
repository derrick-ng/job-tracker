import { scrapeFromLinkedin } from "./helper/extensionScraper.js";
import { getDate } from "./helper/getDate.js";

//grab current tab unique id and url
async function getCurrentTabInfo() {
  console.log("getting most recently used tab");
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  const tabId = tab.id;
  const tabUrl = tab.url;
  return { tabId, tabUrl };
}

document.getElementById("scrape-button").addEventListener("click", async () => {
  console.log("inside extension console");

  const { tabId, tabUrl } = await getCurrentTabInfo();

  // used to check domain name (linkedin, indeed, etc)
  const domain = new URL(tabUrl).hostname;

  // clean url of the job posting, appending to spreadsheet
  const jobUrlWithoutProtocol = tabUrl.split("https://")[1];
  const url = jobUrlWithoutProtocol.split("/?")[0];
  const date = getDate();
  const status = "pending";

  //function/script to be inserted into browser from extension
  // **(add later)** add tabUrl as a parameter, querySelector will be based off tabUrl
  function modifyDOM(domain) {
    console.log("script start");

    if (domain == "www.linkedin.com") {
      const salaryParentElement = document.querySelector(".job-details-fit-level-preferences");
      let salary = salaryParentElement?.querySelector("button:first-of-type span.tvm__text--low-emphasis strong")?.innerText;
      if (!salary || !salary.startsWith("$")) {
        salary = "not provided";
      }

      const locationParentElement = document.querySelector(".job-details-jobs-unified-top-card__primary-description-container");
      const location = locationParentElement?.querySelector("span.tvm__text--low-emphasis")?.innerText ?? "n/aaa";

      const company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.innerText ?? "n/a";
      const role = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.innerText ?? "n/a";

      return { company, role, location, salary };
    }
  }

  //go into the browser's current tab to execute javascript
  chrome.scripting
    .executeScript({
      target: { tabId },
      func: modifyDOM,
      args: [domain],
    })
    //return back to extension
    .then((results) => {
      console.log("returned from browser tab", results[0].result);
      const { company, role, location, salary } = results[0].result;

      const googleScriptsApp = "https://script.google.com/macros/s/AKfycbzA39q9czhtMgZZUmnnHd2rICBT81-vNtG--sOWiTynRtKFbqIh0n15GdeX2X_C9NN_qw/exec";
      const data = new URLSearchParams({ date, company, role, location, salary, status, url });

      // can not add header "Content-Type": "application/json" because of cors error
      fetch(googleScriptsApp, {
        method: "POST",
        body: data,
      });
    });
});
