"use client";
import axios from "axios";
import { FormEvent, useState } from "react";

export default function Home() {
  const [jobUrl, setjobUrl] = useState<string>("");

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await axios.post("/api/scraper", { jobUrl });
    console.log("client response: ", response.data.scraped);
  }

  return (
    <div>
      <h1>Job Tracker</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={jobUrl}
          onChange={(e) => {
            setjobUrl(e.target.value);
          }}
        />
        <button>Save to Sheets</button>
      </form>
    </div>
  );
}
