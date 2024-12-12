let battleInProgress = 0;
let currentPokemilton;

class PokemiltonArena {
  constructor(pokemilton_1, pokemilton_2) {}

  startBattle() {
    console.log("A wild Pokemilton™ appears!\n");
    this.askQuestion(
      "What do you want to do?\n1. Fight\n2. Run\n",
      (choice) => {
        switch (choice) {
          case "1":
            this.choosePokemilton();
            break;
          case "2":
            console.log("Vous avez évincé le combat...");
            break;
          default:
            console.log("Choix invalide.");
            this.startBattle();
            break;
        }
      }
    );
  }

  choosePokemilton(pokemiltonMaster) {
    console.log("Pokemiltons in your collection :");
    for (let i = 0; i < pokemiltonMaster.pokemiltonCollection.length; i++) {
      console.log(
        `${(i++, pokemiltonMaster.pokemiltonCollection[i].getStats())}`
      );
    }
  }

  startRound(selectedPokemilton) {}

  playerAction(selectedPokemilton) {}

  attack(selectedPokemilton) {}

  tryToCatch() {}

  calculateDamage(attackRange, defenseRange) {}

  wildPokemiltonAction() {}

  checkBattleStatus() {}

  startNewRound() {}

  endBattle() {}
}

module.exports = PokemiltonArena;
