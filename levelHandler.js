//Level design
/*var levels = [
    "-------------------7------------------7"+
    "-G  -  r           |                  |"+
    "  -                |                  |"+
    "    r-7            |                   "+
    "    | |            |                   "+
    "    L-]            |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   r7---               "+
    "                ---L]                  "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   |                   "+
    "                   L--                 "
]
var level_width = 39;
var level_height = 22;
*/

/*var levels = [
    "   r----"+
    "   |    "+
    "   |----"+
    "---|    "+
    "   |    "+
    "---]    "+
    "        "+
    "        "
]*/

var levels = [
    " "
]

var level_width = 1;
var level_height = 1;

function loadLevel(number) {
    var level = levels[number];
    for (let i = 0; i < level_width*level_height; i++) {
        let t = level[i];
        if (t == "-") {
            let tile = instance_create(RoadPiece, ((i*32) % (32*level_width))*tileScale, Math.floor(i/level_width)*32*tileScale);
            tile.tileX = 1;
            tile.scale = tileScale;
            roadTiles.push(tile);
        }
        if (t == "|") {
            let tile = instance_create(RoadPiece, ((i*32) % (32*level_width))*tileScale, Math.floor(i/level_width)*32*tileScale);
            tile.scale = tileScale;
            roadTiles.push(tile);
        }
        if (t == "r") {
            let tile = instance_create(RoadPiece, ((i*32) % (32*level_width))*tileScale, Math.floor(i/level_width)*32*tileScale);
            tile.tileY = 1;
            tile.scale = tileScale;
            roadTiles.push(tile);
        }
        if (t == "L") {
            let tile = instance_create(RoadPiece, ((i*32) % (32*level_width))*tileScale, Math.floor(i/level_width)*32*tileScale);
            tile.tileY = 2;
            tile.scale = tileScale;
            roadTiles.push(tile);
        }
        if (t == "7") {
            let tile = instance_create(RoadPiece, ((i*32) % (32*level_width))*tileScale, Math.floor(i/level_width)*32*tileScale);
            tile.tileX = 1;
            tile.tileY = 1;
            tile.scale = tileScale;
            roadTiles.push(tile);
        }
        if (t == "]") {
            let tile = instance_create(RoadPiece, ((i*32) % (32*level_width))*tileScale, Math.floor(i/level_width)*32*tileScale);
            tile.tileX = 1;
            tile.tileY = 2;
            tile.scale = tileScale;
            roadTiles.push(tile);
        }
        if (t == "G") {
            let tile = instance_create(Goal, ((i * 32) % (32 * level_width)) * tileScale, Math.floor(i / level_width) * 32 * tileScale);
            otherObjects.push(tile);
        }
    }
}