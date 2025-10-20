//Find canvas element and assign to variable
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Important variables
var fps = 60;
var time = 0;
var view_xview = 0;
var view_yview = 0;
var room_width = 1248;
var room_height = 704;
var level_complete = false;
ctx.imageSmoothingEnabled = false;
const SPAWNLOCATIONS = [[1488, 4060, 90],[40, 2576, 0],[2346, 50, 270],[4070, 3336, 180],[40, 808, 0]];
const GOALLOCATIONS = [[-150, 2618],[4250, 3292],[4250, 3292],[4250, 852],[1532, 4200]];
var loop = 0;

//Keyboard input (code from https://stackoverflow.com/a/35020537)
var heldKeys = {};
window.onkeyup = function (e) {
    heldKeys[e.keyCode] = false;
}
window.onkeydown = function (e) {
    heldKeys[e.keyCode] = true;
}

//Initialise player
var player = instance_create(Player, SPAWNLOCATIONS[loop][0], SPAWNLOCATIONS[loop][1]);
player.direction = SPAWNLOCATIONS[loop][2];
var goal = instance_create(Goal, GOALLOCATIONS[loop][0], GOALLOCATIONS[loop][1]);
//More slightly less important variables
var replayers = [];
var roadBg = loadSprite("Assets/Images/roadBG.png");
var bgScale = 8;
roadBg.width *= bgScale;
roadBg.height *= bgScale;
var sprRoadTiles = loadSprite("Assets/Images/roadTiles.png");
var roadTiles = [];
var otherObjects = [];
var tileScale = 8;
var loadedLevel = -1;

function restartLevel() {
    player = instance_create(Player, SPAWNLOCATIONS[loop][0], SPAWNLOCATIONS[loop][1]);
    player.direction = SPAWNLOCATIONS[loop][2];
    goal = instance_create(Goal, GOALLOCATIONS[loop][0], GOALLOCATIONS[loop][1]);
    time = 0;
    for (let i = replayers.length-1; i >= 0; i--) {
        replayers[i].readPos = 0;
        replayers[i].x = replayers[i].startX;
        replayers[i].y = replayers[i].startY;
        replayers[i].direction = replayers[i].startDir;
        replayers[i].time = 0;
        replayers[i].speed = 0;
        replayers[i].turnDirection = 0;
    }
}

function Main() {
    ctx.clearRect(0, 0, 1248, 704);

    //Level loading
    if (loadedLevel == -1) {
        loadLevel(0);
        loadedLevel = 0;
    }

    //Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,1248,704);
    /*for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 2; i++) {
            ctx.drawImage(bgSprite,-view_xview+Math.floor(view_xview/bgSprite.width)*bgSprite.width+bgSprite.width*i,-view_yview+Math.floor(view_yview/bgSprite.height)*bgSprite.height+bgSprite.height*j,bgSprite.width,bgSprite.height);
        }
    }*/

   
   //Run object steps
   /*if ((time % 20 == 0) && (time > 0)) {
    let obj = instance_create(Replayer, 0, 0);
    obj.actions = player.actions;
    replayers.push(obj);
    }*/
   
   /*view_xview = Math.min(level_width*tileScale*32-room_width/2,Math.max(room_width/2,player.x));
   view_yview = Math.min(level_height*tileScale*32-room_height/2,Math.max(room_height/2,player.y));*/

   view_xview = Math.min(roadBg.width-room_width/2,Math.max(room_width/2,player.x));
   view_yview = Math.min(roadBg.height-room_height/2,Math.max(room_height/2,player.y));

   ctx.drawImage(roadBg,-view_xview+room_width/2,-view_yview+room_height/2,roadBg.width,roadBg.height);
   
    for (let i = 0; i < roadTiles.length; i++) {
        roadTiles[i].endStep();
    }

    player.draw();
    player.step();
    player.endStep();

    for (let i = 0; i < otherObjects.length; i++) {
        otherObjects[i].step();
        otherObjects[i].endStep();
    }
    for (let i = replayers.length-1; i >= 0; i--) {
        replayers[i].draw();
        replayers[i].earlyStep();
        replayers[i].step();
        replayers[i].endStep();
        if (point_distance(replayers[i].x, replayers[i].y, player.x, player.y) <= 200) {
            if (place_meeting(replayers[i].hitbox, player.hitbox)) {
                player.speed = 0;
                restartLevel();
            }
        }
    }

    goal.step();
    goal.endStep();

    if (level_complete) {
        /*loop++;
        //Create clone
        let obj = instance_create(Replayer, SPAWNLOCATIONS[loop-1][0], SPAWNLOCATIONS[loop-1][1]);
        obj.direction = SPAWNLOCATIONS[loop-1][2];
        obj.startDir = obj.direction;
        obj.startX = obj.x;
        obj.startY = obj.y;
        obj.actions = player.actions;
        replayers.push(obj);

        player = instance_create(Player, SPAWNLOCATIONS[loop][0], SPAWNLOCATIONS[loop][1]);
        player.direction = SPAWNLOCATIONS[loop][2];
        goal = instance_create(Goal, GOALLOCATIONS[loop][0], GOALLOCATIONS[loop][1]);
        level_complete = false;
        time = 0;
        for (let i = replayers.length-1; i >= 0; i--) {
            replayers[i].readPos = 0;
            replayers[i].x = replayers[i].startX;
            replayers[i].y = replayers[i].startY;
            replayers[i].direction = replayers[i].startDir;
            replayers[i].time = 0;
            replayers[i].speed = 0;
            replayers[i].turnDirection = 0;
        }*/
        //Create clone
        loop++
        let obj = instance_create(Replayer, SPAWNLOCATIONS[loop-1][0], SPAWNLOCATIONS[loop-1][1]);
        obj.direction = SPAWNLOCATIONS[loop-1][2];
        obj.startDir = obj.direction;
        obj.startX = obj.x;
        obj.startY = obj.y;
        obj.actions = player.actions;
        replayers.push(obj);
        level_complete = false;

        restartLevel();
    }

    ctx.fillStyle = "#ffffff";
    //GUI text
    ctx.font = "38px Arial";
    ctx.fillText(`X ${Math.round(player.x)}`, 16, 40);
    ctx.fillText(`Y ${Math.round(player.y)}`, 16, 80);
    ctx.fillText(`Speed ${Math.ceil(player.speed*player.displaySpeedMult)}`, 16, 120);
    ctx.fillText(`Turn direction ${Math.ceil(player.turnDirection)}`, 16, 160);
    ctx.fillStyle = "#000000";
    ctx.strokeText(`X ${Math.round(player.x)}`, 16, 40);
    ctx.strokeText(`Y ${Math.round(player.y)}`, 16, 80);
    ctx.strokeText(`Speed ${Math.ceil(player.speed*player.displaySpeedMult)}`, 16, 120);
    ctx.strokeText(`Turn direction ${Math.ceil(player.turnDirection)}`, 16, 160);

    //Arrow to goal
    ctx.fillStyle = "#72eaffff";
    ctx.beginPath();
    playerDirection = point_direction(player.x, player.y, goal.x, goal.y);
    arrowOffsetX = lengthdir_x(200,playerDirection);
    arrowOffsetY = lengthdir_y(200,playerDirection);
    ctx.moveTo(room_width/2+lengthdir_x(32,playerDirection)+arrowOffsetX, room_height/2+lengthdir_y(32,playerDirection)+arrowOffsetY);
    ctx.lineTo(room_width/2+lengthdir_x(32,playerDirection+160)+arrowOffsetX, room_height/2+lengthdir_y(32,playerDirection+160)+arrowOffsetY);
    ctx.lineTo(room_width/2+lengthdir_x(32,playerDirection+200)+arrowOffsetX, room_height/2+lengthdir_y(32,playerDirection+200)+arrowOffsetY);
    ctx.lineTo(room_width/2+lengthdir_x(32,playerDirection)+arrowOffsetX, room_height/2+lengthdir_y(32,playerDirection)+arrowOffsetY);
    ctx.fill();
    ctx.fillStyle = "#000000ff";
    ctx.beginPath();
    ctx.moveTo(room_width/2+lengthdir_x(32,playerDirection)+arrowOffsetX, room_height/2+lengthdir_y(32,playerDirection)+arrowOffsetY);
    ctx.lineTo(room_width/2+lengthdir_x(32,playerDirection+160)+arrowOffsetX, room_height/2+lengthdir_y(32,playerDirection+160)+arrowOffsetY);
    ctx.lineTo(room_width/2+lengthdir_x(32,playerDirection+200)+arrowOffsetX, room_height/2+lengthdir_y(32,playerDirection+200)+arrowOffsetY);
    ctx.lineTo(room_width/2+lengthdir_x(32,playerDirection)+arrowOffsetX, room_height/2+lengthdir_y(32,playerDirection)+arrowOffsetY);
    ctx.stroke();

    time += 1;
}
setInterval(Main, 1000/fps);