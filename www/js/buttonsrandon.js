
InitializeApp()

async function InitializeApp(){

    const buttons = 50;

    let numberButton = 0;

    for(let i = 0; i < buttons; i++){
    
        numberButton++

        await OddEvenNumber(numberButton)
        .then(result => {

            if(result == 0){

                const button = document.createElement("button");
                button.textContent = numberButton
                button.setAttribute("onclick", "ViewImage()")
        
                document.body.appendChild(button)

            }else
            {

                const button = document.createElement("button");
                button.textContent = numberButton
        
                document.body.appendChild(button)

            }

        })
    }
}

async function OddEvenNumber(num) { 

    return Number(num % 2);

}