//Game.js

const locale = require("./locales/fr.json");
const readline = require("readline"); // Pour interagir avec l'utilisateur via la console
const PokemiltonMaster = require("./PokemiltonMaster"); // Remplacez par le bon fichier
const Pokemilton = require("./Pokemilton");
const PokemiltonWorld = require("./PokemiltonWorld");
const fs = require("fs"); // Pour gérer le système de fichiers
const path = require("path");
const {saveGameState} = require('./Shared');
const status = "";


// Création d'une interface pour lire et écrire dans la console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let dataGame = []; // les données du jeu
let pokemiltonMaster; // le maître du jeu
let world = new PokemiltonWorld(); // Initialisation de l'environnement de jeu
let nameNeeded = true; //Doit-on demander le nom du master ?
let currentPokemilton;

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Fonction pour charger les données du jeu à partir d'un fichier JSON
async function loadGameState() {
  const filePath = path.resolve("save.json"); // Résolution du chemin du fichier
  const initialData = []; // Données initiales vides

  console.clear();
  // Vérification si le fichier existe
  if (!fs.existsSync(filePath)) {
    console.log("\n", locale.jsonNotFound, "\n");
    // Création d'un fichier JSON vide si il n'existe pas
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 4), "utf8");
    nameNeeded = true;
    return;
  }

  try {
    // Lecture du fichier de manière asynchrone
    const jsonString = await fs.promises.readFile(filePath, "utf8");

    if (jsonString.trim().length === 0) {
      console.log(locale.jsonEmpty, "\n");
      world = new PokemiltonWorld(); // Initialisation d'un jeu exemple
      return;
    } else {
      // Demande à l'utilisateur s'il veut charger la partie sauvegardée
      let answer = await askQuestion(locale.questionLoadData);

      if (answer.toLowerCase() === "oui") {
        // Si l'utilisateur accepte, on parse les données JSON
        dataGame = JSON.parse(jsonString);

        const pokemiltonMasterData = dataGame.PokemiltonMaster;
        pokemiltonMaster = new PokemiltonMaster(pokemiltonMasterData);

        // @ts-ignore
        world.saved_on = dataGame.saved_on;
        world.day = dataGame.day;
        world.logs = dataGame.logs;

        nameNeeded = false; //le nom du master ne doit pas être renseigné, il a été chargé
        console.log("\n", locale.dataLoaded);
      } else {
        console.log("\n", locale.newGame);
        // Démarre une nouvelle partie si l'utilisateur refuse
        nameNeeded = true;
        world = new PokemiltonWorld();
      }
    }
  } catch (err) {
    console.error("\n", locale.jsonKo, "\n", err);
    fs.writeFileSync(filePath, JSON.stringify([], null, 4), "utf8");
    dataGame = [];
  }
}

// Demande le nom du joueur
async function askForName() {
  let name = await askQuestion("\n" + locale.questionMasterName);
  pokemiltonMaster = new PokemiltonMaster({ name });
  console.log("\n" + locale.hello + pokemiltonMaster.name + locale.helloNext + "\n");
  world.addLog(locale.hello + pokemiltonMaster.name + locale.helloNext);
}

// Choix entre 3 Pokemilton
async function proposeFirstPokemilton() {
  let pokemiltonsArr = []; // array contenant 3 Pokemilton généré aléatoirement
  let selectedPokemilton;

  for (let i = 0; i < 3; i++) {
    pokemiltonsArr[i] = new Pokemilton();
    let { name, level, attackRange, defenseRange, healthPool } = pokemiltonsArr[i];
    console.log(`${i + 1}- ${name} - Level: ${level} - Stats: Attack range ${attackRange}, Defense range ${defenseRange}, Health pool ${healthPool}`);
  }

  while (true) {
    let answer = await askQuestion("\nChoisissez votre 1er Pokemilton (1-3): ");
    switch (answer) {
      case "1":
        selectedPokemilton = pokemiltonsArr[0];
        break;
      case "2":
        selectedPokemilton = pokemiltonsArr[1];
        break;
      case "3":
        selectedPokemilton = pokemiltonsArr[2];
        break;
      default:
        console.log("\nChoix invalide, veuillez entrer 1, 2 ou 3.");
        continue; // Répéter la question si la réponse est invalide
    }
    console.clear();
    break;
  }

  // Attribution du Pokemilton sélectionné au Master
  pokemiltonMaster.pokemiltonCollection.push(selectedPokemilton);
  currentPokemilton = selectedPokemilton 
  console.log(`\n${selectedPokemilton.name}` + locale.addPokemiltonOk + "\n");
  world.addLog(`${selectedPokemilton.name}` + locale.addPokemiltonOk);
  // Sauvegarde des données après le choix du premier Pokemilton
  saveGameState(pokemiltonMaster, world);
}

// Menu de la journée
async function menuDay(pokemiltonMaster) {
  while (true) {
    let answer = await askQuestion("\n" + locale.menuDay);
    switch (answer.trim()) {
      case "1":
        pokemiltonMaster.healPokemilton(currentPokemilton);
        break;
      case "2":
        pokemiltonMaster.revivePokemilton(currentPokemilton);
        break;
      case "3":
        await pokemiltonMaster.releasePokemilton(askQuestion, pokemiltonMaster);
        break;
      case "4":
        currentPokemilton = await pokemiltonMaster.renamePokemilton(askQuestion, pokemiltonMaster); // Ajout paramètre askQuestion.
        break;
      case "5":
        pokemiltonMaster.showCollection();
        break;
      case "6":
        pokemiltonMaster.checkStatus(currentPokemilton);
        break;
      case "7":
        pokemiltonMaster.checkMaster();
        break;
      case "8":
        await world.oneDayPasses(menuDay, askQuestion, pokemiltonMaster);
        return; // Quitte la fonction une fois la journée terminée
      case "9": // Option de sortie propre
        console.log("\n" + locale.goodbye + "\n");
        rl.close();
        process.exit(0);
      default:
        console.log(locale.invalidChoice);
        continue;
    }
    saveGameState(pokemiltonMaster, world);
  }
}

async function startGame() {
  try {
    await loadGameState(); // Charge les données depuis le fichier JSON
    //console.log("JSON file processed successfully.\n");
    if (nameNeeded) {
      await askForName();
      await proposeFirstPokemilton();
    }
    await menuDay(pokemiltonMaster); // Lancer la boucle du menu principal
  } catch (error) {
    console.error("Error while processing JSON file:", error);
  }
}

module.exports = { startGame, currentPokemilton };
