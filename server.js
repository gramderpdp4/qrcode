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
                                CustomerEmail = UserData.val().email,
                                CustomerShareCart = UserData.val().shareCart;

                                let Array_user_send_client = {
                                    name: CustomerName,
                                    passwordEncrypted: AES.encrypt(CustomerPassword, EncryptedPassword).toString(),
                                    password: ResultUser[0].password,
                                    secret: CustomerSecretCode,
                                    shareCart: CustomerShareCart,
                                    customerKey: SuccessCustomerCreate.key,
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
app.post("/Pay", async (req, res) => {
    const customerName = req.body.customerName,
    customerKey = req.body.customerKey,
    sourceID = req.body.sourceID,
    keyTable = req.body.keyTable,
    paymentType = req.body.paymentType,
    PricePay = Number(req.body.price),
    restaurant = req.body.restaurant;

    const PriceDecimals = PricePay.toFixed(2),
    FormattedPrice = PriceDecimals.toString().replace(".", "");

    stripe.customers.create({
        name: customerName,
        source: sourceID,
        metadata: {
            customerKey: customerKey,
            customerName: customerName,
            restaurantKey: restaurant
        }
    })
    .then(success => {
        stripe.paymentIntents.create({
            amount: FormattedPrice,
            currency: 'brl',
            customer: success.id,
            confirm: true,
            source: success.default_source
        })
        .then(paymentSuccesss => {

            const TimeStamp = new Date().getTime();
            const MomentOrder = moment().tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm:ss");
            const CustomerSave = db.ref("/restaurants/" + restaurant + "/orders/");

            let array_save_order_customer = {
                nameCustomer: customerName,
                created_at: MomentOrder,
                keyCustomer: customerKey,
                source: paymentSuccesss.source,
                customer: paymentSuccesss.customer,
                paymentIntent: paymentSuccesss.id,
                amountReceived: paymentSuccesss.amount_received,
                clientSecretStripe: paymentSuccesss.client_secret,
                keyTable: keyTable,
                status: paymentSuccesss.status,
                timestamp: TimeStamp,
                restaurant: restaurant,
                pricePay: PricePay,
                paymentType: paymentType
            }

            if(paymentType == "OnlyMyItens"){

                const OnlyItensPayment = db.ref("/restaurants/" + restaurant + "/dice/tables/" + keyTable + "/itens/").orderByChild("customer_key").equalTo(customerKey);
                CustomerSave.push(array_save_order_customer)
                    .then((SaveOrderCustomer) => {

                        res.send({
                            status: 'success'
                        })

                        OnlyItensPayment.once("value", (DataItens) => {
                            const OnlyItens = DataItens.val(),
                            OnlyKeys = Object.keys(OnlyItens);

                            const SaveItensOrder = db.ref("/restaurants/" + restaurant + "/orders/" + SaveOrderCustomer.key + "/itens/");

                            OnlyKeys.forEach(OnlyKey => {

                                let array_save_item = {
                                    name: OnlyItens[OnlyKey].name,
                                    quantity: OnlyItens[OnlyKey].quantity,
                                    price: OnlyItens[OnlyKey].price,
                                    share: OnlyItens[OnlyKey].share,
                                    customerKey: OnlyItens[OnlyKey].customer_key,
                                    customerName: OnlyItens[OnlyKey].customer_name,
                                    itemKey: OnlyItens[OnlyKey].key_item
                                }

                                SaveItensOrder.push(array_save_item)
                                    .then(() => {

                                        const RemoveOnlyItem = db.ref("/restaurants/" + restaurant + "/dice/tables/" + keyTable + "/itens/" + OnlyKey);

                                        RemoveOnlyItem.remove()
                                            .then(() => {
                                                console.log("Item Saved and Removed", OnlyItens[OnlyKey].name)
                                            })
                                            .catch(() => {
                                                console.log("Erro saved and removed")
                                            })


                                    })
                                    .catch(() => {
                                        console.log("Houve um error ao salvar itens do pedido")
                                    })
                                    
                            })
                        })

                    })
                    .catch((ErrorOrderCustomer) => {

                    })
            }else if(paymentType == "PayAllItens"){

                const PaymentAllItens = db.ref("/restaurants/" + restaurant + "/dice/tables/" + keyTable + "/itens/");

                CustomerSave.push(array_save_order_customer)
                    .then((SaveOrderCustomer) => {

                        res.send({
                            status: 'success'
                        })

                        PaymentAllItens.once("value", (DataAllItens) => {
                            const AllItens = DataAllItens.val(),
                            Allkeys = Object.keys(AllItens);

                            const SaveItensOrder = db.ref("/restaurants/" + restaurant + "/orders/" + SaveOrderCustomer.key + "/itens/");

                            Allkeys.forEach(AllKey => {
                                const ItemShare = AllItens[AllKey].share;
                                if(ItemShare == true){
                                    let array_save_item = {
                                        name: AllItens[AllKey].name,
                                        quantity: AllItens[AllKey].quantity,
                                        price: AllItens[AllKey].price,
                                        share: AllItens[AllKey].share,
                                        customerKey: AllItens[AllKey].customer_key,
                                        customerName: AllItens[AllKey].customer_name,
                                        itemKey: AllItens[AllKey].key_item
                                    }
    
                                    SaveItensOrder.push(array_save_item)
                                        .then(() => {
    
                                            const RemoveAllItem = db.ref("/restaurants/" + restaurant + "/dice/tables/" + keyTable + "/itens/" + AllKey);
    
                                            RemoveAllItem.remove()
                                                .then(() => {
                                                    console.log("Item Saved and Removed", AllItens[AllKey].name)
                                                })
                                                .catch(() => {
                                                    console.log("Erro saved and removed")
                                                })
    
    
                                        })
                                        .catch(() => {
                                            console.log("Houve um error ao salvar itens do pedido")
                                        })
                                }   
                            })
                        })
                    })
                    .catch((ErrorOrderCustomer) => {

                    })
            }
        })
        .catch(paymentError => {
            res.send({
                status: 'error'
            })
        })
    })
    .catch(error => {
        console.log(error)
    })
})
//PAGAMENTO


app.listen(port, () => {
    console.log("Server running port " + port)
})