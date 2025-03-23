

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser")
const path = require("path");

const recipesRoutes = require("./routes/recipes");
const usersRoutes = require("./routes/users");
const shoppingRoutes = require("./routes/shopping");
const indexRoute = require("./routes/index");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());


app.use("/", indexRoute);
app.use("/recipes", recipesRoutes);
app.use("/users", usersRoutes);
app.use("/shopping_list", shoppingRoutes);


const PORT = 3000;
app.listen(PORT, () => console.log(`Server teče na http://localhost:${PORT}`));


