function StarsItem(KeyItem, KeyCategory){

    const Stars = db.ref("/restaurants/" + KeyRestaurant + "/categories/" + KeyCategory + "/menu/" + KeyItem + "/stars/"),
    ContainerStars = document.querySelector("#stars-container");

    Stars.on("value", (data) => {

        if(data.exists()){

            const AllStars = data.val(),
            KeysStars = Object.keys(AllStars).slice(0).reverse();

            ContainerStars.innerHTML = ""

            KeysStars.forEach(KeyStar => {
                const CustomerStar = AllStars[KeyStar].stars,
                nameCustomer = AllStars[KeyStar].name_customer,
                CustomerKey = AllStars[KeyStar].customerKey;

                let CountAllStars = 0,
                CountCustomersStars = 0;

                const Message = document.createElement("div"),
                Avatar = document.createElement("div"),
                Content = document.createElement("div"),
                Name = document.createElement("div"),
                Bubble = document.createElement("div"),
                Row = document.createElement("div"),
                Text = document.createElement("div");

                Message.classList.add("message", "message-received")
                Avatar.classList.add("message-avatar")
                Content.classList.add("message-content")
                Name.classList.add("message-name")
                Bubble.classList.add("message-bubble")
                Text.classList.add("message-text")
                Row.classList.add("row")

                if(CustomerKey != GetKeyCustomer){
                    Name.innerText = "Visitante sem nome"
                }else if(CustomerKey == GetKeyCustomer){
                    Name.innerText = "Você"
                }

                Avatar.innerHTML = `
                <span class="material-symbols-outlined">
                account_circle
                </span>
                `

                Text.appendChild(Row)
                Bubble.appendChild(Text)
                Content.appendChild(Name)
                Content.appendChild(Bubble)
                Message.appendChild(Avatar)
                Message.appendChild(Content)

                Row.classList.add("row")

                if(CustomerStar != undefined){

                  CountAllStars += Number(CustomerStar)

                  CountCustomersStars++

                }

                const CalculatedStars =  5 * CountCustomersStars / CountAllStars,
                CalculatedPercent = ( 100 / CalculatedStars )
    
                if(CalculatedPercent != undefined && CalculatedPercent != NaN){
                    ContainerStars.appendChild(Message)
                    CalculatorStart(CalculatedPercent, Row, CountCustomersStars, 2)
                }    
            })

        }else{

            ContainerStars.innerHTML = `<p style="text-align: center; position: relative; padding-top: 1rem"> Seja o primeiro a avaliar </p>`

        }
    })
}


async function CustomerAddStarRaiting(KeyCategory, KeyItem){

    const CountStars = 5,
    Category = KeyCategory,
    Item = KeyItem,
    ContainerStars = document.querySelector("#container-elements-stars"),
    StarsExists = db.ref("/restaurants/"+ KeyRestaurant + "/categories/" + KeyCategory + "/menu/" + KeyItem + "/stars").orderByChild('customerKey').equalTo(GetKeyCustomer);

    const ResolveStars = async () => {
        return new Promise((resolve, reject) => {
            StarsExists.once("value", (data) => {
                if(data.exists()){
                    const StarVal = data.val(),
                    StarKey = Object.keys(StarVal),
                    QuantityStars = StarVal[StarKey].stars;

                    resolve(QuantityStars)
                }else{
                    reject()
                }
            })
        })
    }

    ResolveStars().then((res) => {
        DefineStars(res)
    }).catch(() => {
        DefineStars(0)
    })

    const DefineStars = (Value) => {
        let NumberStar = 0;

        ContainerStars.innerHTML = ""
    
        for(let i = 0; i < CountStars; i++){
    
            const ElementStar = document.createElement("a");
    
            ElementStar.classList.add("col");

            NumberStar++

            if(NumberStar <= Value){
                ElementStar.innerHTML = `
                <span style="color: #f1c40f; font-size: 0.92rem" class="material-symbols-outlined">
                    star
                </span>
                `
            }else{
                ElementStar.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 0.92rem; color: white">
                    grade
                </span>
                `
            }

            ElementStar.setAttribute("onclick", "CustomerSetStart('"+NumberStar+"', '"+Category+"', '"+Item+"')")
    
            ContainerStars.appendChild(ElementStar)
    
        }  
    }

  }
  

  function CustomerSetStart(Number, KeyCategory, KeyItem){

    const AddStars = db.ref("/restaurants/"+ KeyRestaurant + "/categories/" + KeyCategory + "/menu/" + KeyItem + "/stars"),
    StarsExists = db.ref("/restaurants/"+ KeyRestaurant + "/categories/" + KeyCategory + "/menu/" + KeyItem + "/stars").orderByChild('customerKey').equalTo(GetKeyCustomer);

    StarsExists.once("value", (data) => {
        if(data.exists()){

            const DataReavaluate = data.val(),
            KeyReavaluate = Object.keys(DataReavaluate);

            const ReavaluateItem = db.ref("/restaurants/"+ KeyRestaurant + "/categories/" + KeyCategory + "/menu/" + KeyItem + "/stars/" + KeyReavaluate); 

            let array_reavaluate = {
                stars: Number
            }

            ReavaluateItem.update(array_reavaluate)
                .then(() => {

                    Toast.show(`Você reavaliou para ${Number} estrelas`, "toast-reavaluate", 1500);

                })
                .catch(() => {

                    Toast.show(`Houve um erro ao reavaliar`, "toast-reavaluate", 1500);

                })
                .finally(() => {
                    CustomerAddStarRaiting(KeyCategory, KeyItem)
                })

        }else{

            let array_add_star = {
                customerKey: GetKeyCustomer,
                stars: Number,
                name_customer: GetNameCustomer,
                key_category: KeyCategory,
                key_item: KeyItem
            }
        
            AddStars.push(array_add_star)
                .then(success => {
        
                    const toast = app.toast.create({
                        text: "Avaliação publicada",
                        closeTimeout: 2000
                    })
        
                    toast.open()
        
                })
                .catch(error => {
        
                    const toast = app.toast.create({
                        text: "Houve um erro ao inserir sua avaliação",
                        closeTimeout: 2000
                    })
        
                    toast.open()
        
                })
                .finally(() => {
                    CustomerAddStarRaiting(KeyCategory, KeyItem)
                    StepOpenComments()
                })

        }
    })

}
  