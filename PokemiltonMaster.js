const { log } = require("console");
const Pokemilton = require("./Pokemilton");
const Game = require("./Game");
const locale = require("./locales/fr.json");

class PokemiltonMaster {
  constructor({ name, healingItems, reviveItems, POKEBALLS, pokemiltonCollection }) {
    this.name = name;
    this.pokemiltonCollection = (pokemiltonCollection || []).map((p) => new Pokemilton(p.name, p.level, p.experienceMeter, p.attackRange, p.defenseRange, p.healthPool, p.catchPhrase));
    this.healingItems = healingItems || 5; //Initial number of healing items
    this.reviveItems = reviveItems || 3; //Initial number of revive items
    this.POKEBALLS = POKEBALLS || 10; //Initial number of POKEBALLS
  }

  // Implémenger la fonction pour renommer un pokemon de la collection.
  async renamePokemilton(askQuestion, pokemiltonMaster) {
    const nbrPoke = pokemiltonMaster.pokemiltonCollection.length;
    this.showCollection(pokemiltonMaster);
    let answer = await askQuestion("\nQuel Pokemilton voulez-vous renommer ? ");
    answer = parseInt(answer) - 1;

    if (answer >= 0 && answer < nbrPoke) {
      let oldName = pokemiltonMaster.pokemiltonCollection[answer].name;
      let answer2 = await askQuestion("Entrez son nouveau nom.. ");

      // Update du nom
      pokemiltonMaster.pokemiltonCollection[answer].name = answer2.trim();
      console.log(`\n${oldName} a été renommé ${answer2}!`);
      return pokemiltonMaster.pokemiltonCollection[answer];
    } else {
      console.log("\nPokemilton introuvable dans votre collection !");
    }
  }

  // Implémenter le soin.
  healPokemilton(pokemilton) {
    if (pokemilton === undefined) {
      console.log("\n" + locale.noSelection);
    } else if (this.healingItems > 0) {
      pokemilton.healthPool = Math.floor(pokemilton.getRandomNumber(10, 30));
      this.healingItems -= 1;
      console.log(`\n${pokemilton.name} a été soigné ! Il reste : ${this.healingItems}`);
    } else {
      console.log("\nVous n'avez plus d'objet de soin!");
    }
  }

  // Implémenter le revive.
  revivePokemilton(pokemilton) {
    if (pokemilton === undefined) {
      console.log("\n" + locale.noSelection);
    } else if (this.reviveItems > 0) {
      pokemilton.healthPool = Math.floor(pokemilton.getRandomNumber(10, 30) / 2);
      this.reviveItems -= 1;
      console.log(`\n${pokemilton.name} a été ressuscité ! Il reste : ${this.reviveItems}`);
    } else {
      console.log("\nVous n'avez plus cet objet !");
    }
  }

  // Relacher un pokemon.
  async releasePokemilton(askQuestion, pokemiltonMaster) {
    if (this.pokemiltonCollection.length === 1) {
      console.log("\nVous ne pouvez pas vous séparer de votre unique Pokemilton !\n");
    } else {
      this.showCollection(pokemiltonMaster);
      let answer = await askQuestion("\nQuel Pokemilton voulez-vous libérer ? :");
      const index = pokemiltonMaster.pokemiltonCollection.indexOf(pokemiltonMaster.pokemiltonCollection[answer - 1]);
      if (index !== -1) {
        const deletedPokemiltonName = pokemiltonMaster.pokemiltonCollection[answer - 1].name;
        pokemiltonMaster.pokemiltonCollection.splice(index, 1);
        console.log(`\n${deletedPokemiltonName} a été relaché de votre collection !\n`);
      } else {
        console.log("\nCe Pokemilton n'existe pas dans votre collection !\n");
      }
    }
  }

  // Méthode 2 pour vérifier le statut du pokemilton.
  checkStatus(pokemilton) {
    if (pokemilton === undefined) {
      console.log(locale.noSelection);
    } else {
      // Vérification du statut du pokemilton, comme sa santé et son expérience.
      const status = {
        name: pokemilton.name,
        experienceMeter: pokemilton.experienceMeter,
        healthPool: pokemilton.healthPool,
        level: pokemilton.level,
      };
      // Affichage du statut dans la console.
      console.log(`\n${status.name} - Niveau: ${status.level}, Expérience: ${status.experienceMeter}, Santé: ${status.healthPool}`);
    }
  }

  checkMaster() {
    const checkin = {
      healingItems: this.healingItems,
      reviveItems: this.reviveItems,
    };
    console.log(`\nVotre état :\nIl vous reste : ${checkin.healingItems} potion(s) de soin, et ${checkin.reviveItems} potion(s) Revive.\n`);
  }

  // Montrer la collection
  showCollection(pokemiltonMaster) {
    if (this.pokemiltonCollection.length === 0) {
      console.log("\nVotre collection est vide !");
    } else {
      console.log("\nVotre collection de Pokemilton :");

      let i = 0;
      pokemiltonMaster.pokemiltonCollection.forEach((pokemilton) => {
        console.log(`${++i} - ${pokemilton.name}, Niveau: ${pokemilton.level}, Expérience: ${pokemilton.experienceMeter}, Santé: ${pokemilton.healthPool}`);
      });
    }
  }
}
module.exports = PokemiltonMaster;
