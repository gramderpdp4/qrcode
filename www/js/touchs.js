function TouchEnd(Event, Element, Navbar, Subnavbar){

    const ElementScrollTop = Element.scrollTop;

}

function TouchMove(Event, Element, Navbar, Subnavbar){

    const ElementScrollTop = Element.scrollTop;

    let StateScrolled = 0

    if(StateScrolled == 0){

        if(ElementScrollTop < 165){

            Subnavbar.style.transform = `translateY(${-ElementScrollTop}%)`
            Navbar.style.transform = `translateY(${-ElementScrollTop}%)`

        }
    }

}