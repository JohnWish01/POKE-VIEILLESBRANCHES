
const PokemiltonWorld = require('./PokemiltonWorld')


let battleInProgress = 0

class PokemiltonArena {
  constructor(pokemilton_1, pokemilton_2) {

  }

  startBattle() {
    rl.question("A wild Pokemilton™ appears!:\nWhat do you want to do ? :\n1. Fight\n2. Run", (choice) => {
      switch (choice) {
        case '1':
          battleInProgress = 1
          
          break
        case '2':
          console.log("Vous avez évincé le combat...")
          newWorld.
          break
      }
      console.log(`Hello Master ${pokemiltonMaster.name}, your adventure begins!\n`)
      proposeFirstPokemilton(rl)
    })
  }

  choosePokemilton() {

  }

  startRound(selectedPokemilton) {

  }

  playerAction(selectedPokemilton) {

  }

  attack(selectedPokemilton) {

  }

  tryToCatch() {


  }

  calculateDamage(attackRange, defenseRange) {

  }

  wildPokemiltonAction() {

  }

  checkBattleStatus() {

  }

  startNewRound() {

  }

  endBattle() {

  }
}

module.exports = PokemiltonArena