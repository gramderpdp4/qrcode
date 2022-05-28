
var routes = [
  {
    path: '/',
    url: './index.html'
  },
  {
    path: '/about/',
    url: './pages/about.html',
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
    path: '/account/',
    url: './pages/my-account.html',
    on: {
      pageInit: function(){
        let $name_user_acc = sessionStorage.getItem("user_name_login"),
            $container_name_text = document.getElementById("name_user_acc");

            $container_name_text.innerText = $name_user_acc
      }
    }
  },
  {
    path: '/changedMesa/',
    url: './pages/changed-chair.html',
    on: {
      pageInit: function(){
        app.popover.close(".popover")
        returnChairsLength()
      }
    } 
  },
  {
    path: '/comments/key/:key/',
    sheet: {
      backdrop: false,
      backdropEl: false,
      swipeToClose: true,
      swipeHandler: '.sheet-modal-swipe-step',
      swipeToStep: true,
      async: function({ router, to, resolve }) {
          // App instance
          var app = router.app;

          let key = to.params.key;

          // We got user data from request
          var user = {
            key: key
          };
          // Hide Preloader
          app.preloader.hide();

          // Resolve route to load page
          resolve({
                  url: './pages/sheet-comments.html',
              }, {
                  props: {
                      user: user,
                  }
              },

          );

      },
      on: {
        open: function(e){

          const keyItem = e.route.params.key;

          GetComments()

          AddComment(keyItem)

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
    path: '/favoritos/',
    componentUrl: './pages/favoritos.html',
    on: {
      pageInit: function(){
        returnFavorites()
      }
    }
  },
  {
    path: '/metod/',
    url: './pages/metod-payment.html',
    on: {
      pageInit: function(){
        VerifiShareCart()
      },
      pageBeforeOut: function(){
        let $ref_delete_payment_pending = databases.ref("/paymentPending/")
        .orderByChild("keyUserPayment")
        .equalTo($user_key_global)

        $ref_delete_payment_pending.once("value", sm , nm)

        function sm(data) {
         let $items = data.val(),
             $keys = Object.keys($items)

             for(let i = 0; i < $keys.length; i++){
               let $key = $keys[i];

               let $remove_pending = databases.ref("/paymentPending/" + $key)

               $remove_pending.remove()
             }
        }

        function nm(err) {
          
        }
      }
    }
  },
  {
    path: '/finished/',
    url: './pages/finished.html'
  },
  {
    path: '/notificacoes/',
    componentUrl: './pages/notificacoes.html',
    on: {
      pageInit: function(){
        returnMessages()
      }
    }
  },
  {
    path: '/user-page/',
    url: './pages/user-page.html',
    on: {
      pageInit: function(){
        let $mesa = sessionStorage.getItem("mkep1"),
            $name_user = sessionStorage.getItem("user_name_login"),
            $container_name = document.getElementById("name_user"),
            $mesa__container = document.getElementById("mesa__atual");

            $mesa__container.innerText = "Mesa atual " + $mesa
            $container_name.innerText = $name_user
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
    path: '/form/',
    url: './pages/form.html',
  },
  {
    path: '/itemPage/nome/:nome/description/:description/image/:image/price/:price/key/:key',
    async: function ({ router, to, resolve }) {
      var app = router.app;

      var nome = to.params.nome,
      description = to.params.description,
      image = to.params.image,
      key = to.params.key,
      price = to.params.price;
        var user = {
          description: description,
          nome: nome,
          key: key,
          price: price,
          image: image,
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/item-page.html',
          },
          {
            props: {
              user: user,
            }
          }
        );
    },
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
    path: '/payment/',
    url: './pages/payment.html',
    on: {
      pageInit: function(){
        VerifiItemsCartAcct()
      }
    }
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    componentUrl: './pages/dynamic-route.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];

