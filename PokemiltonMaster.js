const { log } = require("console");
const Pokemilton = require("./Pokemilton");
const Game = require("./Game");

class PokemiltonMaster {
  constructor(name) {
    this.name = name;
    this.pokemiltonCollection = [];
    this.healingItems = 5; // Initial number of healing items
    this.reviveItems = 3; // Initial number of revive items
    this.POKEBALLS = 10; // Initial number of POKEBALLS
  }

  // Implémenger la fonction pour renommer un pokemon de la collection.
  async renamePokemilton() {
    const nbrPoke = this.pokemiltonCollection.length;
    console.log(this.showCollection());
    let answer = await askQuestion("Quel Pokemilton voulez-vous renommer ? ");
    answer = parseInt(answer);
    if (answer >= 0 && answer < nbrPoke) {
      const oldName = this.pokemiltonCollection[answer - 1].name;
      const answer2 = await askQuestion("Entrez son nouveau nom. ");

      this.pokemiltonCollection[answer - 1].name = answer2;
      console.log(`${oldName} a été renommé ${answer2}!`);
    } else {
      console.log("Pokemilton introuvable dans votre collection !");
    }
  }

  // Implémenter le soin.
  healPokemilton(pokemilton) {
    if (this.healingItems > 0) {
      pokemilton.healthPool = pokemilton.getRandomNumber(10, 30);
      this.healingItems -= 1;
      console.log(
        `${pokemilton.name} a été soigné ! Il reste : ${this.healingItems}`
      );
    } else {
      console.log("Vous n'avez plus d'objet de soin!");
    }
  }

  // Implémenter le revive.
  revivePokemilton(pokemilton) {
    if (this.reviveItems > 0) {
      pokemilton.healthPool = Math.floor(
        pokemilton.getRandomNumber(10, 30) / 2
      );
      this.reviveItems -= 1;
      console.log(
        `${pokemilton.name} a été ressuscité ! Il reste : ${this.reviveItems}`
      );
    } else {
      console.log("Vous n'avez plus cet objet !");
    }
  }

  // Relacher un pokemon.
  releasePokemilton(pokemilton) {
    const index = this.pokemiltonCollection.indexOf(pokemilton);
    if (index !== -1) {
      this.pokemiltonCollection.splice(index, 1);
      console.log(`${pokemilton.name} a été relaché de votre collection !`);
    } else {
      console.log("Ce Pokemilton n'existe pas dans votre collection !");
    }
  }

  // Montrer la collection
  showCollection() {
    if (this.pokemiltonCollection.length === 0) {
      console.log("Collection vide !");
    } else {
      this.pokemiltonCollection.forEach((pokemilton) => {
        console.log(
          `Name : ${pokemilton.name}, Niveau : ${pokemilton.level}, Santé : ${pokemilton.healthPool}`
        );
      });
    }
  }
}
module.exports = PokemiltonMaster;
