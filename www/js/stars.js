function StarsItem(KeyItem, KeyCategory){

    const Stars = db.ref("/restaurants/" + KeyRestaurant + "/categories/" + KeyCategory + "/menu/" + KeyItem + "/stars/"),
    ContainerStars = document.querySelector("#stars-container");

    Stars.on("value", (data) => {

        if(data.exists()){

            const AllStars = data.val(),
            KeysStars = Object.keys(AllStars);

            KeysStars.forEach(KeyStar => {
                const CustomerStar = AllStars[KeyStar].stars,
                nameCustomer = 'Usuário';

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

                Name.innerText = nameCustomer
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