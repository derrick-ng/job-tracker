import { scrapeFromLinkedin } from "@/lib/scraper";
// import { scrapeFromIndeed } from "@/lib/scraper";
import { getDate } from "@/lib/getDate";
import { insertIntoGoogleSheets } from "@/lib/googlesheets";
// export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();

  const { jobUrl } = body;
  // console.log(jobUrl);

  //check domain name
  const newUrl = new URL(jobUrl);
  const domain = newUrl.hostname;

  let scrapedInfo = null;

  if (domain == "www.linkedin.com") {
    scrapedInfo = await scrapeFromLinkedin(jobUrl);
  }
  // else if (domain == "www.indeed.com") {
  //   console.log("scraping from indeed");

  //   scrapedInfo = await scrapeFromIndeed(jobUrl);
  // }

  if (!scrapedInfo?.result) {
    console.log("no scraped info result");
    return Response.json({
      scraped: false,
    });
  }

  console.log(scrapedInfo.result);

  const date = getDate();
  //create status here

  const jobInfo = scrapedInfo.result;
  const url = scrapedInfo.url;

  const status = "pending";

  try {
    insertIntoGoogleSheets({ jobInfo, date, status, url });
  } catch (error) {
    console.log("error inserting", error);
    return Response.json({
      scraped: false,
    });
  }
  return Response.json({
    scraped: true,
  });
}
