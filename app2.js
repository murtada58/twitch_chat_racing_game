"use strict";


let time = 0;
let currentCountdown = 0;
let camera = {x:0, y:0, mode: "1"};
let panning = false;
let place = 1;

let players = {};
let sortedPlayers = [];
let trees = [];
let floorArrangment = {};
let wallArrangment = {};
let wallPropArrangment = {};

let canvas;
let canvasContext;
let map;
let mapContext;

function setup()
{
    canvas = document.getElementById('game');
    canvasCTX = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    canvasCTX.font = `1rem ${font}`;


    map = document.getElementById('map');
    mapCTX = map.getContext('2d');

    map.width = map.offsetWidth;
    map.height = map.offsetHeight;

    mapCTX.font = `1rem ${font}`;


    window.requestAnimationFrame(loop);
}

function update()
{

}

function draw()
{

}

let oldTimeStamp = 0;
function loop(timeStamp)
{
    dTime = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    time += dTime;
    countDown -= dTime;

    update(dTime);
    draw(dTime);

    window.requestAnimationFrame(loop);
}

setup();