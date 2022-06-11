function TouchMove(Event, Element, Navbar, Subnavbar, NavbarParent){

  const ElementTxt = Element.previousElementSibling;

  const AllContainers = document.querySelectorAll(".container-items");

  if(Element.scrollTop > 15){

    if(!Subnavbar.classList.contains("animation-scrolled-hidden")){
        Subnavbar.classList.remove("animation-scrolled-hidden-s")
        $(".navbar-home").removeClass("animation-scrolled-hidden-s")
        Navbar.classList.remove("animation-scrolled-hidden-s")
        Subnavbar.classList.add("animation-scrolled-hidden")
        ElementTxt.style.display = "none"
        $(".navbar-home").addClass("animation-scrolled-hidden")
        Navbar.classList.add("animation-scrolled-hidden")
        AllContainers.forEach(Container => {
          Container.classList.remove("animation-containers-hide")
          Container.classList.add("animation-containers")
        })
    }
  }else{

    if(Subnavbar.classList.contains("animation-scrolled-hidden")){

        Subnavbar.classList.remove("animation-scrolled-hidden")
        ElementTxt.style.display = "block"
        $(".navbar-home").removeClass("animation-scrolled-hidden")
        Navbar.classList.remove("animation-scrolled-hidden")
        Subnavbar.classList.add("animation-scrolled-hidden-s")
        $(".navbar-home").addClass("animation-scrolled-hidden-s")
        Navbar.classList.add("animation-scrolled-hidden-s")
        AllContainers.forEach(Container => {
          Container.classList.remove("animation-containers")
          Container.classList.add("animation-containers-hide")
        })
        
    }

  }
}