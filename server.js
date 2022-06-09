const express = require("express");
const port = 5000;
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const adminFirebase = require("firebase-admin");
const functions = require("firebase-functions");
const accountkey = require("./firebasekey.json");
var moment = require('moment-timezone');
const compress = require("compress-base64")
const { AES, enc } = require("crypto-js");
const fs = require("fs");
const Json = require("archiver/lib/plugins/json");
const stripe = require('stripe')('sk_test_51L8AeeKFCvGWaMbovT5OsuZZYvdtKb3plAXHL0k9DSNBd5hJ9za2tBAUZ8bYZERegetJeIyuJD6gb5nlomQMIaXu00l647o0VG');


//hgello

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 })

 
function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end()
    }
    next();
  }

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
    databaseURL: "https://cardapio-digital-f32c5-default-rtdb.firebaseio.com"
});
  
const db = adminFirebase.database()

const EncryptedPassword = "PlayUmEncryptedAes256And20220521Password",
EncryptedEmail = "PlayUmEncryptedAes256And2114"

//CRIA SESSÃO DE PAGAMENTO

//CRIA SESSÃO DE PAGAMENTO

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

//CRIA NOVO CLIENTE

app.post("/CreateNewUser", async (req, res) => {
    const KeyRestaurant = req.body.key_restaurant;

    if(KeyRestaurant.length > 5){
    
        const SelectRestaurant = db.ref("/restaurants/" + KeyRestaurant);

        SelectRestaurant.once("value", (data) => {
            if(data.exists()){

                CreateUserRandom()
                .then(ResultUser => {

                  const InsertedUser = db.ref("/restaurants/" + KeyRestaurant + "/customers/")

                   let Arr_insert_user = {
                       password: ResultUser[0].password,
                       name: ResultUser[1].name,
                       shareCart: true,
                       secret_code: ResultUser[2].secret_code,
                       email: `${ResultUser[1].name.toString().replace(" ", "")}@gmail.com`
                   }

                   InsertedUser.push(Arr_insert_user)
                    .then(SuccessCustomerCreate => {

                        const GetCustomerCreate = db.ref("/restaurants/" + KeyRestaurant + "/customers/" + SuccessCustomerCreate.key);

                        GetCustomerCreate.once("value", (UserData) => {
                            if(UserData.exists()){

                                const CustomerName = UserData.val().name,
                                CustomerPassword = UserData.val().password,
                                CustomerSecretCode = UserData.val().secret_code,
                                CustomerEmail = UserData.val().email;

                                let Array_user_send_client = {
                                    name: CustomerName,
                                    passwordEncrypted: AES.encrypt(CustomerPassword, EncryptedPassword).toString(),
                                    password: ResultUser[0].password,
                                    secret: CustomerSecretCode,
                                    emailEncrypted: AES.encrypt(CustomerEmail, EncryptedEmail).toString(),
                                    email: `${ResultUser[1].name.toString().replace(" ", "")}@gmail.com`
                                }

                                res.send({
                                    data: Array_user_send_client
                                })

                            }else{

                                res.send({
                                    error_code: 4932,
                                    message: "Falha ao pegar usuário criado"
                                })

                            }
                        })

                    })
                    .catch(ErrorCustomerCreate => {

                        console.log("Error Customer Create")

                    })

                })

            }else
            {
                res.send({
                    message: "Falha ao selecionar restaurante",
                    error_code: 3921
                })
            }
        })

    }

    async function CreateUserRandom(){

        const Characteres ='0123456789',
        PasswordLenght = 6;

        let Arr_details_user = []

        async function Generate(length) {
            let passwordUser = '';
            const charactersLength = Characteres.length;
            for ( let i = 0; i < length; i++ ) {
                passwordUser += Characteres.charAt(Math.floor(Math.random() * charactersLength));
            }
        
            return passwordUser;
        }

        
        Generate(PasswordLenght)
        .then(ResultPassword => {
            Arr_details_user.push({
                password: ResultPassword.toString().replaceAll(" ", "")
            })
        })

        Generate(4)
        .then(ResultName => {
            Arr_details_user.push({
                name: "Visitante " + ResultName.toString().replaceAll(" ", "")
            })
        })

        Generate(12)
        .then(ResultSecretCode => {
            Arr_details_user.push({
                secret_code: ResultSecretCode.toString().replaceAll(" ", "")
            })
        })
  

        return Arr_details_user

    }

})

//CRIA NOVO CLIENTE

//LOGA CLIENTE

app.post("/LoginUser", async (req, res) => {

    const Email = req.body.email,
    Password = req.body.password,
    Restaurant = req.body.restaurant,
    DecryptedEmail = AES.decrypt(Email, EncryptedEmail),
    DecryptedPassword = AES.decrypt(Password, EncryptedPassword),
    DecryptedEmailUTF = DecryptedEmail.toString(enc.Utf8),
    DecryptedPasswordUTF = DecryptedPassword.toString(enc.Utf8);

    const LoginCustomer = db.ref("/restaurants/" + Restaurant + "/customers/").orderByChild("email").equalTo(DecryptedEmailUTF);

    LoginCustomer.once("value", (data) => {
        if(data.exists()){

           const Data = data.val(),
           Key = Object.keys(Data),
           Name = Data[Key].name,
           Email = Data[Key].email,
           ShareCart = Data[Key].shareCart,
           Password = Data[Key].password;

           res.send({
               name: Name,
               password: Password,
               email: Email,
               shareCart: ShareCart,
               CustomerKey: Key
           })

        }else
        {

        }
    })

})

//LOGA CLIENTE

//PAGAMENTO 

app.post("/create-payment-intent", async (req, res) => {
    const Amount = Number(req.body.amount).toFixed(2).replace(/[^a-z0-9]/gi,'');

    stripe.paymentIntents.create({
      amount: Amount,
      currency: "brl",
      metadata: {
          integration_check: 'accept_a_payment',
          restaurant: req.body.restaurant,
          customerKey: req.body.customerKey,
          customerName: req.body.customerName
        },
    })
    .then(success => {
        res.send({
            clientSecret: success.client_secret,
          })
    })
    .catch(error => {
        res.send({
            message: "error"
        })
    })
  });

//PAGAMENTO


app.listen(port, () => {
    console.log("Server running port " + port)
})