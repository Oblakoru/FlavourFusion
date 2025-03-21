
const API_URL = "http://localhost:3000";
const axios = require("axios");

// Testni odjemalec
async function testAPI() {
    try {
      console.log("Dodajanje recepta...");
      let res = await axios.post(`${API_URL}/recipes`, {
        name: "Špageti Carbonara",
        ingredients: "Špageti, jajca, panceta, sir, poper",
        instructions: "Skuhaj špagete, zmešaj z jajci in panceto.",
        dietary: "none"
      });
      console.log("Dodano:", res.data);
  
      console.log("Pridobivanje receptov...");
      res = await axios.get(`${API_URL}/recipes`);
      console.log(res.data);
  
      console.log("Iskanje receptov po sestavinah (Špageti)...");
      res = await axios.get(`${API_URL}/recipes/search?ingredients=Špageti`);
      console.log(res.data);
  
      console.log("Dodajanje sestavine v nakupovalni seznam...");
      res = await axios.post(`${API_URL}/shopping_list`, { item: "Parmezan" });
      console.log("Dodano:", res.data);
  
      console.log("Pridobivanje nakupovalnega seznama...");
      res = await axios.get(`${API_URL}/shopping_list`);
      console.log(res.data);
  
      console.log("Registracija novega uporabnika...");
      res = await axios.post(`${API_URL}/users/register`, {
        username: "testuser",
        password: "testpass"
      });
      console.log(res.data);
    } catch (error) {
      console.error("Napaka:", error.response ? error.response.data : error.message);
    }
  }
  
  testAPI();