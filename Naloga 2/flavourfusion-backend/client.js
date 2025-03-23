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

// Seedanje baze 
let recipes = [
  {
    name: "Špageti Carbonara",
    ingredients: "špageti, jajca, panceta, sir, poper",
    instructions: "Skuhaj špagete, zmešaj z jajci in panceto.",
    dietary: "none"
  },
  {
    name: "Piščančji curry",
    ingredients: "piščanec, kokosovo mleko, curry, čebula, česen, ingver",
    instructions: "Prepraži čebulo, dodaj česen in ingver, nato piščanca in curry. Prelij s kokosovim mlekom in kuhaj 20 minut.",
    dietary: "none"
  },
  {
    name: "Veganska bučna juha",
    ingredients: "buča, korenje, krompir, čebula, česen, kokosovo mleko",
    instructions: "Skuhaj zelenjavo, zmiksaj v gladko juho, dodaj kokosovo mleko in začimbe.",
    dietary: "vegan"
  },
  {
    name: "Testenine s pestom",
    ingredients: "testenine, bazilika, pinjole, olivno olje, parmezan, česen",
    instructions: "Skuhaj testenine, zmešaj sestavine za pesto in jih prelij čez testenine.",
    dietary: "vegetarian"
  },
  {
    name: "Grška solata",
    ingredients: "paradižnik, kumara, čebula, feta sir, olive, olivno olje",
    instructions: "Vse sestavine nareži in zmešaj s prelivom iz olivnega olja in limone.",
    dietary: "vegetarian"
  },
  {
    name: "Pečen losos z limono",
    ingredients: "losos, limona, olivno olje, česen, sol, poper",
    instructions: "Lososa premaži z oljem, limoninim sokom in česnom, peci 15 minut na 200°C.",
    dietary: "pescatarian"
  },
  {
    name: "Fižolova enolončnica",
    ingredients: "fižol, paradižnik, čebula, česen, korenje, začimbe",
    instructions: "Skuhaj fižol, dodaj ostale sestavine in kuhaj 40 minut.",
    dietary: "vegan"
  },
  {
    name: "Pica Margherita",
    ingredients: "testo za pico, paradižnikova omaka, mozzarella, bazilika",
    instructions: "Testo premaži z omako, dodaj mocarelo in peci na 220°C 15 minut.",
    dietary: "vegetarian"
  },
  {
    name: "Rižota s šparglji",
    ingredients: "riž, šparglji, čebula, belo vino, parmezan, maslo",
    instructions: "Prepraži čebulo, dodaj riž, zalij z vinom in kuhaj z jušno osnovo. Dodaj šparglje in maslo.",
    dietary: "vegetarian"
  },
  {
    name: "Ocvrti piščanec",
    ingredients: "piščančje meso, moka, jajca, drobtine, sol, poper",
    instructions: "Piščanca povaljaj v moki, jajcu in drobtinah, ocvri do zlato rjave barve.",
    dietary: "none"
  },
  {
    name: "Chili con carne",
    ingredients: "mleto meso, fižol, paradižnik, čebula, česen, čili",
    instructions: "Prepraži čebulo in meso, dodaj paradižnik in fižol, kuhaj 30 minut.",
    dietary: "none"
  }
];


// Testni odjemalec
async function testAPI() {

  try {


    // Resetiramo bazo
    await resetDatabase();


    // Dodamo recepte
    for (let recipe of recipes) {
      let res = await axios.post(`${API_URL}/recipes`, recipe);
      console.log(`✅ Dodan recept: ${recipe.name}`, res.data);
    }


    console.log("\n🔹 Pridobivanje vseh receptov...");
    res = await axios.get(`${API_URL}/recipes`);
    console.log("📋 Seznam receptov:", res.data);

    console.log("\--------------------------------------------------------------------------.");
    // Iskanje po sestavinah 
    console.log("\n🔎 Iskanje receptov po sestavinah...");
    const searchIngredients = ["kumara", "sir", "jajce"];
    
    for (const ingredient of searchIngredients) {
      console.log(`\n➡️ Iskanje receptov, ki vsebujejo: ${ingredient}`);
      res = await axios.get(`${API_URL}/recipes/search?ingredients=${ingredient}`);
      console.log("🔍 Rezultati iskanja:", res.data.length ? res.data : "Ni zadetkov");
    }

    console.log("\--------------------------------------------------------------------------.");
    // Iskanje po ID-ju
    console.log("\n🔹 Pridobivanje recepta po ID-ju...")
    res = await axios.get(`${API_URL}/recipes/1`);
    console.log("📜 Recept:", res.data);


    console.log("\--------------------------------------------------------------------------.");
    // Nakupovalni seznam
    console.log("\n🛒 Dodajanje sestavine v nakupovalni seznam...");
    res = await axios.post(`${API_URL}/shopping_list`, { item: "Parmezan" });
    console.log("✅ Dodano:", res.data);
    const shoppingItem = res.data; 


    console.log("\--------------------------------------------------------------------------.");
    // Pridobivanje nakupovalnega seznama
    console.log("\n🛍️ Pridobivanje nakupovalnega seznama...");
    res = await axios.get(`${API_URL}/shopping_list`);
    console.log("📝 Nakupovalni seznam:", res.data);

  
    console.log("\--------------------------------------------------------------------------.");
    // Posodabljanje nakupovalnega seznama
    console.log("\n📝 Posodabljanje nakupovalnega seznama...");
    res = await axios.put(`${API_URL}/shopping_list/${shoppingItem.id}`, { item: "Ribani sir" });
    console.log("✅ Posodobljeno:", res.data);


    console.log("\--------------------------------------------------------------------------.");
    // Pridobivanje posodobljenega nakupovalnega seznama
    console.log("\n🛍️ Pridobivanje posodobljenega nakupovalnega seznama...");
    res = await axios.get(`${API_URL}/shopping_list`);
    console.log("📋 Posodobljen seznam:", res.data);


    console.log("\--------------------------------------------------------------------------.");
    // Brisanje sestavine iz nakupovalnega seznama
    console.log("\n🗑️ Brisanje sestavine iz nakupovalnega seznama...");
    res = await axios.delete(`${API_URL}/shopping_list/${shoppingItem.id}`);
    console.log("✅ Izbrisano:", shoppingItem.id);


    console.log("\--------------------------------------------------------------------------.");
    // Končno preverjanje nakupovalnega seznama
    console.log("\n🛍️ Končno preverjanje nakupovalnega seznama...");
    res = await axios.get(`${API_URL}/shopping_list`);
    console.log("📋 Končni seznam:", res.data);


    console.log("\--------------------------------------------------------------------------.");
    // Registracija uporabnika
    const user = { username: "testuser", password: "testpass" };
    console.log("\n👤 Registracija novega uporabnika...");
    res = await axios.post(`${API_URL}/users/register`, user);
    console.log("✅ Registracija uspešna:", res.data);

    console.log("\--------------------------------------------------------------------------.");
    // Prijava uporabnika
    console.log("\n🔑 Prijava uporabnika...");
    res = await axios.post(`${API_URL}/users/login`, user);
    console.log("✅ Prijava uspešna:", res.data);


  } catch (error) {
    console.error("\n❌ Napaka:", error.response ? error.response.data : error.message);
  }
}

testAPI();