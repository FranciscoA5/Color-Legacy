addEventListener("keydown", function (e) {
  //o "e" pode ser substituido por qualquer letra ou palavra , não interessa
  if (e.code == "KeyD") player.velocity.xr = 5;
  if (e.code == "KeyA") player.velocity.xl = -5;
  if (e.code == "KeyW" && grounded == true) {
    player.velocity.y = -11.5;
    grounded = false;
  }
  //se clickar no W e estiver no chão executa o salto , senão ia poder clickar no W infinitamente
});
addEventListener("keydown", function (e) {
  if (e.code == "KeyR") {
    black = true;
    if(nivel == 3){
      player.position.x = 320;
      player.position.y = 0;
    }
    else if(nivel == 5){
      player.position.x = 620;
      player.position.y = 0;
    }
    else{
      player.position.x = 100;
      player.position.y = 0;
    }
    text.style.display = "none";
    text2.style.display = "none";
    particles.style.visibility = "hidden";
    death = false;
  }
});

addEventListener("keyup", function (e) {
  //o "e" pode ser substituido por qualquer letra ou palavra , não interessa
  if (e.code == "KeyD") player.velocity.xr = 0;
  if (e.code == "KeyA") player.velocity.xl = 0;
});
