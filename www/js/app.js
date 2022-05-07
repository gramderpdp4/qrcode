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

async function CodeRestaurant(){
  const getUrl = window.location.href,
  thisUrl = new URL(getUrl),
  Code = thisUrl.searchParams.get("restaurant"),
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
      
       CreateNavbar(result.logo, result.color_secundary, result.color_primary, result.key_restaurant)
     })
  }
}


function CreateNavbar(Logo, ColorSecundary, ColorPrimary, Key){

  const NavbarElement = $("#navbar-hide-tab"),
  StylePage = $(".p1-container-full");

  document.documentElement.style.setProperty('--p1-bg-color-primary', ColorPrimary);
  document.documentElement.style.setProperty('--p1-bg-color-secundary', ColorSecundary);

  const NavbarCreate = `
    <div class="navbar-bg"></div>
    <div class="navbar-inner sliding" style="background-color: #212121 !important">
      <div class="title text-updt" style="color: #ffffff">Especialidades da casa</div>
      <div class="title-large no-scroll" style="top: 0; height: auto">
        <div class="title-large-text" style="font-size: 1rem; padding: 0 !important; height: 12em; background-color: var(--p1-bg-color-secundary) !important">
            <div class="container-control-header-logo" id="menu-header-logo">
                <img src="${Logo}" width="98" height="38"/>
              <a href="/user-page/" class="text__name__resizable" data-transition="f7-cover" style="color: white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" style="fill: white; position: relative; top: 0.2rem"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg> <b id="name__user__text"></b>
              </a>
        </div>
        <div class="container-control-header" id="searchbar_swipeable_hide">
            <div id="icon_back_search"></div>
            <input type="text" autocomplete="off" id="filter__search" class="input-search" placeholder="O que você está procurando?" /><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon-search"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path><path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path></svg>
            <p class="p-text text-updt" style="background-color: #212121;">Especialidades da casa</p>
            </div>
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

  CreateTabs(Key)
}


function CreateTabs(Key){
  const ElementTabs = $("#menu-items-container"),
  ElementSvg = $("#svg-container");

  const Tabs = `
  <a href="#tab-1" id="oneButton" class="menu__item tab-link active menu__opacity" style="--bgColorItem: #ff8c00;" >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon-p1"><path d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2v7zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1z"></path></svg>
  </a>

  <a href="#tab-2" id="two"  class="menu__item tab-link menu__opacity" style="--bgColorItem: #f54888;">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon-p1"><path d="M20.832 4.555A1 1 0 0 0 20 3H4a1 1 0 0 0-.832 1.554L11 16.303V20H8v2h8v-2h-3v-3.697l7.832-11.748zM12 14.197 8.535 9h6.93L12 14.197zM18.132 5l-1.333 2H7.201L5.868 5h12.264z"></path></svg>
  </a>

  <a href="#tab-3" class="menu__item tab-link menu__opacity" style="--bgColorItem: #4343f5;" >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon-p1"><path d="M7 22h10a1 1 0 0 0 .99-.858L19.867 8H21V6h-1.382l-1.724-3.447A.998.998 0 0 0 17 2H7c-.379 0-.725.214-.895.553L4.382 6H3v2h1.133L6.01 21.142A1 1 0 0 0 7 22zm10.418-11H6.582l-.429-3h11.693l-.428 3zm-9.551 9-.429-3h9.123l-.429 3H7.867zM7.618 4h8.764l1 2H6.618l1-2z"></path></svg>
  </a>

  <a class="menu__item tab-link menu__opacity" href="#tab-4" style="--bgColorItem: #e0b115;" > 
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon-p1"><path d="m21.484 11.125-9.022-5a1 1 0 0 0-.968-.001l-8.978 4.96a1 1 0 0 0-.003 1.749l9.022 5.04a.995.995 0 0 0 .973.001l8.978-5a1 1 0 0 0-.002-1.749zm-9.461 4.73-6.964-3.89 6.917-3.822 6.964 3.859-6.917 3.853z"></path><path d="M12 22a.994.994 0 0 0 .485-.126l9-5-.971-1.748L12 19.856l-8.515-4.73-.971 1.748 9 5A1 1 0 0 0 12 22zm8-20h-2v2h-2v2h2v2h2V6h2V4h-2z"></path></svg>
  </a>

  <a href="/cart/" data-transition="f7-cover" class="menu_item_cart ripple" style="--bgColorItem:#65ddb7;">

    <svg xmlns="http://www.w3.org/2000/svg" class="icon-p1" viewBox="0 0 24 24" width="24" height="24"><path d="M21 4H2v2h2.3l3.28 9a3 3 0 0 0 2.82 2H19v-2h-8.6a1 1 0 0 1-.94-.66L9 13h9.28a2 2 0 0 0 1.92-1.45L22 5.27A1 1 0 0 0 21.27 4 .84.84 0 0 0 21 4zm-2.75 7h-10L6.43 6h13.24z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="16.5" cy="19.5" r="1.5"></circle></svg>
    <span class="badge color-red p1-badge" id="badge__count"></span>
  </a>

  <div class="menu__border"></div>
  `,

  Svg = `
  <svg viewBox="0 0 202.9 45.5" >
    <clipPath id="menu" clipPathUnits="objectBoundingBox" transform="scale(0.0049285362247413 0.021178021978022)">
      <path  d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7
        c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5
        c9.2,3.6,17.6,4.2,23.3,4H6.7z"/>
    </clipPath>
  </svg>
  `;

  ElementTabs.html(Tabs)
  ElementSvg.html(Svg)

  ConnectMenu(Key)
}

function ConnectMenu(Key){
    const db = firebase.database();

    const Menu = db.ref("/restaurants/" + Key + "/dice/menu");

    Menu.once("value", (data) => {
      console.log(data.val())
    })
}