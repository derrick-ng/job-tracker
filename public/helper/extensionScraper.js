export async function scrapeFromLinkedin() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { type: "SCRAPE_LINKEDIN" }, resolve);
  });
}
