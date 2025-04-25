"use client";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [jobUrl, setjobUrl] = useState<string>("");

  async function handleButtonClick() {
    const response = await axios.post("/api/scraper", { jobUrl });
    console.log("client response: ", response.data.test);
  }
  return (
    <div>
      <input
        type="text"
        value={jobUrl}
        onChange={(e) => {
          setjobUrl(e.target.value);
        }}
      />
      <button onClick={handleButtonClick}>search</button>
    </div>
  );
}
