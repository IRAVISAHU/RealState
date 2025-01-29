import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import UserAgent from "user-agents";

const POSITIONSTACK_API_KEY = process.env.POSITIONSTACK_API_KEY;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    const url = `https://www.magicbricks.com/new-projects-${city}`;
    const randomUserAgent = new UserAgent().toString();

    const response = await fetch(url, {
      headers: { "User-Agent": randomUserAgent },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    const $ = cheerio.load(data);

    const projects = await Promise.all(
      $(".mghome__prjblk__txtsec").map(async (_, element) => {
        const projectName = $(element).find(".mghome__prjblk__prjname").text().trim();
        const location = $(element).find(".mghome__prjblk__locname").text().trim();
        const price = $(element).find(".mghome__prjblk__price").text().trim();

        const geoResponse = await fetch(
          `http://api.positionstack.com/v1/forward?access_key=${POSITIONSTACK_API_KEY}&query=${encodeURIComponent(location)}`
        );
        const geoData = await geoResponse.json();
        const { latitude, longitude } = geoData.data?.[0] || {};

        return {
          projectName,
          location,
          price,
          latitude: latitude || 0,
          longitude: longitude || 0,
        };
      }).get()
    );

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
