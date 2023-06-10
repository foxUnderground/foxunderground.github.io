let enemyPoints = 0, points = 0;
let lastEffect = 0
let battleLogo = new Image()
battleLogo.src = 'https://i.imgur.com/2p7m8oS.png'
let foxesLogo = new Image()
foxesLogo.src = 'https://i.imgur.com/PTOzBZR.png'
let foxesSources = {
    'light': 'https://i.imgur.com/3YAfzoQ.png',
    'normal': 'https://i.imgur.com/Yug781V.png',
    'heavy': 'https://i.imgur.com/uagqKTA.png'
}
let teamSprites = {
    'light': new Image(),
    'normal': new Image(),
    'heavy': new Image(),
}
teamSprites.light.src = 'https://i.imgur.com/87iOqzJ.png'
teamSprites.normal.src = 'https://i.imgur.com/SoYuuzQ.png'
teamSprites.heavy.src = 'https://i.imgur.com/AknBwv1.png'
let arrowBack = new Image()
arrowBack.src = 'https://i.imgur.com/rQVFE10.png'
let arrowLeft = new Image()
arrowLeft.src = 'https://i.imgur.com/rQVFE10.png'
let menuBackground = new Image()
menuBackground.src = 'https://i.imgur.com/CVcFkVU.png'
let map = new Image()
map.src = 'https://i.imgur.com/h80dDSA.png'
let bell = new Image()
bell.src = 'https://i.imgur.com/BDnn8py.png'
let battleStartLogo = new Image()
battleStartLogo.src = 'https://i.imgur.com/IIoAEB9.png'
let fightEffect = new Image()
fightEffect.src = 'https://i.imgur.com/z6Pb1v7.png'
// Define a variable to store the current page of foxes
let enemieTeam
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
        this.trainingStart = Date.now()
        setTimeout(() => { this.muscularMass += 1; this.isTraining = false }, 120000);
    }
    draw(i) {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, i * 32, 0, 32, 32)
    }
}
let speeds = {
    'heavy': 0.25,
    'normal': 0.5,
    'light': 1
}
let recoils = {
    'heavy': 1,
    'normal': 0.5,
    'light': 0.25
}
function drawProgressBar(x, y, width, height, progress, text) {
    // Draw the background rectangle
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, width, height);

    // Draw the foreground rectangle
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, width * progress, height);

    // Draw the border
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = 'white'
    ctx.font = '15px slkscr'
    ctx.fillText(text, x + 50, y + 9)
}

let effects = []
function randomTeam() {
    let len = 3;
    let buf = []
    for (let i = 0; i < len; i++) {
        let weight = ['heavy', 'normal', 'light'][Math.floor(Math.random() * 3)]
        buf.push({
            rotate: 0,
            rotateDiff: 0.05,
            x: canvas.width - 160,
            y: 140 + i * 70,
            image: teamSprites[weight],
            weight: weight,
            mass: (2 + Math.random() * 4) / 30,
            focus: Math.floor(Math.random() * team.length)
        })
    }
    buf[Math.floor(Math.random() * buf.length)].focus = team.length
    return buf
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
    } else
        drawProgressBar(x + CARD_WIDTH / 2 - CARD_WIDTH / 2 / 2, CARD_HEIGHT - 20 - 10 + y, CARD_WIDTH / 2, 20, (Date.now() - fox.trainingStart) / 120000, (Date.now() - fox.trainingStart < 60000 ? Math.floor((120000 - (Date.now() - fox.trainingStart)) / 1000 / 60) + 'm ' : '') + (Math.floor(120000 - (Date.now() - fox.trainingStart) / 1000) % 60) + 's')

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
let zoom = 1
let zoomx
let result
function update() {
    if (menu == 'result') {

        if (result == 'victory') {
            ctx.fillStyle = 'gold'
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1
            ctx.font = '60px slkscr'
            ctx.fillText('YOU WINNED', canvas.width / 2, canvas.height / 2 - 50)
        }
        else {
            ctx.fillStyle = 'red'
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1
            ctx.font = '60px slkscr'
            ctx.fillText('YOU LOST', canvas.width / 2, canvas.height / 2 - 50)
        }
        ctx.fillRect(canvas.width / 2 - 60, canvas.height - 100, 120, 20)
        ctx.fillStyle = 'white'
        ctx.font = '15px slkscr'
        if(points < 3 && enemyPoints < 3)
        ctx.fillText('TRY AGAIN', canvas.width / 2, canvas.height - 90)
        else 
        ctx.fillText('BACK TO MENU', canvas.width / 2, canvas.height - 90)
        if(points < 3 && enemyPoints < 3 && mx > canvas.width / 2 - 60 && my > canvas.height - 100 && mx < canvas.width / 2 + 60 && my < canvas.height){
            zoom = 1
            menu = 'battling'
            team = team.map((e, i) => {
                e.x = 160
                e.y = 140 + i * 70
                return e
            })
            team.selected = 0
            enemieTeam = enemieTeam.map((e, i) => {
                e.x = canvas.width - 160
                e.y = 140 + i * 70
                e.focus = Math.floor(Math.random() * team.length)
                return e
            })
            enemieTeam.selected = team[0].focus
            enemieTeam[Math.floor(Math.random() * enemieTeam.length)].focus = team.length

        } else if( mx > canvas.width / 2 - 60 && my > canvas.height - 100 && mx < canvas.width / 2 + 60 && my < canvas.height){
            menu = 'start'
            points = 0
            enemyPoints = 0
            team = []
            zoom = 1
            mx = -1
            my = -1
        }
    }
    if (menu == 'zooming') {
        zoom += 0.0125
        if (zoom > 3.5) {
            menu = 'result'
        }
        ctx.save()
        ctx.translate(zoomx, canvas.height / 2)
        ctx.scale(zoom, zoom)
        ctx.translate(-zoomx, -canvas.height / 2)
        ctx.drawImage(map, 0, 0, map.width, map.height, 0, -150, 640, 640)
        team.forEach((e, i) => {
            if (Math.abs(e.rotate) > Math.PI / 8) e.rotateDiff = -e.rotateDiff
            e.rotate += e.rotateDiff
            ctx.save();
            ctx.translate(e.x + 32, e.y + 32);
            ctx.scale(-1, 1);
            ctx.rotate(e.rotate)
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2)
            const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 50);
            // Add three color stops
            gradient.addColorStop(0.1, "gold");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.drawImage(e.image, 0, 0, e.image.width, e.image.height, -32, -32, 64, 64);
            ctx.restore()
        })
        enemieTeam.forEach((e, i) => {
            if (Math.abs(e.rotate) > Math.PI / 8) e.rotateDiff = -e.rotateDiff
            e.rotate += e.rotateDiff
            ctx.save()
            ctx.translate(e.x + 32, e.y + 32)
            ctx.rotate(e.rotate)
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2)
            const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 50);
            // Add three color stops
            gradient.addColorStop(0.1, "red");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.drawImage(e.image, 0, 0, e.image.width, e.image.height, -32, -32, 64, 64)
            ctx.restore()
        })
        ctx.drawImage(bell, 0, 0, bell.width, bell.height, 35, canvas.height / 2 - 15, 64, 64)
        ctx.drawImage(bell, 0, 0, bell.width, bell.height, canvas.width - 100, canvas.height / 2 - 15, 64, 64)
        ctx.restore()
    }
    if (menu == 'simulating') {
        ctx.drawImage(map, 0, 0, map.width, map.height, 0, -150, 640, 640)
        team.forEach((e, i) => {
            if (Math.abs(e.rotate) > Math.PI / 8) e.rotateDiff = -e.rotateDiff
            e.rotate += e.rotateDiff
            ctx.save();
            ctx.translate(e.x + 32, e.y + 32);
            ctx.scale(-1, 1);
            ctx.rotate(e.rotate)
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2)
            const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 50);
            // Add three color stops
            gradient.addColorStop(0.1, "gold");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.drawImage(e.image, 0, 0, e.image.width, e.image.height, -32, -32, 64, 64);
            ctx.restore()
            let angle
            try {
                angle = Math.atan2(enemieTeam[e.focus].y - e.y, enemieTeam[e.focus].x - e.x)
            } catch (error) {
                angle = Math.atan2(canvas.height / 2 - 15 - e.y, canvas.width - 100 - e.x)
            }
            let prey = e.y, prex = e.x;
            e.x += Math.cos(angle) * 2 * (speeds[e.weight] + e.mass * 2)
            while (e.x < 64 || e.x > canvas.width - 64) {
                e.x -= Math.cos(angle)
            }
            while (((e.x > prex + Math.cos(angle) && Math.cos(angle) > 0) || (e.x < prex + Math.cos(angle) && Math.cos(angle) < 0)) && enemieTeam.some(o => o.x + 64 > e.x && o.x < e.x + 64 && o.y + 64 > e.y && o.y < e.y + 64)) {
                e.x -= Math.cos(angle)
            }
            e.y += Math.sin(angle) * 2 * (speeds[e.weight] + e.mass * 2)
            console.log(e.y, e.x);
            while (e.y < 64 || e.y > canvas.height - 64) {
                e.y -= Math.sin(angle)
            }
            while (((Math.round(e.y) > Math.round(prey + Math.sin(angle)) && Math.sin(angle) > 0) || (Math.round(e.y) < Math.round(prey + Math.sin(angle)) && Math.sin(angle) < 0)) && enemieTeam.some(o => o.x + 64 > e.x && o.x < e.x + 64 && o.y + 64 > e.y && o.y < e.y + 64)) {
                e.y -= Math.sin(angle)
            }
            console.log('b', e.y, e.x);
            try {
                if (enemieTeam[e.focus].x + 64 > e.x && enemieTeam[e.focus].x < e.x + 64 && enemieTeam[e.focus].y + 64 > e.y && enemieTeam[e.focus].y < e.y + 64) {
                    enemieTeam[e.focus].x += Math.cos(angle) * 2 * (speeds[e.weight]) * 70 * recoils[e.weight]
                    while (enemieTeam[e.focus].x < 64 || enemieTeam[e.focus].x > canvas.width - 64) {
                        enemieTeam[e.focus].x -= Math.cos(angle) * 2 * (recoils[e.weight] + e.mass * 2)
                    }
                    enemieTeam[e.focus].y += Math.sin(angle) * 2 * 70 * (recoils[e.weight] + e.mass * 2)
                    while (enemieTeam[e.focus].y < 64 || enemieTeam[e.focus].y > canvas.height - 64) {
                        enemieTeam[e.focus].y -= Math.sin(angle) * 2 * (recoils[e.weight] + e.mass * 2)
                    }
                    if (Date.now() - lastEffect > 100) {
                        effects.push({ type: 'cloud', x: e.x + Math.cos(angle) * 60, y: e.y + Math.sin(angle) * 60, start: Date.now() })
                        lastEffect = Date.now()
                    }
                }
            } catch (error) {
                if (e.x + 32 > canvas.width - 100 && e.y + 32 > canvas.height / 2 - 15 && e.y < canvas.width - 100 + 32 && e.y < canvas.height / 2 - 15 + 32) {
                    points++
                    menu = 'zooming'
                    zoomx = canvas.width - 50
                    result = 'victory'
                }
            }
        })

        enemieTeam.forEach((e, i) => {
            if (Math.abs(e.rotate) > Math.PI / 8) e.rotateDiff = -e.rotateDiff
            e.rotate += e.rotateDiff
            ctx.save()
            ctx.translate(e.x + 32, e.y + 32)
            ctx.rotate(e.rotate)
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2)
            const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 50);
            // Add three color stops
            gradient.addColorStop(0.1, "red");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.drawImage(e.image, 0, 0, e.image.width, e.image.height, -32, -32, 64, 64)
            ctx.restore()
            let angle
            try {
                angle = Math.atan2(team[e.focus].y - e.y, team[e.focus].x - e.x)
            } catch (error) {
                angle = Math.atan2(canvas.height / 2 - 15 - e.y, 35 - e.x)
            }
            e.x += Math.cos(angle) * 3 * (speeds[e.weight] + e.mass * 2)
            while (e.x < 0 || e.x > canvas.width - 32) {
                e.x -= Math.cos(angle)
            }
            e.y += Math.sin(angle) * 3 * (speeds[e.weight] + e.mass * 2)
            while (e.y < 0 || e.y > canvas.height - 32) {
                e.y -= Math.sin(angle)
            }
            try {
                if (team[e.focus].x + 64 > e.x && team[e.focus].x < e.x + 64 && team[e.focus].y + 64 > e.y && team[e.focus].y < e.y + 64) {
                    team[e.focus].x += Math.cos(angle) * 2 * (recoils[e.weight] + e.mass * 2) * 70
                    while (team[e.focus].x < 64 || team[e.focus].x > canvas.width - 64) {
                        team[e.focus].x -= Math.cos(angle)
                    }
                    team[e.focus].y += Math.sin(angle) * 2 * (recoils[e.weight] + e.mass * 2) * 70
                    while (team[e.focus].y < 64 || team[e.focus].y > canvas.height - 64) {
                        team[e.focus].y -= Math.sin(angle)
                    }
                    console.log('aa', team[e.focus].y, team[e.focus].weight)
                    if (Date.now() - lastEffect > 100) {
                        effects.push({ type: 'cloud', x: e.x + Math.cos(angle) * 60, y: e.y + Math.sin(angle) * 60, start: Date.now() })
                        lastEffect = Date.now()
                    }

                }

            } catch (error) {
                if (e.x + 32 > 40 && e.y + 32 > canvas.height / 2 - 15 && e.x < 40 && e.y < canvas.height / 2 - 15 + 32) {
                    enemyPoints++
                    menu = 'zooming'
                    zoomx = 40
                    result = 'defeat'
                }
            }
        })
        effects.forEach((e, i) => {
            if (Date.now() - e.start < 400) {
                if (e.type == 'cloud') ctx.drawImage(fightEffect, e.x, e.y, 128, 128)
            } else {
            }
        })
        ctx.drawImage(bell, 0, 0, bell.width, bell.height, 35, canvas.height / 2 - 15, 64, 64)
        ctx.drawImage(bell, 0, 0, bell.width, bell.height, canvas.width - 100, canvas.height / 2 - 15, 64, 64)
    }
    if (menu == 'battling') {
        ctx.font = '50px slkscr'
        ctx.drawImage(map, 0, 0, map.width, map.height, 0, -150, 640, 640)
        ctx.fillStyle = 'gold'
        ctx.fillText(points, 50, 50)
        ctx.fillStyle = 'red'
        ctx.fillText(enemyPoints, 570, 50)
        team.forEach((e, i) => {
            ctx.save();
            ctx.translate(e.x, e.y);
            ctx.scale(-1, 1);
            if (i == team.selected) {
                ctx.beginPath();
                ctx.arc(32, 32, 40, 0, Math.PI * 2)
                const gradient = ctx.createRadialGradient(32, 32, 10, 32, 32, 50);
                // Add three color stops
                gradient.addColorStop(0.1, "gold");
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.fill();
            }
            ctx.drawImage(e.image, 0, 0, e.image.width, e.image.height, 0, 0, 64, 64);
            ctx.restore()
            if (mx < e.x && mx > e.x - 64 && my < e.y + 64 && my > e.y) {
                if (team.selected > -1) {
                    team[team.selected].focus = enemieTeam.selected
                    enemieTeam.selected = -1
                }
                team.selected = i
                if (team[i].focus > -1) {
                    enemieTeam.selected = team[i].focus
                }
            }
        })
        if (mx > canvas.width - 100 && my > canvas.height / 2 - 15 && mx < canvas.width - 100 + 64 && my < canvas.height / 2 - 15 + 64) {
            enemieTeam.selected = enemieTeam.length
        }
        enemieTeam.forEach((e, i) => {
            if (i == enemieTeam.selected) {
                ctx.beginPath();
                ctx.arc(e.x + 32, e.y + 32, 40, 0, Math.PI * 2)
                const gradient = ctx.createRadialGradient(e.x + 32, e.y + 32, 10, e.x + 32, e.y + 32, 50);
                // Add three color stops
                gradient.addColorStop(0.1, "red");
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.fill();
            }
            if (mx < e.x + 64 && mx > e.x && my < e.y + 64 && my > e.y) {
                enemieTeam.selected = i
            }
            ctx.drawImage(e.image, 0, 0, e.image.width, e.image.height, e.x, e.y, 64, 64)
        })
        ctx.drawImage(bell, 0, 0, bell.width, bell.height, 35, canvas.height / 2 - 15, 64, 64)
        if (enemieTeam.selected == enemieTeam.length) {
            ctx.beginPath();
            ctx.arc(canvas.width - 100 + 32, canvas.height / 2 - 15 + 32, 40, 0, Math.PI * 2)
            const gradient = ctx.createRadialGradient(canvas.width - 100 + 32, canvas.height / 2 - 15 + 32, 10, canvas.width - 100 + 32, canvas.height / 2 - 15 + 32, 50);
            // Add three color stops
            gradient.addColorStop(0.1, "red");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        ctx.drawImage(bell, 0, 0, bell.width, bell.height, canvas.width - 100, canvas.height / 2 - 15, 64, 64)
        if (team.filter(e => e.focus > -1).length >= team.length - 1 && enemieTeam.selected != -1) {
            ctx.drawImage(battleStartLogo, 0, 0, battleStartLogo.width, battleStartLogo.height, canvas.width - 64, canvas.height - 64, 64, 64)
            if (mx > canvas.width - 64 && my > canvas.height - 64) {
                menu = 'simulating'
                if (team.selected > -1) {
                    team[team.selected].focus = enemieTeam.selected
                    enemieTeam.selected = -1
                }
            }
        }
    }
    if (menu == 'battle') {
        ctx.drawImage(menuBackground, 0, 0, menuBackground.width, menuBackground.height, 0, -150, 640, 640)

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
        if (team.length == 3) ctx.drawImage(arrowBack, 0, 0, arrowBack.width, arrowBack.height, 0, 0, 64, 64)
        ctx.restore()
        // Check if the mouse is inside the button area
        if (mx >= canvas.width / 2 - 32 && mx <= canvas.width / 2 + 32 &&
            my >= 0 && my <= 64) {
            menu = 'start'
            team = []

        }         // Check if the mouse is inside the button area
        if (mx >= canvas.width / 2 - 32 && mx <= canvas.width / 2 + 32 &&
            my >= canvas.height - 64 && my <= canvas.height && team.length == 3) {
            menu = 'battling'
            enemieTeam = randomTeam()
            team = team.map((e, i) => {
                return {
                    rotateDiff: 0.05,
                    rotate: 0,
                    focus: -1,
                    weight: e.weight,
                    selected: false,
                    x: 160,
                    y: 140 + i * 70,
                    mass: e.muscularMass / 30,
                    image: teamSprites[e.weight]
                }
            })

        }
        else {
            console.log(mx, my)
        }
    }
    else if (menu == 'start') {
        ctx.drawImage(menuBackground, 0, 0, menuBackground.width, menuBackground.height, 0, -150, 640, 640)

        card(canvas.width / 2 - (CARD_WIDTH * 2 + CARD_SPACING * 2) / 2, canvas.height / 2 - CARD_HEIGHT / 2, 'BATTLE', battleLogo, () => { menu = 'battle' })
        card(canvas.width / 2 - (CARD_WIDTH * 2 + CARD_SPACING) / 2 + CARD_WIDTH + CARD_SPACING, canvas.height / 2 - CARD_HEIGHT / 2, 'FOXES', foxesLogo, () => { menu = 'fox' })
    }
    else if (menu == 'fox') {
        ctx.drawImage(menuBackground, 0, 0, menuBackground.width, menuBackground.height, 0, -150, 640, 640)

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