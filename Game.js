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
let pokemiltonsArr = [] //array contenant 3 Pokemilton généré aléatoirement  

//Sauvegarde l'état du jeu
function saveGameState() {
  try {
    fs.writeFileSync('save.json', JSON.stringify(dataGame, null, 2)); // Écrit les données du jeu dans un fichier JSON
  } catch (error) {
    console.error("Error:", error); // Affiche une erreur en cas de problème
  }
}

//Chargement de l'état du jeu
function loadGameState() {

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
function askForName() {
  rl.question("What's your name Master ?:", (name) => {
    pokemiltonMaster = new PokemiltonMaster(name)
    console.log(`Hello Master ${pokemiltonMaster.name}, your adventure begins!\n`)
    proposeFirstPokemilton(rl)
  })
}

//Choix entre 3 Pokemilton
function proposeFirstPokemilton(rl) {

  for (let i = 0; i < 3; i++) {
    pokemiltonsArr[i] = new Pokemilton()
    let { name, level, attackRange, defenseRange, healthPool } = pokemiltonsArr[i]
    console.log(`${i + 1} : ${name} - Level: ${level} - Stats: Attack range ${attackRange}, Defense range ${defenseRange}, Health pool ${healthPool}`)
  }

  rl.question("Choose your first Pokemilton (1-3):", (pokemilton) => {
    let selectedPokemilton
    switch (pokemilton) {
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
    
    //Sauvegarde des données
    saveGameState()

    //Création d'un monde
    let newWorld = new PokemiltonWorld()
    
    newWorld.oneDayPasses()


  })
}

function startGame() {

  try {
    loadGameState(); // Charge les données depuis le fichier JSON
    console.log("JSON file processed successfully.\n");

    askForName()

  } catch (error) {
    console.error("Error while processing JSON file:", error);
  }






  // console.log(myPokemilton)
}




startGame()

