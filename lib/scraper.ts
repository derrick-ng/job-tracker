import puppeteer from "puppeteer";

export async function initPuppeteer() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";
  await page.setUserAgent(customUserAgent);

  return { browser, page };
}

export async function scrapeFromLinkedin(jobUrl: string) {
  const jobUrlWithoutProtocol = jobUrl.split("https://")[1];
  const url = jobUrlWithoutProtocol.split("/?")[0];
  console.log(url);

  const { browser, page } = await initPuppeteer();

  await page.goto(jobUrl);

  const result = await page.evaluate(() => {
    const role = (document.querySelector(".top-card-layout__title") as HTMLElement)?.innerText;
    const salary = (document.querySelector(".salary") as HTMLElement)?.innerText;

    const topCard = document.querySelector(".topcard__flavor-row");
    if (!topCard) return null;

    const company = (topCard.querySelector("a.topcard__org-name-link") as HTMLElement)?.innerText.trim();
    const location = (topCard.querySelector("span.topcard__flavor--bullet") as HTMLElement)?.innerText.trim();

    return { role, company, location, salary };
  });

  await browser.close();
  return { result, url };
}

// export async function scrapeFromIndeed(jobUrl: string) {
//   //gets rid of all the random info in the middle of the url
//   const jobUrlWithoutProtocol = jobUrl.split("https://")[1];
//   const jobWithAdvertiseNumber = jobUrlWithoutProtocol.split("vjk=")[1];
//   const jobUniqueNumberIdentifier = jobWithAdvertiseNumber.split("&advn")[0];

//   const url = `www.indeed.com/viewjob?jk=${jobUniqueNumberIdentifier}`;

//   const { browser, page } = await initPuppeteer();

//   await page.goto(jobUrl);

//   //i am stuck on needing to pass the
//   const result = page.evaluate(() => {});

//   await browser.close();
//   return { result, url };
// }
