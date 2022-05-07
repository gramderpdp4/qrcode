
async function returnBebidas()
{
  var databases = firebase.database();
  var ref = databases.ref('/cardapio').orderByChild("categoria").equalTo("bebida")
  await ref.on('value', pedidos, pedidoErr)


function pedidos(data)
{

if(data.exists())
{
 let container = document.getElementById("scroll__event")
 var chave = data.val()
 console.log(chave)
 var revertion = Object.keys(chave)
 var keys = revertion.slice(0).reverse();

 window.sr = ScrollReveal({ reset: false });
 
 container.innerHTML = ""

 for(var i = 0; i < keys.length; i++)
 {
      let key = keys[i],
      nome = chave[key].nome,
      price = chave[key].price,
      imagem = chave[key].imagem;
      
      let card = document.createElement("div"),
          a_card = document.createElement("a"),
          cardImg = document.createElement("div"),
          img = document.createElement("img"),
          cardContainer = document.createElement("div"),
          svg__button = document.createElement('a'),
          p = document.createElement("p"),
          pName = document.createElement("p"),
          divContent = document.createElement("div"),
          divInner = document.createElement("div"),
          divSvg = document.createElement("div"),
          a = document.createElement("a");

          card.classList.add("card-p1")
          cardImg.classList.add("card-image")
          img.src = imagem
          p.innerText = "R$ " + price
          pName.innerText = nome
          pName.classList.add("item-title")
          pName.style.color = "white"
          if(sessionStorage.getItem(`like${key}`))
          {
            svg__button.classList.add("liked")
            divSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="scale-in-center" width="16.114" height="14.092" viewBox="0 0 24 24" style="fill: #00FD00"><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path></svg>`
          }else{
            divSvg.innerHTML = `<svg id="Icon-Heart" xmlns="http://www.w3.org/2000/svg" width="16.114" height="14.092" viewBox="0 0 16.114 14.092">
            <path id="Fill-18" d="M-161.843-204.808l-.27-.236c-6.136-4.989-7.788-6.742-7.788-9.608a4.252,4.252,0,0,1,4.248-4.248,4.869,4.869,0,0,1,3.809,1.955,4.869,4.869,0,0,1,3.809-1.955,4.252,4.252,0,0,1,4.248,4.248c0,2.866-1.652,4.619-7.788,9.608l-.27.236Zm-3.809-13.215a3.381,3.381,0,0,0-3.371,3.371c0,2.461,1.551,4.079,7.181,8.7,5.63-4.619,7.181-6.237,7.181-8.7a3.381,3.381,0,0,0-3.371-3.371,4.208,4.208,0,0,0-3.3,1.82l-.506.573-.506-.573a4.209,4.209,0,0,0-3.3-1.82Z" transform="translate(169.9 218.9)" fill="#fff"/>
          </svg>`
          }
         
          p.style.color = "white"
          p.classList.add("mt-1")
          cardContainer.classList.add("row", "card__container-details")
          p.style.color = "white"
          a.style.textTransform = "none"
          a.classList.add("button", "button-p1")

          svg__button.id = key
          svg__button.setAttribute("onclick", "addLike(this,\'" + key + "\')")


          a_card.setAttribute("onclick", "viewItem(\'" + key + "\', \'" + nome + "\',  \'" + price + "\')")
          a_card.setAttribute("data-transition", "f7-parallax")
          a_card.setAttribute("href", "/itemPage/")

          
          a.textContent = "Adicionar"
          a.setAttribute("onclick", "addCart(\'" + nome + "\', \'" + price + "\')")
          cardImg.appendChild(img)
          cardContainer.appendChild(p)
          divInner.appendChild(pName)
          divContent.appendChild(divInner)
          
          cardContainer.appendChild(a)
          svg__button.appendChild(divSvg)
          card.appendChild(svg__button)
          card.appendChild(cardImg)
          card.appendChild(divContent)
          card.appendChild(cardContainer)
          a_card.appendChild(card)

          container.appendChild(a_card)

          container.style.opacity = "0"

          

 }

 sr.reveal('.card-p1', {
  container: '.row-p1.scrollreveal__container',
  distance: '200%',
  origin: 'bottom',
  opacity: 0,
  useDelay: 'once',
  delay: 80,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
  duration: 1300,
  scale: 1,
})


sr.reveal('.card-image', {
  container: '.row-p1.scrollreveal__container',
  distance: '200%',
  origin: 'bottom',
  opacity: 0,
  delay: 90,
  duration: 1300,
  scale: 1,
})

setTimeout(() => {
  container.style.opacity = "1"
}, 10);
initSearch()

}

}


function pedidoErr(err)
{
  consoloe.log(err)
}
}



async function returnMusic()
{
  var databases = firebase.database();
  var ref = databases.ref('musica')
  await ref.on('value', musics, musicsError)


function musics(data)
{
  let $music__max__value = 0;
  let $music__max__text = 0;
  let $result__arr = "";
if(data.exists())
{
 let $music__container = document.getElementById("music__list"),  
     $music__max = document.getElementById("list__music__max"),
     $button = document.getElementById("button__vota");

 let chave = data.val()
 let items = Object.keys(chave)
 let arraY = []

 $music__container.innerHTML = ""

 for(let i = 0; i < items.length; i++)
 {
  let key = items[i],
      item__name = chave[key].nome,
      item__votacao = chave[key].votacao;
      

      arraY.push(parseFloat(item__votacao))

      if ( item__votacao > $music__max__value ) {
        $music__max__value = item__votacao
        $music__max__text = item__name
     }

  let li = document.createElement("li"),
      label = document.createElement("label"),
      input = document.createElement("input"),
      div__icon = document.createElement("i"),
      div__inner = document.createElement("div"),
      div__title = document.createElement("div");

      label.classList.add("item-radio", "item-radio-icon-start", "item-content")
      div__inner.classList.add("item-inner")
      div__title.classList.add("item-title")
      div__icon.classList.add("icon", "icon-radio")
      input.type = "radio"
      input.value = item__name
      input.id = key
      input.setAttribute("data-votacao", item__votacao)
      input.name = "demo-radio-start"
      div__title.innerText = item__name
      div__inner.appendChild(div__title)
      label.appendChild(input)
      label.appendChild(div__icon)
      label.appendChild(div__inner)
      li.appendChild(label)

      $music__container.appendChild(li)  
      $button.style.display = "block";

}

function calculo__music(){
  let count_value = 0
  for(let a in arraY)
  {
    count_value += arraY[a]
  }
  return count_value
}

$music__max.innerText = $music__max__value

let $soma__loop__music = calculo__music()

let $result__music_vot =  $music__max__value * 100 / $soma__loop__music

let $result__replace = parseFloat($result__music_vot.toFixed(2))

$music__max.innerText = $music__max__text + " " + $result__replace + "% dos votos"

let button_send_voto = document.getElementById("button__vota")

button_send_voto.addEventListener("click", function(){
  let $return__session__voto = sessionStorage.getItem("voto__count__success")

  if($return__session__voto == "true")
  {
    let $toast = app.toast.create({
      text: "Você já votou, aguarde o fim dessa rodada para votar novamente",
      closeTimeout: 4500,
      buttonOK: true
    })

    $toast.open()
  }else
  {
    let items__radio = $("input[name=demo-radio-start]");
    items__radio.each(function(e){
        if(e.checked)
        {
          let key = e.id;
          let count__votacao = e.getAttribute("data-votacao")
          let sum__votacao = parseInt(count__votacao) + parseInt(1)

          let $database = firebase.database()
          let $ref = $database.ref("/musica/" + key)

          let data__update = {
            votacao: sum__votacao
          }

          $ref.update(data__update)
          .then(function(){
            let $success = app.toast.create({
              text: "Voto computado com sucesso",
              closeTimeout: 2000
            })
            $success.open()

            sessionStorage.setItem("voto__count__success", "true")

          })
          .catch(function(){
            let $error = app.toast.create({
              text: "Falha ao votar, tente novamente",
              closeTimeout: 2000
            })
            $error.open()

          })
        
        }
    })
  }
})
}
}


function musicsError(err)
{
  consoloe.log(err)
}
}




async function returnEspeciais()
{
  console.log("return")
  var databases = firebase.database();
  var ref = databases.ref('/cardapio').orderByChild("categoria").equalTo("especiais")
  await ref.on('value', especiaisSucess, especiaisError)


function especiaisSucess(data)
{
if(data.exists())
{
  console.log("existe")
 let container = document.getElementById("scroll__especiais")
 var chave = data.val()
 console.log(chave)
 var revertion = Object.keys(chave)
 var keys = revertion.slice(0).reverse();

 window.sr = ScrollReveal({ reset: false });
 
 container.innerHTML = ""

 for(var i = 0; i < keys.length; i++)
 {
      let key = keys[i],
      nome = chave[key].nome,
      price = chave[key].price,
      imagem = chave[key].imagem;
      
      let card = document.createElement("div"),
      cardImg = document.createElement("div"),
      img = document.createElement("img"),
      cardContainer = document.createElement("div"),
      svg__button = document.createElement('a'),
      p = document.createElement("p"),
      pName = document.createElement("p"),
      divContent = document.createElement("div"),
      divInner = document.createElement("div"),
      divSvg = document.createElement("div"),
      a = document.createElement("a");

      card.classList.add("card-p1")
      cardImg.classList.add("card-image")
      img.src = imagem
      p.innerText = "R$ " + price
      pName.innerText = nome
      pName.classList.add("item-title")
      pName.style.color = "white"
      if(sessionStorage.getItem(`like${key}`))
      {
        svg__button.classList.add("liked")
        divSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="scale-in-center" width="16.114" height="14.092" viewBox="0 0 24 24" style="fill: #00FD00"><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path></svg>`
      }else{
        divSvg.innerHTML = `<svg id="Icon-Heart" xmlns="http://www.w3.org/2000/svg" width="16.114" height="14.092" viewBox="0 0 16.114 14.092">
        <path id="Fill-18" d="M-161.843-204.808l-.27-.236c-6.136-4.989-7.788-6.742-7.788-9.608a4.252,4.252,0,0,1,4.248-4.248,4.869,4.869,0,0,1,3.809,1.955,4.869,4.869,0,0,1,3.809-1.955,4.252,4.252,0,0,1,4.248,4.248c0,2.866-1.652,4.619-7.788,9.608l-.27.236Zm-3.809-13.215a3.381,3.381,0,0,0-3.371,3.371c0,2.461,1.551,4.079,7.181,8.7,5.63-4.619,7.181-6.237,7.181-8.7a3.381,3.381,0,0,0-3.371-3.371,4.208,4.208,0,0,0-3.3,1.82l-.506.573-.506-.573a4.209,4.209,0,0,0-3.3-1.82Z" transform="translate(169.9 218.9)" fill="#fff"/>
      </svg>`
      }
     
      p.style.color = "white"
      p.classList.add("mt-1")
      cardContainer.classList.add("row", "card__container-details")
      p.style.color = "white"
      a.style.textTransform = "none"
      a.classList.add("button", "button-p1")

      svg__button.id = key
      svg__button.setAttribute("onclick", "addLike(this,\'" + key + "\')")

      
      a.textContent = "Adicionar"
      a.setAttribute("onclick", "addCart(\'" + nome + "\', \'" + price + "\')")
      cardImg.appendChild(img)
      cardContainer.appendChild(p)
      divInner.appendChild(pName)
      divContent.appendChild(divInner)
      
      cardContainer.appendChild(a)
      svg__button.appendChild(divSvg)
      card.appendChild(svg__button)
      card.appendChild(cardImg)
      card.appendChild(divContent)
      card.appendChild(cardContainer)

      $("#tab-2").on("tab:show", function(){
        container.appendChild(card)
        revelCard__especiais()
      })
        
 }

}
}


function revelCard__especiais(){
  
 sr.reveal('.card-p1', {
  container: '.row-p1.scrollreveal__container__especiais',
  distance: '150%',
  origin: 'bottom',
  opacity: 0,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
  useDelay: 'once',
  delay: 20,
  duration: 1400,
  scale: 1,
})


sr.reveal('.card-image', {
  container: '.row-p1.scrollreveal__container__especiais',
  distance: '150%',
  origin: 'bottom',
  opacity: 0,
  useDelay: 'once',
  delay: 30,
  duration: 1400,
  scale: 1,
})
}


function especiaisError(err)
{
  consoloe.log(err)
}
}


async function returnOriental()
{
  console.log("return")
  var databases = firebase.database();
  var ref = databases.ref('/cardapio').orderByChild("categoria").equalTo("oriental")
  await ref.on('value', orientalSuccess, orientalError)


function orientalSuccess(data)
{
if(data.exists())
{
  console.log("existe")
 let container = document.getElementById("scroll_oriental")
 var chave = data.val()
 console.log(chave)
 var revertion = Object.keys(chave)
 var keys = revertion.slice(0).reverse();

 window.sr = ScrollReveal({ reset: false });
 
 container.innerHTML = ""

 for(var i = 0; i < keys.length; i++)
 {
      let key = keys[i],
      nome = chave[key].nome,
      price = chave[key].price,
      imagem = chave[key].imagem;
      let card = document.createElement("div"),
      cardImg = document.createElement("div"),
      img = document.createElement("img"),
      cardContainer = document.createElement("div"),
      svg__button = document.createElement('a'),
      p = document.createElement("p"),
      pName = document.createElement("p"),
      divContent = document.createElement("div"),
      divInner = document.createElement("div"),
      divSvg = document.createElement("div"),
      a = document.createElement("a");

      card.classList.add("card-p1")
      cardImg.classList.add("card-image")
      img.src = imagem
      p.innerText = "R$ " + price
      pName.innerText = nome
      pName.classList.add("item-title")
      pName.style.color = "white"
      if(sessionStorage.getItem(`like${key}`))
      {
        svg__button.classList.add("liked")
        divSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="scale-in-center" width="16.114" height="14.092" viewBox="0 0 24 24" style="fill: #00FD00"><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path></svg>`
      }else{
        divSvg.innerHTML = `<svg id="Icon-Heart" xmlns="http://www.w3.org/2000/svg" width="16.114" height="14.092" viewBox="0 0 16.114 14.092">
        <path id="Fill-18" d="M-161.843-204.808l-.27-.236c-6.136-4.989-7.788-6.742-7.788-9.608a4.252,4.252,0,0,1,4.248-4.248,4.869,4.869,0,0,1,3.809,1.955,4.869,4.869,0,0,1,3.809-1.955,4.252,4.252,0,0,1,4.248,4.248c0,2.866-1.652,4.619-7.788,9.608l-.27.236Zm-3.809-13.215a3.381,3.381,0,0,0-3.371,3.371c0,2.461,1.551,4.079,7.181,8.7,5.63-4.619,7.181-6.237,7.181-8.7a3.381,3.381,0,0,0-3.371-3.371,4.208,4.208,0,0,0-3.3,1.82l-.506.573-.506-.573a4.209,4.209,0,0,0-3.3-1.82Z" transform="translate(169.9 218.9)" fill="#fff"/>
      </svg>`
      }
     
      p.style.color = "white"
      p.classList.add("mt-1")
      cardContainer.classList.add("row", "card__container-details")
      p.style.color = "white"
      a.style.textTransform = "none"
      a.classList.add("button", "button-p1")

      svg__button.id = key
      svg__button.setAttribute("onclick", "addLike(this,\'" + key + "\')")

      
      a.textContent = "Adicionar"
      a.setAttribute("onclick", "addCart(\'" + nome + "\', \'" + price + "\')")
      cardImg.appendChild(img)
      cardContainer.appendChild(p)
      divInner.appendChild(pName)
      divContent.appendChild(divInner)
      
      cardContainer.appendChild(a)
      svg__button.appendChild(divSvg)
      card.appendChild(svg__button)
      card.appendChild(cardImg)
      card.appendChild(divContent)
      card.appendChild(cardContainer)

   

      $("#tab-3").on("tab:show", function(){
        container.appendChild(card)
        revelCard()
      })
        

 }
}
}


function orientalError(err)
{
  consoloe.log(err)
}
}

function revelCard(){
  
 sr.reveal('.card-p1', {
  container: '.row-p1#scroll_oriental',
  distance: '150%',
  origin: 'bottom',
  opacity: 0,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
  useDelay: 'once',
  delay: 20,
  duration: 1400,
  scale: 1,
})


sr.reveal('.card-image', {
  container: '.row-p1#scroll_oriental',
  distance: '150%',
  origin: 'bottom',
  opacity: 0,
  delay: 30,
  duration: 1400,
  scale: 1,
})
}