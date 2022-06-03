function Favorites(){

    const Favorites = db.ref("/restaurants/" + KeyRestaurant + "/customers/"+ GetKeyCustomer + "/favorites/"),
    ContainerFavorites = document.querySelector("#container-favorites");

    Favorites.on("value", (data) => {

        if(data.exists()){

            const Favorites = data.val(),
            KeysFavorites = Object.keys(Favorites);

            ContainerFavorites.innerHTML = ""

            KeysFavorites.forEach(KeyFavorite => {
                const name = Favorites[KeyFavorite].name,
                price = Favorites[KeyFavorite].price,
                image = Favorites[KeyFavorite].image,
                stars = Favorites[KeyFavorite].stars,
                keyCategory = Favorites[KeyFavorite].key_category,
                keyItem = Favorites[KeyFavorite].key_item;

                const Li = document.createElement("li"),
                Link = document.createElement("a"),
                Media = document.createElement("div"),
                Inner = document.createElement("div"),
                Subtitle = document.createElement("div"),
                TitleRow = document.createElement("div"),
                After = document.createElement("a"),
                Title = document.createElement("div");

                Link.classList.add("item-link", "item-content")
                Media.classList.add("item-media")
                Subtitle.classList.add("item-text")
                Inner.classList.add("item-inner")
                Title.classList.add("item-title", "item-title-search")
                After.classList.add("item-after", "popover-open")
                TitleRow.classList.add("item-title-row")

                Media.innerHTML = `<img src="${image}" style="width: 70px; height: 70px; border-radius: 8px" />`

                Title.style.color = "#ffffff"
                After.style.color = "#ffffff"
                Inner.style.display = "flow-root"
                Subtitle.style.color = "#ffffff"
                Link.style.zIndex = "100"
                Link.style.position = "relative"
                After.style.zIndex = "101"
                After.style.position = "relative"
                After.style.float = "right"
                After.style.marginTop = "-5rem"

                Link.setAttribute("onclick", "ItemPage('"+keyItem+"', '"+keyCategory+"')")

                After.innerHTML = `
                    <span class="material-symbols-outlined">
                    more_vert
                    </span>
                `

                After.setAttribute("data-popover", ".popover-favorite")
                After.setAttribute("onclick", "PopoverFavorite('"+keyItem+"')")

                Title.innerText = name
                Subtitle.innerText = `R$ ${price}`
                
                TitleRow.appendChild(Title)
                Inner.appendChild(TitleRow)
                Inner.appendChild(Subtitle)
                Link.appendChild(Media)
                Link.appendChild(Inner)
                Li.appendChild(Link)
                Li.appendChild(After)

                ContainerFavorites.appendChild(Li)
            
              })
        }else{

            ContainerFavorites.innerHTML = `<p style="text-align: center; color: #ffffff"> Seus favoritos aparecerão aqui </p>`

        }
    })
}


function PopoverFavorite(itemKey){

    const ItemKey = itemKey;

    const ElementPopover = document.querySelector(".popover-favorite ul"),
    ButtonRemoveHTML = `
        <li><a class="list-button item-link remove-favorite-popover" href="#">Remover dos favoritos</a></li>
    `

    ElementPopover.innerHTML = ButtonRemoveHTML

    const ButtonRemoved = document.querySelector(".remove-favorite-popover");

    ButtonRemoved.addEventListener("click", (e) => {

        addFavorite(null, itemKey)

        app.popover.close(".popover-favorite")

    })

}