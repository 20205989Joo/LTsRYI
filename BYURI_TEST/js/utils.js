function drawDiamond(x,y,r,fill,glow){
  ctx.save();
  ctx.fillStyle = fill;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(x,y-r);
  ctx.lineTo(x+r*.75,y);
  ctx.lineTo(x,y+r);
  ctx.lineTo(x-r*.75,y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundRect(ctx,x,y,w,h,r,fill,stroke){
  var rr = Math.min(r,w/2,h/2);

  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);
  ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr);
  ctx.arcTo(x,y,x+w,y,rr);
  ctx.closePath();

  if(fill){
    ctx.fill();
  }

  if(stroke){
    ctx.stroke();
  }
}

function dist(x1,y1,x2,y2){
  var dx = x2 - x1;
  var dy = y2 - y1;

  return Math.sqrt(dx*dx + dy*dy);
}

function randInt(min,max){
  return Math.floor(Math.random() * (max-min+1)) + min;
}

function randFloat(min,max){
  return Math.random() * (max-min) + min;
}

function degToRad(deg){
  return deg * Math.PI / 180;
}

function clamp(v,min,max){
  return Math.max(min,Math.min(max,v));
}

function shuffle(arr){
  for(var i=arr.length-1;i>0;i--){
    var j = randInt(0,i);
    var temp = arr[i];

    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}
function laneEdgeDistance(angle,margin){
  var dx = Math.cos(angle);
  var dy = Math.sin(angle);
  var best = Infinity;

  if(dx > 0){
    best = Math.min(best,(w - margin - cx) / dx);
  }else if(dx < 0){
    best = Math.min(best,(margin - cx) / dx);
  }

  if(dy > 0){
    best = Math.min(best,(h - margin - cy) / dy);
  }else if(dy < 0){
    best = Math.min(best,(margin - cy) / dy);
  }

  if(!isFinite(best) || best < 0){
    return Math.min(w,h) * .42;
  }

  return Math.max(0,best);
}