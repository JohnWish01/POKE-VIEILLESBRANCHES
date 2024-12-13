const PokemiltonArena = require("./PokemiltonArena");
const Pokemilton = require("./Pokemilton");
const Game = require("./Game");

let pokemiltonArena;
let msg = "";

class PokemiltonWorld {
  constructor() {
    this.day = 1;
    //this.saved_on = null;
    this.logs = [];
  }

  oneDayPasses(menuDay) {
    //this.day++;
    this.randomizeEvent(menuDay);
  }

  async randomizeEvent(menuDay) {
    let num = Math.floor(Math.random()) * 2;
    if (num === 0) {
      pokemiltonArena = new PokemiltonArena();
      await pokemiltonArena.startBattle(menuDay);
    } else {
      msg = '\nNothing happened for this day."';
      console.log(msg);
      this.addLog(msg);
      //this.oneDayPasses(); //on passe à une nouvelle journée
      await menuDay(); //on affiche le menu
    }
  }

  addLog(newLog) {
    this.logs.push(newLog);
  }
}

module.exports = PokemiltonWorld;
