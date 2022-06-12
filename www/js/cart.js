
function CartItensEvents(){
    const RefCart = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/");
    
    RefCart.on("child_changed", (data) => {
        ReturnCartItens()
    })

    RefCart.on("child_removed", (data) => {
        console.log("Remove")
        ReturnCartItens()
    })
}

function CartItensShare(){
    const Ref = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/"),
    Container = document.querySelector("#container-cart");

    Ref.once("value", (data) => {
        if(data.exists()){

            let CalculatesTotalPrice = 0,
            CreateFinished = 0;

            const DataItens = data.val(),
            ItensKeys = Object.keys(DataItens);

            let CountItensShare = 0;

           if(Container){
                Container.innerHTML = ""
           }

            ItensKeys.forEach((Key, Indice) => {
                const name = DataItens[Key].name,
                price = DataItens[Key].price,
                CustomerKey = DataItens[Key].customer_key,
                quantity = DataItens[Key].quantity,
                image = DataItens[Key].image,
                itemShare = DataItens[Key].share,
                CalculateUnitValue = Number(quantity) * parseFloat(price);

                    if(itemShare == true || CustomerKey == GetKeyCustomer){
                        CalculatesTotalPrice += CalculateUnitValue

                        CountItensShare++

                        const Li = document.createElement("li"),
                        Link = document.createElement("div"),
                        Media = document.createElement("div"),
                        Inner = document.createElement("div"),
                        TitleRow = document.createElement("div"),
                        Title = document.createElement("div"),
                        After = document.createElement("div"),
                        Row = document.createElement("div"),
                        Col80 = document.createElement("div"),
                        Col5 = document.createElement("div"),
                        Deleted = document.createElement("button"),
                        Subtitle = document.createElement("div"),
                        Stepper = document.createElement("div"),
                        StepperMinus = document.createElement("div"),
                        StepperPlus = document.createElement("div"),
                        StepperWrap = document.createElement("div"),
                        StepperInput = document.createElement("input"),
                        Swipeout = document.createElement("div"),
                        SwipeoutButton = document.createElement("a");
    
                        Stepper.id = "Stepper" + Key
                        Stepper.classList.add("stepper", "stepper-fill")
                        StepperMinus.classList.add("stepper-button-minus")
                        StepperPlus.classList.add("stepper-button-plus")
                        StepperWrap.classList.add("stepper-input-wrap")
    
                        StepperInput.setAttribute("min", "0")
                        StepperInput.setAttribute("step", "1")
                        StepperInput.setAttribute("value", quantity)
                        StepperInput.setAttribute("max", "1000")
    
                        Stepper.setAttribute("data-wraps", "true")
                        Stepper.setAttribute("data-autorepeat", "true")
                        Stepper.setAttribute("data-autorepeat-dynamic", "true")
                        Stepper.setAttribute("data-decimal-point", "2")
                        Stepper.setAttribute("data-manual-input-mode", "true")
    
                        StepperWrap.innerHTML = `
                        <input type="text" value="${quantity}" min="0" max="1000" step="1" onchange="UpdatePriceCartItem('${Key}', '${name}', this)"/>
                        `
                        Stepper.appendChild(StepperMinus)
                        Stepper.appendChild(StepperWrap)
                        Stepper.appendChild(StepperPlus)
    
                        Deleted.innerHTML = `
                        <a onclick="DeleteItemCart('${Key}', '${name}')">
                            <span style="color: #d63031" class="material-symbols-outlined">
                            cancel
                            </span>
                        <a>
                        `
                    
                        Media.innerHTML = `<img src="${image}" style="width: 80px; height: 80px; border-radius: 12px"/>`
    
                        Li.classList.add("swipeout")
                        Link.classList.add("item-content", "swipeout-content")
                        Media.classList.add("item-media")
                        Inner.classList.add("item-inner")
                        TitleRow.classList.add("item-title-row")
                        Title.classList.add("item-title")
                        After.classList.add("item-after")
                        Row.classList.add("row")
                        Col80.classList.add("col-80")
                        Col5.classList.add("col-20")
                        Subtitle.classList.add("item-subtitle")
                        Deleted.classList.add("button")
                        Swipeout.classList.add("swipeout-actions-left")
                        SwipeoutButton.classList.add("swipeout-overswipe")
    
                        Title.innerText = name
                        Col80.innerText = "R$ " + CalculateUnitValue.toFixed(2)
    
                        Li.style.borderBottom = "1px solid #303030"
                        Li.id = Key
                        Deleted.style.alignItems = "normal"
    
                        Swipeout.appendChild(SwipeoutButton)
                        Col5.appendChild(Deleted)
                        Row.appendChild(Col80)
                        Row.appendChild(Col5)
                        After.appendChild(Row)
                        TitleRow.appendChild(Title)
                        TitleRow.appendChild(After)
                        Subtitle.appendChild(Stepper)
                        Inner.appendChild(TitleRow)
                        Inner.appendChild(Subtitle)
                        Link.appendChild(Media)
                        Link.appendChild(Inner)
                        Link.appendChild(Swipeout)
                        Li.appendChild(Link)
                        
                        Container.appendChild(Li)
    
                        const stepperTime = app.stepper.create({
                            el: '#Stepper'+Key,
                        })
    
                        CreateContainerFinished(1, CalculatesTotalPrice)
                    }

                    if(ItensKeys.length - 1 == Indice){
                        if(CountItensShare == 0){
                            CreateContainerFinished(2)
                            Container.innerHTML = ""
                            Container.innerHTML = `<p style="text-align: center">Seu carrinho está vazio</p>`
                        }
                    }
            })

            
            $(".swipeout").on("swipeout:opened", function(){
                const ElementSwipeout = $(this),
                SwipeoutId = ElementSwipeout.attr("id");

                const ItemRemove = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/" + SwipeoutId);

                ElementSwipeout.addClass("slit-out-horizontal")

                setTimeout(() => {
                ItemRemove.remove()
                    .then(Success => {
                        const ToastRemoved = app.toast.create({
                            text: "Removido",
                            closeTimeout: 2000
                        })

                        ToastRemoved.open()
                    })
                }, 500);
            })

        }else{

            CreateContainerFinished(2)

            Container.innerHTML = ""

            Container.innerHTML = `<p style="text-align: center">Seu carrinho está vazio</p>`
        }
    })
}

function CartItensNoShared(){
    const Ref = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/").orderByChild("customer_key").equalTo(GetKeyCustomer),
    Container = document.querySelector("#container-cart");

    Ref.on("value", (data) => {
        if(data.exists()){

            let CalculatesTotalPrice = 0,
            CreateFinished = 0;

            const DataItens = data.val(),
            ItensKeys = Object.keys(DataItens);

            if(Container){
                Container.innerHTML = ""
            }

            ItensKeys.forEach((Key, Indice) => {
                const name = DataItens[Key].name,
                price = DataItens[Key].price,
                CustomerKey = DataItens[Key].customer_key,
                quantity = DataItens[Key].quantity,
                image = DataItens[Key].image,
                itemShare = DataItens[Key].share,
                CalculateUnitValue = Number(quantity) * parseFloat(price);

                    if(CustomerKey == GetKeyCustomer){
                        CalculatesTotalPrice += CalculateUnitValue

                        const Li = document.createElement("li"),
                        Link = document.createElement("div"),
                        Media = document.createElement("div"),
                        Inner = document.createElement("div"),
                        TitleRow = document.createElement("div"),
                        Title = document.createElement("div"),
                        After = document.createElement("div"),
                        Row = document.createElement("div"),
                        Col80 = document.createElement("div"),
                        Col5 = document.createElement("div"),
                        Deleted = document.createElement("button"),
                        Subtitle = document.createElement("div"),
                        Stepper = document.createElement("div"),
                        StepperMinus = document.createElement("div"),
                        StepperPlus = document.createElement("div"),
                        StepperWrap = document.createElement("div"),
                        StepperInput = document.createElement("input"),
                        Swipeout = document.createElement("div"),
                        SwipeoutButton = document.createElement("a");
    
                        Stepper.id = "Stepper" + Key
                        Stepper.classList.add("stepper", "stepper-fill")
                        StepperMinus.classList.add("stepper-button-minus")
                        StepperPlus.classList.add("stepper-button-plus")
                        StepperWrap.classList.add("stepper-input-wrap")
    
                        StepperInput.setAttribute("min", "0")
                        StepperInput.setAttribute("step", "1")
                        StepperInput.setAttribute("value", quantity)
                        StepperInput.setAttribute("max", "1000")
    
                        Stepper.setAttribute("data-wraps", "true")
                        Stepper.setAttribute("data-autorepeat", "true")
                        Stepper.setAttribute("data-autorepeat-dynamic", "true")
                        Stepper.setAttribute("data-decimal-point", "2")
                        Stepper.setAttribute("data-manual-input-mode", "true")
    
                        StepperWrap.innerHTML = `
                        <input type="text" value="${quantity}" min="0" max="1000" step="1" onchange="UpdatePriceCartItem('${Key}', '${name}', this)"/>
                        `
                        Stepper.appendChild(StepperMinus)
                        Stepper.appendChild(StepperWrap)
                        Stepper.appendChild(StepperPlus)
    
                        Deleted.innerHTML = `
                        <a onclick="DeleteItemCart('${Key}', '${name}')">
                            <span style="color: #d63031" class="material-symbols-outlined">
                            cancel
                            </span>
                        <a>
                        `
                    
                        Media.innerHTML = `<img src="${image}" style="width: 80px; height: 80px; border-radius: 12px"/>`
    
                        Li.classList.add("swipeout")
                        Link.classList.add("item-content", "swipeout-content")
                        Media.classList.add("item-media")
                        Inner.classList.add("item-inner")
                        TitleRow.classList.add("item-title-row")
                        Title.classList.add("item-title")
                        After.classList.add("item-after")
                        Row.classList.add("row")
                        Col80.classList.add("col-80")
                        Col5.classList.add("col-20")
                        Subtitle.classList.add("item-subtitle")
                        Deleted.classList.add("button")
                        Swipeout.classList.add("swipeout-actions-left")
                        SwipeoutButton.classList.add("swipeout-overswipe")
    
                        Title.innerText = name
                        Col80.innerText = "R$ " + CalculateUnitValue.toFixed(2)
    
                        Li.style.borderBottom = "1px solid #303030"
                        Li.id = Key
                        Deleted.style.alignItems = "normal"
    
                        Swipeout.appendChild(SwipeoutButton)
                        Col5.appendChild(Deleted)
                        Row.appendChild(Col80)
                        Row.appendChild(Col5)
                        After.appendChild(Row)
                        TitleRow.appendChild(Title)
                        TitleRow.appendChild(After)
                        Subtitle.appendChild(Stepper)
                        Inner.appendChild(TitleRow)
                        Inner.appendChild(Subtitle)
                        Link.appendChild(Media)
                        Link.appendChild(Inner)
                        Link.appendChild(Swipeout)
                        Li.appendChild(Link)
                        
                        Container.appendChild(Li)
    
                        const stepperTime = app.stepper.create({
                            el: '#Stepper'+Key,
                        })
    
                        CreateContainerFinished(1, CalculatesTotalPrice)
                    }
            })

            
            $(".swipeout").on("swipeout:opened", function(){
                const ElementSwipeout = $(this),
                SwipeoutId = ElementSwipeout.attr("id");

                const ItemRemove = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/" + SwipeoutId);

                ElementSwipeout.addClass("slit-out-horizontal")

                setTimeout(() => {
                ItemRemove.remove()
                    .then(Success => {
                        const ToastRemoved = app.toast.create({
                            text: "Removido",
                            closeTimeout: 2000
                        })

                        ToastRemoved.open()
                    })
                }, 500);
            })

        }else{

            CreateContainerFinished(2)

            Container.innerHTML = ""

            Container.innerHTML = `<p style="text-align: center">Seu carrinho está vazio</p>`

        }
    })
}


function UpdatePriceCartItem(KeyItem, Name, This){

        Preloader.show(".page-cart .page-content", "blue")

        const Table = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/" + KeyItem),
        Val = This.value;

        if(Val == 0){

            const DialogRemoveItem = app.dialog.create({
                title: `Deseja remover ${Name}?`,
                text: `
                <div class="toolbar toolbar-bottom">
                    <div class="toolbar-inner">
                        <a class="link cancel-remove">Cancelar</a>
                        <a class="link remove-item">Remover</a>
                    </div>
                </div>
                `,
                on: {
                    opened: function(){
                        const ButtonCancel = document.querySelector(".cancel-remove"),
                        ButtonRemove = document.querySelector(".remove-item");

                        ButtonCancel.addEventListener("click", (e) => {

                            This.value = 1

                            DialogRemoveItem.close()

                        })

                        ButtonRemove.addEventListener("click", (e) => {

                            Table.remove()
                            .then(SuccessRemove => {

                                const ToastRemove = app.toast.create({
                                    text: "Removido",
                                    closeTimeout: 2000
                                })

                                ToastRemove.open()

                                DialogRemoveItem.close()

                            })

                        })

                    }
                }
              }).open();

        }else{

            let Array_update_price = {
                quantity: Val
            }
    
            Table.update(Array_update_price)
            .then(success => {
                Preloader.close(".page-cart .page-content")
            })
            .catch(error => {
                Preloader.close(".page-cart .page-content")
            })

        }
}

function DeleteItemCart(KeyItem, Name){

    const Table = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/" + KeyItem);

    const DialogRemoveItem = app.dialog.create({
        title: `Deseja remover ${Name}?`,
        text: `
        <div class="toolbar toolbar-bottom">
            <div class="toolbar-inner">
                <a class="link cancel-remove">Cancelar</a>
                <a class="link remove-item">Remover</a>
            </div>
        </div>
        `,
        on: {
            opened: function(){
                const ButtonCancel = document.querySelector(".cancel-remove"),
                ButtonRemove = document.querySelector(".remove-item");

                ButtonCancel.addEventListener("click", (e) => {

                    DialogRemoveItem.close()

                })

                ButtonRemove.addEventListener("click", (e) => {

                    Table.remove()
                    .then(SuccessRemove => {

                        const ToastRemove = app.toast.create({
                            text: "Removido",
                            closeTimeout: 2000
                        })

                        ToastRemove.open()

                        DialogRemoveItem.close()

                    })
                })

            }
        }
      }).open(); 
      
      return true
}

function CreateContainerFinished(Code, CalculatedPrice){

    const PageCart = document.querySelector(".page-cart"),
    ContainerCart = document.querySelector("#container-cart");

    if(PageCart){

        const LastChild = PageCart.lastElementChild;

        const CreateToolbar = () => {
            return new Promise((resolve, reject) => {

                    if(!LastChild.classList.contains("toolbar")){
                        const ContainerFinished = `
                        <div class="toolbar toolbar-bottom" style="height: 7rem; background: var(--f7-navbar-shadow-image); background: var(--p1-bg-color-secundary);">
                            <div class="toolbar-inner" style="display: initial; padding: 1rem">
                            <p style="color: white; font-size: 1.5rem" id="container-calculated-price"></p>
                            <a style="margin-top: 0.5rem;" class="button button-fill button-finished-order" href="/payment/" data-transition="f7-cover">Fazer pedido</a>
                            </div>
                        </div>
                        `;    
            
                        PageCart.insertAdjacentHTML("beforeend", ContainerFinished)

                        resolve()

                    }else{

                        resolve()

                    }        
            })
        }

        if(Code == 1){

            CreateToolbar()
            .then(result => {
                const ContainerCalculatedPrice = document.querySelector("#container-calculated-price");
        
                if(ContainerCalculatedPrice){
            
                    ContainerCalculatedPrice.innerText = "Valor total " + CalculatedPrice
            
                }
            })

        }else{
            if(LastChild.classList.contains("toolbar")){
                LastChild.remove()
            }
        }

    }
}

function ItemStars(Star, KeyCategory, KeyItem){
    const ElementsStar = document.querySelectorAll(".stars-item"),
    RefItem = db.ref("/restaurants/" + KeyRestaurant + "/categories/" + KeyCategory + "/menu/" + KeyItem + "/stars/");

    ElementsStar.forEach((Element, Indice) => {

     if(Indice <= Star - 1){

        Element.innerHTML = `
            <span style="color: #f1c40f" class="material-symbols-outlined">
            star
            </span>
        `

     }else{

        const ElementChildren = Element.lastElementChild;

        if(ElementChildren.classList.contains("material-symbols-outlined")){
            Element.innerHTML = `
            <span class="material-symbols-outlined">
            grade
            </span>
        `
        }

     }
    })

    
    let CountStars = {
        stars: Star,
        customerKey: GetKeyCustomer
    };

    RefItem.push(CountStars)

}