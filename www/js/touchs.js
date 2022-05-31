function TouchMove(Event, Element, Navbar, Subnavbar, NavbarParent){

  const ElementTxt = Element.previousElementSibling;

  if(Element.scrollTop > 15){

    if(!Subnavbar.classList.contains("animation-scrolled-hidden")){

        Subnavbar.classList.add("animation-scrolled-hidden")
        Navbar.classList.add("animation-scrolled-hidden")
        ElementTxt.classList.add("animation-scrolled-hidden-text")
        Element.style.marginTop = "1.3rem"

        $(".p1-container-full .navbar").css({
          "height": "7rem"
        })
    
    }
  }else{

    if(Subnavbar.classList.contains("animation-scrolled-hidden")){

        Subnavbar.classList.remove("animation-scrolled-hidden")
        Navbar.classList.remove("animation-scrolled-hidden")
        ElementTxt.classList.remove("animation-scrolled-hidden-text")
        Element.style.marginTop = "15vh"

        $(".p1-container-full .navbar").css({
          "height": "10rem"
        })
        
    }

  }
}