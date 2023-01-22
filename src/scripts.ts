import axios from 'axios';

type Character = {
    id: number;
    name: string;
    affiliation: string;
    image: string
}

const characterCards = document.querySelectorAll<HTMLDivElement>(".card");
const cardsContainer = document.querySelector<HTMLDivElement>(".cards__container")
let cardIdArray :number[] = [];


// Function for CREATING CARDS
const createSingleCard = (character: Character) => {
    const cardDiv = document.createElement("div");
    if(cardIdArray.includes(character.id)){
        return;
    }
    cardDiv.setAttribute("id", String(character.id))
    cardIdArray.push(character.id);


    cardDiv.classList.add("card")
    cardDiv.classList.add("mb-30");
    cardsContainer.appendChild(cardDiv);
    

    const imageDiv = document.createElement("div");
    const image = document.createElement("img") as HTMLImageElement;

    image.setAttribute("src", character.image);
    image.setAttribute("alt", character.name);
    image.setAttribute("width", "70%");
    image.style.border = "1px solid black"

    imageDiv.classList.add("card__image");
    imageDiv.appendChild(image)

    const cardTitle = document.createElement("h2");
    cardTitle.classList.add("mt-30")
    cardTitle.classList.add("mb-10")
    cardTitle.innerHTML = character.name;

    const cardAffiliation = document.createElement("h3");
    cardAffiliation.innerHTML = character.affiliation;
    cardAffiliation.classList.add("mb-30")

    const buttonContainer = document.createElement("div");
    const editButton = document.createElement("div");
    const deleteButton = document.createElement("div");

    editButton.innerHTML = "EDIT";
    editButton.classList.add("button");
    deleteButton.innerHTML = "DELETE";
    deleteButton.classList.add("button");

    buttonContainer.classList.add("button__container");
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    const editForm = document.createElement("form") as HTMLFormElement;
    const editTitleInput = document.createElement("input") as HTMLInputElement;
    editTitleInput.setAttribute("type", "text");
    editTitleInput.placeholder = "New Title"
    const editContentInput = document.createElement("textarea") as HTMLTextAreaElement;
    editContentInput.placeholder = "New description"
    const updateInputButton = document.createElement("button") as HTMLButtonElement;
    updateInputButton.classList.add("button");
    updateInputButton.innerHTML = "UPDATE"
    editForm.classList.add("card-form-container");
    editForm.classList.add("mt-30")

    editForm.appendChild(editTitleInput);
    editForm.appendChild(editContentInput);
    editForm.appendChild(updateInputButton);
    editForm.style.display = "none";
    

    cardDiv.appendChild(imageDiv);
    cardDiv.appendChild(cardTitle);
    cardDiv.appendChild(cardAffiliation);
    cardDiv.appendChild(buttonContainer);  
    cardDiv.appendChild(editForm);

    createDeleteEvent(deleteButton);

    // EDIT CARD
    editButton.addEventListener("click", () => {
        editForm.style.display = "flex";
    })

    // UPDATE CARD
    updateInputButton.addEventListener("click", () => {
        let title = editTitleInput.value
        let value = editContentInput.value
        const index = editButton.parentElement.parentElement.id;
        axios.patch<Character>("http://localhost:3004/simpsons/" + index, {
            name: title,
            affiliation: value
        });
        
    })
}



const createDeleteEvent = (deleteButton: HTMLDivElement) => {
    deleteButton.addEventListener("click", () => {
        const index = deleteButton.parentElement.parentElement.id;
        axios.delete("http://localhost:3004/simpsons/" + index);
        cardIdArray.splice(cardIdArray.indexOf(+index), 1);
        location.reload()    
    })
}
const createCards = () =>{
    axios.get("http://localhost:3004/simpsons").then(res => {
        const simpsons: Character[] = res.data;
        simpsons.forEach(character => {
            createSingleCard(character); 
        });
    })
}

// DISPLAYING ALL CARDS
createCards();

