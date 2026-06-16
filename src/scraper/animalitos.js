const axios = require("axios");
const cheerio = require("cheerio");

const URL = "https://loteriadehoy.com/animalitos/resultados/";

async function getResults() {
  const response = await axios.get(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "es-ES,es;q=0.9",
    },
    timeout: 15000,
  });

  const $ = cheerio.load(data);

  const results = [];
  let currentLottery = null;

  $("h3, h4, h5").each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const text = $(el).text().trim();

    if (tag === "h3") {
      currentLottery = text;
      return;
    }

    if (tag === "h4" && currentLottery && /^\d+/.test(text)) {
      const match = text.match(/^(\d+)\s+(.+)$/);

      const number = match?.[1] || "";
      const animal = match?.[2] || "";

      const hour = $(el).next("h5").text().trim();

      const container = $(el).closest(".circle-legend");

      const imageSrc = container.prev(".circle").find("img").attr("src");

      const image = imageSrc ? `https://loteriadehoy.com${imageSrc}` : null;
      console.log({
        animal,
        image,
      });

      results.push({
        lottery: currentLottery,
        animal,
        number,
        hour,
        image,
      });
    }
  });

  return results;
}

module.exports = {
  getResults,
};
