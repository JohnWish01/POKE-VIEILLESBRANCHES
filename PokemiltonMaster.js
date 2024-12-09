
class PokemiltonMaster {
  constructor(name) {
    this.name = name;
    this.pokemiltonCollection = [];
    this.healingItems = 5; // Initial number of healing items
    this.reviveItems = 3; // Initial number of revive items
    this.POKEBALLS = 10; // Initial number of POKEBALLS
  }

  //Permet de renommer le nom du PokemiltonMaster
  renamePokemilton(pokemilton) {

  }


  //Restaure la santé de base du Pokemilton
  healPokemilton(pokemilton) {
    //La santé ne peut pas être réinitialisée si il est mort 




  }

  //Faire revivre le pokemilton
  revivePokemilton(pokemilton) {
    // lui en rendre 1 et réinitialiser sa santé

  }

  //Libérer un pokemilton de sa collection
  releasePokemilton(pokemilton) {
    //pour libérer de l'espace 
  }

  //Affiche la collection de Pokemilton
  showCollection() {

  }
}

module.exports = PokemiltonMaster
