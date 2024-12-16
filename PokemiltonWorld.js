//PokemiltonWorld.js

const locale = require("./locales/fr.json");
const PokemiltonArena = require("./PokemiltonArena");
const Pokemilton = require("./Pokemilton");
const PokemiltonMaster = require("./PokemiltonMaster");
const {saveGameState} = require('./Shared');

class PokemiltonWorld {
  constructor() {
    this.day = 1; //Jour initial
    this.logs = []; //Stockage des événements
  }

  oneDayPasses(menuDay, askQuestion, pokemiltonMaster) {
    this.day++;
    console.clear();
    console.log(`\nJournée ${this.day}`);
    saveGameState(pokemiltonMaster, this)
    this.randomizeEvent(menuDay, askQuestion, pokemiltonMaster);
  }

  async randomizeEvent(menuDay, askQuestion, pokemiltonMaster) {
    let num = Math.floor(Math.random() * 2);
    if (num === 0) {
      const pokemiltonArena = new PokemiltonArena();
      await pokemiltonArena.startBattle(menuDay, askQuestion, pokemiltonMaster);
    } else {
      const msg = "Rien ne s'est passé pendant cette journée...";
      console.log("\n" + msg);
      this.addLog(msg);
      this.oneDayPasses(menuDay, askQuestion, pokemiltonMaster);
      //await menuDay(); //on affiche le menu
    }
  }

  addLog(newLog) {
    this.logs.push(locale.dayWord + " " + this.day + " - " + newLog);
  }
}

module.exports = PokemiltonWorld;
