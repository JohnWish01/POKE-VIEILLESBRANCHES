const readline = require('readline') // Pour interagir avec l'utilisateur via la console
const PokemiltonMaster = require('./PokemiltonMaster') // Replace 'your_classes_filename' with the actual filename
const Pokemilton = require('./Pokemilton')
const PokemiltonWorld = require('./PokemiltonWorld')
const PokemiltonArena = require('./PokemiltonArena')
const fs = require('fs'); // Pour gérer le système de fichiers


// Création d'une interface pour lire et écrire dans la console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let dataGame = []; //les données du jeu
let pokemiltonMaster //le maître du jeu
let world = new PokemiltonWorld()

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

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
  } catch (error) {
    console.error("Error:", error); // Affiche une erreur en cas de problème
  }
}

// function loadGameState() {
//   if (fs.existsSync("save.json")) {
//     const saveData = JSON.parse(fs.readFileSync("save.json"));
//     return saveData;
//   }
// }

//Sauvegarde l'état du jeu

//Chargement de l'état du jeu
async function loadGameState() {

  const filePath = 'save.json'; // Chemin vers le fichier JSON
  const initialData = []; // Données initiales (tableau vide)

  return new Promise((resolve, reject) => {
    // Si le fichier JSON n'existe pas, il est créé
    if (!fs.existsSync(filePath)) {
      console.log("JSON file not found => creation made.");
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 4), 'utf8');
    }

    fs.readFile(filePath, "utf8", (err, jsonString) => {
      if (err) {
        console.error("Error reading file: ", err);
        return reject(err); // Rejette la promesse en cas d'erreur
      }

      if (jsonString.trim().length === 0) {
        console.log("The JSON file is empty => repair done.");
        world = new PokemiltonWorld()
        // resolve([]) est utilisé pour signaler que le chargement s'est terminé correctement
        // et que le programme peut continuer à fonctionner avec un tableau vide comme contenu des tâches.
        return resolve([]); // Retourne un tableau vide si le fichier est vide
      } else {
        try {
          dataGame = JSON.parse(jsonString); // Parse le contenu JSON
          resolve(dataGame); // Résout la promesse avec les tâches chargées
        } catch (err) {
          console.error("Error while parsing JSON: ", err);
          reject(err); // Rejette la promesse en cas d'erreur de parsing
        }
      }
    });
  });
}

//Demande le nom du joueur
async function askForName() {
  let answer = await askQuestion("What's your name Master ?:")
  pokemiltonMaster = new PokemiltonMaster(answer)
  console.log(`Hello Master ${pokemiltonMaster.name}, your adventure begins!\n`)
}


//Choix entre 3 Pokemilton
async function proposeFirstPokemilton() {

  let pokemiltonsArr = [] //array contenant 3 Pokemilton généré aléatoirement  
  let selectedPokemilton

  for (let i = 0; i < 3; i++) {
    pokemiltonsArr[i] = new Pokemilton()
    let { name, level, attackRange, defenseRange, healthPool } = pokemiltonsArr[i]
    console.log(`${i + 1} : ${name} - Level: ${level} - Stats: Attack range ${attackRange}, Defense range ${defenseRange}, Health pool ${healthPool}`)
  }

  let answer = await askQuestion("Choose your first Pokemilton (1-3):")

  switch (answer) {
    case '1':
      selectedPokemilton = pokemiltonsArr[0]
      break
    case '2':
      selectedPokemilton = pokemiltonsArr[1]
      break
    case '3':
      selectedPokemilton = pokemiltonsArr[2]
      break
  }

  //Attribution du Pokemilton sélectionné au Master
  pokemiltonMaster.pokemiltonCollection.push(selectedPokemilton)
  console.log(`${selectedPokemilton.name} has been added to your collection\n`)

  console.log("AFfichage de la collection :")
  console.log(pokemiltonMaster.pokemiltonCollection)

  //Sauvegarde des données
  saveGameState(pokemiltonMaster, world)
}

//Menu journée
const menuDay =
  "Que voulez-vous faire :\n" +
  "1. Soigner votre Pokemilton\n" +
  "2. Ressusciter votre Pokemilton\n" +
  "3. Relacher un Pokemilton\n" +
  "4. Renommer un pokemilton de votre collection\n" +
  "5. Voir la collection\n" +
  "6. Ne rien faire\n" +
  "Votre choix: "

// Exécution.
async function run() {

  let answer = await askQuestion(menuDay)

  rl.question(menuDay, (answer) => {
    switch (answer) {
      case "1":
        pokemiltonMaster.healPokemilton(pokemilton);
        break;
      case "2":
        pokemiltonMaster.revivePokemilton(pokemilton);
        break;
      case "3":
        pokemiltonMaster.releasePokemilton(pokemilton);
        break;
      case "4":
        pokemiltonMaster.renamePokemilton(pokemilton);
        break;
      case "5":
        pokemiltonMaster.showCollection();
      case "6":
        console.log("La journée passe...");
        rl.close();
        break;
      default:
        console.log("Choix incorrect");
        console.clear();
        run();
    }
  });
  saveGameState()
}

async function startGame() {

  try {
    await loadGameState(); // Charge les données depuis le fichier JSON
    console.log("JSON file processed successfully.\n");

    await askForName()

    await proposeFirstPokemilton()

    await run()







    let newArena = new PokemiltonArena()


    // pokemiltonMaster.showCollection()

    // newArena.choosePokemilton(pokemiltonMaster)

    //newWorld.oneDayPasses()


  } catch (error) {
    console.error("Error while processing JSON file:", error);
  }






  // console.log(myPokemilton)
}




startGame()

