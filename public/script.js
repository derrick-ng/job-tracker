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

  const newUrl = new URL(tabUrl);
  const domain = newUrl.hostname;

  const date = getDate();
  const status = "pending";

  //function/script to be inserted into browser from extension
  // **(add later)** add tabUrl as a parameter, querySelector will be based off tabUrl
  function modifyDOM(domain) {
    console.log("script start");

    if (domain == "www.linkedin.com") {
      const salaryParentElement = document.querySelector(".job-details-fit-level-preferences");
      const salary = salaryParentElement?.querySelector("button:first-of-type span.tvm__text--low-emphasis strong")?.innerText ?? "n/a";

      const locationParentElement = document.querySelector(".job-details-jobs-unified-top-card__primary-description-container");
      const location = locationParentElement?.querySelector("span.tvm__text--low-emphasis")?.innerText ?? "n/aaa";

      const company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.innerText ?? "n/a";
      const role = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.innerText ?? "n/a";
      
      return { salary, company, role, location };
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
    .then((results) => console.log("returned from browser tab", results[0].result));
});
