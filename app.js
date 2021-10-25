let canvas;
let canvasContext;
let map;
let mapContext;

let players = {};
let sortedPlayers = [];
let trees = [];
let floorArrangment = {};
let wallArrangment = {};
let wallPropArrangment = {};
let place = 1;
let raceLength = 10000;
let raceEnd = 9500;
let raceHeight = 0;
let time = 0;
let countDown = 0;
let bobbingHeight = 0.2;
let bobbingSpeed = 5;
let gameOver = true;
let deceleration = 0
let cameraLeftX = 0;
let cameraMode = "1";
let panning = false;
let num1 = parseInt(Math.random() * 100);
let num2 = parseInt(Math.random() * 100);
questionCounter = 0;

let idleSpriteSheet = [new  Image(), new  Image(), new  Image()];
idleSpriteSheet[0].src = "./assets/characters/knight/knight_idle.png";
idleSpriteSheet[1].src = "./assets/characters/goblin/goblin_idle.png";
idleSpriteSheet[2].src = "./assets/characters/slime/slime_idle.png";


let runSpriteSheet = [new  Image(), new  Image(), new  Image()];
runSpriteSheet[0].src = "./assets/characters/knight/knight_run.png";
runSpriteSheet[1].src = "./assets/characters/goblin/goblin_run.png";
runSpriteSheet[2].src = "./assets/characters/slime/slime_run.png";

let floorSprites = [];
for (let i = 0; i < 10; i++)
{
    floorSprites.push(new Image());
    floorSprites[i].src = "./assets/environment/floor/floor_" + (i + 1) + ".png";
} 

let wallSprites = [];
for (let i = 0; i < 2; i++)
{
    wallSprites.push(new Image());
    wallSprites[i].src = "./assets/environment/wall/wall_" + (i + 1) + ".png";
}

let wallPropSprites = [];
for (let i = 0; i < 4; i++)
{
    wallPropSprites.push(new Image());
    wallPropSprites[i].src = "./assets/environment/wall_props/wall_prop_" + (i + 1) + ".png";
}

let wallTop = new Image();
wallTop.src = "./assets/environment/wall/wall_top_1.png";

let spikes = new Image();
spikes.src = "./assets/environment/floor_props/spikes_anim_f9.png"


let client = new tmi.Client({
	channels: ["niknakzz"]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(message.split(" "));
    message = message.split(" ");
    if (message[0] === "!race" && !(tags['display-name'] in players) && countDown > 0)
    {
        let y = ((canvas.height - raceHeight) - 60) + (Math.random() * (raceHeight - 20))

        let idleAnimation = new SpriteSheetAnimation(16, 16, 50, y, idleSpriteSheet[0], 6, time, 5);
        let runAnimation = new SpriteSheetAnimation(16, 16, 50, y, runSpriteSheet[0], 6, time, 5);
        if (message.length > 1)
        {
            if (message[1] === "goblin")
            {
                idleAnimation = new SpriteSheetAnimation(16, 16, 50, y, idleSpriteSheet[1], 6, time, 5);
                runAnimation = new SpriteSheetAnimation(16, 16, 50, y, runSpriteSheet[1], 6, time, 5);
            }
            else if (message[1] === "slime")
            {
                idleAnimation = new SpriteSheetAnimation(16, 16, 50, y, idleSpriteSheet[2], 6, time, 5);
                runAnimation = new SpriteSheetAnimation(16, 16, 50, y, runSpriteSheet[2], 6, time, 5);
            }
        }

        players[tags['display-name']] = {name: tags['display-name'],
                                         speed: 0,
                                         color: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0"),
                                         x: 50,
                                         y: y,
                                         idleAnimation: idleAnimation,
                                         runAnimation: runAnimation,
                                         answered: false,
                                         place: 0,
                                        }
        sortedPlayers.push(players[tags['display-name']]) 
        console.log(players);
    }
    else if (message[0] === "" + (num1 + num2) && countDown <= 0 && !gameOver && tags['display-name'] in players && !players[tags['display-name']].answered)
    {
        players[tags['display-name']].speed += questionCounter * 10;
        players[tags['display-name']].answered = true;
    }
});


function init()
{
    canvas = document.getElementById('game');
    canvasContext = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    raceHeight = canvas.height - (16*5) - 40;

    canvasContext.font = "1rem Poppins";


    map = document.getElementById('map');
    mapContext = map.getContext('2d');

    map.width = map.offsetWidth;
    map.height = map.offsetHeight;

    mapContext.font = "1rem Poppins";

    document.addEventListener("keydown", keyPressed);

    map.addEventListener("mousedown", function (event)
    {
        if (cameraMode == "m")
        {
            cameraLeftX = raceLength * (event.clientX / map.width);
            panning = true;
        }
    });
    document.addEventListener("mouseup", function (event)
    {
        panning = false;
    });

    map.addEventListener("mousemove", function (event)
    {
        if (panning && cameraMode == "m")
        {
            cameraLeftX = raceLength * (event.clientX / map.width);
        }
    });


    for (let i = canvas.height - raceHeight; i < canvas.height; i += 16*5)
    {
        for (let j = 0; j < raceLength + canvas.width; j += 16*5)
        {
            floorArrangment[[i, j]] = randomInt(0, 10);   
        }
    }
    
    for (let i = 40; i < canvas.height - raceHeight; i += 16*5)
    {
        for (let j = 0; j < raceLength + canvas.width; j += 16*5)
        {
            wallArrangment[[i, j]] = randomInt(0, 2);   
        }
    }

    for (let i = 40; i < canvas.height - raceHeight; i += 16*5)
    {
        for (let j = 0; j < raceLength + canvas.width; j += 16*5)
        {
            wallPropArrangment[[i, j]] = randomInt(0, 8);
        }
    }

    window.requestAnimationFrame(draw);
}

function update(dTime)
{
    for (const [name, player] of Object.entries(players))
    {
        player.speed = Math.max(0, player.speed - (deceleration * dTime));
        player.x += player.speed * dTime;
        if (player.x >= raceEnd + 100)
        {
            //gameOver = true;
            player.speed = 0;
            if (player.place == 0)
            {
                player.place = place;
                place++;
            }
        }
        if (gameOver)
        {
            //player.speed = 0;
        }
        if (countDown <= 0 && !gameOver && questionCounter <= 0)
        {
            if (!player.answered)
            {
                player.speed = Math.max(0, player.speed - 50);
            }
            player.answered = false;
        }
    
    }

    if (countDown <= 0 && !gameOver && questionCounter <= 0)
    {
        questionCounter = 10;
        tempNum1 = parseInt(Math.random() * 100);
        tempNum2 = parseInt(Math.random() * 100);
        while (tempNum1 + tempNum2 == num1 + num2)
        {
            tempNum1 = parseInt(Math.random() * 100);
            tempNum2 = parseInt(Math.random() * 100);
        }

        num1 = tempNum1;
        num2 = tempNum2;
        
        console.log(num1 + num2);
    }
}

let oldTimeStamp = 0;
function draw(timeStamp)
{
    dTime = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    time += dTime;
    countDown -= dTime;
    questionCounter = Math.max(0, questionCounter -  dTime);
    update(dTime);
    canvasContext.fillStyle = "#333333";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    //drawBackground(canvasContext, background, cameraLeftX, 0, canvas.width, canvas.height - raceHeight);
    drawWall()
    colorRect(canvasContext, 0, canvas.height - raceHeight, canvas.width , raceHeight, "#333333")
    drawFloor();
    colorRect(canvasContext, canvas.width - 2, 0, 2, canvas.height, "#000000")
    

    

    mapContext.fillStyle = "#333333";
    mapContext.fillRect(0, 0, map.width, map.height);

    colorRect(mapContext, map.width * (raceEnd / raceLength), 0, 100 * (map.width / raceLength) * (canvas.width / map.width), map.height, "#FFFFFF")
    colorRect(mapContext, 0, 0, map.width, 2, "#000000")
    
    drawFinishLine(raceEnd - cameraLeftX, canvas.height - raceHeight, 100, raceHeight);

    //colorRect(mapContext, map.width * (cameraLeftX / raceLength), 3, canvas.width * (map.height / canvas.height), map.height - 4, "#FF0000")
    //colorRect(mapContext, map.width * (cameraLeftX / raceLength) + 2, 5, canvas.width * (map.height / canvas.height) - 4, map.height - 8, "#333333")
    colorBorder(mapContext,  map.width * (cameraLeftX / raceLength), 2, map.width * (map.width / raceLength) * (canvas.width / map.width), map.height - 3, 2, "#FF0000");

    for (const [name, player] of Object.entries(players))
    {
        mapContext.font = "1rem Poppins";
        let textWidth = mapContext.measureText(name).width;
        colorRect(mapContext, map.width * (player.x / raceLength), ((map.height / (raceHeight + 60))  * ((player.y - (canvas.height - raceHeight)) + 100)) - 15, textWidth + 20, 20, "#000000")
        mapContext.fillStyle = "#FFFFFF";
        mapContext.textAlign = "left";
        mapContext.fillText(name, map.width * (player.x / raceLength) + 10, ((map.height / (raceHeight + 60))  * ((player.y - (canvas.height - raceHeight)) + 100)));

        test = player.x
        if (player.speed > 0)
        {
            player.runAnimation.leftX = player.x
            player.runAnimation.animate(canvasContext, time, cameraLeftX)
        }
        else
        {
            player.idleAnimation.leftX = player.x
            player.idleAnimation.animate(canvasContext, time, cameraLeftX)
        }

        canvasContext.font = "1rem Poppins";
        textWidth = canvasContext.measureText(name).width;
        colorRect(canvasContext, player.x - cameraLeftX - 10, player.y - 15, textWidth + 15, 20, "#000000");

        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.textAlign = "left";
        canvasContext.fillText(name, player.x - cameraLeftX, player.y);


    }

    sortedPlayers.sort(function(a, b) {
        // check everything here...
         if (a.place != 0 && b.place != 0)
         { // might be the other way around
             return  b.place - a.place
         }
         else if (a.place != 0)
         {
             return -1
         }
         else if (b.place != 0)
         {
             return 1
         }
         else
         {
            return a.x - b.x
         }
         
        })
    if (sortedPlayers.length > 0 && cameraMode != "m")
    {
        index = Math.min(parseInt(cameraMode), sortedPlayers.length)
        cameraLeftX = Math.max(0, sortedPlayers[sortedPlayers.length - index].x - (canvas.width - 150))
        canvasContext.font = "2rem Poppins";
        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.textAlign = "left";
        canvasContext.fillText("Following player in position " + index, 0, 32);
    }
    else if (cameraMode == "m")
    {
        canvasContext.font = "2rem Poppins";
        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.textAlign = "left";
        canvasContext.fillText("Manual camera mode ", 0, 32);
    }

    updateScores(sortedPlayers);

    if (countDown > 0)
    {
        canvasContext.font = "10rem Poppins";
        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.textAlign = "center";
        canvasContext.fillText(Math.ceil(countDown), canvas.width / 2, 150);
    }
    else if (!gameOver)
    {
        canvasContext.font = "5rem Poppins";
        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.textAlign = "center";
        canvasContext.fillText(num1 + " + " + num2, canvas.width / 2, 100);
        canvasContext.fillText(Math.ceil(questionCounter), canvas.width / 2, 200);
    }
    window.requestAnimationFrame(draw);
}

init();

function restart()
{
    countDown = 10;
    players = {};
    sortedPlayers = [];
    place = 1;
    gameOver = false;
    cameraLeftX = 0;
    time = 0;
    cameraMode = "1";
    cameraLeftX = 0;

}

function drawWall()
{
    canvasContext.imageSmoothingEnabled = false;
    for (let j = 16 * 5 * Math.floor(cameraLeftX / (16*5)); j <= (16 * 5 * Math.floor(cameraLeftX / (16*5))) + canvas.width + (16*5); j += 16*5)
    {
        canvasContext.drawImage(wallTop, j - cameraLeftX, -40, 16*5, 16*5)           
    }

    for (let i = 40; i < canvas.height - raceHeight; i += 16*5)
    {
        for (let j = 16 * 5 * Math.floor(cameraLeftX / (16*5)); j <= (16 * 5 * Math.floor(cameraLeftX / (16*5))) + canvas.width + (16*5); j += 16*5)
        {
            canvasContext.drawImage(wallSprites[wallArrangment[[i, j]]], j - cameraLeftX, i, 16*5, 16*5)           
        }
    }

    for (let i = 40; i < canvas.height - raceHeight; i += 16*5)
    {
        for (let j = 16 * 5 * Math.floor(cameraLeftX / (16*5)); j <= (16 * 5 * Math.floor(cameraLeftX / (16*5))) + canvas.width + (16*5); j += 16*5)
        {
            let propNumber = wallPropArrangment[[i, j]];
            if (propNumber < 4)
            {
                canvasContext.drawImage(wallPropSprites[propNumber], j - cameraLeftX, i, 16*5, 16*5)          
            }
        }
    }
}

function drawFloor()
{
    canvasContext.imageSmoothingEnabled = false;
    for (let i = canvas.height - raceHeight; i < canvas.height; i += 16*5)
    {
        for (let j = 16 * 5 * Math.floor(cameraLeftX / (16*5)); j <= (16 * 5 * Math.floor(cameraLeftX / (16*5))) + canvas.width + (16*5); j += 16*5)
        {
            canvasContext.drawImage(floorSprites[floorArrangment[[i, j]]], j - cameraLeftX, i, 16*5, 16*5)           
        }
    }
}

function drawFinishLine(leftX, topY, width, height)
{
    //canvasContext.fillStyle = "#FFFFFF";
    //canvasContext.fillRect(leftX, topY, width, height);
    for (let i = topY; i < canvas.height; i += 16*5)
    {
        canvasContext.drawImage(spikes, leftX, i, 16*5, 16*5)
    }
    for (let i = topY; i < canvas.height; i += 16*5)
    {
        canvasContext.drawImage(spikes, leftX + 16*5, i, 16*5, 16*5)
    }
}

function updateScores(sortedPlayers)
{
    const scoreBoard = document.getElementById("scores")
    while (scoreBoard.lastChild) {
        scoreBoard.removeChild(scoreBoard.lastChild);
    }


    for (i = sortedPlayers.length - 1; i >= 0 ; i--)
    {
        const position = document.createElement("p");
        position.classList.add("position");
        position.textContent = sortedPlayers.length - i;

        const name = document.createElement("p");
        name.classList.add("name");
        name.textContent = sortedPlayers[i].name;

        const distance = document.createElement("p");
        distance.classList.add("distance");
        distance.textContent = "Distance: " + Math.round(sortedPlayers[i].x)

        const speed = document.createElement("p");
        speed.classList.add("speed");
        speed.textContent = "Speed: " + Math.round(sortedPlayers[i].speed);

        const score = document.createElement("div");
        score.classList.add("score");
        score.appendChild(position);
        score.appendChild(name);
        //score.appendChild(distance);
        score.appendChild(speed);

        scoreBoard.appendChild(score);
    }
}

function keyPressed(evt)
{   

    if (evt.keyCode > 48 && evt.keyCode < 58)
    {
        cameraMode = "" + (evt.keyCode - 48)
    }
    else if (evt.keyCode == 48)
    {
        cameraMode = "10";
    }
    else if (evt.keyCode == 77)
    {
        cameraMode = "m";
    }
    else if (evt.keyCode == 83)
    {
        restart();
    }
}