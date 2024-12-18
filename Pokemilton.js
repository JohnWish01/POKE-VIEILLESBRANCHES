//Pokemilton.js

const Game = require("./Game");
// const PokemiltonArena = require("./PokemiltonArena");
// const PokemiltonMaster = require("./PokemiltonMaster");
// const PokemiltonWorld = require("./PokemiltonWorld");

// Tableau avec des morceaux de noms utilisés pour générer les noms de pokémons.
const students = [
  "Ale",
  "x",
  "And",
  "ré",
  "And",
  "rii",
  "Bas",
  "tien",
  "Bry",
  "an",
  "Céd",
  "ric",
  "Cha",
  "rlotte",
  "Den",
  "is",
  "Emi",
  "lie",
  "Emm",
  "anuel",
  "Fré",
  "déric",
  "Gui",
  "llaume",
  "Hug",
  "o",
  "Jaâ",
  "d",
  "Jam",
  "aldinne",
  "Jus",
  "tine",
  "Luc",
  "as",
  "Mar",
  "ie",
  "Mar",
  "tin",
  "Meh",
  "di",
  "Meh",
  "di",
  "Naj",
  "ib",
  "Nic",
  "olas",
  "Pas",
  "cal",
  "Pie",
  "rre",
  "Que",
  "ntin",
  "Rob",
  "in",
  "Sco",
  "tt",
];

//Le constructor initialise l'objet Pokemilton avec plusieurs choses :
// - Un nom random, un niveau, des stats(attaque, défense, santé) et la catch phrase.
class Pokemilton {
  constructor(name, level, experienceMeter, attackRange, defenseRange, healthPool, catchPhrase) {
    this.name = name || this.generateRandomName();
    this.level = level || 1;
    this.experienceMeter = experienceMeter || 0;
    this.attackRange = attackRange || this.getRandomNumber(1, 8);
    this.defenseRange = defenseRange || this.getRandomNumber(1, 3);
    this.healthPool = healthPool || this.getRandomNumber(10, 30);
    this.catchPhrase = catchPhrase || this.generateCatchPhrase();
    this.healthPoolGeneration = this.healthPool;
  }

  // Retourne les infos d'un Pokemilton
  getStats() {
    return `Name: ${this.name} - Level: ${this.level} - Experience: ${this.experienceMeter} - Attack: ${this.attackRange} - Defense: ${this.defenseRange} - Health: ${this.healthPool}`;
  }

  // Crée des nom de pokemons en combinant 2 étudiants (strings) avec la méthode random
  generateRandomName() {
    let randomStudent1 = students[Math.floor(Math.random() * students.length)];
    randomStudent1 = randomStudent1.charAt(0).toUpperCase() + randomStudent1.slice(1);
    let randomStudent2 = students[Math.floor(Math.random() * students.length)];
    randomStudent2 = randomStudent2.charAt(0).toUpperCase() + randomStudent2.slice(1);
    return `${randomStudent1}${randomStudent2}`;
  }
  // Génère un nombre aléatoire entre min & max.
  getRandomNumber(min, max) {
    if (min > max) [min, max] = [max, min]; // inversion si min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Génère la catch phrase parmis les 3 options.
  generateCatchPhrase() {
    const phrases = ["I choose you!", "Let the battle begin!", "Pokemilton, go!"];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Permet à un pokemon d'en attaquer un autre, calcul aussi les dégats
  //en fonction de son niveau d'ATK et du niveau de DEF de l'adversaire.
  attack(defender) {
    if (!defender || !(defender instanceof Pokemilton)) {
      console.log("Erreur : le défenseur n'est pas un Pokemilton valide !");
    }
    const damage = Math.max(0, this.getRandomNumber(this.attackRange * this.level, this.attackRange) - defender.defenseRange);
    defender.healthPool -= damage;
    console.log(`${this.name} attacked ${defender.name} and dealt ${damage} damage!`);
  }

  //Gain d'expérience après un combat et évolution si suffisamment d'EXP.
  gainExperience(opponentLevel) {
    const experienceGain = this.getRandomNumber(1, 5) * opponentLevel;
    this.experienceMeter += experienceGain;
    console.log(`\n${this.name} a reçu ${experienceGain} de points d'expérience!`);
    if (this.experienceMeter >= this.level * 100) {
      this.evolve();
    }
  }

  // Évolution = Augmentation du niveau, stats ATK, DEF et HEALTH.
  evolve() {
    this.level += 1;
    const attackIncrease = this.getRandomNumber(1, 5);
    const defenseIncrease = this.getRandomNumber(1, 5);
    const healthIncrease = this.getRandomNumber(1, 5);

    this.attackRange += attackIncrease;
    this.defenseRange += defenseIncrease;
    this.healthPool += healthIncrease;

    console.log(`${this.name} a évolué au niveau ${this.level}!
      Nouvelles stats:
      - Attack Range ${this.attackRange}
      - Defense Range ${this.defenseRange}
      - Health Pool ${this.healthPool}`);
  }

  // Dis la catchphrase.
  sayCatchPhrase(pokemiltonArena) {
    console.log(`${this.name} says: "${this.catchPhrase}"`);
  }
}

module.exports = Pokemilton;