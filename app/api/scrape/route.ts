import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const POSITIONSTACK_API_KEY = process.env.POSITIONSTACK_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) return NextResponse.json({ error: "City is required" }, { status: 400 });

  try {
    const url = `https://www.magicbricks.com/new-projects-${city}`;
    const response = await fetch(url);
    const data = await response.text();

    const $ = cheerio.load(data);
    const projects = await Promise.all(
      $(".mghome__prjblk__txtsec").map(async (index, element) => {
        const projectName = $(element).find(".mghome__prjblk__prjname").text().trim();
        const location = $(element).find(".mghome__prjblk__locname").text().trim();
        const price = $(element).find(".mghome__prjblk__price").text().trim();
        
        const geoResponse = await fetch(`http://api.positionstack.com/v1/forward?access_key=${POSITIONSTACK_API_KEY}&query=${encodeURIComponent(location)}`);
        const geoData = await geoResponse.json();
        console.log(geoData)
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to scrape data", details: errorMessage }, { status: 500 });
  }
}
