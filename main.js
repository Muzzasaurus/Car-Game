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
var game_start = false;
var in_tutorial = false;
var game_won = false;

//Keyboard input (code from https://stackoverflow.com/a/35020537)
var heldKeys = {};
window.onkeyup = function (e) {
    heldKeys[e.keyCode] = false;
}
window.onkeydown = function (e) {
    heldKeys[e.keyCode] = true;
}

//Mouse input
var mouseX = 400;
var mouseY = 304;
var scaleFactor = 0;
var leftPx = 0;
function mouseMove(e) {
    scaleFactor = canvas.clientWidth/room_width;
    leftPx=document.getElementById('canvas').getBoundingClientRect().left;
    mouseX = e.clientX/scaleFactor-document.getElementById('canvas').getBoundingClientRect().left/scaleFactor;
    mouseY = e.clientY/scaleFactor;
};

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
var titleScreen = loadSprite("Assets/Images/titleScreen.png");
var playButton = loadSprite("Assets/Images/playButton.png");
var playButtonHover = loadSprite("Assets/Images/playButtonHover.png");
var tutorialButton = loadSprite("Assets/Images/tutorialButton.png");
var tutorialButtonHover = loadSprite("Assets/Images/tutorialButtonHover.png");
var tutorialBG1 = loadSprite("Assets/Images/tutorialControls.png");
var tutorialBG2 = loadSprite("Assets/Images/tutorialHTP1.png");
var tutorialBG3 = loadSprite("Assets/Images/tutorialHTP2.png");
var nextButton = loadSprite("Assets/Images/nextButton.png");
var nextButtonHover = loadSprite("Assets/Images/nextButtonHover.png");
var previousButton = loadSprite("Assets/Images/previousButton.png");
var previousButtonHover = loadSprite("Assets/Images/previousButtonHover.png");
var exitButton = loadSprite("Assets/Images/exitButton.png");
var exitButtonHover = loadSprite("Assets/Images/exitButtonHover.png");
var clearScreen = loadSprite("Assets/Images/clearScreen.png");
var menuButton = loadSprite("Assets/Images/menuButton.png");
var menuButtonHover = loadSprite("Assets/Images/menuButtonHover.png");
var play_primed = false;
var tutorial_primed = false;
var next_primed = false;
var prev_primed = false;
var exit_primed = false;
var menu_primed = false;
var tutorialNum = 0;
var tutorialImages = [tutorialBG1, tutorialBG2, tutorialBG3];

function restartLevel() {
    if (loop == SPAWNLOCATIONS.length) {
        game_won = true;
        game_start = false;
        replayers = [];
        loop = 0;
        time = 0;
        player = instance_create(Player, SPAWNLOCATIONS[loop][0], SPAWNLOCATIONS[loop][1]);
        player.direction = SPAWNLOCATIONS[loop][2];
        goal = instance_create(Goal, GOALLOCATIONS[loop][0], GOALLOCATIONS[loop][1]);
    } else {
        if (loop == SPAWNLOCATIONS.length-1) {
            player = instance_create(BikePlayer, SPAWNLOCATIONS[loop][0], SPAWNLOCATIONS[loop][1]);
            player.direction = SPAWNLOCATIONS[loop][2];
        } else {
            player = instance_create(Player, SPAWNLOCATIONS[loop][0], SPAWNLOCATIONS[loop][1]);
            player.direction = SPAWNLOCATIONS[loop][2];
        }
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
}
canvas.onmousedown = function(e) {
	if ((play_primed) && !(game_start)) {
        game_start = true;
        play_primed = false;
    }
    if ((tutorial_primed) && !(game_start)) {
        in_tutorial = true;
        tutorial_primed = false
    }
    if ((prev_primed) && (in_tutorial)) {
        tutorialNum = (tutorialNum + 2) % 3;
        prev_primed = false;
    }
    if ((next_primed) && (in_tutorial)) {
        tutorialNum = (tutorialNum + 4) % 3;
        next_primed = false
    }
    if ((exit_primed) && (in_tutorial)) {
        tutorialNum = 0;
        in_tutorial = false;
        exit_primed = false;
    }
    if ((menu_primed) && (game_won)) {
        game_won = false;
        menu_primed = false;
    }
    document.getElementById('canvas').style.cursor = 'auto';
};

function Main() {
    ctx.clearRect(0, 0, 1248, 704);
    if (!game_start) {
        if (in_tutorial) {
            ctx.drawImage(tutorialImages[tutorialNum],0,0);
            if (curInside(20, 319, 145, 378)) {
                prev_primed = true;
                ctx.drawImage(previousButtonHover, 20, 319);
                document.getElementById('canvas').style.cursor = 'pointer';
            } else {
                prev_primed = false;
                ctx.drawImage(previousButton, 20, 319);
                document.getElementById('canvas').style.cursor = 'auto';
            }

            if (curInside(1104, 319, 1229, 378)) {
                next_primed = true;
                ctx.drawImage(nextButtonHover, 1104, 319);
                document.getElementById('canvas').style.cursor = 'pointer';
            } else {
                next_primed = false;
                ctx.drawImage(nextButton, 1104, 319);
                document.getElementById('canvas').style.cursor = 'auto';
            }

            if (curInside(1104, 14, 1229, 73)) {
                exit_primed = true;
                ctx.drawImage(exitButtonHover, 1104, 14);
                document.getElementById('canvas').style.cursor = 'pointer';
            } else {
                exit_primed = false;
                ctx.drawImage(exitButton, 1104, 14);
                document.getElementById('canvas').style.cursor = 'auto';
            }

            if ((prev_primed) || (next_primed) || (exit_primed)) {
                document.getElementById('canvas').style.cursor = 'pointer';
            } else {
                document.getElementById('canvas').style.cursor = 'auto';
            }
        } else if (game_won) {
            ctx.drawImage(clearScreen,0,0);
            if (curInside(387, 356, 860, 457)) {
                menu_primed = true;
                ctx.drawImage(menuButtonHover, 387, 356);
                document.getElementById('canvas').style.cursor = 'pointer';
            } else {
                menu_primed = false;
                ctx.drawImage(menuButton, 387, 356);
                document.getElementById('canvas').style.cursor = 'auto';
            }
        } else {
            ctx.drawImage(titleScreen,0,0);
            if (curInside(491, 290, 757, 415)) {
                play_primed = true;
                ctx.drawImage(playButtonHover, 491, 290);
            } else {
                play_primed = false;
                ctx.drawImage(playButton, 491, 290);
            }
            if (curInside(491, 443, 757, 568)) {
                tutorial_primed = true;
                ctx.drawImage(tutorialButtonHover, 491, 443);
            } else {
                tutorial_primed = false
                ctx.drawImage(tutorialButton, 491, 443);
            }
            if ((play_primed) || (tutorial_primed)) {
                document.getElementById('canvas').style.cursor = 'pointer';
            } else {
                document.getElementById('canvas').style.cursor = 'auto';
            }
        }
    } else {
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
            loop++;
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

        /*ctx.fillStyle = "#ffffff";
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
        ctx.strokeText(`Turn direction ${Math.ceil(player.turnDirection)}`, 16, 160);*/

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
}
setInterval(Main, 1000/fps);