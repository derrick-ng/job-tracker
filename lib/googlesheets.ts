import { google } from "googleapis";

interface ScrapedInfo {
  company: string;
  role: string;
  location: string;
  salary: string;
}
interface GoogleSheetsProp {
  jobInfo: ScrapedInfo;
  date: string;
  status: string;
  url: string;
}

export async function insertIntoGoogleSheets({ jobInfo, date, status, url }: GoogleSheetsProp) {
  const { company, role, location } = jobInfo;
  const salary = jobInfo.salary || "not provided";

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({
    auth,
    version: "v4",
  });
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "A1:G1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[date, company, role, location, salary, status, url]],
    },
  });
}
