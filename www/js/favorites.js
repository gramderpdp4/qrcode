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

function addFavorite(Element, ItemKey, Name, Price, Image, KeyCategory){

    const Favorite = db.ref("/restaurants/" + KeyRestaurant + "/customers/"+ GetKeyCustomer + "/favorites/"),
    ItemExists = db.ref("/restaurants/" + KeyRestaurant + "/customers/"+ GetKeyCustomer + "/favorites/").orderByChild("key_item").equalTo(ItemKey);
  
    ItemExists.once("value", (data) => {
  
      if(data.exists()){
  
        const Key = Object.keys(data.val());
  
        const RemoveFavorite = db.ref("/restaurants/" + KeyRestaurant + "/customers/"+ GetKeyCustomer + "/favorites/" + Key);
  
        RemoveFavorite.remove()
          .then(success => {
  
            Element.innerHTML = `
            <svg style="fill: var(--p1-bg-color-principal)" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 19.475 11.275 18.85Q7.65 15.525 5.4 13.087Q3.15 10.65 3.15 8.175Q3.15 6.3 4.413 5.037Q5.675 3.775 7.55 3.775Q8.625 3.775 9.8 4.325Q10.975 4.875 12 6.425Q13.05 4.875 14.213 4.325Q15.375 3.775 16.45 3.775Q18.325 3.775 19.587 5.037Q20.85 6.3 20.85 8.15Q20.85 10.65 18.6 13.087Q16.35 15.525 12.725 18.85ZM12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45ZM12 18.25Q15.55 15.025 17.738 12.688Q19.925 10.35 19.925 8.15Q19.925 6.675 18.938 5.688Q17.95 4.7 16.45 4.7Q15.3 4.7 14.288 5.337Q13.275 5.975 12.45 7.45H11.55Q10.725 5.975 9.713 5.337Q8.7 4.7 7.55 4.7Q6.05 4.7 5.062 5.688Q4.075 6.675 4.075 8.15Q4.075 10.35 6.263 12.688Q8.45 15.025 12 18.25Z"/></svg>
            `
  
          })
          .catch(error => [
  
          ])
  
      }else{
  
        let array_favorite = {
          key_item: ItemKey,
          image: Image,
          name: Name,
          price: Price,
          key_category: KeyCategory
        }
      
        Favorite.push(array_favorite)
          .then(success => {
  
            Element.innerHTML = `
            <svg style="fill: var(--p1-bg-color-principal)" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 19.475 11.275 18.85Q7.65 15.525 5.4 13.087Q3.15 10.65 3.15 8.175Q3.15 6.3 4.413 5.037Q5.675 3.775 7.55 3.775Q8.625 3.775 9.8 4.325Q10.975 4.875 12 6.425Q13.05 4.875 14.213 4.325Q15.375 3.775 16.45 3.775Q18.325 3.775 19.587 5.037Q20.85 6.3 20.85 8.15Q20.85 10.65 18.6 13.087Q16.35 15.525 12.725 18.85Z"/></svg>
            `
  
          })
          .catch(error => {
            
          })
  
      }
    })
  }