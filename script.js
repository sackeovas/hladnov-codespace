// Konstanty
const plocha = document.getElementById("plocha")
const tlacitkoStart = document.getElementById("tlacitkoStart")
const tlacitkoZmenVelikost = document.getElementById("tlacitkoZmenVelikost")

// Globalní proměnné
let posledniKlavesa = 0;
let rychlost;

let stavHry = {
	sirka: 7,
  vyska: 7,
  zradlo: [
  	{x: 1, y: 1},
  	{x: 5, y: 5},
  ],
  hraci: [
  	{
    	connection: null,
    	had: [{x: 3, y: 3}],
      smer: {x:0, y:0}
    },
  ]
}

// Události
tlacitkoStart.addEventListener('click', function () {
  tlacitkoStart.remove()
  plocha.style.display = ""
});
tlacitkoZmenVelikost.addEventListener("click", zmenaMrizky)
document.addEventListener("keydown", autopohyb);

// Počáteční nastavení
zmenaMrizky()


function pridejHadaNaNahodnePole() {
  let a = Math.floor(Math.random() * velikost + 1) ; //Math.floor zaokrouhlí na celé číslo dolů
  let b = Math.floor(Math.random() * velikost + 1) ;
  let nahodnePole = document.getElementById(a + ":" + b)

  console.log("Chci hodit hada na " + a + ":" + b)

  nahodnePole.classList.add("had");
  had = [nahodnePole]
}

function pridejZradloNaNahodnePole() {
  let a = Math.floor(Math.random() * (velikost) + 1);
  let b = Math.floor(Math.random() * (velikost) + 1);
  let nahodnePolee = document.getElementById(a + ":" + b);

  if (nahodnePolee.classList.contains("had")) {
    // Recursively call the function until an unoccupied pole is found
    pridejZradloNaNahodnePole(velikost);
  } else {
    nahodnePolee.classList.add("zradlo");
    console.log("Chci hodit zradlo na " + a + ":" + b);
    zradlo = [nahodnePolee];
  }
}

function zmenaMrizky() {
  const poleVelikost = document.getElementById("velikost");
  const velikost = parseInt(poleVelikost.value);
  console.log("Měním mřížku na velikost " + velikost)
  
  stavHry.sirka = velikost
  stavHry.vyska = velikost
  
  pridejHadaNaNahodnePole()
  pridejZradloNaNahodnePole()
  //nesmrtelnost()
  zrychlení()
  
  aktualizujStavHry()
}
 
function pohniHadem(dolu, doprava) {
  const hadiHlava = stavHry.hraci[0].had[0];
  
  console.log("Had je na " + hadiHlava.x + ":" + hadiHlava.y);

  const cil = {x: hadiHlava.x + dolu, y: hadiHlava.y + doprava}
  
  console.log("Had bude na " + cil.x + ":" + cil.y);

  kontrolaProhry(cil)

  stavHry.hraci[0].had.unshift(cil);
  
  for (let i = 0; i < stavHry.zradlo.length; i++) {
    const zradlo = stavHry.zradlo[i]
    if (zradlo.x === cil.x && zradlo.y === cil.y) {
      console.log("Had bude žrát");
      stavHry.zradlo.splice(i, 1)
      pridejZradloNaNahodnePole()
      return
    }
  }
  
  stavHry.hraci[0].had.pop()
  
  aktualizujStavHry()
}

function autopohyb(udalost) {
  const jeToPrvniKlavesa = (posledniKlavesa === 0);
  posledniKlavesa = udalost.which;
  if (jeToPrvniKlavesa) {
    rychlost = setInterval(pohyb, 200);
  }
  console.log("Posledni klavesa je " + posledniKlavesa);
}

function zrychlení() { //nefunguje :(((
  if (velikost > 12){
    console.log("Zrychluji hada");
    clearInterval(rychlost);
    rychlost = setInterval(pohyb, 100);
  }
}

function pohyb() {
  if (posledniKlavesa === 37) {
    console.log("Hade, jdi doleva pls");
    pohniHadem(0, -1);
  }
  if (posledniKlavesa === 38) {
    console.log("Hade, jdi nahoru pls");
    pohniHadem(-1, 0);
  }
  if (posledniKlavesa === 39) {
    console.log("Hade, jdi doprava pls");
    pohniHadem(0, 1);
  }
  if (posledniKlavesa === 40) {
    console.log("Hade, jdi dolů pls");
    pohniHadem(1, 0);
  }
}

function kontrolaProhry(cil) {
  if (cil.x < 0 || cil.x >= stavHry.sirka || cil.y < 0 || cil.y >= stavHry.vyska) {
    clearInterval() //had se zastaví
    window.alert("Had narazil do zdi:(")

    window.location.reload(); //page reload   
  }
  // TODO pro Simonu z budoucnosti: Hadi do sebe nesmí narazit :)
}

function aktualizujStavHry() {
  const mrizka = document.getElementById("plocha");

  for (const element of mrizka.querySelectorAll("br, .pole")) {
    element.remove()
  }
  const puvodniMezera = document.createElement("br");
  mrizka.append(puvodniMezera)
  
  for (let noveX = 0; noveX < stavHry.sirka; noveX++) {
    for (let noveY = 0; noveY < stavHry.vyska; noveY++) {
      const novyDiv = document.createElement("div");
      novyDiv.classList.add("pole");
      novyDiv.id = noveX + ":" + noveY
      
      for (let i = 0; i < stavHry.zradlo.length; i++) {
        const zradlo = stavHry.zradlo[i]
        if (zradlo.x === noveX && zradlo.y === noveY) {
          novyDiv.classList.add("zradlo")
        }
      }
      // TODO pro Simonu z budoucnosti: Totéž pro hady :)
      
      mrizka.append(novyDiv);
      console.log("Přidám div s id" + novyDiv.id);
    }
    const noveBr = document.createElement("br");
    mrizka.append(noveBr);
  }
}



/*function objeveniPortalu(klavesaP) {
  const jeToP = (klavesaPortal === 80);
  klavesaPortal = klavesaP.which;
  if (jeToP) {
    portaly()
  }
}
function portaly() {
  console.log("Portály se spawnou");
  if ()
}*/
