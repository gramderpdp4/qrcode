function GetComments(KeyItem){

    const Comments = db.ref("/restaurants/" + KeyRestaurant + "/comments/").orderByChild("key_item").equalTo(KeyItem),
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

            ContainerMessages.innerHTML = `<p style="text-align: center; position: relative; padding-top: 1rem"> Seja o primeiro a comentar </p>`

        }
    })
}

function AddComment(KeyItem){

    const FormComment = document.forms.formComment;

    const ButtonPostMessage = document.querySelector(".button-send-review");

    const Comments = db.ref("/restaurants/" + KeyRestaurant + "/comments/");

    ButtonPostMessage.addEventListener("click", (e) => {

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

        e.preventDefault()

        return false
    })
}


function StepOpenComments(){

    const ElementStep = document.querySelector(".sheet-scrolled"),
    ElementContent = ElementStep.querySelector(".page-content-comments"),
    ElementBlock = document.querySelector(".page-block-comments"),
    ElementsScroll = document.querySelectorAll(".scrolled-container"),
    ElementDisabledScroll = document.querySelector(".sheet-scrolled"),
    ElementList = document.querySelector(".list-comment ul form"),
    ElementNodeList = document.querySelector(".list-comment"),
    ElementNodeListStart =  document.querySelector(".list-stars"),
    ElementSheet = document.querySelector(".sheet-modal-comments"),
    ElementTxtInput = document.querySelector(".input_txt_comment");

    app.sheet.stepOpen(".sheet-modal-comments")
    ElementStep.style.height = "100%"
    ElementContent.style.height = "90%"
    ElementBlock.style.height = "100%"
    ElementNodeList.style.marginBottom = "2rem"
    ElementNodeListStart.style.marginBottom = "1.2rem"
    ElementTxtInput.removeAttribute("disabled")
    ElementTxtInput.removeAttribute("readonly")

    ElementDisabledScroll.classList.remove("sheet-modal-swipe-step")
}

function StepCloseComments(){

    const ElementStep = document.querySelector(".sheet-scrolled"),
    ElementContent = ElementStep.querySelector(".page-content-comments"),
    ElementBlock = document.querySelector(".page-block-comments"),
    ElementNodeList = document.querySelector(".list-comment"),
    ElementTxtInput = document.querySelector(".input_txt_comment"),
    ElementNodeListStart =  document.querySelector(".list-stars");

    ElementStep.style.height = "auto"
    ElementContent.style.height = "25vh"
    ElementBlock.style.height = "auto"
    ElementNodeList.style.marginBottom = "0.5rem"
    ElementNodeListStart.style.marginBottom = "0.5rem"

    ElementTxtInput.setAttribute("disabled", "disabled")
    ElementTxtInput.setAttribute("readonly", "readonly")

    const ButtonSendComment = document.querySelector(".button-send-comment");

    ElementStep.classList.add("sheet-modal-swipe-step")

    if(ButtonSendComment){

        ButtonSendComment.parentNode.parentNode.parentNode.remove()
        ElementTxtInput.setAttribute("readonly", "readonly")
        ElementTxtInput.setAttribute("disabled", "disabled")

    }

}
