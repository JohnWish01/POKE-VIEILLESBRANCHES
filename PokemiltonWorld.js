const PokemiltonArena = require("./PokemiltonArena");
const Pokemilton = require("./Pokemilton");
const Game = require("./Game");

let pokemiltonArena;
let msg = "";

class PokemiltonWorld {
  constructor() {
    this.day = 1;
    this.logs = [];
  }

  oneDayPasses() {
    this.day++;
    //this.randomizeEvent()
  }

  randomizeEvent() {
    let num = Math.floor(Math.random(1) + 1);
    if (num === 0) {
      pokemiltonArena = new PokemiltonArena();
      pokemiltonArena.startBattle();
    } else {
      msg = 'Nothing happened for this day."';
      console.log(msg);
      this.addLog(msg);
      this.oneDayPasses(); //on passe à une nouvelle journée
      Game.menuDay(); //on affiche le menu
    }
  }

  addLog(newLog) {
    this.logs.push(newLog);
  }
}

module.exports = PokemiltonWorld;
