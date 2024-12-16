//PokemiltonMaster.js

const { log } = require("console");
const Pokemilton = require("./Pokemilton");
//const Game = require("./Game");
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
  async renamePokemilton(askQuestion) {
    this.showCollection();
    let answer = await askQuestion("\nQuel Pokemilton voulez-vous renommer ? ");
    let index = parseInt(answer) - 1;

    if (index >= 0 && index < this.pokemiltonCollection.length) {
      let oldName = this.pokemiltonCollection[index].name;
      let newName = await askQuestion("Entrez son nouveau nom : ");

      if (newName.trim().length > 0) {
        newName = newName.trim().charAt(0).toUpperCase() + newName.trim().slice(1);
        this.pokemiltonCollection[index].name = newName;
        console.log(`\n${oldName} a été renommé ${newName} !`);
      } else {
        console.log("\nNom invalide, le Pokemilton n'a pas été renommé.");
      }
    } else {
      console.log("\nPokemilton introuvable dans votre collection !");
    }
  }

  // Implémenter le soin.
  async healPokemilton(askQuestion) {
    if (this.healingItems > 0) {
      this.showCollection();
      const answer = await askQuestion("Quel Pokemilton voulez-vous soigner ? : ");

      let index = parseInt(answer) - 1;
      if (index >= 0 && index <= this.pokemiltonCollection.length) {
        const pokemiltonTemp = new Pokemilton();
        const healedAmount = pokemiltonTemp.getRandomNumber(10, 30);
        this.pokemiltonCollection[index].healthPool = healedAmount;

        this.healingItems -= 1;
        console.log(`\n${this.pokemiltonCollection[index].name} a récupéré ${healedAmount} points de santé ! Potions restantes : ${this.healingItems}`);
      } else {
        console.log("\nChoix invalide");
        return;
      }
    } else {
      console.log("\nVous n'avez plus d'objet de soin!");
    }
  }

  // Implémenter le revive.
  async revivePokemilton(askQuestion) {
    if (this.reviveItems > 0) {
      this.showCollection();
      const answer = await askQuestion("Quel Pokemilton voulez-vous ressusciter ? : ");

      let index = parseInt(answer) - 1;
      if (index >= 0 && index <= this.pokemiltonCollection.length) {
        const pokemiltonTemp = new Pokemilton();
        const reviveAmount = Math.floor(pokemiltonTemp.getRandomNumber(10, 30) / 2);
        this.pokemiltonCollection[index].healthPool = Math.max(this.pokemiltonCollection[index].healthPool, reviveAmount); //On prend la plus grande des 2 valeurs
        this.reviveItems -= 1;
        console.log(`\n${this.pokemiltonCollection[index].name} a été ressuscité avec ${reviveAmount} points de santé ! Potions revive restantes : ${this.reviveItems}`);
      } else {
        console.log("\nChoix invalide");
        return;
      }
    } else {
      console.log("\nVous n'avez plus de potions de résurection !");
    }
  }

  // Relacher un Pokémilton.
  async releasePokemilton(askQuestion, pokemiltonMaster) {
    if (this.pokemiltonCollection.length === 1) {
      console.log("\nVous ne pouvez pas vous séparer de votre unique Pokemilton !");
      return;
    }

    this.showCollection();
    const answer = await askQuestion("\nQuel Pokemilton voulez-vous libérer ? :");
    const index = parseInt(answer, 10) - 1;

    if (isNaN(index) || index < 0 || index >= this.pokemiltonCollection.length1) {
      console.log("\nrChoix invalide. Aucune action n'a été effectuée.");
      return;
    }

    const releasedPokemilton = this.pokemiltonCollection.splice(index, 1)[0];
    console.log(`\n${releasedPokemilton.name} a été relaché de votre collection !`);
  }

  // Méthode 2 pour vérifier le statut du pokemilton.
  checkStatus(pokemilton) {
    if (!pokemilton) {
      console.log("\n" + locale.noSelection);
      return;
    }
    // Affichage du statut dans la console.
    console.log(`\nStatus de ${pokemilton.name} :`);
    console.log(`- Niveau: ${pokemilton.level}, \nExpérience: ${pokemilton.experienceMeter}, \nSanté: ${pokemilton.healthPool}`);
  }

  checkMaster() {
    console.log(`\nInventaire de ${this.name} : `);
    console.log(`- Objets de guérison : ${this.healingItems} \n- Objets de vie : ${this.reviveItems}`);
  }

  // Montrer la collection
  showCollection() {
    if (this.pokemiltonCollection.length === 0) {
      console.log("\nVotre collection est vide !");
      return;
    }

    console.log("\nVotre collection de Pokemilton :\n");
    this.pokemiltonCollection.forEach((pokemilton, index) => {
      console.log(`${index + 1} - ${pokemilton.name}`);
      console.log(`- Niveau : ${pokemilton.level}`);
      console.log(`- Expérience : ${pokemilton.experienceMeter}`);
      console.log(`- Santé : ${pokemilton.healthPool}\n`);
    });
  }
}
module.exports = PokemiltonMaster;
