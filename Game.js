const locale = require('./locales/fr.json');
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
let nameNeeded = true; //Doit-on demander le nom du master ?

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
    console.log("\n",locale.saveOk,"\n");
  } catch (error) {
    console.error("\n",locale.saveKo, error, "\n");
  }
}

// Fonction pour charger les données du jeu à partir d'un fichier JSON
async function loadGameState() {
  const filePath = path.resolve("save.json"); // Résolution du chemin du fichier
  const initialData = []; // Données initiales vides

  console.clear();
  // Vérification si le fichier existe
  if (!fs.existsSync(filePath)) {
    console.log("\n", locale.jsonNotFound,"\n");
    // Création d'un fichier JSON vide si il n'existe pas
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 4), "utf8");
  }

  try {
    // Lecture du fichier de manière asynchrone
    const jsonString = await fs.promises.readFile(filePath, "utf8");

    if (jsonString.trim().length === 0) {
      console.log(locale.jsonEmpty,"\n");
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

        world.saved_on = dataGame.saved_on;
        world.day = dataGame.day;
        world.logs = dataGame.logs;

        nameNeeded = false; //le nom du master ne doit pas être renseigné, il a été chargé
        console.log("\n",locale.dataLoaded,"\n");
      } else {
        console.log("\n",locale.newGame,"\n");
        // Démarre une nouvelle partie si l'utilisateur refuse
        nameNeeded = true
        world = new PokemiltonWorld();
      }
    }
  } catch (err) {
    console.error("\n",locale.jsonKo,"\n", err);
    fs.writeFileSync(filePath, JSON.stringify([], null, 4), "utf8");
    dataGame = [];
  }
}

// Demande le nom du joueur
async function askForName() {
  let name = await askQuestion(locale.questionMasterName);
  pokemiltonMaster = new PokemiltonMaster({ name });
  console.log(
    "\n" + locale.hello + pokemiltonMaster.name + locale.helloNext + "\n"
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
        console.log("\nChoix invalide, veuillez entrer 1, 2 ou 3.");
        continue; // Répéter la question si la réponse est invalide
    }
    console.clear();
    break;
  }

  // Attribution du Pokemilton sélectionné au Master
  pokemiltonMaster.pokemiltonCollection.push(selectedPokemilton);
  console.log(
    `\n${selectedPokemilton.name} has been added to your collection\n`
  );

  // Sauvegarde des données après le choix du premier Pokemilton
  saveGameState(pokemiltonMaster, world);
}

// Menu de la journée
const menuDay =
  "Que voulez-vous faire :\n" +
  "1. Soigner votre Pokemilton\n" +
  "2. Ressusciter votre Pokemilton\n" +
  "3. Relâcher un Pokemilton\n" +
  "4. Renommer un Pokemilton de votre collection\n" +
  "5. Voir la collection\n" +
  "6. Vérifier l'état\n" +
  "7. Vérifier votre état\n" +
  "8. Ne rien faire (Passer la journée)\n" +
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
        pokemiltonMaster.renamePokemilton();
        break;
      case "5":
        pokemiltonMaster.showCollection();
        break;
      case "6":
        pokemiltonMaster.checkStatus(pokemilton);
        break;
      case "7":
        pokemiltonMaster.checkMaster();
        break;
      case "8":
        console.log("La journée passe...\n");
        rl.close();
        return; // Quitte la fonction une fois la journée terminée
      default:
        console.log("Choix incorrect. Essayez de nouveau.\n");
        continue; // Redemande une réponse valide si l'utilisateur fait un choix invalide
    }
    saveGameState(pokemiltonMaster, world);  
    //break; // Sort de la boucle si un choix valide est fait (A DECOMMENTER)
  }
}

async function startGame() {
  try {
    await loadGameState(); // Charge les données depuis le fichier JSON
    console.log("JSON file processed successfully.\n");
    if (nameNeeded) {
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
