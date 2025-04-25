import puppeteer from "puppeteer";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();

  const { jobUrl } = body;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(jobUrl);

  const result = await page.evaluate(() => {
    const jobTitle = (document.querySelector(".top-card-layout__title") as HTMLElement)?.innerText;
    const jobSalary = (document.querySelector(".salary") as HTMLElement)?.innerText;

    const topCard = document.querySelector(".topcard__flavor-row");
    if (!topCard) return null;

    const companyName = (topCard.querySelector("a.topcard__org-name-link") as HTMLElement)?.innerText.trim();
    const jobLocation = (topCard.querySelector("span.topcard__flavor--bullet") as HTMLElement)?.innerText.trim();

    return { jobTitle, companyName, jobLocation, jobSalary };
  });
  console.log(result);

  await browser.close();

  return Response.json({
    test: true,
  });
}
