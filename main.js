window.requestAnimationFrame = window.requestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.oRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

var Game = function(canvasId){
    var me = this;

    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    me.canvas = canvas;

    me.background = 'black';

    me.running = false;
    me.isDebug = true;

    me.actors = [];

    me.clear = function(){
        ctx.fillStyle = me.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    me.update = function(delta){
        me.actors.forEach(function(a){
            a.update(me, delta);
        });
    }

    me.draw = function(delta){
        me.actors.forEach(function(a){
            a.draw(ctx, delta);
        });
    }

    me.drawFps = function(delta){
        var seconds = delta/1000;
        var fps = 1/seconds;
        ctx.fillStyle = 'lime';
        ctx.font = '20pt Consolas';
        ctx.fillText(fps.toFixed(1), 20, 20);
    }

    me.start = function(){
        me.running = true;
        var lastTime = Date.now();
        (function mainloop(){
            if(!me.running) return;
            window.requestAnimationFrame(mainloop);

            var current = Date.now();

            var elapsed = current - lastTime;

            me.clear();
            me.update(elapsed);
            me.draw(elapsed);

            if(me.isDebug){
                me.drawFps(elapsed);
            }

            lastTime = current;
        })();
    }

    return me;
}

var game = new Game("game");
var grid = new Grid(0, 0, Math.floor(800/20), Math.floor(800/20), 20, 20);

game.canvas.addEventListener('click', function(evt){
    var gridx = Math.floor(evt.offsetX / grid.width);
    var gridy = Math.floor(evt.offsetY / grid.height);

    grid.getCell(gridx, gridy).isAlive = true;
});

window.addEventListener('keydown', function(){
    grid.simulationOn = !grid.simulationOn;
});

game.actors.push(grid);
game.start();