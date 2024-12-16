//PokemiltonArena.js

const Pokemilton = require("./Pokemilton");

let goAway = false; //Le combat est-il terminé
let healthWild = 0; //Le pourcentage de santé restante du Pokemilton Wild

class PokemiltonArena {
  constructor(pokemilton_1 = null, pokemilton_2 = null) {
    this.pokemilton_1 = pokemilton_1;
    this.pokemilton_2 = pokemilton_2;
    this.roundNumber = 0;
  }

  async startBattle(menuDay, askQuestion, pokemiltonMaster) {
    goAway = false;
    console.log("\nUn Pokemilton sauvage apparaît !\n");
    while (true) {
      const answer = await askQuestion("Que voulez-vous faire ?\n1. Combattre\n2. Fuir\n\nVotre choix: ");
      switch (answer) {
        case "1":
          this.pokemilton_2 = new Pokemilton();
          healthWild = this.pokemilton_2.healthPool; //Sauvegarde pour le calcul du % de chance de l'attraper
          console.log(`\nVoici les caractéristiques du Pokemilton sauvage :\n- Niveau : ${this.pokemilton_2.level}\n- Nom : ${this.pokemilton_2.name} \n- Santé : ${this.pokemilton_2.healthPool}`);
          await this.choosePokemilton(pokemiltonMaster, askQuestion, menuDay);
          return;
        case "2":
          console.log("\nVous avez évincé le combat...");
          goAway = true;
          await menuDay(pokemiltonMaster);
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
    const answer = await askQuestion("\nQue voulez-vous faire ?\n1. Attaquer\n2. Attraper\n3. Fuir\n\nVotre choix : ");
    switch (answer) {
      case "1":
        this.attack(pokemiltonMaster);
        break;
      case "2":
        this.tryToCatch(pokemiltonMaster);
        break;
      case "3":
        console.log("\nVous fuyez le combat !");
        goAway = true;
        await menuDay(pokemiltonMaster);
        break;
      default:
        console.log("\nChoix invalide. Réessayez.\n");
        await this.playerAction(askQuestion, menuDay, pokemiltonMaster);
    }

    if ((this.pokemilton2 && this.pokemilton_2.healthPool > 0) || goAway === false) {
      this.wildPokemiltonAction(askQuestion, menuDay, pokemiltonMaster);
    } else {
      this.endBattle(menuDay, pokemiltonMaster);
    }
  }

  attack() {
    const damage = this.calculateDamage(this.pokemilton_1.attackRange, this.pokemilton_2.defenseRange, this.pokemilton_1.level);
    if (this.pokemilton_2.healthPool - damage <= 0) {
      this.pokemilton_2.healthPool = 0;
    } else {
      this.pokemilton_2.healthPool -= damage;
    }

    console.log(`\n${this.pokemilton_1.name} attaque ${this.pokemilton_2.name} et inflige ${damage} point(s) de dégât(s) !`);
    console.log(`Nom: ${this.pokemilton_2.name} - Niveau: ${this.pokemilton_2.level} - Expérience: ${this.pokemilton_2.experienceMeter} - Attaque: ${this.pokemilton_2.attackRange} - Défense: ${this.pokemilton_2.defenseRange} - Santé: ${this.pokemilton_2.healthPool}`);

    this.checkBattleStatus();
  }

  tryToCatch(pokemiltonMaster) {
    const catchChance = Math.random() * 100;
    if (pokemiltonMaster.pokemiltonCollection.length < pokemiltonMaster.POKEBALLS) {
      const luck = 100 - (this.pokemilton_2.healthPool / healthWild) * 100;
      if (catchChance <= luck) {
        console.log("\nFélicitations ! Vous avez attrapé le Pokemilton sauvage !");
        pokemiltonMaster.pokemiltonCollection.push(this.pokemilton_2);
        console.log("Et il a été ajouté à votre collection.");
        goAway = true;
      } else {
        console.log("\nLa capture a échoué !");
        goAway = false;
        return;
      }
    } else {
      console.log("\n Votre collection est pleine !");
    }
  }

  calculateDamage(attackRange, defenseRange, level) {
    return Math.max(Math.floor(Math.random() * (attackRange * level)) - defenseRange, 0); // Les dégâts ne peuvent pas être négatifs
  }

  wildPokemiltonAction(askQuestion, menuDay, pokemiltonMaster) {
    const damage = this.calculateDamage(this.pokemilton_2.attackRange, this.pokemilton_1.defenseRange, this.pokemilton_2.level);
    if (this.pokemilton_1.healthPool - damage <= 0) {
      this.pokemilton_1.healthPool = 0;
    } else {
      this.pokemilton_1.healthPool -= damage;
    }

    console.log(`\n${this.pokemilton_2.name} contre-attaque et inflige ${damage} point(s) de dégât(s) à ${this.pokemilton_1.name} !`);
    console.log(`Nom: ${this.pokemilton_1.name} - Niveau: ${this.pokemilton_1.level} - Expérience: ${this.pokemilton_1.experienceMeter} - Attaque: ${this.pokemilton_1.attackRange} - Défense: ${this.pokemilton_1.defenseRange} - Santé: ${this.pokemilton_1.healthPool}`);

    if (this.pokemilton_1.healthPool <= 0) {
      console.log(`\n${this.pokemilton_1.name} a été vaincu !`);
      goAway = true;
      this.endBattle(menuDay, pokemiltonMaster);
    } else {
      this.startRound(askQuestion, menuDay, pokemiltonMaster); //On passe au round suivant.
    }
  }

  checkBattleStatus() {
    if (this.pokemilton_2.healthPool <= 0) {
      console.log(`\n${this.pokemilton_2.name} a été vaincu !`);
      this.pokemilton_1.gainExperience(this.pokemilton_2.level);
      goAway = true;
    }
  }

  endBattle(menuDay, pokemiltonMaster) {
    console.log("\nLe combat est terminé !");
    this.pokemilton_2 = null;
    menuDay(pokemiltonMaster);
  }
}

module.exports = PokemiltonArena;
