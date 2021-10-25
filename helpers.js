"use strict";

class SpriteAnimation
{
    constructor (width, height, leftX, topY, sprites, time)
    {
        this.width = width;
        this.height = height;
        this.leftX = leftX;
        this.topY = topY;
        this.sprites = sprites;
        this.sprite = sprites[0];
        this.currentSprite = 0;
        this.spriteInterval = 0.1; // in seconds
        this.time = time;
    }

    animate(canvasContext, time)
    {
        if (this.time + this.spriteInterval <= time)
        {
            this.currentSprite += 1;
            this.currentSprite %= this.sprites.length;
            this.sprite = this.sprites[this.currentSprite];
            this.time = time;
        }

        canvasContext.drawImage(this.sprite, this.leftX, this.topY, this.width, this.height);
    }
}

class SpriteSheetAnimation
{
    constructor (width, height, leftX, topY, spriteSheet, numberOfFrames, time, scale)
    {
        this.width = width;
        this.height = height;
        this.scale = scale
        this.leftX = leftX;
        this.topY = topY;
        this.spriteSheet = spriteSheet;
        this.numberOfFrames = numberOfFrames;
        this.currentFrame = 0;
        this.spriteInterval = 0.1; // in seconds
        this.time = time;
    }

    animate(canvasContext, time, cameraLeftX)
    {
        if (this.time + this.spriteInterval <= time)
        {
            this.currentFrame += 1;
            this.currentFrame %= this.numberOfFrames;
            this.time = time;
        }

        canvasContext.imageSmoothingEnabled = false;
        canvasContext.drawImage(this.spriteSheet, this.width * this.currentFrame, 0, this.width, this.height, this.leftX - cameraLeftX, this.topY, this.width * this.scale, this.height * this.scale);
    }
}

class Sound
{
    constructor (src)
    {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play()
    {
        this.sound.play();
    }

    stop()
    {
        this.sound.pause();
    }
    
    loop()
    {
        this.sound.loop = true;
    }

    mute()
    {
        this.sound.muted = true;
    }

    unmute()
    {
        this.sound.muted = false;
    }

}

function colorRect(canvasContext, leftX, topY, width, height, color)
{
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
}

function drawBackground(canvasContext, background, cameraLeftX, topY, gameWidth, gameHeight)
{
    let adjustedBackgroundWidth = background.width * (gameHeight / background.height);
    cameraLeftX %= adjustedBackgroundWidth;
    //canvasContext.drawImage(background, -cameraLeftX, 0, adjustedBackgroundWidth, gameHeight);
    //canvasContext.drawImage(background, -cameraLeftX + adjustedBackgroundWidth, 0, adjustedBackgroundWidth, gameHeight);
    //canvasContext.drawImage(background, -cameraLeftX + adjustedBackgroundWidth + adjustedBackgroundWidth, 0, adjustedBackgroundWidth, gameHeight);
    for (let i = 0; i <= gameWidth + adjustedBackgroundWidth; i += adjustedBackgroundWidth)
    {
        canvasContext.imageSmoothingEnabled = false;
        canvasContext.drawImage(background, -cameraLeftX + i, topY, adjustedBackgroundWidth, gameHeight);
    }
}

function colorBorder(canvasContext, leftX, topY, width, height, thickness, color)
{
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = thickness;

    canvasContext.strokeRect(leftX, topY, width, height)

    /*canvasContext.beginPath();
    canvasContext.moveTo(leftX, topY);
    canvasContext.lineTo(leftX + width, topY);
    canvasContext.lineTo(leftX + width, topY + height);
    canvasContext.lineTo(leftX, topY + height);
    canvasContext.lineTo(leftX, topY);
    canvasContext.stroke();*/
}

function randomInt(min, max)
{
    return Math.floor(min + (Math.random() * (max - min)));
}
