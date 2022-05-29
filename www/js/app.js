
var $ = Dom7;

var app = new Framework7({
  name: 'cardapio', // App name
  theme: 'md', // Automatic theme detection
  el: '#app', // App root element

  view: {
    stackPages: true
  },
  // App store
  store: store,
  // App routes
  routes: routes,
});

const db = firebase.database();

const auth = firebase.auth();

let KeyRestaurant,
KeyTable,
GetKeyCustomer,
GetNameCustomer;

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

      AuthUser(result.key_restaurant)
      .then(LoginSuccess => {
          if(LoginSuccess == true){
            CreateNavbar(result.logo, result.color_secundary, result.color_primary, result.key_restaurant)
              .then(Completed => {
                  if(Completed == true){
                    CreateTabs(result.key_restaurant)
                    .then(CompletedCreateTabs => {
                      CreateTabElementContainer()
                      .then(CompletedCreateTabContainer => {
                        CreateTabsPages(result.key_restaurant)
                      })

                      if(CodeTable){
                        SelectCustomerTable(CodeTable)
                      }
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
      <div class="title text-updt" style="color: #ffffff">Especialidades da casa</div>
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

          KeysMenus.forEach((KeyMenuItem, IndiceMenu) => {
            const name = AllMenu[KeyMenuItem].name,
            image = AllMenu[KeyMenuItem].image,
            price = AllMenu[KeyMenuItem].price;

            const Card = document.createElement("div"),
            CardHeader = document.createElement("div"),
            CardContent = document.createElement("div"),
            Col = document.createElement("div"),
            P = document.createElement("p"),
            Pprice = document.createElement("p"),
            Button = document.createElement("button"),
            CardFooter = document.createElement("div");
            Card.classList.add("card")
            Col.classList.add("col")
            CardHeader.classList.add("card-header", "align-items-flex-end")
            CardContent.classList.add("card-content", "card-content-padding")
            Button.classList.add("button", "button-fill")

            CardHeader.style.backgroundImage = `url(${image})`
            Button.setAttribute("onclick", "AddToCart('"+KeyMenuItem+"', '"+name+"', '"+price+"', '"+image+"')")

            CardHeader.style.backgroundRepeat = "no-repeat"
            CardHeader.style.backgroundSize = "cover"
            Col.style.width = "45%"
            Col.style.margin = "0.2rem"
            Pprice.style.fontSize = "1.1rem"

            CardHeader.setAttribute("onclick", "ItemPage('"+KeyMenuItem+"', '"+res.tab_key+"')")

            P.innerText = name
            Pprice.innerText = price
            Button.innerText = "Adicionar"
            Button.style.backgroundColor = "var(--p1-bg-color-primary)"
            Button.style.color = "black"
            Button.style.fontWeight = "bold"
            Button.style.borderRadius = "8px"
            Button.style.marginTop = "0.5rem"
            Button.style.textTransform = "initial"

            CardContent.appendChild(P)
            CardContent.appendChild(Pprice)
            CardContent.appendChild(Button)
            Card.appendChild(CardHeader)
            Card.appendChild(CardContent)

            Col.appendChild(Card)

            ContainerMenuCode.appendChild(Col)
        
          })
        }

        if(Array_tabs_keys.length - 1 == ind){
          app.preloader.hideIn(".tabs-elements")
        }

                      
        const ElementsScroll = document.querySelectorAll(".container-items"),
        ElementNavbar = document.querySelector(".title-large-text"),
        SubnavbarHome = $(".navbar .subnavbar");

        ElementsScroll.forEach(ElementScroll => {

          const ParentElement = ElementScroll.parentElement;

          let CountScroll = 0;

          let LastScrolled = 0;

          ElementScroll.addEventListener("scroll", (e) => {

            const ElementScrollTop = ElementScroll.scrollTop,
            CalculatedOpacityEffect = 100 / (Number(ElementScrollTop) + ElementScrollTop * 2),
            OpacityEffect = CalculatedOpacityEffect.toFixed(1),
            CalculatedScrollNavbar = ElementScrollTop / 1.3;

            console.log(CalculatedScrollNavbar)

            if(LastScrolled >= ElementScrollTop){

              if(CalculatedScrollNavbar < 150){

                SubnavbarHome.css({
                  transform: `translateY(-${CalculatedScrollNavbar}%)`,
                  "transition-timing-function": "ease-in-out"
                })
  
                if(CalculatedScrollNavbar == 0){
                  ElementNavbar.style.opacity = 1
                 
                }else{
                  ElementNavbar.style.opacity = `${CalculatedOpacityEffect}`
                  
                }

              }
              
            }else{

              LastScrolled = ElementScrollTop
                         
              if(CalculatedScrollNavbar < 150){

                SubnavbarHome.css({
                  "transform": `translateY(-${CalculatedScrollNavbar}%)`,
                  "transition-timing-function": "ease-in-out"
                })
  
                ElementNavbar.style.opacity = `${CalculatedOpacityEffect}`

              }

            }
          })
        })

      }
    })
  })

}


async function AuthUser(KeyRestaurant){
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
        LoginUserFirebaseAuth(result.email, result.password, result.name, result.session, result.CustomerKey)
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
        CreateUserFirebaseAuth(result.data.password, result.data.email, result.data.emailEncrypted, result.data.passwordEncrypted, result.data.secret, result.data.name)
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

      let CountItensCart = 0
      
      DataKey.forEach((Key, Indice) => {
        const Code = DataTable[Key].code,
        ItensCart = DataTable[Key].itens;

        if(ItensCart != undefined){
          const ItensCartKeys = Object.keys(ItensCart);

          ItensCartKeys.forEach((KeyItemCart, IndiceItemCart) => {

            CountItensCart++

            if(ItensCartKeys.length - 1 == IndiceItemCart){
                const LastChild = ContainerMenuButtons.lastElementChild;

                if(LastChild.classList.contains("menu-cart")){
                    const Badge = document.createElement("div");
                    Badge.classList.add("badge", "color-red", "badge-cart")
                    Badge.innerText = CountItensCart

                    const BadgeElement = document.querySelector(".badge-cart");

                    if(!BadgeElement){
                      LastChild.appendChild(Badge)
                    }else{
                      BadgeElement.innerText = CountItensCart
                    }
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
        text: `${Name} já está no seu carrinho`,
        closeButton: true,
        closeButtonText: "Ok",
        closeButtonColor: "blue"
      })

      toast.open()

    }else{
        
        let Array_item_add_to_cart = {
          name: Name,
          key_item: Key,
          price: Price,
          image: Image,
          customer_name: GetNameCustomer,
          customer_key: GetKeyCustomer,
          quantity: 1
        }
  
        const AddItemToTable = db.ref("/restaurants/" + KeyRestaurant + "/dice/tables/" + KeyTable + "/itens/");
  
        AddItemToTable.push(Array_item_add_to_cart)
          .then(success => {
  
            const toast = app.toast.create({
              text: `${Name} foi adicionado`,
              closeTimeout: 2500
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

async function CreateUserFirebaseAuth(Password, Email, EmailEncrypted, PasswordEncrypted,  SessionSecret, CustomerName){
  firebase.auth().createUserWithEmailAndPassword(Email, Password)
  .then((userCredential) => {
    localStorage.setItem("Session_user", SessionSecret)
    localStorage.setItem("Email_user", EmailEncrypted)
    localStorage.setItem("Password_user", PasswordEncrypted)
    LoginUserFirebaseAuth(Email, Password, CustomerName)
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage)
  });
}

async function LoginUserFirebaseAuth(Email, Password, CustomerName,  SessionSecret, CustomerKey){
  firebase.auth().signInWithEmailAndPassword(Email, Password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;

    GetNameCustomer = CustomerName
    GetKeyCustomer = CustomerKey.toString()

    InsertDetailsUser(CustomerName)

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
                  if(MaxElementsStars < 5){
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

  }else if(CalculatedPercent >= 41 && CalculatedPercent <= 59){

    AddStars(3, Container, CountCustomers, NumberIdenti)  
    
  }else if(CalculatedPercent >= 60 && CalculatedPercent <= 80){

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
