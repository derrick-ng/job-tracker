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

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/spreadsheets"],
});

export async function insertIntoGoogleSheets({ jobInfo, date, status, url }: GoogleSheetsProp) {
  const { company, role, location } = jobInfo;
  const salary = jobInfo.salary || "not provided";

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

  // await updateStatusWithDropdown();
}

async function updateStatusWithDropdown() {
  const sheets = google.sheets({
    auth,
    version: "v4",
  });

  const sheetId = 0;
  const ruleRequest = {
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    resource: {
      requests: [
        {
          setDataValidation: {
            range: {
              sheetId,
              startRowIndex: 1,
              endRowIndex: 1000,
              startColumnIndex: 5,
              endColumnIndex: 6,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: [
                  { userEnteredValue: "pending" },
                  { userEnteredValue: "oa" },
                  { userEnteredValue: "interview" },
                  { userEnteredValue: "accepted" },
                  { userEnteredValue: "rejected" },
                ],
              },
            },
          },
        },
      ],
    },
  };

  await sheets.spreadsheets.batchUpdate(ruleRequest);
}
