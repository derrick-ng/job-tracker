import { scrapeFromLinkedin } from "./scraper";

async function getCurrentTabUrl() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const currentTabUrl = tab.url;
  console.log(currentTabUrl);

  return tab.url;
}

async function main() {
  const currentTabUrl = await getCurrentTabUrl();

  const newUrl = URL(currentTabUrl);
  const domain = newUrl.hostname;

  if (domain == "www.linkedin.com") {
    const scrapedInfo = await scrapeFromLinkedin(currentTabUrl);
    console.log(scrapedInfo.result, scrapedInfo.url);
  }
}

main();
