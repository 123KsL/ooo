// a.ts
var Shape;
(function (Shape) {
    var pi = Math.PI;
    function circle(r) {
        return pi * Math.pow(r, 2);
    }
    Shape.circle = circle;
})(Shape || (Shape = {}));
// b.ts
Shape.circle(2); // 12.566370614359172
