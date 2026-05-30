init();
requestAnimationFrame(loop);

function loop(now){
  var dt = Math.min((now-lastTime)/1000,.04);
  lastTime = now;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}
