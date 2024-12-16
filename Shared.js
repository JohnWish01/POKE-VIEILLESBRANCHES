//Shared.js

const locale = require("./locales/fr.json");
const fs = require("fs"); // Pour gérer le système de fichiers

// Fonction pour sauvegarder l'état du jeu dans un fichier JSON
function saveGameState(pokemiltonMaster, world) {
  try {
    const saveData = {
      saved_on: new Date().toISOString(),
      PokemiltonMaster: {
        name: pokemiltonMaster.name,
        pokemiltonCollection: pokemiltonMaster.pokemiltonCollection,
        healingItems: pokemiltonMaster.healingItems,
        reviveItems: pokemiltonMaster.reviveItems,
        POKEBALLS: pokemiltonMaster.POKEBALLS,
      },
      day: world.day,
      logs: world.logs,
    };
    fs.writeFileSync("save.json", JSON.stringify(saveData, null, 2));
    console.log("\n", locale.saveOk);
  } catch (error) {
    console.error("\n", locale.saveKo, error);
  }
}

module.exports = { saveGameState };
