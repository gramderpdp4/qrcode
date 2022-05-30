
function TouchMove(Event, Element, Navbar, Subnavbar){

    const ElementScrollTop = Element.scrollTop;

        if(ElementScrollTop <= 165 && ElementScrollTop >= 0){
            document.documentElement.style.setProperty('--animation-scrolled', `translateY(-${ElementScrollTop}%)`);

            if(!Subnavbar.classList.contains("animation-scrolled")){

                Subnavbar.classList.add("animation-scrolled")
                Navbar.classList.add("animation-scrolled")

            }          
        } 

}