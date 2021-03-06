
var routes = [
  {
    path: '/',
    url: './index.html'
  },
  {
    path: '/searchpage/',
    url: './pages/page-search-container.html',
    on: {
      pageAfterIn: function(e){

         if(DirectionItensSearch == 0){

          app.searchbar.create({
            el: '.searchbar-page',
            searchContainer: '.list-itens-search',
            searchIn: '.item-title',
            backdrop: false,
            on: {
              search(sb, query, previousQuery) {
                const ContainerAllItens = document.querySelector(".list-itens-search");
  
                if(query.length == 0){
  
                  const AllElementsNoStars = document.querySelectorAll(".no-stars"),
                  TxtRecommended = document.querySelector(".text_search_title");
  
                  AllElementsNoStars.forEach(Element => {
                    Element.classList.add("hidden-by-searchbar")
                  })
  
                  TxtRecommended.innerText = "Recomendamos para você"
             
                  const TxtNotResults = document.querySelector(".not-results");

                  if(TxtNotResults){

                    TxtNotResults.remove()

                  }
  
                }else{
  
                  const TxtRecommended = document.querySelector(".text_search_title");
  
                  TxtRecommended.innerText = "Resultado de pesquisa"

                  const AllElementsSearch = document.querySelectorAll(".list-itens-search li");

                  let countElementsShow = 0;

                  AllElementsSearch.forEach(Element => {

                    if(!Element.classList.contains("hidden-by-searchbar")){

                      countElementsShow++

                      const TxtNotResults = document.querySelector(".not-results");

                      if(TxtNotResults){

                        TxtNotResults.remove()

                      }

                    }

                    if(countElementsShow == 0){

                      const TxtNotResults = document.querySelector(".not-results");

                      if(!TxtNotResults){

                        const StyleElementTxtNotResults = {
                          textAlign: 'center',
                          width: '100vw',
                          position: 'absolute'
                        }

                        const ElementTxtNotResults = document.createElement("b");

                        ElementTxtNotResults.innerText = "Nenhum resultado encontrado";

                        ElementTxtNotResults.classList.add("not-results")

                        Object.assign(ElementTxtNotResults.style, StyleElementTxtNotResults)

                        ContainerAllItens.insertAdjacentElement("beforeend", ElementTxtNotResults)

                      }

                    }

                  })
  
                }
              },
              enable: function(){
                const ButtonReturn = $(".searchbar-disable-button");

                ButtonReturn.click(function(){
                  app.view.main.router.back()
                })
              }
            }
          });
  
          const InputSearch = document.querySelector(".input-search-page");
  
          InputSearch.focus()
  
          ItensSearch()

         }

      },
      pageBeforeOut: function(e){

        if(e.detail.direction == "forward"){

          DirectionItensSearch = 1

        }else{

          DirectionItensSearch = 0

        }

      }
    }
  },
  {
    path: '/search/',
    url: './pages/search.html',
    transition: "f7-p1",
    on: {
        pageInit: function(){
      
            initSearch()
            returnAllItems()

            let $search = $("#searchP1"), $message_text = $("#message_text");

            $search.keyup(function(){
 
              var filter = $(this).val(), count = 0, $length = $(this).val();
              $(".item-search-children").each(function(){
  
                  if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                      $(this).
                      css({
                        visibility: "hidden",
                        opacity: "0"
                      })
                      .hide();

                      if($(this).hasClass("hidden-search-all-items")){
                        $(this).removeClass("hidden-search-all-items")
                      }


                      $message_text.css({
                        display: "none",
                        visibility: "hidden"
                      })
                  }else if($length.length == ""){
                    $(this).
                    css({
                      visibility: "hidden",
                      opacity: "0"
                    })
                    .hide();
                  }else{
                    $message_text.css({
                      display: "none",
                      visibility: "hidden"
                    })
                    $(this)
                    .css({
                      visibility: "visible",
                      opacity: "1",
                      pointerEvents: "auto"
                    })
                    .show()
                    .addClass("hidden-search-all-items")

                    count++;

                  }

              
              });
              
          });
        },
        pageAfterIn: function(){
          app.searchbar.enable()
        }
 
    }
  },
  {
    path: '/comments/key/:key/keycategory/:keycategory/',
    sheet: {
      backdrop: false,
      backdropEl: false,
      swipeToClose: true,
      swipeHandler: '.sheet-modal-swipe-step, .container-handler',
      swipeToStep: true,
      async: function({ router, to, resolve }) {
          // App instance
          var app = router.app;

          let key = to.params.key,
          keycategory = to.params.keycategory;

          // We got user data from request
          var user = {
            key: key,
            keycategory: keycategory
          };
          // Hide Preloader
          app.preloader.hide();

          // Resolve route to load page
          resolve({
                  url: './pages/sheets/sheet-comments.html',
              }, {
                  props: {
                      user: user,
                  }
              },

          );

      },
      on: {
        open: function(e){

          const keyItem = e.route.params.key,
          keyCategory = e.route.params.keycategory,
          FormComment = document.forms.formComment,
          ElementTxtInput = document.querySelector(".input_txt_comment");

          FormComment.addEventListener("click", (e) => {
            StepOpenComments()
            ElementTxtInput.addEventListener("keyup", (e) => {

              const ElementButtonSend = `
              <a class="button-send-review ripple">
                  <span class="material-symbols-outlined">
                  send
                  </span>
              </a>
              `
      
              if(ElementTxtInput.value.length > 3){
                  const NextElement = ElementTxtInput.nextElementSibling;
      
                  if(!NextElement.classList.contains("button-send-review")){
                      ElementTxtInput.insertAdjacentHTML("afterend", ElementButtonSend)
                      AddComment(keyItem)
                  }
              }else{
                  const NextElement = ElementTxtInput.nextElementSibling;
      
                  if(NextElement != null){
                      if(NextElement.classList.contains("button-send-review"))
                      NextElement.remove()
                  }
              }
          })
          })

          GetComments(keyItem)

          StarsItem(keyItem, keyCategory)

          CustomerAddStarRaiting(keyCategory, keyItem)

          var swiper = app.swiper.create('.swiper-comments', {
            speed: 400,
            spaceBetween: 100,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
              renderBullet: function (index, className) {
                let ElementTab;

                if(index == 0){

                  ElementTab = `<span class="${className}">Comentários</span>`

                }else{

                  ElementTab = `<span class="${className}">Avaliações</span>`

                }

                return ElementTab
              },
            },
        });
        },
        stepOpen: function(){
          
          StepOpenComments()

        },
        stepClose: function(){

          StepCloseComments()

        }
      }
  },
  },
  {
    path: '/favorites/',
    transition: 'f7-cover',
    componentUrl: './pages/favorites.html',
    on: {
      pageInit: function(){
        
        Favorites()

      }
    }
  },
  {
    path: '/popover-favorite/',
    popover: {
      url: './pages/popovers/popover-favorite.html'
    }
  },
  {
    path: '/call-waiter/',
    sheet: {
      push: true,
      swipeToClose: true,
      url: './pages/sheets/call-waiter.html',
      on: {
        open: function(){
          const ListWaiter = document.querySelectorAll(".list-waiter input"),
          FormWaiter = document.forms.formWaiter,
          FormWaiterUL = FormWaiter.querySelector("ul"),
          DatabaseWaiter = firebase.database();

          const SubmitElement = `
          <li class="button-submit-li">
            <div class="item-content">
              <div class="item-inner">
                <input class="button button-p1 button-fill button-small" type="submit" value="Chamar garçom"/>
              </div>
            </div>
          </li>
          `

          let InputSelect;

          ListWaiter.forEach(Input => {
            Input.addEventListener("input", (e) => {
              InputSelect = Input.value
              if(InputSelect.length > 0){
                const LastElement = FormWaiterUL.lastElementChild;
                if(!LastElement.classList.contains("button-submit-li")){
                  FormWaiterUL.insertAdjacentHTML("beforeend", SubmitElement)
                }
              }
            })
          })

          FormWaiter.addEventListener("submit", (e) => {

            const TimeStamp = new Date().getTime();

            if(InputSelect.length > 0){
              
              let array_call_waiter = {
                customer_name: GetNameCustomer,
                customer_key: GetKeyCustomer,
                table: NumberTable,
                key_table: KeyTable,
                textSelected: InputSelect,
                timestamp: TimeStamp
              }

              const Waiter = DatabaseWaiter.ref("/restaurants/" + KeyRestaurant + "/call_waiter/");

              Waiter.push(array_call_waiter)
                .then(success => {

                  app.sheet.close(".sheet-waiter")

                  const toast = app.toast.create({
                    text: "Seu pedido foi enviado, em breve o garçom chegará em sua mesa",
                    closeButton: true,
                    closeButtonColor: 'Red',
                    closeButtonText: 'OK'
                  })

                  toast.open()

                })
                .catch(error => {

                  const toast = app.toast.create({
                    text: "Houve um erro ao chamar o garçom. Tente novamente em breve",
                    closeButton: true,
                    closeButtonColor: 'Red',
                    closeButtonText: 'OK'
                  })

                  toast.open()

                })
            }

            e.preventDefault()
          })

        }
      }
    }
  },
  {
    path: '/finished/',
    url: './pages/finished.html'
  },
  {
    path: '/user-page/',
    url: './pages/user-page.html',
    on: {
      pageInit: function(){
        const ContainerTable = document.querySelector("#mesa_atual"),
        ContainerName = document.querySelector("#name_user");

        ContainerName.innerText = GetNameCustomer

        CustomerPage()

      }
    }
  },
  {
    path: "/music/",
    url: "./pages/music.html",
    on: {
      pageInit: function(){
        let $music__container = document.getElementById("music")
        $music__container.classList.add("rotate-scale-up")
        setTimeout(() => {
         $menu_cart.style.display = "none"
        }, 100);
        returnMusic()
      },
      pageBeforeout: function(){
        let $music__container = document.getElementById("music")
        $music__container.classList.remove("rotate-scale-up")
      }
    }
  },
  {
    path: '/sheet-cupom/',
    sheet: {
      url: './pages/sheet-cupom.html',
      on: {
        open: function(){
          let button = document.getElementById("verified_cupom"),
              cod__cupom = document.getElementById("cod__cupom");

          button.addEventListener("click", function(){
            returnCupom(cod__cupom.value)
          })

          app.popover.close(".popover")
        }
      }
    }
  },
  {
    path: '/sheet-cupom-active/',
    sheet: {
      url: './pages/sheet-cupom-active.html',

    }
  },
  { 
    path: '/right-panel-ajax/',
    panel: {
      url: './pages/filtered.html',
      on: {
        open: function(){
          app.range.create({
            el: '.range-slider',
            min:0,
            max:100,
            value:50,
            label:true,
            labelText:'my label',
            formatLabel:function(v){
              return this.params.labelText+' '+v;
            }
          });
        }
      }
    },
  },
  {
    path:  '/cart/',
    transition: "f7-cover",
    url: './pages/cart.html',
    on: {
      pageInit: function(){
        ReturnCartItens()
        CartItensEvents()
        const ShareCartInput = document.querySelector("#share_cart_input");
        $(".popover-share").on("popover:open", function(){
          if(CustomerShareCart == true){
            ShareCartInput.checked = true
          }else{
            ShareCartInput.checked = false
          }
        })
      },
    }
  },
  {
    path: '/item/key/:key/keycategory/:keycategory/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      var key = to.params.key,
      keycategory = to.params.keycategory;

        var details = {
          key: key,
          keycategory: keycategory
        };
        resolve(
          {
            componentUrl: './pages/item.html',
          },
          {
            props: {
              details: details,
            }
          }
        );
    },
  },
  {
    path: '/paymentPending/',
    url: './pages/paymentPending.html',
    transition: 'f7-cover',
    on: {
      pageInit: function(){
        returnPaymentProcessResults()
      }
    }
  },
  {
    path: '/payment-success/',
    popup: {
      url: './pages/popup/payment-success.html',
      on: {
        open: function(){
          const Restaurant = db.ref("/restaurants/" + KeyRestaurant + "/configs/paymentSuccess"),
          Container = document.querySelector("#container-payment-success"),
          ContainerLogo = document.querySelector("#payment-success-logo");

          Restaurant.once("value", (data) => {
            if(data.exists()){
              const Title = data.val().title;

              const TitleElement = document.createElement("h2"),
              LogoElement = document.createElement("img");
              TitleElement.innerText = Title
              LogoElement.src = LogoRestaurant
              LogoElement.style.width = "98px"
              LogoElement.style.height = "38px"
              LogoElement.style.marginLeft = "2vw"

              Container.appendChild(TitleElement)
              ContainerLogo.appendChild(LogoElement)
            }
          })
        }
      }
    }
  },
  {
    path: '/popup-items/',
    popup: {
      url: './pages/popup/popup-items.html',
      on: {
        open: function(){
          ViewItensIsNotMine()
        }
      }
    }
  },
  {
    path: '/payment/',
    transition: "f7-push",
    url: './pages/payment.html',
    on: {
      pageInit: function(){
        InitializePayment()
      }
    }
  },
  {
    path: '/finished-payment/price/:price/paymentType/:paymentType/',
    transition: 'f7-cover',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      var Price = to.params.Price,
      paymentType = to.params.paymentType;

        var details = {
          Price: Price,
          paymentType: paymentType
        };
        resolve(
          {
            url: './pages/finished-payment.html',
          },
          {
            props: {
              details: details,
            }
          }
        );
    },
    on: {
      pageAfterIn: function(e){
        const Price = e.detail.route.params.price,
        PaymentType = e.detail.route.params.paymentType;

        KeyStripe(Price, PaymentType)
      }
    }
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];

