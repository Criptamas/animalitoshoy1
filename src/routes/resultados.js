const express = require("express");
const router = express.Router();
const { getResults } = require("../scraper/animalitos");

function buildFrontendData(rows) {
  const map = {};

  const CONFIG = {
    "Guacharo Activo": { id: "guacharo", emoji: "🦜", color: "#2F8F5B" },
    "Lotto Activo": { id: "lotto", emoji: "🎯", color: "#D4AF37" },
    "La Granjita": { id: "granjita", emoji: "🐄", color: "#8B5A2B" },
  };

  for (const item of rows) {
    if (!map[item.lottery]) {
      map[item.lottery] = {
        id:
          CONFIG[item.lottery]?.id ||
          item.lottery.toLowerCase().replace(/\s+/g, "-"),
        nombre: item.lottery,
        emoji: CONFIG[item.lottery]?.emoji || "🎲",
        color: CONFIG[item.lottery]?.color || "#3B82F6",
        resultados: [],
      };
    }

    map[item.lottery].resultados.push({
      hora: item.hour,
      fecha: new Date().toLocaleDateString("es-VE"),
      nombre: item.animal,
      imagen: item.image,
    });
  }

  return Object.values(map);
}

router.get("/", async (req, res) => {
  try {
    const rows = await getResults();
    res.json(buildFrontendData(rows));
  } catch (error) {
    console.log(error.response?.data);
    console.log(error.response?.status);
    console.log(error.message);

    res.status(500).json({
      error: error.message,
      status: error.response?.status,
    });
  }
});

module.exports = router;
