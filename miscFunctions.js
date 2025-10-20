function instance_create(obj, x, y) {
    let o = new (obj);
    o.x = x;
    o.y = y;
    return o;
}
function lengthdir_x(dist, angle) {
	return dist*Math.cos(angle*Math.PI/180);
}
function lengthdir_y(dist, angle) {
	return dist*-Math.sin(angle*Math.PI/180);
}
function point_direction(x1, y1, x2, y2) {
    return -Math.atan2(y1-y2, x1-x2)*180/Math.PI+180;
}
function point_distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
}
//function adapted from https://stackoverflow.com/a/10965077
function place_meeting(poly1, poly2) {
    var polygons = [poly1, poly2];
    for (polygon of polygons) {
        for (let i = 0; i < polygon.length; i++) {
            let j = (i+1) % polygon.length;
            var p1 = polygon[i];
            var p2 = polygon[j];

            var normal = [p2[1] - p1[1], p1[0] - p2[0]];

            var minA = null;
            var maxA = null;
            for (let p of polygons[0]) {
                var projected = normal[0] * p[0] + normal[1] * p[1];
                if (minA === null || projected < minA) minA = projected;
                if (maxA === null || projected > maxA) maxA = projected;
            }

            var minB = null;
            var maxB = null;
            for (let p of polygons[1]) {
                var projected = normal[0] * p[0] + normal[1] * p[1];
                if (minB === null || projected < minB) minB = projected;
                if (maxB === null || projected > maxB) maxB = projected;
            }

            if (maxA < minB || maxB < minA) return false;
        }
    }
    return true;
}
//function from https://stackoverflow.com/questions/77270265/rotating-a-polygon-around-the-origin-its-center
function rotate_polygon(polygon, angle, origin) {
    var radians = -angle*Math.PI/180
    var newPolygon = [];
    for (p of polygon) {
        var newX = (p[0]-origin[0]) * Math.cos(radians) - (p[1]-origin[1]) * Math.sin(radians);
        var newY = (p[0]-origin[0]) * Math.sin(radians) + (p[1]-origin[1]) * Math.cos(radians);
        newPolygon.push([newX+origin[0], newY+origin[1]]);
    }
    return newPolygon;
}
//hslToHex function from https://stackoverflow.com/a/44134328
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function loadSprite(data) {
    var spr=new Image();
    spr.src=data;
    return spr;
}