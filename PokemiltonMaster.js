const Pokemilton = require("./Pokemilton");

class PokemiltonMaster {
  constructor(name) {
    this.name = name;
    this.pokemiltonCollection = [];
    this.healingItems = 5; // Initial number of healing items
    this.reviveItems = 3; // Initial number of revive items
    this.POKEBALLS = 10; // Initial number of POKEBALLS
  }

  // Implémenger la fonction pour renommer un pokemon de la collection.
  renamePokemilton(pokemilton, newName) {
    const pokemiltonToRename = this.pokemiltonCollection.find(
      (p) => p.name === pokemilton.name
    );
    if (pokemiltonToRename) {
      pokemiltonToRename.name = newName;
      console.log(`${pokemilton.name} a été renommé ${newName}!`);
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
