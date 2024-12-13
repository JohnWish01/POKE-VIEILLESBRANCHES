const Game = require("./Game");

let battleInProgress = 0;
let currentPokemilton;

class PokemiltonArena {
  constructor(pokemilton_1, pokemilton_2) {
    this.pokemilton_1 = pokemilton_1;
    this.pokemilton_2 = pokemilton_2;
    this.roundNumber = 0;

    // this.rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout,
    // });
  }

  async startBattle(menuDay, askQuestion) {
    console.log("Un Pokemilton sauvage apparaît !\n");
    await askQuestion(
      "Que voulez-vous faire ?\n1. Combattre\n2. Fuir\n",
      (choice) => {
        switch (choice) {
          case "1":
            this.choosePokemilton();
            break;
          case "2":
            console.log("Vous avez évincé le combat...");
            menuDay();
            break;
          default:
            console.log("Choix invalide.");
            this.startBattle(menuDay);
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

    this.askQuestion("Choisissez votre Pokemilton (1-3) : ", (choice) => {
      const selectedPokemilton = this.pokemilton_1[choice - 1];
      if (selectedPokemilton) {
        this.startRound(selectedPokemilton);
      } else {
        console.log("Choix invalide.");
        this.choosePokemilton();
      }
    });
  }

  startRound(selectedPokemilton) {
    console.log(`Round ${this.roundNumber + 1}:`);
    console.log(`${pokemilton.name} is battling the wild Pokemilton !`);
    this.playerAction(pokemilton);
  }

  async playerAction(selectedPokemilton) {
    this.askQuestion(
      "Que voulez-vous faire ?\n1. Attaquer\n2.Utiliser un objet\n3. Attraper\n4. Fuir",
      (action) => {
        switch (action) {
          case "1":
            this.attack(pokemilton);
            break;
          case "2":
            console.log("Objet"); //Creer un moyen d'utiliser un menu choix des objets.
            this.UseObject(pokemilton);
            break;
          case "3":
            this.tryToCatch();
            break;
          case "4":
            console.log("Vous fuyez le combat !");
            break;
          default:
            console.log("Choix invalide...");
            this.playerAction(pokemilton);
            break;
        }
      }
    );
  }

  attack(selectedPokemilton) {
    console.log(`${pokemilton.name} passe à l'attaque !`);
    const damage = pokemilton.attackRange;
    this.pokemilton_2.healthPool -= damage;
    console.log(
      `${this.pokemilton_2.name} prend ${damage} points de dommages !`
    );
    this.checkBattleStatus();
  }

  tryToCatch() {
    const catchChance = Math.random();
    if (catchChance < 0.5) {
      console.log("Vous avez attrapé le Pokemilton sauvage !!");
    } else {
      console.log("Le Pokemilton s'est enfuis ! ");
    }
  }

  calculateDamage(attackRange, defenseRange) {}

  wildPokemiltonAction() {}

  checkBattleStatus() {
    if (this.pokemilton_2.healthPool <= 0) {
      console.log(`${this.pokemilton_2.name} a été vaincu !`);
    }
  }

  startNewRound() {}

  endBattle() {}
}

module.exports = PokemiltonArena;
