"use strict";


class Animation
{
    constructor (x, y, width, height, time, numberOfFrames, scale=1, interval=0.1, startingFrame=0, spriteSheet=null, sprites=new Array(), looping=false)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale
        this.time = time;
        this.numberOfFrames = numberOfFrames;
        
        this.interval = interval; // in seconds
        this.currentFrame = startingFrame;
        this.spriteSheet = spriteSheet;
        this.sprites = sprites;
        this.looping = looping;
    }

    animate(ctx, time)
    {
        if (this.time + this.spriteInterval <= time)
        {
            this.time = time;
            this.currentFrame += 1;
            
            if (looping) {this.currentFrame %= this.numberOfFrames}
            else {this.currentFrame = Math.min(this.currentFrame, this.numberOfFrames - 1)}
        }

        ctx.imageSmoothingEnabled = false;

        if (this.spriteSheet) 
        {
            ctx.drawImage(
                            this.spriteSheet,                                                               // sprite sheet
                            Math.floor(this.spriteSheet.width / this.numberOfFrames) * this.currentFrame,   // source x
                            0,                                                                              // source y
                            Math.floor(this.spriteSheet.width / this.numberOfFrames),                       // source width
                            this.spriteSheet.height,                                                        // source height
                            this.x,                                                                         // destination x
                            this.y,                                                                         // destination y
                            this.width * this.scale,                                                        // destination width
                            this.height * this.scale                                                        // destination height
                        );
        }
        else
        {
            ctx.drawImage(
                            this.sprites[this.currentFrame],  // sprite
                            this.x,                           // destination x
                            this.y,                           // destination y
                            this.width * this.scale,          // destination width
                            this.height * this.scale          // destination height
                        );
        }
    }
}

function drawScrollingBackground(ctx, background, x, y, width, height)
{
    let adjustedBackgroundWidth = background.width * (height / background.height); // scale the width to fit the canvas height
    x %= adjustedBackgroundWidth;
    ctx.imageSmoothingEnabled = false;
    for (let frameX = 0;  frameX <= width + adjustedBackgroundWidth;  frameX += adjustedBackgroundWidth)
    {
        ctx.drawImage(background, -x + frameX, y, adjustedBackgroundWidth, height);
    }
}

function colorRect(ctx, x, y, width, height, color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function colorRectBorder(ctx, x, y, width, height, thickness, color)
{
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.strokeRect(x, y, width, height)
}

function colorSector(ctx, x, y, radius, color, startingAngl=0, endingAngle=2*Math.PI)
{

}

function colorSectorBorder(ctx, x, y, radius, color, thickness, startingAngl=0, endingAngle=2*Math.PI)
{

}

function randomInt(min, max)
{
    return Math.floor(min + (Math.random() * (max - min)));
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
        // check if it works without the line below
        // document.body.appendChild(this.sound);
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