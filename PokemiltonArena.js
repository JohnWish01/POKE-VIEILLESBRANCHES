//PokemiltonArena.js

//const Game = require("./Game");
const Pokemilton = require("./Pokemilton");
let currentPokemilton = require("./Game");

let battleInProgress = 0;

class PokemiltonArena {
  constructor(pokemilton_1 = null, pokemilton_2 = null) {
    this.pokemilton_1 = pokemilton_1;
    this.pokemilton_2 = pokemilton_2;
    this.roundNumber = 0;
  }

  async startBattle(menuDay, askQuestion, pokemiltonMaster) {
    console.log("\nUn Pokemilton sauvage apparaît !\n");
    while (true) {
      const answer = await askQuestion("Que voulez-vous faire ?\n1. Combattre\n2. Fuir\n\nVotre choix: ");
      switch (answer) {
        case "1":
          this.pokemilton_2 = new Pokemilton();
          console.log(`\nVoici ses caractéristiques :\n- Niveau : ${this.pokemilton_2.level}\n- Nom : ${this.pokemilton_2.name} \n- Santé : ${this.pokemilton_2.healthPool}`);
          await this.choosePokemilton(pokemiltonMaster, askQuestion, menuDay);
          return;
        case "2":
          console.log("\nVous avez évincé le combat...");
          await menuDay(pokemiltonMaster); // AJOUTER UNE FONCTION ALEATOIRE ?
          return;
        default:
          console.log("\nChoix invalide.");
      }
    }
  }

  async choosePokemilton(pokemiltonMaster, askQuestion, menuDay) {
    pokemiltonMaster.showCollection();

    let answer = await askQuestion("\nChoisissez votre Pokemilton : ");
    answer = parseInt(answer, 10);

    if (answer > 0 && answer <= pokemiltonMaster.pokemiltonCollection.length) {
      this.pokemilton_1 = pokemiltonMaster.pokemiltonCollection[answer - 1];
      currentPokemilton = this.pokemilton_1;
      await this.startRound(askQuestion, menuDay, pokemiltonMaster);
    } else {
      console.log("\nChoix invalide. Veuillez sélectionner un Pokemilton valide.");
      await this.choosePokemilton(pokemiltonMaster, askQuestion, menuDay);
    }
  }

  async startRound(askQuestion, menuDay, pokemiltonMaster) {
    this.roundNumber++;
    console.log(`\nRound ${this.roundNumber} :`);
    console.log(`\n${this.pokemilton_1.name} combat ${this.pokemilton_2.name} !`);
    await this.playerAction(askQuestion, menuDay, pokemiltonMaster);
  }

  async playerAction(askQuestion, menuDay, pokemiltonMaster) {
    const answer = await askQuestion("\nQue voulez-vous faire ?\n1. Attaquer\n2. Utiliser un objet\n3. Attraper\n4. Fuir\n\nVotre choix : ");
    switch (answer) {
      case "1":
        this.attack(pokemiltonMaster);
        break;
      case "2":
        //TO DO
        console.log("Objet"); //Creer un moyen d'utiliser un menu choix des objets.
        this.UseObject();
        break;
      case "3":
        this.tryToCatch(askQuestion, menuDay, pokemiltonMaster);
        break;
      case "4":
        console.log("\nVous fuyez le combat !");
        menuDay(pokemiltonMaster);
        break;
      //Fin du combat - QUE DOIT-ON FAIRE ?
      default:
        console.log("\nChoix invalide. Réessayez.");
        await this.playerAction(askQuestion, menuDay, pokemiltonMaster);
    }

    if (this.pokemilton_2.healthPool > 0) {
      this.wildPokemiltonAction(askQuestion, menuDay, pokemiltonMaster);
    } else {
      this.endBattle(menuDay, pokemiltonMaster);
    }
  }

  attack() {
    const damage = this.calculateDamage(this.pokemilton_1.attackRange, this.pokemilton_2.defenseRange);
    this.pokemilton_2.healthPool -= damage;
    console.log(`\n${this.pokemilton_1.name} attaque ${this.pokemilton_2.name} et inflige ${damage} points de dégâts !`);
    this.checkBattleStatus();
  }

  tryToCatch(askQuestion, menuDay, pokemiltonMaster) {
    const catchChance = Math.random();
    if (catchChance < 0.5) {
      console.log("\nFélicitations ! Vous avez attrapé le Pokemilton sauvage !");
    } else {
      console.log("\nLe Pokemilton sauvage s'est échappé !");
    }
  }

  calculateDamage(attackRange, defenseRange) {
    return Math.max(Math.floor(Math.random() * (attackRange + 1)) - defenseRange, 0); // Les dégâts ne peuvent pas être négatifs
  }

  wildPokemiltonAction(askQuestion, menuDay, pokemiltonMaster) {
    const damage = this.calculateDamage(this.pokemilton_2.attackRange, this.pokemilton_1.defenseRange);
    this.pokemilton_1.healthPool -= damage;

    console.log(`${this.pokemilton_2.name} contre-attaque et inflige ${damage} points de dégâts à ${this.pokemilton_1.name} !`);

    if (this.pokemilton_1.healthPool <= 0) {
      console.log(`${this.pokemilton_1.name} a été vaincu !`);
      this.endBattle(menuDay, pokemiltonMaster);
    } else {
      this.startRound(askQuestion, menuDay); //On passe au round suivant.
    }
  }

  checkBattleStatus() {
    if (this.pokemilton_2.healthPool <= 0) {
      console.log(`\n${this.pokemilton_2.name} a été vaincu !`);
      this.pokemilton_1.gainExperience(this.pokemilton_2.level);
    }
  }

  endBattle(menuDay, pokemiltonMaster) {
    console.log("\nLe combat est terminé !");
    this.pokemilton_1 = null;
    this.pokemilton_2 = null;
    menuDay(pokemiltonMaster);
  }
}

module.exports = PokemiltonArena;
