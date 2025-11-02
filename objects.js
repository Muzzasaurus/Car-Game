//Basic obj class with basic physics
class BaseObj {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.xOrigin = this.x;
        this.yOrigin = this.y;
        this.speed = 0;
        this.direction = 0;
        this.image_angle = 0;
        this.friction = 0;
        this.divFriction = 0;
        this.gravity = 0;
        this.gravity_direction = 270;
        this.init_hitbox = [[this.x, this.y],[this.x+32, this.y],[this.x+32, this.y+32],[this.x, this.y+32]];
        this.hitbox = rotate_polygon(this.init_hitbox, this.image_angle, [this.xOrigin, this.yOrigin]);
    }
    endStep() {
        //Speed
        this.x += lengthdir_x(this.speed, this.direction);
        this.y += lengthdir_y(this.speed, this.direction);
        //Friction
        if (this.divFriction != 0) {
            this.speed /= this.divFriction;
        }
        if (this.speed < 0) {
            this.speed = Math.min(this.speed+this.friction, 0);
        } else if (this.speed > 0) {
            this.speed = Math.max(this.speed-this.friction, 0);
        }
        //Gravity
        if (this.gravity != 0) {
            var hspeed = lengthdir_x(this.speed, this.direction);
            var vspeed = lengthdir_y(this.speed, this.direction);
            var gx = lengthdir_x(this.gravity, this.gravity_direction);
            var gy = lengthdir_y(this.gravity, this.gravity_direction);
            hspeed += gx;
            vspeed += gy;
            this.speed = point_distance(0, 0, hspeed, vspeed);
            this.direction = point_direction(0, 0, hspeed, vspeed);
        }

        //Hitbox handling
        this.hitbox = rotate_polygon(this.init_hitbox, this.image_angle, [this.xOrigin, this.yOrigin]);

        //Draw own sprite
        //Save current canvas state
        ctx.save();
        //Move canvas origin to object's origin and rotate, before reversing the translation
        ctx.translate(this.x-view_xview+room_width/2, this.y-view_yview+room_height/2);
        ctx.rotate(-(Math.PI/180)*this.image_angle);
        ctx.translate(-this.x, -this.y);
        this.drawSelf();
        ctx.restore();
    }

    //Draws the collision area of the object
    drawHitbox() {
        ctx.fillStyle = "#fa1edd";
        ctx.beginPath();
        ctx.moveTo(this.hitbox[0][0]-view_xview+room_width/2, this.hitbox[0][1]-view_yview+room_height/2)
        for (let point of this.hitbox) {
            ctx.lineTo(point[0]-view_xview+room_width/2, point[1]-view_yview+room_height/2);
        }
        ctx.closePath();
        ctx.fill();
    }
    drawSelf() {
        return;
    }
}

class Player extends BaseObj {
    constructor() {
        super()
        this.width = 25;
        this.height = 50;
        this.colour = "#ff82ba";
        this.accelerate = 0.3;
        this.brake = 0.4;
        this.turnSpeed = 1;
        this.turnDirection = 0;
        this.turnDiv = 1.05;
        this.displaySpeedMult = 2.5;
        this.friction = 0.001;
        this.divFriction = 1.001;
        this.trueDirection = 0;
        this.actions = [];
        this.visible = true;
    }
    step() {
        //38 - up arrow
        if (heldKeys[38]) {
            this.forwards();
            this.actions.push([1,time]);
        }
        //40 - down arrow
        if (heldKeys[40]) {
            this.backwards();
            this.actions.push([2,time]);
        }
        //37 - left arrow
        if (heldKeys[37]) {
            this.turnLeft();
            this.actions.push([3,time]);
        }
        //39 - right arrow
        if (heldKeys[39]) {
            this.turnRight();
            this.actions.push([4,time]);
        }
        //snap direction test
        /*this.direction = this.trueDirection
        if (Math.abs(this.direction) % 90 < 15) {
            this.direction = Math.round(this.direction/90)*90;
        }*/
        //Turn if moving
        this.direction += this.turnDirection*this.speed/20;
        if (this.speed != 0) {
            this.turnDirection /= 0.15*this.speed/20+1;
        }
        //Wheel quickly snaps to 0 degrees if not turning
        if (!heldKeys[37] && !heldKeys[39]) {
            this.turnDirection /= 1.15;
        }
        //Wheel tends to 0 degrees
        if (this.turnDirection > 0) {
            this.turnDirection = Math.max(0, this.turnDirection - 0.005);
        } else if (this.turnDirection < 0) {
            this.turnDirection = Math.min(0, this.turnDirection + 0.005);
        }
        this.xOrigin = this.x;
        this.yOrigin = this.y;
        this.init_hitbox = [[this.x-this.width/2, this.y-this.height/1.5],[this.x-this.width/2, this.y+this.height/3],[this.x+this.width/2, this.y+this.height/3],[this.x+this.width/2, this.y-this.height/1.5]];
    }
    forwards() {
        this.speed += this.accelerate/Math.max(1,(this.speed/5));
    }
    backwards() {
        this.speed = Math.max(0,this.speed - this.brake);
    }
    turnLeft() {
        this.turnDirection = (this.turnDirection + this.turnSpeed)/this.turnDiv;
    }
    turnRight() {
        this.turnDirection = (this.turnDirection - this.turnSpeed)/this.turnDiv;
    }
    draw() {
        this.image_angle = this.direction-90;
    }
    drawSelf() {
        if (this.visible) {
            ctx.fillStyle = this.colour;
            ctx.fillRect(this.x-this.width/2, this.y-this.height/1.5, this.width, this.height);
        }
    }
}

class BikePlayer extends Player {
    constructor() {
        super()
        this.width = 7;
        this.height = 30;
        this.colour = "#ff82ba";
        this.accelerate = 0.05;
        this.brake = 0.1;
        this.turnSpeed = 1;
        this.turnDirection = 0;
        this.turnDiv = 1.05;
        this.displaySpeedMult = 2.5;
        this.friction = 0.001;
        this.divFriction = 1.005;
        this.trueDirection = 0;
        this.actions = [];
        this.visible = true;
    }
}

class Replayer extends Player {
    constructor() {
        super();
        this.time = 0;
        this.readPos = 0;
        this.pressedKeys = [0,0,0,0];
        this.colour = "#ff4639";
    }
    earlyStep() {
        this.pressedKeys = [0,0,0,0];
        if (this.actions.length > this.readPos) {
            while (this.actions[this.readPos][1] <= this.time) {
                switch (this.actions[this.readPos][0]) {
                    case 1:
                        this.forwards();
                        this.pressedKeys[0] = 1;
                        break;
                    case 2:
                        this.backwards();
                        this.pressedKeys[1] = 1;
                        break;
                    case 3:
                        this.turnLeft();
                        this.pressedKeys[2] = 1;
                        break;
                    case 4:
                        this.turnRight();
                        this.pressedKeys[3] = 1;
                        break;
                    case 5:
                        this.readPos = 0;
                        this.x = this.startX;
                        this.y = this.startY;
                        this.direction = this.startDir;
                        this.time = 0;
                        this.speed = 0;
                        this.turnDirection = 0;
                        return;
                }
                this.readPos += 1;
                if (this.actions.length <= this.readPos) return;
            }
        }
    }
    step () {
        //Code from player obj
        this.direction += this.turnDirection*this.speed/20;
        if (this.speed != 0) {
            this.turnDirection /= 0.15*this.speed/20+1;
        }
        //Wheel quickly snaps to 0 degrees if not turning
        if (!this.pressedKeys[2] && !this.pressedKeys[3]) {
            this.turnDirection /= 1.15;
        }
        //Wheel tends to 0 degrees
        if (this.turnDirection > 0) {
            this.turnDirection = Math.max(0, this.turnDirection - 0.005);
        } else if (this.turnDirection < 0) {
            this.turnDirection = Math.min(0, this.turnDirection + 0.005);
        }
        this.xOrigin = this.x;
        this.yOrigin = this.y;
        this.init_hitbox = [[this.x-this.width/2, this.y-this.height/1.5],[this.x-this.width/2, this.y+this.height/3],[this.x+this.width/2, this.y+this.height/3],[this.x+this.width/2, this.y-this.height/1.5]];
    }
    endStep() {
        super.endStep();
        this.time += 1;
        //this.colour = hslToHex(333+this.time, 100, 75);
    }
    draw() {
        this.image_angle = this.direction-90;
    }
}

class RoadPiece extends BaseObj {
    constructor() {
        super();
        this.tileX = 0;
        this.tileY = 0;
        this.scale = 1;
    }
    drawSelf() {
        ctx.drawImage(sprRoadTiles, 32*this.tileX, 32*this.tileY, 32, 32, Math.floor(this.x), Math.floor(this.y), 32*this.scale+0.5, 32*this.scale+0.5);
    }
}

class Goal extends BaseObj {
    constructor() {
        super();
        this.width = 168;
        this.height = 168;
    }
    step() {
        this.init_hitbox = [[this.x - this.width / 2, this.y - this.height / 2], [this.x - this.width / 2, this.y + this.height / 2], [this.x + this.width / 2, this.y + this.height / 2], [this.x + this.width / 2, this.y - this.height / 2]];
    }
    endStep() {
        super.endStep();
        if (place_meeting(this.hitbox, player.hitbox)) {
            level_complete = true;
            player.actions.push([5,time]);
        }
    }
    drawSelf() {
        ctx.fillStyle = "#2dfa1e";
        ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
    }
}