import { scrapeFromLinkedin } from "./helper/extensionScraper.js";
import { getDate } from "./helper/getDate.js";

async function getCurrentTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  console.log("tab:", tab);
  const currentTabUrl = tab.url;
  console.log(currentTabUrl);

  // return tab.url;
  return currentTabUrl;
}

document.getElementById("scrape-button").addEventListener("click", async () => {
  console.log("inside extension console");

  function modifyDOM() {
    console.log("new tab script: ");
    const salaryParentElement = document.querySelector(".job-details-fit-level-preferences");
    const salary = salaryParentElement?.querySelector("button:first-of-type span.tvm__text--low-emphasis strong")?.innerText ?? "n/a";

    const locationParentElement = document.querySelector(".job-details-jobs-unified-top-card__primary-description-container");
    const location = locationParentElement?.querySelector("span.tvm__text--low-emphasis")?.innerText ?? "n/aaa";

    const company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.innerText ?? "n/a";
    const role = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.innerText ?? "n/a";
    return { salary, company, role, location };
  }

  //grab the current tab (id)
  async function getCurrentTabId() {
    console.log("getting tab");
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log("tab id: ", tab.id);
    return tab.id;
  }

  chrome.scripting
    //go into the browser's current tab to execute javascript
    .executeScript({
      target: { tabId: await getCurrentTabId() },
      func: modifyDOM,
    })
    //return back to extension
    .then((results) => console.log("returned from browser tab", results[0].result));
});

async function main() {
  const currentTabUrl = await getCurrentTabUrl();

  const newUrl = new URL(currentTabUrl);
  const domain = newUrl.hostname;

  const date = getDate();
  console.log("date", date);

  if (domain == "www.linkedin.com") {
    console.log("scraping");
    const scrapedInfo = await scrapeFromLinkedin();
    // console.log(scrapedInfo.result, scrapedInfo.url);
  }
}

// main();
