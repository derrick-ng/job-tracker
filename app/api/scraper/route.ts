import { scrapeFromLinkedin } from "@/lib/scraper";
import { scrapeFromIndeed } from "@/lib/scraper";
import { getDate } from "@/lib/getDate";
// export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();

  const { jobUrl } = body;
  // console.log(jobUrl);

  //check domain name
  const newUrl = new URL(jobUrl);
  const domain = newUrl.hostname;

  const date = getDate();

  if (domain == "www.linkedin.com") {
    const scrapedInfo = await scrapeFromLinkedin(jobUrl);
    console.log(scrapedInfo.result, scrapedInfo.url);
  } else if (domain == "www.indeed.com") {
    console.log("scraping from indeed");

    const scrapedInfo = await scrapeFromIndeed(jobUrl);
    console.log(scrapedInfo.url);
  }
  return Response.json({
    scraped: true,
  });
}
