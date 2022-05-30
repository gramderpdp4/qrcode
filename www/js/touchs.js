
function TouchMove(Event, Element, Navbar, Subnavbar){

    const ElementScrollTop = Element.scrollTop;

    let StateScrolled = 0
    let Scrolled = ElementScrollTop

    if(StateScrolled == 0){

        if(Scrolled < 40){

            Scrolled = ElementScrollTop - 20

        }

        if(Scrolled < 165){

            document.documentElement.style.setProperty('--animation-scrolled', `-${Scrolled}%`);

            if(!Subnavbar.classList.contains("animation-scrolled")){

                Subnavbar.classList.add("animation-scrolled")
                Navbar.classList.add("animation-scrolled")

            }           
        }
    }

}