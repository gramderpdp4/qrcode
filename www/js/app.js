
var $ = Dom7;

var app = new Framework7({
  name: 'cardapio', // App name
  theme: 'md', // Automatic theme detection
  el: '#app', // App root element

  view: {
    stackPages: true
  },
  // App routes
  routes: routes,
});

const db = firebase.database();

const auth = firebase.auth();

let KeyRestaurant,
KeyTable,
GetKeyCustomer,
GetNameCustomer,
LogoRestaurant,
CustomerShareCart,
NumberTable;

async function CodeRestaurant(){
  const getUrl = window.location.href,
  thisUrl = new URL(getUrl),
  Code = thisUrl.searchParams.get("restaurant"),
  CodeTable = thisUrl.searchParams.get("table"),
  ElementPreloader = $(".p1-container-full"),
  ElementOpacity = $(".tabs-animated-wrap");

  if(Code){

    app.preloader.showIn(ElementPreloader, "blue")
    ElementOpacity.css({
      opacity: 0,
      pointerEvents: "hidden"
    })
    

     fetch("/IdentifiesRestaurant",{
       method: "POST",
       body: new URLSearchParams({
         code: Code
       })
     })
     .then(res => res.json())
     .then(result => {

      KeyRestaurant = result.key_restaurant.toString().replaceAll(" ", "")

      AuthUser(result.key_restaurant, CodeTable)
      .then(LoginSuccess => {
          if(LoginSuccess == true){
            CreateNavbar(result.logo, result.color_secundary, result.color_primary, result.key_restaurant)
              .then(Completed => {
                  if(Completed == true){
                    CreateTabs(result.key_restaurant)
                    .then(CompletedCreateTabs => {
                      CreateTabElementContainer()
                    })
                  }
              })
          }
      })
     })
  }
}

EventsTabs()

async function CreateNavbar(Logo, ColorSecundary, ColorPrimary, Key){

  const NavbarElement = $("#navbar-hide-tab"),
  StylePage = $(".p1-container-full");

  document.documentElement.style.setProperty('--p1-bg-color-primary', ColorPrimary);
  document.documentElement.style.setProperty('--p1-bg-color-secundary', ColorSecundary);

  const NavbarCreate = `
    <div class="navbar-bg" style="background-color: none; background: none"></div>
    <div class="navbar-inner sliding" style="background-color: #212121 !important">
      <div class="subnavbar subnavbar-home">
      <form class="searchbar">
        <div class="searchbar-inner">
          <div class="searchbar-input-wrap">
            <input class="input-search-itens" type="search" placeholder="O que está procurando?" />
            <i class="searchbar-icon"></i>
            <span class="input-clear-button"></span>
          </div>
          <span class="searchbar-disable-button if-not-aurora">Cancel</span>
        </div>
      </form>
    </div>
      <div class="title-large no-scroll" style="top: 0; height: auto">
        <div class="title-large-text" style="font-size: 1rem; padding: 0 !important; height: 8rem; background-color: var(--p1-bg-color-secundary) !important">
            <div class="container-control-header-logo" id="menu-header-logo">
                <img src="${Logo}" width="98" height="38"/>
              <a href="/user-page/" class="text__name__resizable" data-transition="f7-cover" style="color: white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" style="fill: white; position: relative; top: 0.2rem"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg> <b class="customer_name"></b>
              </a>
        </div>
      </div>
    </div>
  `

  LogoRestaurant = Logo

  StylePage.css({
    top: 0,
    left: 0,
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "var(--p1-bg-color-secundary)"
  })
    
  NavbarElement.html(NavbarCreate)

  const ElementInputSearch = document.querySelector(".input-search-itens");

  ElementInputSearch.addEventListener("click", (e) => {

    app.view.main.router.navigate("/searchpage/",{
      transition: "f7-cover"
    })

  })

  return true
}


async function CreateTabs(Key){
  const ElementTabs = document.querySelector("#menu-items-container"),
  ElementSvg = $("#svg-container"),
  ContainerFull = document.querySelector(".p1-container-full"),
  RestaurantMenuBar = db.ref("/restaurants/" + Key + "/categories/")

  let TabCount = 0;

  RestaurantMenuBar.once("value", (data) => {
    if(data.exists()){
      const Data = data.val(),
      Keys = Object.keys(Data);

      Keys.forEach((Key, Indice) => {
        const category = Data[Key].category,
        icon = Data[Key].icon;

        const Button = document.createElement("a"),
        SpanIcon = document.createElement("span");
        SpanIcon.classList.add("material-symbols-outlined")
        Button.classList.add("menu__item", "tab-link", "menu__opacity", "no-ripple")

        if(Indice == 0){
          Button.classList.add("menu__item", "tab-link", "menu__opacity", "no-ripple", "tab-link-active")
        }else{
          Button.classList.add("menu__item", "tab-link", "menu__opacity", "no-ripple")
        }

        TabCount++

        Button.href = "#tab-" + TabCount

        Button.innerHTML = icon

        Button.style.paddingTop = "1rem"
    
        ElementTabs.appendChild(Button)

        if(Keys.length - 1 == Indice){
          CreateCartButton()
        }
      })

      function CreateCartButton(){
        const Button = document.createElement("a"),
        SpanIcon = document.createElement("span");
        SpanIcon.classList.add("material-symbols-outlined")
        Button.classList.add("menu__item", "menu__opacity", "no-ripple", "menu-cart")

        Button.href = "/cart/"

        Button.style.paddingTop = "1rem"

        Button.innerHTML = `
        <span class="material-symbols-outlined">
        shopping_cart
        </span>
        `

        ElementTabs.appendChild(Button)
      }
    }
  })

  return true
}

async function CreateTabElementContainer(){

 const MenuContainer = document.querySelector("#menu-items-container");

  const TabsPagesElement = `
  <div class="tabs-animated-wrap" id="tabs-events">
    <div class="tabs tabs-elements">
    </div>
  </div>
  `
  MenuContainer.insertAdjacentHTML("beforebegin", TabsPagesElement)

  return true
}

async function CreateTabsPages(KeyRestaurant){
  const CreateTabsPages = db.ref("/restaurants/" + KeyRestaurant + "/categories/"),
  ContainerTabs = document.querySelector(".tabs-elements");

  let CountTabsId = 0

  let Array_tabs = []

  CreateTabsPages.once("value", (data) => {
    if(data.exists()){
      const Data = data.val(),
      Keys = Object.keys(Data);

      Keys.forEach((KeyPag, Indice) => {
        const category = Data[KeyPag].category,
        code = Data[KeyPag].code;

        const Tab = document.createElement("div")

        CountTabsId++

        if(CountTabsId == 1){
          Tab.classList.add("page-content", "tab", "tab-active", `menu${code}`)
        }else{
          Tab.classList.add("page-content", "tab", `menu${code}`)
        }

        Tab.style.zIndex = "0"

        Array_tabs.push({
          tab_key: KeyPag
        })

        Tab.id = "tab-" + CountTabsId

        ContainerTabs.appendChild(Tab)

        if(Keys.length - 1 == Indice){

          app.preloader.hideIn(".p1-container-full")  

          CreateMenuFood(Array_tabs, KeyRestaurant)
        }

      })
    }
  })

  return Array_tabs
}

async function CreateMenuFood(Array_tabs_keys, KeyRestaurant){

  let CountGetElementMenu = 0

  if(CountGetElementMenu == 0){

    app.preloader.showIn(".tabs-elements", "red")

    CountGetElementMenu++
  }

  Array_tabs_keys.forEach((res, ind) => {
    const MenuFood = db.ref("/restaurants/" + KeyRestaurant + "/categories/" + res.tab_key)
    
    MenuFood.on("value", (DataMenu) => {
      if(DataMenu.exists()){
        const AllMenu = DataMenu.val().menu,
        CodeMenu = DataMenu.val().code,
        Category = DataMenu.val().category;

          const ContainerMenu = document.querySelector(".menu"+CodeMenu);
  
          ContainerMenu.innerHTML = `
          <div class="container${CodeMenu} container-items" style="display: flex; margin-left: 4vw; margin-right: 4vw">
          </div>
          `

          const TitleTab = `
          <b style="color: white; top: 10.2rem; position: fixed; margin-left: 5vw; font-size: 1.1rem; border-bottom: 1px solid #303030">${Category}</b>
          `

          const ContainerChildreMenu = document.querySelector(".container"+CodeMenu)

          ContainerChildreMenu.insertAdjacentHTML("beforebegin", TitleTab)

        const ContainerMenuCode = document.querySelector(".container"+CodeMenu)
        ContainerMenuCode.classList.add("row")

        if(AllMenu != undefined){
          const KeysMenus = Object.keys(AllMenu);

          KeysMenus.forEach( async (KeyMenuItem, IndiceMenu) => {
            const name = AllMenu[KeyMenuItem].name,
            image = AllMenu[KeyMenuItem].image,
            price = AllMenu[KeyMenuItem].price;

            const Card = document.createElement("div"),
            CardHeader = document.createElement("div"),
            CardContent = document.createElement("div"),
            Col = document.createElement("div"),
            P = document.createElement("p"),
            Pprice = document.createElement("p"),
            Favorite = document.createElement("a"),
            Button = document.createElement("button"),
            CardFooter = document.createElement("div");

            Card.classList.add("card")
            Col.classList.add("col")
            CardHeader.classList.add("card-header", "align-items-flex-end")
            CardContent.classList.add("card-content", "card-content-padding")
            Button.classList.add("button", "button-fill")
            Favorite.classList.add("favorite-button")

            CardHeader.style.backgroundImage = `url(${image})`
            Button.setAttribute("onclick", "AddToCart('"+KeyMenuItem+"', '"+name+"', '"+price+"', '"+image+"')")

            CardHeader.style.backgroundRepeat = "no-repeat"
            CardHeader.style.backgroundSize = "cover"
            Col.style.width = "45%"
            Col.style.margin = "0.2rem"
            Pprice.style.fontSize = "1.1rem"

            const CheckFavorite = db.ref("/restaurants/" + KeyRestaurant + "/customers/"+ GetKeyCustomer + "/favorites/").orderByChild("key_item").equalTo(KeyMenuItem);

            await CheckFavorite.on("value", (FavoriteExists) => {

              if(FavoriteExists.exists()){

                console.log("Favorite exists")

                Favorite.innerHTML = `
                <svg style="fill: var(--p1-bg-color-principal)" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 19.475 11.275 18.85Q7.65 15.525 5.4 13.087Q3.15 10.65 3.15 8.175Q3.15 6.3 4.413 5.037Q5.675 3.775 7.55 3.775Q8.625 3.775 9.8 4.325Q10.975 4.875 12 6.425Q13.05 4.875 14.213 4.325Q15.375 3.775 16.45 3.775Q18.325 3.775 19.587 5.037Q20.85 6.3 20.85 8.15Q20.85 10.65 18.6 13.087Q16.35 15.525 12.725 18.85Z"/></svg>
                `

              }else{

                console.log("Favorite not exists")

                Favorite.innerHTML = `
                <svg style="fill: var(--p1-bg-color-principal)" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 19.475 11.275 18.85Q7.65 15.525 5.4 13.087Q3.15 10.65 3.15 8.175Q3.15 6.3 4.413 5.037Q5.675 3.775 7.55 3.775Q8.625 3.775 9.8 4.325Q10.975 4.875 12 6.425Q13.05 4.875 14.213 4.325Q15.375 3.775 16.45 3.775Q18.325 3.775 19.587 5.037Q20.85 6.3 20.85 8.15Q20.85 10.65 18.6 13.087Q16.35 15.525 12.725 18.85ZM12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45Q12 11.45 12 11.45ZM12 18.25Q15.55 15.025 17.738 12.688Q19.925 10.35 19.925 8.15Q19.925 6.675 18.938 5.688Q17.95 4.7 16.45 4.7Q15.3 4.7 14.288 5.337Q13.275 5.975 12.45 7.45H11.55Q10.725 5.975 9.713 5.337Q8.7 4.7 7.55 4.7Q6.05 4.7 5.062 5.688Q4.075 6.675 4.075 8.15Q4.075 10.35 6.263 12.688Q8.45 15.025 12 18.25Z"/></svg>            `
                
              }

            })

            Favorite.setAttribute("onclick", "addFavorite(this, '"+KeyMenuItem+"', '"+name+"', '"+price+"', '"+image+"', '"+res.tab_key+"')")
            CardHeader.setAttribute("onclick", "ItemPage('"+KeyMenuItem+"', '"+res.tab_key+"')")

            P.innerText = name
            Pprice.innerText = price
            Button.innerText = "Adicionar"
            Button.style.backgroundColor = "var(--p1-bg-color-primary)"
            Button.style.color = "black"
            Button.style.fontWeight = "bold"
            Button.style.borderRadius = "6px"
            Button.style.marginTop = "0.5rem"
            Button.style.textTransform = "initial"

            CardContent.appendChild(P)
            CardContent.appendChild(Pprice)
            CardContent.appendChild(Button)
            Card.appendChild(CardHeader)
            Card.appendChild(CardContent)
            Card.appendChild(Favorite)

            Col.appendChild(Card)

            ContainerMenuCode.appendChild(Col)
        
          })
        }

        if(Array_tabs_keys.length - 1 == ind){
          app.preloader.hideIn(".tabs-elements")
        }

                      
        const ElementsScroll = document.querySelectorAll(".container-items"),
        ElementNavbar = document.querySelector(".title-large"),
        SubnavbarHome = document.querySelector(".navbar .subnavbar"),
        ElementNavbarParent = document.querySelector(".navbar");

        ElementsScroll.forEach(ElementScroll => {
          
          ElementScroll.addEventListener("scroll", (e) => {
            TouchMove(e, ElementScroll, ElementNavbar, SubnavbarHome, ElementNavbarParent)
          })

        })
      }
    })
  })
}


async function AuthUser(KeyRestaurant, Code){
  const SessionExists = localStorage.getItem("Session_user"),
  GetEmailUser = localStorage.getItem("Email_user"),
  GetPasswordUser = localStorage.getItem("Password_user");

  if(SessionExists){
    fetch("/LoginUser", {
      method: 'POST',
      body: new URLSearchParams({
        email: GetEmailUser,
        password: GetPasswordUser,
        restaurant: KeyRestaurant
      })
    })
    .then(res => res.json())
      .then(result => {
        LoginUserFirebaseAuth(result.email, result.password, result.name, result.session, result.CustomerKey, result.shareCart, Code)
      })

  }else{
    fetch('/CreateNewUser', {
      method: 'POST',
      body: new URLSearchParams({
        key_restaurant: KeyRestaurant
      })
    })
    .then(res => res.json())
    .then(result => {
      if(result.data){
        const getUrl = window.location.href,
        thisUrl = new URL(getUrl),
        CodeTable = thisUrl.searchParams.get("table");

        console.log(result.data.password, result.data.email, result.data.emailEncrypted, result.data.passwordEncrypted, result.data.secret, result.data.name, Code, result.data.customerKey, result.data.shareCart, CodeTable)

        CreateUserFirebaseAuth(result.data.password, result.data.email, result.data.emailEncrypted, result.data.passwordEncrypted, result.data.secret, result.data.name, Code, result.data.customerKey, result.data.shareCart, CodeTable)
      }
    })

  }

  return true
}

async function SelectCustomerTable(CodeTable){

  const Table = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/").orderByChild("code").equalTo(Number(CodeTable)),
  ContainerMenuButtons = document.querySelector("#menu-items-container");

  Table.on("value", (data) => {
    if(data.exists()){
      const DataTable = data.val(),
      DataKey = Object.keys(DataTable);

      let CountItensShareCart = 0,
      CountItensNoShareCart = 0;
      
      DataKey.forEach((Key, Indice) => {
        const Code = DataTable[Key].code,
        ItensCart = DataTable[Key].itens,
        Name = DataTable[Key].name;

        NumberTable = Name

        if(ItensCart != undefined){
          const ItensCartKeys = Object.keys(ItensCart);

          ItensCartKeys.forEach( async (KeyItemCart, IndiceItemCart) => {

            const itemShare = ItensCart[KeyItemCart].share,
            customerKey = ItensCart[KeyItemCart].customer_key;

            if(itemShare == true){
              CountItensShareCart++
            }

            if(customerKey == GetKeyCustomer){
              CountItensNoShareCart++
            }
            
            if(ItensCartKeys.length - 1 == IndiceItemCart){
                const LastChild = ContainerMenuButtons.lastElementChild;

                const CartShareCustomer = db.ref("/restaurants/" + KeyRestaurant + "/customers/" + GetKeyCustomer);

                if(LastChild.classList.contains("menu-cart")){
                    await CartShareCustomer.on("value", (DataCartShare) => {
                        if(DataCartShare.exists()){
                          const Badge = document.createElement("div");
                          Badge.classList.add("badge", "color-red", "badge-cart")
      
                          const BadgeElement = document.querySelector(".badge-cart");

                          const ShareCartStatus = DataCartShare.val().shareCart;
                                      
                          if(ShareCartStatus == true){
                              if(!BadgeElement){
                                Badge.textContent = CountItensShareCart
                                LastChild.appendChild(Badge)
                              }else{
                                BadgeElement.textContent = CountItensShareCart
                              }
                          }else if(ShareCartStatus == false){
                              if(!BadgeElement){
                                Badge.textContent = CountItensNoShareCart
                                LastChild.appendChild(Badge)
                              }else{
                                BadgeElement.textContent = CountItensNoShareCart
                              }
                          }
                      }else{
                        alert("False")
                      }
                  })
                }
            }
          })
        }else{

          const BadgeElement = document.querySelector(".badge-cart");

          if(BadgeElement){
            BadgeElement.remove()
          }

        }

        if(Code != undefined){
          KeyTable = Key
        }

      })
    }
  })
}

async function AddToCart(Key, Name, Price, Image){
  const Table = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/").orderByChild("key_item").equalTo(Key)

  Table.once("value", (data) => {
    if(data.exists()){
      
      const toast = app.toast.create({
        text: `<span class="material-symbols-outlined info-icon">
        info
        </span> &nbsp; ${Name} já está no seu carrinho`,
        closeButton: true,
        closeButtonText: "Ok",
        closeButtonColor: "blue",
      })

      toast.open()

    }else{
        
        let Array_item_add_to_cart = {
          name: Name,
          key_item: Key,
          price: Price,
          share: CustomerShareCart,
          image: Image,
          customer_name: GetNameCustomer,
          customer_key: GetKeyCustomer,
          quantity: 1
        }
  
        const AddItemToTable = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/");
  
        AddItemToTable.push(Array_item_add_to_cart)
          .then(success => {
  
            const toast = app.toast.create({
              text: `<span class="material-symbols-outlined success-icon">
              check_circle
              </span> &nbsp; ${Name} foi adicionado`,
              closeButton: true,
              closeButtonText: "Ok",
              closeButtonColor: "blue",
              cssClass: 'toast-cart'
            })
  
            toast.open()
  
          })
          .catch(error => {
  
            const toast = app.toast.create({
              text: "Houve um erro, tente novamente",
              closeTimeout: 2500
            })
  
            toast.open()
  
          })
    }
  })
}

function EventsTabs(){
  $("#tab-2").on("tab:show", function(){
    
  })
}

function ItemPage(KeyItem, KeyCategory){
  app.view.main.router.navigate("/item/key/"+KeyItem+"/keycategory/"+KeyCategory+"/",{
    transition: "f7-cover"
  })
}

async function CreateUserFirebaseAuth(Password, Email, EmailEncrypted, PasswordEncrypted,  SessionSecret, CustomerName, Code, CustomerKey, shareCart, CodeTable){
  firebase.auth().createUserWithEmailAndPassword(Email, Password)
  .then((userCredential) => {
    localStorage.setItem("Session_user", SessionSecret)
    localStorage.setItem("Email_user", EmailEncrypted)
    localStorage.setItem("Password_user", PasswordEncrypted)
    LoginUserFirebaseAuth(Email, Password, CustomerName, Code, CustomerKey, shareCart, CodeTable)
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage)
  });
}

async function LoginUserFirebaseAuth(Email, Password, CustomerName,  SessionSecret, CustomerKey, ShareCart, Code){
  console.log(Email, Password, CustomerName,  SessionSecret, CustomerKey, ShareCart, Code)
  firebase.auth().signInWithEmailAndPassword(Email, Password)
  .then((userCredential) => {

    var user = userCredential.user;
    CustomerShareCart = ShareCart
    GetNameCustomer = CustomerName
    GetKeyCustomer = CustomerKey.toString()

    SelectCustomerTable(Code)

    InsertDetailsUser(CustomerName)

    CreateTabsPages(KeyRestaurant)
    CallWaiter()

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage)
  });

  return SessionSecret
}


function InsertDetailsUser(CustomerName){
  
  const ContainerNameCustomer = document.querySelector(".customer_name");

  ContainerNameCustomer.innerText = CustomerName

}

let DirectionItensSearch = 0;

function ItensSearch(){

  const ContainerSearch = document.querySelector(".container-search-itens"),
  ContainerItensSearch = document.querySelector(".list-itens-search");

      const MenuFood = db.ref("/restaurants/" + KeyRestaurant + "/categories/");

      MenuFood.on("value", (data) => {
        if(data.exists()){

          let MaxElementsStars = 0;
    
          const Categorys = data.val(),
          Keys = Object.keys(Categorys);

          ContainerItensSearch.innerHTML = ""

          Keys.forEach(Key => {
            const Menu = Categorys[Key].menu;

            if(Menu != undefined){

              const KeysMenu = Object.keys(Menu);

              KeysMenu.forEach(KeyMenu => {
                const name = Menu[KeyMenu].name,
                price = Menu[KeyMenu].price,
                image = Menu[KeyMenu].image,
                stars = Menu[KeyMenu].stars;

                const Li = document.createElement("li"),
                Link = document.createElement("a"),
                Media = document.createElement("div"),
                Inner = document.createElement("div"),
                Subtitle = document.createElement("div"),
                TitleRow = document.createElement("div"),
                Row = document.createElement("div"),
                After = document.createElement("div"),
                Title = document.createElement("div");

                Link.classList.add("item-link", "item-content")
                Media.classList.add("item-media")
                Subtitle.classList.add("item-text")
                Inner.classList.add("item-inner")
                Row.classList.add("row")
                Title.classList.add("item-title", "item-title-search")
                After.classList.add("item-after")
                TitleRow.classList.add("item-title-row")

                Media.innerHTML = `<img src="${image}" style="width: 70px; height: 70px; border-radius: 8px" />`

                Title.style.color = "white"
                After.style.color = "white"
                Inner.style.display = "flow-root"
                Row.style.maxWidth = "36%"

                Title.innerText = name
                After.innerText = price

                Link.setAttribute("onclick", "ItemPage('"+KeyMenu+"', '"+Key+"')")

                Subtitle.appendChild(Row)
                TitleRow.appendChild(Title)
                TitleRow.appendChild(After)
                Inner.appendChild(TitleRow)
                Inner.appendChild(Subtitle)
                Link.appendChild(Media)
                Link.appendChild(Inner)
                Li.appendChild(Link)

                let ElementCountStars = 0;

                if(stars != undefined){

                  const KeysStars = Object.keys(stars);

                  let CountCustomersStars = 0,
                  CountAllStars = 0;

                  KeysStars.forEach(KeyStar => {
                    const star = stars[KeyStar].stars;

                    if(star != undefined){

                      CountAllStars += Number(star)

                      CountCustomersStars++

                    }
                  })

                  const CalculatedStars =  5 * CountCustomersStars / CountAllStars,
                  CalculatedPercent = ( 100 / CalculatedStars )

                  if(CalculatedPercent != undefined && CalculatedPercent != NaN){
                    CalculatorStart(CalculatedPercent, Row, CountCustomersStars, 1)
                    ElementCountStars = parseInt(CalculatedPercent)
                  }
                }        

                if(ElementCountStars > 59){
                  if(MaxElementsStars <= 5){

                    ContainerItensSearch.appendChild(Li)

                    MaxElementsStars++
                  }
                }else{
                  Li.classList.add("no-stars", "hidden-by-searchbar")
                  ContainerItensSearch.appendChild(Li)
                }

              })
            }
          })

          const TxtTitleSearch = document.querySelector(".text_search_title");

          if(!TxtTitleSearch){

            const h2TextAvaliable = `<h2 class="text_search_title" style="margin-left: 4vw; color: white; font-size: 1rem">Recomendamos para você</h2>`

            ContainerItensSearch.insertAdjacentHTML("beforebegin", h2TextAvaliable)  

          }
         
        }
      })
}

function CalculatorStart(CalculatedPercent, Container, CountCustomers, NumberIdenti){
  if(CalculatedPercent <= 20){

    AddStars(1, Container, CountCustomers, NumberIdenti)                    

  }else if(CalculatedPercent >= 21 && CalculatedPercent <= 40){

    AddStars(2, Container, CountCustomers, NumberIdenti)  

  }else if(CalculatedPercent >= 41 && CalculatedPercent <= 60){

    AddStars(3, Container, CountCustomers, NumberIdenti)  
    
  }else if(CalculatedPercent >= 61 && CalculatedPercent <= 80){

    AddStars(4, Container, CountCustomers, NumberIdenti)  

  }else if(CalculatedPercent >= 81 && CalculatedPercent <= 100){

    AddStars(5, Container, CountCustomers, NumberIdenti)  

  }
}

function AddStars(CountStars, ContainerElement, CountUsers, NumberIdenti){

  const Stats = CountStars

  let DefineNumberStars = 0;

  for(let i = 0; i < 5; i++){

      const StarsDiv = document.createElement("div");

      StarsDiv.classList.add("col", "stars-item")

          if(i < Number(Stats)){

            StarsDiv.innerHTML = `
            <span style="color: #f1c40f; font-size: 0.92rem" class="material-symbols-outlined">
            star
            </span>
            `;

          }else{

            StarsDiv.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 0.92rem">
            grade
            </span>`;
            
          }

      DefineNumberStars++

      ContainerElement.appendChild(StarsDiv)

      }   

      const ElementCountUsers = document.createElement("div");

      ElementCountUsers.style.width = "100%"
      ElementCountUsers.style.position = "absolute"
      ElementCountUsers.style.marginTop = "1.2rem"

      if(NumberIdenti == 1){

        if(CountUsers != 0){

          ElementCountUsers.innerText = `${CountUsers} avaliações`
        
          ContainerElement.appendChild(ElementCountUsers)
  
        }else
        {
  
          ElementCountUsers.innerText = "Seja o primeiro a avaliar"
        
          ContainerElement.appendChild(ElementCountUsers)
  
        }

      }else{

        if(CountUsers != 0){

          ContainerElement.appendChild(ElementCountUsers)
  
        }else
        {
        
          ContainerElement.appendChild(ElementCountUsers)
  
        }
        
      }
}

function CallWaiter(){
  const Container = document.querySelector(".p1-container-full");

  const HTML = `
  <div class="fab fab-extended fab-right-bottom fab-waiter color-red">
    <a href="/call-waiter/">
      <span class="material-symbols-outlined">
        room_service
        </span>
    </a>
  </div>
  `

  Container.insertAdjacentHTML("beforeend", HTML)
}

function CustomerPage(){

  const RestaurantConfigs = db.ref("/restaurants/" + KeyRestaurant + "/configs/services/"),
  ContainerUserPage = document.querySelector("#list-user-page");

  RestaurantConfigs.on("value", (data) => {

    if(data.exists()){

      const Data = data.val(),
      Keys = Object.keys(Data).slice(0).reverse();

      ContainerUserPage.innerHTML = ""

      Keys.forEach(Key => {

        const Type = Data[Key].type,
        Code = Data[Key].code,
        Icon = Data[Key].icon,
        Status = Data[Key].status;
        
        const Li = document.createElement("li"),
        A = document.createElement("a"),
        Media = document.createElement("div"),
        Inner = document.createElement("div"),
        Title = document.createElement("div");
  
        A.classList.add("item-link", "item-content")
        Media.classList.add("item-media")
        Inner.classList.add("item-inner")
        Title.classList.add("item-title")

        Media.innerHTML = Icon

        Inner.appendChild(Title)
        A.appendChild(Media)
        A.appendChild(Inner)
        Li.appendChild(A)

        switch (Code) {
          case 2:

            if(Status == true){
  
              Title.innerText = "Votação/Enquete"
              ContainerUserPage.appendChild(Li) 

            }
            
            break;
            case 3:

              if(Status == true){
  
                Title.innerText = "Mudar de mesa"
                ContainerUserPage.appendChild(Li) 
  
              }
            
              break;
              case 4:

              if(Status == true){
  
                Title.innerText = "Notificações"
                ContainerUserPage.appendChild(Li) 
  
              }
            
              break;
              case 5:

              if(Status == true){
  
                Title.innerText = "Favoritos"
                A.href = "/favorites/"
                ContainerUserPage.appendChild(Li) 
  
              }
            
              break;
        
          default:
            break;
        }
      })
    }
  })
}

function ShareCartState(El){
  Preloader.show(".page-cart .page-content", "blue")

  const User = db.ref("/restaurants/" + KeyRestaurant + "/customers/" + GetKeyCustomer),
  CartItens = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/").orderByChild("customer_key").equalTo(GetKeyCustomer);

  if(El.checked == true){
    CustomerShareCart = true
    let arr_cart_share = {
      shareCart: true
    }
    User.update(arr_cart_share)
    .then(success => {
      CartItens.once("value", (CartItens) => {
        if(CartItens.exists()){
          const DataCart = CartItens.val(),
          CartKeys = Object.keys(DataCart);
  
          CartKeys.forEach((ItemKey, ItemIndice) => {
            const UpdateCartItemState = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/" + ItemKey);
            let arr_upd_item_share = {
              share: true
            }
            UpdateCartItemState.update(arr_upd_item_share)
          })
        }
      })
    })
    .finally(() => {
      ReturnCartItens()
      Preloader.close(".page-cart .page-content")
    })
  }else{
    CustomerShareCart = false
    let arr_cart_share = {
      shareCart: false
    }
    User.update(arr_cart_share)
    .then(() => {
      CartItens.once("value", (CartItens) => {
        if(CartItens.exists()){
          const DataCart = CartItens.val(),
          CartKeys = Object.keys(DataCart);
  
          CartKeys.forEach((ItemKey, ItemIndice) => {
            const UpdateCartItemState = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/" + ItemKey);
            let arr_upd_item_share = {
              share: false
            }
            UpdateCartItemState.update(arr_upd_item_share)
          })
        }
      })
    })
    .finally(() => {
      ReturnCartItens()
      Preloader.close(".page-cart .page-content")
    })
  }
}

async function InitializePayment(){
  const RestaurantConfigs = db.ref("/restaurants/" + KeyRestaurant + "/configs/services/"),
  ContainerPayment = document.querySelector("#container-payment");

  RestaurantConfigs.on("value", (data) => {

    if(data.exists()){
      const Services = data.val(),
      Keys = Object.keys(Services);

      let PaymentTheEnd;

      Keys.forEach(Key => {
        const Code = Services[Key].code,
        Type = Services[Key].type,
        Status = Services[Key].status;

        if(Type == "payAtTheEnd" && Code == 1){
          PaymentTheEnd = Status
        }
      })

      const PaymentMoment = document.createElement("a"),
      PaymentEnd = document.createElement("a");
      PaymentMoment.classList.add("col", "button", "button-fill")
      PaymentMoment.innerText = "Pagar agora"

      if(PaymentTheEnd == true){
        PaymentEnd.classList.add("col", "button", "button-fill")
        PaymentEnd.innerText = "Continuar consumindo e pagar no final"
        PaymentEnd.style.margin = "1rem"
        PaymentEnd.style.fontWeight = "var(--p1-buttons-weight)"
        PaymentEnd.style.color = "#000000"
        PaymentEnd.style.backgroundColor = "var(--p1-bg-color-principal)"
        PaymentEnd.style.textTransform = "initial"
        PaymentEnd.setAttribute("onclick", "PaymentEnd()")
      }

      PaymentMoment.setAttribute("onclick", "PayNow()")
      PaymentMoment.style.margin = "1rem"
      PaymentMoment.style.fontWeight = "var(--p1-buttons-weight)"
      PaymentMoment.style.backgroundColor = "var(--p1-bg-color-principal)"
      PaymentMoment.style.textTransform = "initial"
      PaymentMoment.style.color = "#000000"
      

      ContainerPayment.appendChild(PaymentMoment)
      ContainerPayment.appendChild(PaymentEnd)

    }
  })
}


function PaymentEnd(){
  alert("End")
}

function PayNow(){
  const Element = $("#container-payment");
  app.preloader.showIn(Element.parent(), "blue");
  Element.css({
    pointerEvents: "none",
    opacity: 0.5
  })

  setTimeout(() => {
    app.preloader.hideIn(Element.parent())
    Element.css({
      pointerEvents: "auto",
      opacity: 1
    })

    let OpenedPopup = 0,
    NoShareItens = 0;

    const ItemsCart = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/");

    if(CustomerShareCart == true){
      ItemsCart.once("value", (data) => {
        const Itens = data.val(),
        Keys = Object.keys(Itens);
  
        Keys.forEach( async (Key) => {
          const CustomerKey = Itens[Key].customer_key,
          ShareItem = Itens[Key].share;
  
          if(CustomerKey != GetKeyCustomer && ShareItem == true){
            NoShareItens++
            if(OpenedPopup == 0){
              OpenedPopup++          
              app.view.main.router.navigate("/popup-items/")
            }
          }
        })

        if(NoShareItens == 0){
          ViewItensIsNotMine()
        }

      })
    }
  }, 400);
}

function ViewItensIsNotMine(Ref){
  const ItemsCart = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/"),
  Container = document.querySelector("#IsNotMime");
  
  if(CustomerShareCart == true){
    ItemsCart.once("value", (data) => {
      const Itens = data.val(),
      Keys = Object.keys(Itens);

      let NoShareItens = 0;

      Keys.forEach( async (Key) => {
        const CustomerKey = Itens[Key].customer_key,
        ItemShare = Itens[Key].share;

        if(CustomerKey != GetKeyCustomer && ItemShare == true){
          const image = Itens[Key].image,
          price = Itens[Key].price,
          name = Itens[Key].name;

          NoShareItens++

          const Li = document.createElement("li"),
          Link = document.createElement("a"),
          Media = document.createElement("div"),
          Inner = document.createElement("div"),
          Subtitle = document.createElement("div"),
          TitleRow = document.createElement("div"),
          Row = document.createElement("div"),
          After = document.createElement("div"),
          Title = document.createElement("div");

          Link.classList.add("item-link", "item-content")
          Media.classList.add("item-media")
          Subtitle.classList.add("item-text")
          Inner.classList.add("item-inner")
          Row.classList.add("row")
          Title.classList.add("item-title", "item-title-search")
          After.classList.add("item-after")
          TitleRow.classList.add("item-title-row")

          Media.innerHTML = `<img src="${image}" style="width: 70px; height: 70px; border-radius: 8px" />`

          Title.style.color = "white"
          After.style.color = "white"
          Inner.style.display = "flow-root"
          Row.style.maxWidth = "36%"

          Title.innerText = name
          After.innerText = "R$ " + price

          Subtitle.appendChild(Row)
          TitleRow.appendChild(Title)
          TitleRow.appendChild(After)
          Inner.appendChild(TitleRow)
          Inner.appendChild(Subtitle)
          Link.appendChild(Media)
          Link.appendChild(Inner)
          Li.appendChild(Link)

          Container.appendChild(Li)
        }
      })
 
      if(NoShareItens == 0){
        PaymentAllItens(true)
      }

    })
  }
}

function PaymentAllItens(ItensNoShare){
  const ItemsCart = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/");
  
  ItemsCart.once("value", (data) => {
    const Itens = data.val(),
    Keys = Object.keys(Itens);

    let AllPrice = 0,
    AllQuantity;

    if(ItensNoShare == true){
      Keys.forEach( async (Key, Indice) => {
        const price = Itens[Key].price,
        quantity = Itens[Key].quantity,
        share = Itens[Key].share;
  
        if(quantity != undefined || quantity != null && price != undefined || price != null){
          if(share == true){
            AllPrice += parseFloat(price) * Number(quantity)
          }
        }
      })
      
      if(AllPrice > 1){
        AppendStripe(AllPrice, 'OnlyMyItens')
      }
    
    }else{
      Keys.forEach( async (Key, Indice) => {
        const price = Itens[Key].price,
        quantity = Itens[Key].quantity;
  
        if(quantity != undefined || quantity != null && price != undefined || price != null){
          AllPrice += parseFloat(price) * Number(quantity)
        }
      })

      if(AllPrice > 1){
        AppendStripe(AllPrice, 'PayAllItens')
      }

    }
  })
}

function PaymentMyItens(){
  const ItemsCart = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/").orderByChild("customer_key").equalTo(GetKeyCustomer);
  ItemsCart.once("value", (data) => {
    if(data.exists()){
      const Itens = data.val(),
      Keys = Object.keys(Itens);
  
      let AllPrice = 0,
      AllQuantity;
  
        Keys.forEach( async (Key, Indice) => {
          const price = Itens[Key].price,
          quantity = Itens[Key].quantity;

          if(quantity != undefined || quantity != null && price != undefined || price != null){
            AllPrice += parseFloat(price) * Number(quantity)
          }
        })
        if(AllPrice > 1){
          AppendStripe(AllPrice, 'OnlyMyItens')
        }
    }else{
        const Dial = app.dialog.create({
          title: 'Você não colocou nenhum item no carrinho',
          text: 'Escolha a opção "Pagar tudo", ou adicione algo ao carrinho.',
          buttons: [
            {
              text: 'Voltar',
            },
            {
              text: 'Pagar tudo',
              onClick: function(){
                PaymentAllItens()
              }
            }
          ]
        });

        Dial.open()
    }
  })

}

function AppendStripe(Price, PaymentType){
  const Stripe = document.createElement("script");
  Stripe.src = "https://js.stripe.com/v3/"

  document.body.appendChild(Stripe)

  app.popup.close(".popup")

  app.view.main.router.navigate("/finished-payment/price/"+Price+"/paymentType/"+PaymentType+"/")
}

function KeyStripe(Price, PaymentType){
  const stripe = Stripe("pk_test_51L8AeeKFCvGWaMbo23KgKGAyiKbLMg0kflFDCVFThFoSkm6X3m95DSWVRW7KFuvd9mUfqLrVS4PwZKtm5AXRSrdm00NNbQNrhP");
  const form = document.querySelector('#payment-form');
  const submit = form.querySelector("#submit"),
  containerPrice = document.querySelector(".block-finished-payment");

  const ElementPrice = document.createElement("div");
  ElementPrice.classList.add("payment-price")

  ElementPrice.innerHTML = `Total do pagamento <b>R$${Price}</b>`
  containerPrice.insertAdjacentElement("afterbegin", ElementPrice)

  form.style.pointerEvents = "none"

      var elements = stripe.elements();
      var style = {
        base: {
          iconColor: '#c4f0ff',
          color: '#fff',
          fontWeight: '500',
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: '#fce883',
          },
          '::placeholder': {
            color: '#ffffff',
          },
        },
        invalid: {
          iconColor: '#FFC7EE',
          color: '#FFC7EE',
        },
      };

      var card = elements.create("card", { style: style, hidePostalCode: true });
      card.mount("#card-element");
      
      card.on("ready", function(event){
        form.style.pointerEvents = "auto"
      })

      form.addEventListener('submit', function(event) {

        Preloader.show('.page-payment-finished .page-content', 'blue')

        OpacityPayment(true)

        if(form.name.value.length == 0){
          Toast.show("Preencha seu nome", "toast-payment", 2000, 'center')
          Preloader.close('.page-payment-finished .page-content')
          OpacityPayment(false)
        }else{
          const ownerInfo = {
            owner: {
              name: form.name.value,
            },
            metadata: {
              customerKey: GetKeyCustomer,
              restaurantKey: KeyRestaurant
            },
          };

          stripe.createSource(card, ownerInfo).then(function(result) {
            if (result.error) {
              Toast.show(result.error.message, "toast-payment", 2500, 'center')
              Preloader.close('.page-payment-finished .page-content')
              OpacityPayment(false)
            } else {
              stripeSourceHandler(result.source)
            }
          });
        }
        event.preventDefault();
      })

      function stripeSourceHandler(source) {
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeSource');
        hiddenInput.setAttribute('value', source.id);
        form.appendChild(hiddenInput);

        fetch("/Pay",{
          method: 'POST',
          body: new URLSearchParams({
            customerName: form.name.value,
            restaurant: KeyRestaurant,
            sourceID: source.id,
            paymentType: PaymentType,
            price: Price,
            keyTable: KeyTable,
            customerKey: GetKeyCustomer
          })
        })
        .then(res => res.json())
          .then(result => {
            if(result.status == "success"){
              const view = app.views.current;
              view.router.back(view.history[0],{force:true});
              PopupSuccessPayment()
            }
          })
          .finally(() => {
            Preloader.close('.page-payment-finished .page-content')
            OpacityPayment(false)
          })
      }
}

const Toast = {
  show: function(Text, Element, Timeout, Position){
    const T = app.toast.create({
      text: Text,
      cssClass: Element,
      position: Position,
      closeTimeout: Timeout
    })

    T.open()
  },
  close: function(Element){
     app.toast.close(Element)
  }
}

const Preloader = {
  show: function(Element, Color){
    
    app.preloader.showIn(Element, Color)

    const ElementEvents = document.querySelector(Element);

    ElementEvents.style.pointerEvents = "none"

  },
  close: function(Element){
    app.preloader.hideIn(Element)

    const ElementPointerEvents = document.querySelector(Element);

    ElementPointerEvents.style.pointerEvents = "auto"
  }
}

const OpacityPayment = (Status) => {
  const Element = $(".page-payment-finished .container__style, #payment-form");
  if(Status == true){
    Element.css({
      opacity: 0.5,
      "pointerEvents": "none"
    })
  }else{
    Element.css({
      opacity: 1,
      pointerEvents: "auto"
    })
  }
}

function PopupSuccessPayment(){
  InitializePopupSuccessPayment()
    .then(() => {
      app.view.main.router.navigate("/payment-success/")
    })
    .catch(() => {
      PopupSuccessPayment()
    })
}

function InitializePopupSuccessPayment(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Page Is Current?")
      const PageHomeExistsCurrent = document.querySelector(".page[data-name=home]");
      if(PageHomeExistsCurrent.classList.contains("page-current")){
        resolve()
      }else{
        reject()
      }
    }, 120);
  })
}

function ReturnCartItens(){
  const CartShare = db.ref("/restaurants/" + KeyRestaurant + "/customers/" + GetKeyCustomer);
  const RefCart = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/");

  RefCart.once("value", () => {
      CartShare.once("value", (CartShare) => {
          const ShareCartStatus = CartShare.val().shareCart;
          if(ShareCartStatus == true){
              CartItensShare()
          }else if(ShareCartStatus == false){
              CartItensNoShared()
          }
      })
  })
}