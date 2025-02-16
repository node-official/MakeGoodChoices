'use strict';

const dialogue_images = {
    'START': '/MakeGoodChoices/assets/images/dialogue/start.png',
    'ROOM': '/MakeGoodChoices/assets/images/dialogue/room.png',
};

const dialogues = {
    // The Beginning
    start: {
        text: "You wake up in a dark, damp room; it feels like you have been kidnapped. What will you do?",
        image: 'ROOM',
        choices: [ { text: "Look around", next: "lookAround" }, { text: "Scream and call for help", next: "panic" } ]
    },
    panic: {
        text: "No one heard your cries.",
        image: 'ROOM',
        choices: [ { text: "Look around", next: "lookAround" } ]
    },
    
    // Looking around
    lookAround: {
        text: "This is a dark and damp room, illuminated by a single dim light bulb. What will you do?",
        image: 'ROOM',
        choices: [
            { text: "Examine the door", next: "inspectDoor" },
            { text: "Examine the window", next: "inspectWindow" },
            { text: "Examine the desk", next: "inspectDesk" },
            { text: "Examine the drawer", next: "inspectShelf" },
        ]
    },
    
    inspectDoor: {
        text: function(states) {
            return states[0][0] ? "You open the door and find yourself free. (THE END)" : "You try to open the door, but it is locked. Maybe you should look for a key?";
        },
        choices: [ { text: "Look around", next: "lookAround" } ]
    },
    inspectWindow: {
        text: "You see a barred window that you cannot escape through.",
        choices: [ { text: "Look around", next: "lookAround" } ]
    },
    inspectDesk: {
        text: "There is nothing on the desk.",
        choices: [ { text: "Look around", next: "lookAround" } ]
    },
    inspectShelf: {
        text: function(states) {
            setTimeout(() => {
                states[0][0] = true;
            }, 1000);
            
            return states[0][0] ? "You examine the drawer and find nothing." : "You examine the drawer and find an old key.";
        },
        choices: [ { text: "Look around", next: "lookAround" } ]
    }
};

const imageElement = document.getElementById('dialogue_image');
const dialogueElement = document.getElementById('dialogue');
const choicesElement = document.getElementById('choices');

let currentDialogue = 'start';
let states = [[false]]; // [[Ключ в Ящике]]

function typeText(text, element, callback) {
    let index = 0;
    element.innerHTML = '';
    
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 20);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

function renderDialogue() {
    choicesElement.innerHTML = '';
    
    const dialogue = dialogues[currentDialogue];
    
    imageElement.src = dialogue_images[dialogue.image] ?? '';
    
    const text = typeof dialogue.text === 'function' ? dialogue.text(states) : dialogue.text;
    typeText(text, dialogueElement, () => {
        const choices = typeof dialogue.choices === 'function' ? dialogue.choices(states) : dialogue.choices;
        choices.forEach(choice => {
            const button = document.createElement('button');
            
            button.className = 'choice';
            button.innerText = choice.text;
            button.onclick = () => {
                currentDialogue = choice.next;
                renderDialogue();
            };
            
            choicesElement.appendChild(button);
        });
    });
}

renderDialogue();
