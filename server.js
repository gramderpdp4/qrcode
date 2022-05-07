const express = require("express");
const port = 5000;
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const adminFirebase = require("firebase-admin");
const functions = require("firebase-functions");
const accountkey = require("./firebasekey.json");
var moment = require('moment-timezone');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 })

app.use(bodyParser.urlencoded({
    extended:true
}));

app.disable("x-powered-by");
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(express.static(__dirname + '/www'));

adminFirebase.initializeApp({
    credential: adminFirebase.credential.cert(accountkey),
    databaseURL: "https://playumqrcode-default-rtdb.firebaseio.com"
  });
  
const db = adminFirebase.database()

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                              
      function generatePassword(length) {
        let resultPassword = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          resultPassword += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
  
        return resultPassword;
      } 
  
const user = db.ref("/restaurants/-N1Gm7qGEIR0zbiDwnm1/dice/menu"),
MomentCreated = moment().tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm:ss");

let Arr_user = {
    name: "Feijao tropeiro",
    price: 2.52,
    qtd: 25,
    code: generatePassword(12),
    category: "food"
}

//IDENTIFICA O RESTAURANTE PELO CÓDIGO, DO QR CODE

app.post("/IdentifiesRestaurant", async (req, res) => {
    const Code = req.body.code;
    
    if(Code){

        const Restaurant = db.ref("/restaurants/").orderByChild("code").equalTo(Code);

        Restaurant.once("value", (data) => {
            if(data.exists()){

                const Dice = data.val(),
                Keys = Object.keys(Dice);

                Keys.forEach(key => {
                    const Name = Dice[key].name,
                    Logo = Dice[key].logo,
                    ColorPrimary = Dice[key].color_primary,
                    ColorSecundary = Dice[key].color_secundary;

                    res.send({
                        name: Name,
                        logo: Logo,
                        color_secundary: ColorSecundary,
                        color_primary: ColorPrimary,
                        key_restaurant: key
                    })
                })

            }else{

            }
        })

    }
})

//IDENTIFICA O RESTAURANTE PELO CÓDIGO, DO QR CODE


app.listen(port, () => {
    console.log("Server running port " + port)
})