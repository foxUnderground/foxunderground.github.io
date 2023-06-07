let battleLogo = new Image()
battleLogo.src = 'https://i.imgur.com/2p7m8oS.png'
let foxesLogo = new Image()
foxesLogo.src = 'https://i.imgur.com/PTOzBZR.png'
let foxesSources = {
    'light': 'https://i.imgur.com/3YAfzoQ.png',
    'normal': 'https://i.imgur.com/Yug781V.png',
    'heavy': 'https://i.imgur.com/uagqKTA.png'
}
let arrowBack = new Image()
arrowBack.src = 'https://i.imgur.com/rQVFE10.png'
let arrowLeft = new Image()
arrowLeft.src = 'https://i.imgur.com/rQVFE10.png'
let menuBackground = new Image()
menuBackground.src = 'https://i.imgur.com/CVcFkVU.png'
let map = new Image()
map.src = 'https://i.imgur.com/rYd2tNH.png'
// Define a variable to store the current page of foxes
let page = 0;
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
// Define some constants for the card size and spacing
const CARD_WIDTH = 200;
const CARD_HEIGHT = 300;
const CARD_SPACING = 10;
let team = []
// Define a variable to store the horizontal offset of the cards
let offsetX = 0;
// Define a variable to store the number of foxes per page
let perPage = Math.floor(canvas.width / (CARD_WIDTH + CARD_SPACING));
class JudoFox {
    constructor(weight, name, muscularMass) {
        this.weight = weight;
        this.name = name;
        this.muscularMass = muscularMass;
        this.image = new Image()
        this.image.src = foxesSources[weight]
        this.isTraining = false
        setInterval(() => {
            this.muscularMass -= 1;
        }, 3600000);
    }

    training() {
        this.isTraining = true
        setTimeout(() => { this.muscularMass += 1; this.isTraining = false }, 120000);
    }
    draw(i) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, i * 32, 0, 32, 32)
    }
}
let mx, my;
canvas.onclick = (e) => {
    // Get the mouse position relative to the canvas
    let rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
    console.log(mx, my)
}
// Define a function to draw a card with an image and a button
function drawCard(x, y, image, name, fox, click, text) {
    // Draw a rounded rectangle for the card background
    ctx.fillStyle = "#2A3132";
    ctx.strokeStyle = team.indexOf(fox) == -1 ? "black" : "gold";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x + 10, y);
    ctx.lineTo(x + CARD_WIDTH - 10, y);
    ctx.quadraticCurveTo(x + CARD_WIDTH, y, x + CARD_WIDTH, y + 10);
    ctx.lineTo(x + CARD_WIDTH, y + CARD_HEIGHT - 10);
    ctx.quadraticCurveTo(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH - 10, y + CARD_HEIGHT);
    ctx.lineTo(x + 10, y + CARD_HEIGHT);
    ctx.quadraticCurveTo(x, y + CARD_HEIGHT, x, y + CARD_HEIGHT - 10);
    ctx.lineTo(x, y + 10);
    ctx.quadraticCurveTo(x, y, x + 10, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw the image on the card
    let img = image
    // Scale and center the image to fit the card
    let scale = Math.min(CARD_WIDTH / img.width, (CARD_HEIGHT - 50) / img.height);
    let w = img.width * scale;
    let h = img.height * scale;
    let cx = x + (CARD_WIDTH - w) / 2;
    let cy = y + (CARD_HEIGHT - h - 50) / 2;
    ctx.drawImage(img, cx, cy, w, h);

    // Draw the name of the fox below the image
    ctx.fillStyle = "black";
    ctx.font = "30px slkscr";
    ctx.textAlign = "center";
    ctx.fillText(name, x + CARD_WIDTH / 2, y + CARD_HEIGHT - 50);
    if (!fox.isTraining) {
        // Define the button parameters
        var width = CARD_WIDTH / 2; // You can change this value
        var height = 20; // You can change this value
        var x = x + CARD_WIDTH / 2 - width / 2; // Center the button horizontally
        var y = CARD_HEIGHT - height - 10 + y; // Center the button vertically
        var radius = 5; // You can change this value
        var color = "green"; // You can change this value

        // Draw the button shape using a path
        ctx.beginPath();
        ctx.moveTo(x + radius, y); // Move to the top left corner
        ctx.lineTo(x + width - radius, y); // Draw a line to the top right corner
        ctx.arcTo(x + width, y, x + width, y + radius, radius); // Draw a rounded corner
        ctx.lineTo(x + width, y + height - radius); // Draw a line to the bottom right corner
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Draw a rounded corner
        ctx.lineTo(x + radius, y + height); // Draw a line to the bottom left corner
        ctx.arcTo(x, y + height, x, y + height - radius, radius); // Draw a rounded corner
        ctx.lineTo(x, y + radius); // Draw a line to the top left corner
        ctx.arcTo(x, y, x + radius, y, radius); // Draw a rounded corner
        ctx.closePath();

        // Fill the button with color
        ctx.fillStyle = color;
        ctx.fill();

        // Add some text to the button
        ctx.fillStyle = "white"; // You can change this value
        ctx.font = "15px slkscr"; // You can change this value
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x + width / 2, y + height / 2); // You can change this value
        if (mx > x && my > y && my < y + height && mx < x + width) {
            click(fox)
        }
    }

}

// Define a function to draw all the cards on the current page
function drawCards(click, text) {

    // Loop through the array of foxes on the current page and draw a card for each one
    for (let i = page * perPage; i < Math.min((page + 1) * perPage, foxes.length); i++) {

        // Calculate the position of the card based on the index and page
        let row = Math.floor((i - page * perPage) / Math.floor(canvas.width / (CARD_WIDTH + CARD_SPACING)));
        let col = (i - page * perPage) % Math.floor(canvas.width / (CARD_WIDTH + CARD_SPACING));
        let x = col * (CARD_WIDTH + CARD_SPACING) + CARD_SPACING;
        let y = (canvas.height - (CARD_HEIGHT)) / 2;

        // Draw the card with the image and name of the fox
        drawCard(x, y, foxes[i].image, foxes[i].name, foxes[i], click, text);
    }

    // Draw a left arrow below the cards to go to the previous page
    // Draw a right arrow below the cards to go to the next page
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(arrowLeft, 0, 0, arrowLeft.width, arrowLeft.height, -64, canvas.height / 2 - 32, 64, 64)
    ctx.restore()

    if (mx >= 0 && mx <= 64 &&
        my >= canvas.height / 2 - 32 && my <= canvas.height / 2 + 32) {
        // Decrease the page by one if possible
        if (page > 0) {
            page--;
        }

    };

    ctx.drawImage(arrowLeft, 0, 0, arrowLeft.width, arrowLeft.height, canvas.width - 64, canvas.height / 2 - 32, 64, 64)


    // Check if the mouse is inside the right arrow area
    if (mx >= canvas.width - 64 && mx <= canvas.width &&
        my >= canvas.height / 2 - 32 && my <= canvas.height / 2 + 32) {
        // Increase the page by one if possible
        if (page < Math.ceil(foxes.length / perPage) - 1) {
            page++;
        }

        // Redraw the cards on the new page
    }
}

function card(x, y, name, image, click) {
    // Draw a rounded rectangle for the card background
    ctx.fillStyle = "#2A3132";
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x + 10, y);
    ctx.lineTo(x + CARD_WIDTH - 10, y);
    ctx.quadraticCurveTo(x + CARD_WIDTH, y, x + CARD_WIDTH, y + 10);
    ctx.lineTo(x + CARD_WIDTH, y + CARD_HEIGHT - 10);
    ctx.quadraticCurveTo(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH - 10, y + CARD_HEIGHT);
    ctx.lineTo(x + 10, y + CARD_HEIGHT);
    ctx.quadraticCurveTo(x, y + CARD_HEIGHT, x, y + CARD_HEIGHT - 10);
    ctx.lineTo(x, y + 10);
    ctx.quadraticCurveTo(x, y, x + 10, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Draw the name of the fox below the image
    ctx.fillStyle = "black";
    ctx.font = "40px slkscr";
    ctx.textAlign = "center";
    ctx.fillText(name, x + CARD_WIDTH / 2, y + CARD_HEIGHT - 30);
    let img = image
    // Scale and center the image to fit the card
    let scale = Math.min(CARD_WIDTH / (img.width + 40), (CARD_HEIGHT - 50) / (img.height + 40));
    let w = img.width * scale;
    let h = img.height * scale;
    let cx = x + (CARD_WIDTH - w) / 2;
    let cy = y + (CARD_HEIGHT - h - 50) / 2;
    ctx.drawImage(img, cx, cy, w, h);
    if (mx < x + CARD_WIDTH && mx > x && my < y + CARD_HEIGHT && my > y) {
        click()
    }

}
let foxes = [new JudoFox('light', 'Robson', 10), new JudoFox('normal', 'Ronald', 15), new JudoFox('heavy', 'Romary', 15), new JudoFox('normal', 'Renan', 10),]
let menu = 'start'

function update() {
    ctx.drawImage(menuBackground, 0, 0, menuBackground.width, menuBackground.height, 0, -150, 640, 640)
    if (menu == 'battling') {
        ctx.drawImage(map, 0, 0, map.width, map.height, 0, -100, 640, 640)
        team.forEach(e=>{ctx.save();ctx.translate(e.x,e.y);ctx.scale(-1, 1);ctx.drawImage(e.image, 0, 0, e.image.width, e.image.height, 0, 0, 64, 64);ctx.restore()})
    }
    if (menu == 'battle') {
        drawCards((fox) => {
            if (team.indexOf(fox) == -1) team.push(fox)
        }, 'SELECT')
        ctx.save()
        ctx.rotate(Math.PI * 1.5)
        ctx.drawImage(arrowBack, 0, 0, arrowBack.width, arrowBack.height, -64, canvas.width / 2 - 32, 64, 64)
        ctx.restore()
        ctx.save()
        ctx.translate(canvas.width / 2 + 32, canvas.height - 64)
        ctx.rotate(Math.PI * 0.5)
        ctx.drawImage(arrowBack, 0, 0, arrowBack.width, arrowBack.height, 0, 0, 64, 64)
        ctx.restore()
        // Check if the mouse is inside the button area
        if (mx >= canvas.width / 2 - 32 && mx <= canvas.width / 2 + 32 &&
            my >= 0 && my <= 64) {
            menu = 'start'
            team = []

        }         // Check if the mouse is inside the button area
        if (mx >= canvas.width / 2 - 32 && mx <= canvas.width / 2 + 32 &&
            my >= canvas.height - 64 && my <= canvas.height) {
            menu = 'battling'
            team = team.map((e, i) => {
                return {
                    x: 160,
                    y: 70+i*80,
                    image: e.image                    
                }  
            })    

        }
        else {
            console.log(mx, my)
        }
    }
    else if (menu == 'start') {
        card(canvas.width / 2 - (CARD_WIDTH * 2 + CARD_SPACING * 2) / 2, canvas.height / 2 - CARD_HEIGHT / 2, 'BATTLE', battleLogo, () => { menu = 'battle' })
        card(canvas.width / 2 - (CARD_WIDTH * 2 + CARD_SPACING) / 2 + CARD_WIDTH + CARD_SPACING, canvas.height / 2 - CARD_HEIGHT / 2, 'FOXES', foxesLogo, () => { menu = 'fox' })
    }
    else if (menu == 'fox') {
        drawCards((fox) => {
            // Check if the mouse is inside the button area
            // Call a function to train the fox (not implemented here)
            fox.training()
        }, 'TRAIN')
        ctx.save()
        ctx.rotate(Math.PI * 1.5)
        ctx.drawImage(arrowBack, 0, 0, arrowBack.width, arrowBack.height, -64, canvas.width / 2 - 32, 64, 64)
        ctx.restore()

        // Check if the mouse is inside the button area
        if (mx >= canvas.width / 2 - 32 && mx <= canvas.width / 2 + 32 &&
            my >= 0 && my <= 64) {
            menu = 'start'
        } else {
            console.log(mx, my)
        }
    }
    mx = -1
    my = -1
}
setInterval(update, 1000 / 60)
console.log('hds')