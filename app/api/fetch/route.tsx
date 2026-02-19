import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { resolve } from "path";
const chromium = require("@sparticuz/chromium");
const exePath =
  process.platform === "win32"
    ? "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

const getOptions = async () => {
  let options
  if (process.env.NODE_ENV === "production") {
    options = {
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    }
  } else {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    }
  }
  return options
}

export async function POST(req: Request) {
  try {
    console.log("testing")
    const responseBody = await req.json();
    console.log(responseBody);
    const url = responseBody.url;
    //const { url } = await req.json();
    console.log("url")
    // Fetch the raw HTML from the target site
    const options = await getOptions();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.resourceType() === "document") {
        request.continue();
      } else {
        request.abort();
        return NextResponse.json(
          { error: "Unable to scrape" },
          { status: 400 }
        );
      }
    })

    await page.goto(url, { timeout: 0 }).then(async (response) => {});
    const html = await page.evaluate(() => {
      if (!document.querySelector("main")) {
        console.log("no main")
        return NextResponse.json(
          { error: "Cannot scrape this website, please try another input method" },
          { status: 400 }
        );
        
      }
      else {
        console.log("main")
        const cleanedHtml = document.querySelector("main")!.innerHTML.replace(/\s+/g, ' ').trim();
        return NextResponse.json({
          url,
          status: 200,
          content: cleanedHtml,
        });
      };
    })
    
    // const res = await fetch(url, {
    //   method: "GET",
    //   headers: {
    //     "User-Agent": "Mozilla/5.0 (compatible; NextJS-FetchBot/1.0)",
    //   },
    // });

    // const text = await res.text();
    // const $ = cheerio.load(text);
    // let result = ""
    // $("body").each((i, elem) => {
    //   result = $(elem).text()
    // })
    
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}