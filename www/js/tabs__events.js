function returnEvents(){
$(".panel").on("panel:open", function(){
  var range = app.range.create({
      el: '.range-slider',
      on: {
        change: function () {
          console.log('Range Slider value changed')
        }
      }
    })
})

let $menu_cart = document.getElementById("navbar-hide-tab")



$("#tab-4, #tab-5").on("tab:show", function(){
 setTimeout(() => {
  $menu_cart.style.display = "none"
 }, 100);
 returnMusic()
})

$("#tab-4, #tab-5").on("tab:hide", function(){
    $menu_cart.style.display = "block"
    
})

let $input__search = document.getElementById("filter__search")

$(".tab").on("tab:show", function(){
  let $input_value = $input__search.value
 if($input_value.length >= 1)
 {

  $input__search.value = ""
  let count = 0;

  $(".item-title").each(function(){
    $(this).parent().parent().parent().parent().show()
    count++
  });
 }
})

    let $textH2 = $(".text-updt");

$("#tab-1").on("tab:show", function(){
   $textH2.text("Especialidades da casa")
})

$("#tab-2").on("tab:show", function(){

   $textH2.text("Bebidas")
   returnEspeciais()
})


$("#tab-3").on("tab:show", function(){
   $textH2.text("Comida oriental")
})
}

