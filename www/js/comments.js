function GetComments(){

    const Comments = db.ref("/restaurants/" + KeyRestaurant + "/comments/"),
    ContainerMessages = document.querySelector("#messages-container");

    Comments.on("value", (data) => {

        if(data.exists()){

            const Data = data.val(),
            Keys = Object.keys(Data);

            ContainerMessages.innerHTML = ""

            Keys.forEach(Key => {

                const name = Data[Key].name_customer,
                txt = Data[Key].message;

                const Message = document.createElement("div"),
                Avatar = document.createElement("div"),
                Content = document.createElement("div"),
                Name = document.createElement("div"),
                Bubble = document.createElement("div"),
                Text = document.createElement("div");

                Message.classList.add("message", "message-received")
                Avatar.classList.add("message-avatar")
                Content.classList.add("message-content")
                Name.classList.add("message-name")
                Bubble.classList.add("message-bubble")
                Text.classList.add("message-text")

                Name.innerText = name
                Text.innerText = txt
                Avatar.innerHTML = `
                <span class="material-symbols-outlined">
                account_circle
                </span>
                `

                Bubble.appendChild(Text)
                Content.appendChild(Name)
                Content.appendChild(Bubble)
                Message.appendChild(Avatar)
                Message.appendChild(Content)

                ContainerMessages.appendChild(Message)

            })


        }else{


        }

    })



}

function AddComment(KeyItem){

    const FormComment = document.forms.formComment;

    const Comments = db.ref("/restaurants/" + KeyRestaurant + "/comments/");

    FormComment.addEventListener("submit", (e) => {

        const TxtComment = FormComment.txt.value;

        if(TxtComment.length < 3){

            const toast = app.toast.create({
                text: "Seu comentário está muito curto",
                closeTimeout: 2200,
                cssClass: 'toast-comment'
            })

            toast.open()

        }else{

            console.log(GetKeyCustomer)

            let array_comment = {
                message: TxtComment,
                key_customer: GetKeyCustomer,
                name_customer: GetNameCustomer,
                key_item: KeyItem
            }

            Comments.push(array_comment)
                .then(success => {

                    const toast = app.toast.create({
                        text: "Comentário publicado",
                        closeTimeout: 2200,
                        cssClass: 'toast-comment'
                    })
        
                    toast.open()

                })
                .catch(error => {

                    const toast = app.toast.create({
                        text: "Houve um erro ao publicar seu comentário",
                        closeTimeout: 2200,
                        cssClass: 'toast-comment'
                    })
        
                    toast.open()

                })


        }
        

        e.preventDefault();

    })

}