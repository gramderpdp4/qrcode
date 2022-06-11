function TouchMove(Event, Element, Navbar, Subnavbar, NavbarParent){

  const ElementTxt = Element.previousElementSibling;

  const AllContainers = document.querySelectorAll(".container-items");

  if(Element.scrollTop > 15){

    if(!Subnavbar.classList.contains("animation-scrolled-hidden")){

        Subnavbar.classList.add("animation-scrolled-hidden")
        ElementTxt.style.display = "none"
        $(".navbar-home").addClass("animation-scrolled-hidden")
        Navbar.classList.add("animation-scrolled-hidden")
        AllContainers.forEach(Container => {
            Container.style.marginTop = "5vh"
        })
    }
  }else{

    if(Subnavbar.classList.contains("animation-scrolled-hidden")){

        Subnavbar.classList.remove("animation-scrolled-hidden")
        ElementTxt.style.display = "block"
        $(".navbar-home").removeClass("animation-scrolled-hidden")
        Navbar.classList.remove("animation-scrolled-hidden")
        AllContainers.forEach(Container => {
          Container.style.marginTop = "15vh"
        })
        
    }

  }
}