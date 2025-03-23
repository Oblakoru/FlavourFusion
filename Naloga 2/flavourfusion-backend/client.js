const API_URL = "http://localhost:3000";
const axios = require("axios");

async function resetDatabase() {
  try {
    console.log("🚨 Resetiranje baze podatkov...");

    await axios.post(`${API_URL}/reset_db`); 

    console.log("✅ Baza podatkov resetirana.\n");
  } catch (error) {
    console.error("❌ Napaka pri resetiranju baze:", error.response ? error.response.data : error.message);
    process.exit(1); 
  }
}


let recipes = [
  {
    name: "Špageti Carbonara",
    ingredients: "Špageti, jajca, panceta, sir, poper",
    instructions: "Skuhaj špagete, zmešaj z jajci in panceto.",
    dietary: "none"
  },
  {
    name: "Piščančji curry",
    ingredients: "Piščanec, kokosovo mleko, curry, čebula, česen, ingver",
    instructions: "Prepraži čebulo, dodaj česen in ingver, nato piščanca in curry. Prelij s kokosovim mlekom in kuhaj 20 minut.",
    dietary: "none"
  },
  {
    name: "Veganska bučna juha",
    ingredients: "Buča, korenje, krompir, čebula, česen, kokosovo mleko",
    instructions: "Skuhaj zelenjavo, zmiksaj v gladko juho, dodaj kokosovo mleko in začimbe.",
    dietary: "vegan"
  },
  {
    name: "Testenine s pestom",
    ingredients: "Testenine, bazilika, pinjole, olivno olje, parmezan, česen",
    instructions: "Skuhaj testenine, zmešaj sestavine za pesto in jih prelij čez testenine.",
    dietary: "vegetarian"
  },
  {
    name: "Grška solata",
    ingredients: "Paradižnik, kumara, čebula, feta sir, olive, olivno olje",
    instructions: "Vse sestavine nareži in zmešaj s prelivom iz olivnega olja in limone.",
    dietary: "vegetarian"
  },
  {
    name: "Pečen losos z limono",
    ingredients: "Losos, limona, olivno olje, česen, sol, poper",
    instructions: "Lososa premaži z oljem, limoninim sokom in česnom, peci 15 minut na 200°C.",
    dietary: "pescatarian"
  },
  {
    name: "Fižolova enolončnica",
    ingredients: "Fižol, paradižnik, čebula, česen, korenje, začimbe",
    instructions: "Skuhaj fižol, dodaj ostale sestavine in kuhaj 40 minut.",
    dietary: "vegan"
  },
  {
    name: "Pica Margherita",
    ingredients: "Testo za pico, paradižnikova omaka, mozzarella, bazilika",
    instructions: "Testo premaži z omako, dodaj mocarelo in peci na 220°C 15 minut.",
    dietary: "vegetarian"
  },
  {
    name: "Rižota s šparglji",
    ingredients: "Riž, šparglji, čebula, belo vino, parmezan, maslo",
    instructions: "Prepraži čebulo, dodaj riž, zalij z vinom in kuhaj z jušno osnovo. Dodaj šparglje in maslo.",
    dietary: "vegetarian"
  },
  {
    name: "Ocvrti piščanec",
    ingredients: "Piščančje meso, moka, jajca, drobtine, sol, poper",
    instructions: "Piščanca povaljaj v moki, jajcu in drobtinah, ocvri do zlato rjave barve.",
    dietary: "none"
  },
  {
    name: "Chili con carne",
    ingredients: "Mleto meso, fižol, paradižnik, čebula, česen, čili",
    instructions: "Prepraži čebulo in meso, dodaj paradižnik in fižol, kuhaj 30 minut.",
    dietary: "none"
  }
];


// Testni odjemalec
async function testAPI() {

  try {

    await resetDatabase();


    for (let recipe of recipes) {
      let res = await axios.post(`${API_URL}/recipes`, recipe);
      console.log(`✅ Dodan recept: ${recipe.name}`, res.data);
    }

    console.log("\n🔹 Pridobivanje vseh receptov...");
    res = await axios.get(`${API_URL}/recipes`);
    console.log("📋 Seznam receptov:", res.data);

    console.log("\n🔎 Iskanje receptov po sestavinah...");
    const searchIngredients = ["Špageti", "sir"];
    for (const ingredient of searchIngredients) {
      console.log(`\n➡️ Iskanje receptov, ki vsebujejo: ${ingredient}`);
      res = await axios.get(`${API_URL}/recipes/search?ingredients=${ingredient}`);
      console.log("🔍 Rezultati iskanja:", res.data.length ? res.data : "Ni zadetkov");
    }

    console.log("\n🛒 Dodajanje sestavine v nakupovalni seznam...");
    res = await axios.post(`${API_URL}/shopping_list`, { item: "Parmezan" });
    console.log("✅ Dodano:", res.data);

    console.log("\n🛍️ Pridobivanje nakupovalnega seznama...");
    res = await axios.get(`${API_URL}/shopping_list`);
    console.log("📝 Nakupovalni seznam:", res.data);

    console.log("\n👤 Registracija novega uporabnika...");
    res = await axios.post(`${API_URL}/users/register`, {
      username: "testuser",
      password: "testpass"
    });
    console.log("✅ Registracija uspešna:", res.data);
  } catch (error) {
    console.error("\n❌ Napaka:", error.response ? error.response.data : error.message);
  }
}

testAPI();