const readline = require("readline"); // Pour interagir avec l'utilisateur via la console
const PokemiltonMaster = require("./PokemiltonMaster"); // Remplacez par le bon fichier
const Pokemilton = require("./Pokemilton");
const PokemiltonWorld = require("./PokemiltonWorld");
const PokemiltonArena = require("./PokemiltonArena");
const fs = require("fs"); // Pour gérer le système de fichiers
const path = require("path");
const Game = require("./Game");

// Création d'une interface pour lire et écrire dans la console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let dataGame = []; // les données du jeu
let pokemiltonMaster; // le maître du jeu
let world = new PokemiltonWorld(); // Initialisation de l'environnement de jeu
let gameInProgress = false;

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Fonction pour sauvegarder l'état du jeu dans un fichier JSON
function saveGameState(pokemiltonMaster, world) {
  try {
    const saveData = {
      saved_on: new Date().toISOString(),
      PokemiltonMaster: {
        name: pokemiltonMaster.name,
        pokemiltonCollection: pokemiltonMaster.pokemiltonCollection,
        healingItems: pokemiltonMaster.healingItems,
        reviveItems: pokemiltonMaster.reviveItems,
        POKEBALLS: pokemiltonMaster.POKEBALLS,
      },
      day: world.day,
      logs: world.logs,
    };
    fs.writeFileSync("save.json", JSON.stringify(saveData, null, 2));
    console.log("État du jeu sauvegardé.");
  } catch (error) {
    console.error("Error during save:", error);
  }
}

// Fonction pour charger les données du jeu à partir d'un fichier JSON
async function loadGameState() {
  const filePath = path.resolve("save.json"); // Résolution du chemin du fichier
  const initialData = []; // Données initiales vides

  // Vérification si le fichier existe
  if (!fs.existsSync(filePath)) {
    console.log("Fichier JSON non trouvé => création du fichier.");
    // Création d'un fichier JSON vide si il n'existe pas
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 4), "utf8");
  }

  try {
    // Lecture du fichier de manière asynchrone
    const jsonString = await fs.promises.readFile(filePath, "utf8");

    if (jsonString.trim().length === 0) {
      console.log("Le fichier JSON est vide => initialisation du jeu.");
      world = new PokemiltonWorld(); // Initialisation d'un jeu exemple
      return;
    } else {
      // Demande à l'utilisateur s'il veut charger la partie sauvegardée
      let answer = await askQuestion(
        "Des données existent, voulez-vous charger la partie ? (oui/non)"
      );

      if (answer.toLowerCase() === "oui") {
        // Si l'utilisateur accepte, on parse les données JSON
        dataGame = JSON.parse(jsonString);

        pokemiltonMaster = new PokemiltonMaster(dataGame.PokemiltonMaster.name);
        pokemiltonMaster.pokemiltonCollection =
          dataGame.PokemiltonMaster.pokemiltonCollection;
        pokemiltonMaster.healingItems = dataGame.PokemiltonMaster.healingItems;
        pokemiltonMaster.reviveItems = dataGame.PokemiltonMaster.reviveItems;
        pokemiltonMaster.POKEBALLS = dataGame.PokemiltonMaster.POKEBALLS;

        world.saved_on = dataGame.saved_on;
        world.day = dataGame.day;
        world.logs = dataGame.logs;

        gameInProgress = true;
        console.log(
          "Données de jeu chargées\n",
          pokemiltonMaster + "\n",
          world
        );
      } else {
        console.log("Démarrage d'une nouvelle partie...");
        // Démarre une nouvelle partie si l'utilisateur refuse
        world = new PokemiltonWorld();
      }
    }
  } catch (err) {
    console.error("Fichier corrompu. Réinitialisation du jeu.", err);
    fs.writeFileSync(filePath, JSON.stringify([], null, 4), "utf8");
    dataGame = [];
  }
}

// Demande le nom du joueur
async function askForName() {
  let answer = await askQuestion("What's your name Master ?:");
  pokemiltonMaster = new PokemiltonMaster(answer);
  console.log(
    `Hello Master ${pokemiltonMaster.name}, your adventure begins!\n`
  );
}

// Choix entre 3 Pokemilton
async function proposeFirstPokemilton() {
  let pokemiltonsArr = []; // array contenant 3 Pokemilton généré aléatoirement
  let selectedPokemilton;

  for (let i = 0; i < 3; i++) {
    pokemiltonsArr[i] = new Pokemilton();
    let { name, level, attackRange, defenseRange, healthPool } =
      pokemiltonsArr[i];
    console.log(
      `${
        i + 1
      }: ${name} - Level: ${level} - Stats: Attack range ${attackRange}, Defense range ${defenseRange}, Health pool ${healthPool}`
    );
  }

  while (true) {
    let answer = await askQuestion("Choose your first Pokemilton (1-3):");
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
        console.log("Choix invalide, veuillez entrer 1, 2 ou 3.");
        continue; // Répéter la question si la réponse est invalide
    }
    break;
  }

  // Attribution du Pokemilton sélectionné au Master
  pokemiltonMaster.pokemiltonCollection.push(selectedPokemilton);
  console.log(`${selectedPokemilton.name} has been added to your collection\n`);

  // Sauvegarde des données après le choix du premier Pokemilton
  saveGameState(pokemiltonMaster, world);
}

// Menu de la journée
const menuDay =
  "Que voulez-vous faire :\n" +
  "1. Soigner votre Pokemilton\n" +
  "2. Ressusciter votre Pokemilton\n" +
  "3. Relâcher un Pokemilton\n" +
  "4. Renommer un pokemilton de votre collection\n" +
  "5. Voir la collection\n" +
  "6. Vérifier l'état\n" +
  "7. Ne rien faire\n" +
  "Votre choix: ";

async function run(pokemiltonMaster) {
  while (true) {
    let answer = await askQuestion(menuDay);
    switch (answer) {
      case "1":
        pokemiltonMaster.healPokemilton(
          pokemiltonMaster.pokemiltonCollection[0]
        );
        break;
      case "2":
        pokemiltonMaster.revivePokemilton(
          pokemiltonMaster.pokemiltonCollection[0]
        );
        break;
      case "3":
        pokemiltonMaster.releasePokemilton(
          pokemiltonMaster.pokemiltonCollection[0]
        );
        break;
      case "4":
        pokemiltonMaster.releasePokemilton();
      case "5":
        pokemiltonMaster.showCollection();
        break;
      case "6":
        pokemiltonMaster.checkStatus();
        break;
      case "7":
        console.log("La journée passe...");
        rl.close();
        return; // Quitte la fonction une fois la journée terminée
      default:
        console.log("Choix incorrect. Essayez de nouveau.");
        continue; // Redemande une réponse valide si l'utilisateur fait un choix invalide
    }
    // Sauvegarder l'état du jeu après toutes les actions
    saveGameState(pokemiltonMaster, world);
    //break; // Sort de la boucle si un choix valide est fait
  }
}

async function startGame() {
  try {
    await loadGameState(); // Charge les données depuis le fichier JSON
    console.log("JSON file processed successfully.\n");
    if (!gameInProgress) {
      await askForName();
      await proposeFirstPokemilton();
    }
    await run(pokemiltonMaster); // Lancer la boucle du menu principal
  } catch (error) {
    console.error("Error while processing JSON file:", error);
  }
}

startGame();

module.exports = Game;
