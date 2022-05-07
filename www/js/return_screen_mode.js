
async function returnEspeciaisScreenMode()
{
  var ref = databases.ref('/cardapio').orderByChild("categoria").equalTo("especiais")
  await ref.on('value', especiaisSucessScreenMode, especiaisErrorScreenMode)


function especiaisSucessScreenMode(data)
{
if(data.exists())
{

 let container = document.getElementById("scroll__especiais__screen__mode")
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

        container.appendChild(card)
        revelCard__especiais__ScreenMode()
        
 }

}
}


function revelCard__especiais__ScreenMode(){
  
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


function especiaisErrorScreenMode(err)
{
  consoloe.log(err)
}
}



async function returnOrientalScreenMode()
{
  var ref = databases.ref('/cardapio').orderByChild("categoria").equalTo("oriental")
  await ref.on('value', orientalSuccessScreenMode, orientalErrorScreenMode)


function orientalSuccessScreenMode(data)
{
if(data.exists())
{
  console.log("existe")
 let container = document.getElementById("scroll_oriental__screen__mode")
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
 
        container.appendChild(card)
        revelCardScreenMode()

 }
}
}


function orientalErrorScreenMode(err)
{
  consoloe.log(err)
}
}

function revelCardScreenMode(){
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