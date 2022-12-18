const canvas = document.querySelector("canvas");
const canvas_platforms = document.getElementById("platforms");
const canvas_porta = document.getElementById("platforms");
const canvas_face = document.getElementById("face");
const c = canvas.getContext("2d");
const p = canvas_platforms.getContext("2d");
const d = canvas_porta.getContext("2d");
const f = canvas_face.getContext("2d");
const text = document.getElementById("text");
const text2 = document.getElementById("text2");
const text3 = document.getElementById("text3");
const title = document.getElementById("my-svg");
const hint = document.getElementById("hint");
const particles = document.getElementById("particles-js");
particles.style.visibility = "hidden"; //o div onde estão as partículas fica invisivel

text.style.display = "none";
text2.style.display = "none";
text3.style.display = "none";
var black = true;
var inplataforma;
var death = false;
var nivel = 0;
var collide = true;
let grounded = false; //variável que verifica se está a tocar no chão
let done = false; //variável que verifica se a API da cor foi sucessida
const gravity = 0.3; //variável que define a gravidade

//define as dimensões do canvas para ocupar o ecrã inteiro
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas_platforms.width = innerWidth;
canvas_platforms.height = innerHeight;
canvas_face.width = innerWidth;
canvas_face.height = innerHeight;
//criar uma variável player com as caracteristicas da classe Player
const player = new Player();
const face = new Face();
const porta = new Porta({ x: 1370, y: 350, w: 30, h: 100 });
Levels(nivel);

function Level0() {
  animate(); //chama a função animate
  function animate() {
    title.style.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  addEventListener("keydown", function (e) {
    //o "e" pode ser substituido por qualquer letra ou palavra , não interessa
    if (e.code == "Enter" && nivel == 0) {
      nivel = 1;
      title.style.display = "none";
      return Levels(nivel);
    }

    //se clickar no W e estiver no chão executa o salto , senão ia poder clickar no W infinitamente
  });
}
function Level1() {
  console.log("estou aqui");
  const plataformas = [
    new Plataforma({ x: 0, y: 150, w: 150, h: 50 }),
    new Plataforma({ x: 0, y: 500, w: 150, h: 50 }),
    new Plataforma({ x: 220, y: 330, w: 150, h: 50 }),
    new Plataforma({ x: 450, y: 470, w: 150, h: 50 }),
    new Plataforma({ x: 700, y: 300, w: 150, h: 50 }),
    new Plataforma({ x: 780, y: 570, w: 150, h: 50 }),
    new Plataforma({ x: 1100, y: 450, w: 300, h: 50 }),
  ]; //defines as posição dos eixos da plataforma

  plataformas.forEach((plataforma) => {
    //para já tenho o draw das plataformas aqui , também se pode meter na class das plataformas
    plataforma.draw();
  });

  hint.innerHTML = "Lvl 1 - Find the correct path";
  animate(); //chama a função animate
  function animate() {
    if (nivel == 1) {
      requestAnimationFrame(animate); //vai continuar a chamar esta função
    }

    var doorcolor = $.xcolor.average(
      plataformas[0].fillStyle,
      plataformas[1].fillStyle
    );
    doorcolor = $.xcolor.average(doorcolor, plataformas[2].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas[3].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas[4].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas[6].fillStyle);
    porta.draw(doorcolor);

    c.clearRect(0, 0, canvas.width, canvas.height); //temos de dar clear para apagar o draw do quadrado da posição anterior
    f.clearRect(0, 0, canvas.width, canvas.height);
    if (death == false && done == true) {
      player.update(); //chama a função update
      face.draw();
    }
    //console.log(porta.fillStyle)
    //console.log(c.fillStyle)

    if (
      porta.fillStyle == c.fillStyle &&
      nivel == 1 &&
      player.position.x + player.width == porta.position.x
    ) {
      nivel = 2;
      p.clearRect(0, 0, canvas.width, canvas.height);
      black = true;
      return Levels(nivel);
    }

    plataformas.forEach((plataforma) => {
      //este if verifica a colisão em cima
      if (
        player.position.y + player.height <= plataforma.position.y &&
        player.position.y + player.height + player.velocity.y >=
          plataforma.position.y &&
        player.position.x + player.width >= plataforma.position.x &&
        player.position.x <= plataforma.position.x + plataforma.size.w
      ) {
        player.velocity.y = 0;
        player.position.y = plataforma.position.y - player.height;
        grounded = true;
        //particles.style.visibility = "visible";

        if (inplataforma != plataforma && black == false) {
          if (
            $.xcolor.average(c.fillStyle, plataforma.fillStyle) == "#000000"
          ) {
            c.fillStyle = plataforma.fillStyle;
          } else {
            c.fillStyle = $.xcolor.average(c.fillStyle, plataforma.fillStyle);
          }
        }

        if (black && done == true) {
          c.fillStyle = plataforma.fillStyle;
          black = false;
        }

        inplataforma = plataforma;
      }

      //este if verifica a colisão em baixo
      if (
        player.position.y <= plataforma.position.y + player.height &&
        player.position.y + player.height >=
          plataforma.position.y + player.height &&
        player.position.x + player.width > plataforma.position.x &&
        player.position.x < plataforma.position.x + plataforma.size.w
      ) {
        player.position.y = plataforma.position.y + plataforma.size.h;
        player.velocity.y = gravity;
      }

      //colisão lado esquerdo da plataforma
      if (
        player.position.x + player.width <= plataforma.position.x &&
        player.position.x + player.width + player.velocity.xr >=
          plataforma.position.x &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xr = 0;
        player.position.x = plataforma.position.x - player.width;
      }

      //colisão lado direito da plataforma
      if (
        player.position.x >= plataforma.position.x + plataforma.size.w &&
        player.position.x + player.velocity.xl <=
          plataforma.position.x + plataforma.size.w &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xl = 0;
        player.position.x = plataforma.position.x + plataforma.size.w;
      }

      if (player.position.x + player.width > canvas.width) {
        player.velocity.xr = 0;
        player.position.x = canvas.width - player.width;
      }

      if (player.position.x < 0) {
        player.velocity.xl = 0;
        player.position.x = 0;
      }
    });
  }
}

function Level2() {
  console.log("estamos no nivel 2");
  player.position.x = 100;
  player.position.y = 0;
  porta.position.x = 1370;
  porta.position.y = 200;

  const plataformas2 = [
    new Plataforma({ x: 0, y: 150, w: 150, h: 50 }),
    new Plataforma({ x: 100, y: 500, w: 75, h: 50 }),
    new Plataforma({ x: 350, y: 500, w: 50, h: 50 }),
    new Plataforma({ x: 550, y: 500, w: 100, h: 50 }),
    new Plataforma({ x: 780, y: 300, w: 120, h: 50 }),
    new Plataforma({ x: 780, y: 650, w: 120, h: 50 }),
    new Plataforma({ x: 950, y: 450, w: 150, h: 50 }),
    new Plataforma({ x: 1050, y: 400, w: 150, h: 50 }),
    new Plataforma({ x: 1150, y: 350, w: 150, h: 50 }),
    new Plataforma({ x: 1250, y: 300, w: 150, h: 50 }),
  ]; //defines as posição dos eixos da plataforma

  plataformas2.forEach((plataforma) => {
    //para já tenho o draw das plataformas aqui , também se pode meter na class das plataformas
    plataforma.draw();
  });
  hint.innerHTML = "Lvl 2 - From small to large (Remember the order)";
  animate2(); //chama a função animate
  function animate2() {
    if (nivel == 2) {
      requestAnimationFrame(animate2); //vai continuar a chamar esta função
    }

    var doorcolor = $.xcolor.average(
      plataformas2[0].fillStyle,
      plataformas2[2].fillStyle
    );
    doorcolor = $.xcolor.average(doorcolor, plataformas2[1].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas2[3].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas2[4].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas2[7].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas2[6].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas2[8].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas2[9].fillStyle);
    porta.draw(doorcolor);

    c.clearRect(0, 0, canvas.width, canvas.height); //temos de dar clear para apagar o draw do quadrado da posição anterior
    f.clearRect(0, 0, canvas.width, canvas.height);

    if (death == false && done == true) {
      player.update(); //chama a função update
      face.draw();
    }

    if (
      porta.fillStyle == c.fillStyle &&
      nivel == 2 &&
      player.position.x + player.width == porta.position.x
    ) {
      nivel = 3;
      black = true;
      p.clearRect(0, 0, canvas.width, canvas.height);
      return Levels(nivel);
    }

    plataformas2.forEach((plataforma) => {
      //este if verifica a colisão em cima

      if (
        player.position.y + player.height <= plataforma.position.y &&
        player.position.y + player.height + player.velocity.y >=
          plataforma.position.y &&
        player.position.x + player.width >= plataforma.position.x &&
        player.position.x <= plataforma.position.x + plataforma.size.w
      ) {
        player.velocity.y = 0;
        player.position.y = plataforma.position.y - player.height;
        grounded = true;
        //particles.style.visibility = "visible";

        if (inplataforma != plataforma && black == false) {
          if (
            $.xcolor.average(c.fillStyle, plataforma.fillStyle) == "#000000"
          ) {
            c.fillStyle = plataforma.fillStyle;
          } else {
            c.fillStyle = $.xcolor.average(c.fillStyle, plataforma.fillStyle);
            //console.log(c.fillStyle);
          }
        }

        if (black && done == true) {
          c.fillStyle = plataforma.fillStyle;
          black = false;
          //console.log(plataforma.fillStyle);
        }

        inplataforma = plataforma;
      }

      //este if verifica a colisão em baixo
      if (
        player.position.y <= plataforma.position.y + player.height &&
        player.position.y + player.height >=
          plataforma.position.y + player.height &&
        player.position.x + player.width > plataforma.position.x &&
        player.position.x < plataforma.position.x + plataforma.size.w
      ) {
        player.position.y = plataforma.position.y + plataforma.size.h;
        player.velocity.y = gravity;
      }

      //colisão lado esquerdo da plataforma
      if (
        player.position.x + player.width <= plataforma.position.x &&
        player.position.x + player.width + player.velocity.xr >=
          plataforma.position.x &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xr = 0;
        player.position.x = plataforma.position.x - player.width;
      }

      //colisão lado direito da plataforma
      if (
        player.position.x >= plataforma.position.x + plataforma.size.w &&
        player.position.x + player.velocity.xl <=
          plataforma.position.x + plataforma.size.w &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xl = 0;
        player.position.x = plataforma.position.x + plataforma.size.w;
      }

      if (player.position.x + player.width > canvas.width) {
        player.velocity.xr = 0;
        player.position.x = canvas.width - player.width;
      }

      if (player.position.x < 0) {
        player.velocity.xl = 0;
        player.position.x = 0;
      }
    });
  }
}

function Level3() {
  console.log("estamos no nivel 3");
  player.position.x = 320;
  player.position.y = 0;
  porta.position.x = 680;
  porta.position.y = 215;

  const plataformas3 = [
    new Plataforma({ x: 320, y: 100, w: 150, h: 50 }),
    new Plataforma({ x: 130, y: 250, w: 150, h: 50 }),
    new Plataforma({ x: 130, y: 400, w: 150, h: 50 }),
    new Plataforma({ x: 320, y: 520, w: 150, h: 50 }),
    new Plataforma({ x: 620, y: 315, w: 150, h: 50 }),
    new Plataforma({ x: 920, y: 100, w: 150, h: 50 }),
    new Plataforma({ x: 1110, y: 250, w: 150, h: 50 }),
    new Plataforma({ x: 1110, y: 400, w: 150, h: 50 }),
    new Plataforma({ x: 920, y: 520, w: 150, h: 50 }),
  ]; //defines as posição dos eixos da plataforma

  plataformas3.forEach((plataforma) => {
    //para já tenho o draw das plataformas aqui , também se pode meter na class das plataformas
    plataforma.draw();
  });
  hint.innerHTML = "Lvl 3 - Clockwise or anti-clockwise ? Or maybe both ?";
  animate3(); //chama a função animate
  function animate3() {
    if (nivel == 3) {
      requestAnimationFrame(animate3); //vai continuar a chamar esta função
    }

    var doorcolor = $.xcolor.average(
      plataformas3[0].fillStyle,
      plataformas3[1].fillStyle
    );
    doorcolor = $.xcolor.average(doorcolor, plataformas3[2].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas3[3].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas3[4].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas3[5].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas3[6].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas3[7].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas3[8].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas3[4].fillStyle);
    porta.draw(doorcolor);

    c.clearRect(0, 0, canvas.width, canvas.height); //temos de dar clear para apagar o draw do quadrado da posição anterior
    f.clearRect(0, 0, canvas.width, canvas.height);
    if (death == false && done == true) {
      player.update(); //chama a função update
      face.draw();
    }

    if (
      porta.fillStyle == c.fillStyle &&
      nivel == 3 &&
      player.position.x + player.width == porta.position.x
    ) {
      nivel = 4;
      black = true;
      p.clearRect(0, 0, canvas.width, canvas.height);
      return Levels(nivel);
    }

    plataformas3.forEach((plataforma) => {
      //este if verifica a colisão em cima

      if (
        player.position.y + player.height <= plataforma.position.y &&
        player.position.y + player.height + player.velocity.y >=
          plataforma.position.y &&
        player.position.x + player.width >= plataforma.position.x &&
        player.position.x <= plataforma.position.x + plataforma.size.w
      ) {
        player.velocity.y = 0;
        player.position.y = plataforma.position.y - player.height;
        grounded = true;
        //particles.style.visibility = "visible";

        if (inplataforma != plataforma && black == false) {
          if (
            $.xcolor.average(c.fillStyle, plataforma.fillStyle) == "#000000"
          ) {
            c.fillStyle = plataforma.fillStyle;
          } else {
            c.fillStyle = $.xcolor.average(c.fillStyle, plataforma.fillStyle);
            //console.log(c.fillStyle);
          }
        }

        if (black && done == true) {
          c.fillStyle = plataforma.fillStyle;
          black = false;
          //console.log(plataforma.fillStyle);
        }

        inplataforma = plataforma;
      }

      //este if verifica a colisão em baixo
      if (
        player.position.y <= plataforma.position.y + player.height &&
        player.position.y + player.height >=
          plataforma.position.y + player.height &&
        player.position.x + player.width > plataforma.position.x &&
        player.position.x < plataforma.position.x + plataforma.size.w
      ) {
        player.position.y = plataforma.position.y + plataforma.size.h;
        player.velocity.y = gravity;
      }

      //colisão lado esquerdo da plataforma
      if (
        player.position.x + player.width <= plataforma.position.x &&
        player.position.x + player.width + player.velocity.xr >=
          plataforma.position.x &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xr = 0;
        player.position.x = plataforma.position.x - player.width;
      }

      //colisão lado direito da plataforma
      if (
        player.position.x >= plataforma.position.x + plataforma.size.w &&
        player.position.x + player.velocity.xl <=
          plataforma.position.x + plataforma.size.w &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xl = 0;
        player.position.x = plataforma.position.x + plataforma.size.w;
      }

      if (player.position.x + player.width > canvas.width) {
        player.velocity.xr = 0;
        player.position.x = canvas.width - player.width;
      }

      if (player.position.x < 0) {
        player.velocity.xl = 0;
        player.position.x = 0;
      }
    });
  }
}

function Level4() {
  console.log("estamos no nivel 4");
  player.position.x = 100;
  player.position.y = 0;
  porta.position.x = 1320;
  porta.position.y = 600;

  const plataformas4 = [
    new Plataforma({ x: 0, y: 100, w: 150, h: 50 }),
    new Plataforma({ x: 300, y: 100, w: 150, h: 50 }),
    new Plataforma({ x: 0, y: 300, w: 150, h: 50 }),
    new Plataforma({ x: 0, y: 500, w: 150, h: 50 }),
    new Plataforma({ x: 300, y: 300, w: 150, h: 50 }),
    new Plataforma({ x: 600, y: 100, w: 150, h: 50 }),
    new Plataforma({ x: 900, y: 100, w: 150, h: 50 }),
    new Plataforma({ x: 600, y: 300, w: 150, h: 50 }),
    new Plataforma({ x: 300, y: 500, w: 150, h: 50 }),
    new Plataforma({ x: 0, y: 700, w: 150, h: 50 }),
    new Plataforma({ x: 300, y: 700, w: 150, h: 50 }),
    new Plataforma({ x: 600, y: 500, w: 150, h: 50 }),
    new Plataforma({ x: 900, y: 300, w: 150, h: 50 }),
    new Plataforma({ x: 1200, y: 100, w: 150, h: 50 }),
    new Plataforma({ x: 1200, y: 300, w: 150, h: 50 }),
    new Plataforma({ x: 900, y: 500, w: 150, h: 50 }),
    new Plataforma({ x: 600, y: 700, w: 150, h: 50 }),
    new Plataforma({ x: 900, y: 700, w: 150, h: 50 }),
    new Plataforma({ x: 1200, y: 500, w: 150, h: 50 }),
    new Plataforma({ x: 1200, y: 700, w: 150, h: 50 }),
  ]; //defines as posição dos eixos da plataforma

  plataformas4.forEach((plataforma) => {
    //para já tenho o draw das plataformas aqui , também se pode meter na class das plataformas
    plataforma.draw();
  });
  hint.innerHTML = "Lvl 4 - Diagonals, this is the way ! (Start from the top)";
  animate4(); //chama a função animate
  function animate4() {
    if (nivel == 4) {
      requestAnimationFrame(animate4); //vai continuar a chamar esta função
    }

    var doorcolor = $.xcolor.average(
      plataformas4[0].fillStyle,
      plataformas4[1].fillStyle
    );
    doorcolor = $.xcolor.average(doorcolor, plataformas4[2].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[3].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[4].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[5].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[6].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[7].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[8].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[9].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[10].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[11].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[12].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[13].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[14].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[15].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[16].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[17].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[18].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas4[19].fillStyle);
    porta.draw(doorcolor);
    c.clearRect(0, 0, canvas.width, canvas.height); //temos de dar clear para apagar o draw do quadrado da posição anterior
    f.clearRect(0, 0, canvas.width, canvas.height);
    if (death == false && done == true) {
      player.update(); //chama a função update
      face.draw();
    }

    if (
      porta.fillStyle == c.fillStyle &&
      nivel == 4 &&
      player.position.x + player.width == porta.position.x
    ) {
      nivel = 5;
      black = true;
      p.clearRect(0, 0, canvas.width, canvas.height);
      return Levels(nivel);
    }

    plataformas4.forEach((plataforma) => {
      //este if verifica a colisão em cima

      if (
        player.position.y + player.height <= plataforma.position.y &&
        player.position.y + player.height + player.velocity.y >=
          plataforma.position.y &&
        player.position.x + player.width >= plataforma.position.x &&
        player.position.x <= plataforma.position.x + plataforma.size.w
      ) {
        player.velocity.y = 0;
        player.position.y = plataforma.position.y - player.height;
        grounded = true;
        //particles.style.visibility = "visible";

        if (inplataforma != plataforma && black == false) {
          if (
            $.xcolor.average(c.fillStyle, plataforma.fillStyle) == "#000000"
          ) {
            c.fillStyle = plataforma.fillStyle;
          } else {
            c.fillStyle = $.xcolor.average(c.fillStyle, plataforma.fillStyle);
            //console.log(c.fillStyle);
          }
        }

        if (black && done == true) {
          c.fillStyle = plataforma.fillStyle;
          black = false;
          //console.log(plataforma.fillStyle);
        }

        inplataforma = plataforma;
      }

      //este if verifica a colisão em baixo
      if (
        player.position.y <= plataforma.position.y + player.height &&
        player.position.y + player.height >=
          plataforma.position.y + player.height &&
        player.position.x + player.width > plataforma.position.x &&
        player.position.x < plataforma.position.x + plataforma.size.w
      ) {
        player.position.y = plataforma.position.y + plataforma.size.h;
        player.velocity.y = gravity;
      }

      //colisão lado esquerdo da plataforma
      if (
        player.position.x + player.width <= plataforma.position.x &&
        player.position.x + player.width + player.velocity.xr >=
          plataforma.position.x &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xr = 0;
        player.position.x = plataforma.position.x - player.width;
      }

      //colisão lado direito da plataforma
      if (
        player.position.x >= plataforma.position.x + plataforma.size.w &&
        player.position.x + player.velocity.xl <=
          plataforma.position.x + plataforma.size.w &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xl = 0;
        player.position.x = plataforma.position.x + plataforma.size.w;
      }

      if (player.position.x + player.width > canvas.width) {
        player.velocity.xr = 0;
        player.position.x = canvas.width - player.width;
      }

      if (player.position.x < 0) {
        player.velocity.xl = 0;
        player.position.x = 0;
      }
    });
  }
}

function Level5() {
  console.log("estamos no nivel 5");
  player.position.x = 620;
  player.position.y = 0;
  porta.position.x = 950;
  porta.position.y = 150;
  const plataformas5 = [
    new Plataforma({ x: 620, y: 100, w: 150, h: 50 }),
    new Plataforma({ x: 350, y: 250, w: 150, h: 50 }),
    new Plataforma({ x: 350, y: 400, w: 150, h: 50 }),
    new Plataforma({ x: 620, y: 550, w: 150, h: 50 }),
    new Plataforma({ x: 890, y: 400, w: 150, h: 50 }),
    new Plataforma({ x: 890, y: 250, w: 150, h: 50 }),
  ]; //defines as posição dos eixos da plataforma

  plataformas5.forEach((plataforma) => {
    //para já tenho o draw das plataformas aqui , também se pode meter na class das plataformas
    plataforma.draw();
  });
  hint.innerHTML = "Lvl 5 - You think once is okay ? Double it !";
  animate5(); //chama a função animate
  function animate5() {
    if (nivel == 5) {
      requestAnimationFrame(animate5); //vai continuar a chamar esta função
    }

    var doorcolor = $.xcolor.average(
      plataformas5[0].fillStyle,
      plataformas5[1].fillStyle
    );
    doorcolor = $.xcolor.average(doorcolor, plataformas5[2].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[3].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[4].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[5].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[0].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[1].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[2].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[3].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[4].fillStyle);
    doorcolor = $.xcolor.average(doorcolor, plataformas5[5].fillStyle);
    porta.draw(doorcolor);
    c.clearRect(0, 0, canvas.width, canvas.height); //temos de dar clear para apagar o draw do quadrado da posição anterior
    f.clearRect(0, 0, canvas.width, canvas.height);

    if (death == false && done == true) {
      player.update(); //chama a função update
      face.draw();
    }

    if (
      porta.fillStyle == c.fillStyle &&
      nivel == 5 &&
      player.position.x + player.width == porta.position.x
    ) {
      nivel = 6;
      black = true;
      p.clearRect(0, 0, canvas.width, canvas.height);
      return Levels(nivel);
    }

    plataformas5.forEach((plataforma) => {
      //este if verifica a colisão em cima

      if (
        player.position.y + player.height <= plataforma.position.y &&
        player.position.y + player.height + player.velocity.y >=
          plataforma.position.y &&
        player.position.x + player.width >= plataforma.position.x &&
        player.position.x <= plataforma.position.x + plataforma.size.w
      ) {
        player.velocity.y = 0;
        player.position.y = plataforma.position.y - player.height;
        grounded = true;
        //particles.style.visibility = "visible";

        if (inplataforma != plataforma && black == false) {
          if (
            $.xcolor.average(c.fillStyle, plataforma.fillStyle) == "#000000"
          ) {
            c.fillStyle = plataforma.fillStyle;
          } else {
            c.fillStyle = $.xcolor.average(c.fillStyle, plataforma.fillStyle);
            //console.log(c.fillStyle);
          }
        }

        if (black && done == true) {
          c.fillStyle = plataforma.fillStyle;
          black = false;
          //console.log(plataforma.fillStyle);
        }

        inplataforma = plataforma;
      }

      //este if verifica a colisão em baixo
      if (
        player.position.y <= plataforma.position.y + player.height &&
        player.position.y + player.height >=
          plataforma.position.y + player.height &&
        player.position.x + player.width > plataforma.position.x &&
        player.position.x < plataforma.position.x + plataforma.size.w
      ) {
        player.position.y = plataforma.position.y + plataforma.size.h;
        player.velocity.y = gravity;
      }

      //colisão lado esquerdo da plataforma
      if (
        player.position.x + player.width <= plataforma.position.x &&
        player.position.x + player.width + player.velocity.xr >=
          plataforma.position.x &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xr = 0;
        player.position.x = plataforma.position.x - player.width;
      }

      //colisão lado direito da plataforma
      if (
        player.position.x >= plataforma.position.x + plataforma.size.w &&
        player.position.x + player.velocity.xl <=
          plataforma.position.x + plataforma.size.w &&
        ((player.position.y + player.height >= plataforma.position.y &&
          player.position.y + player.height <=
            plataforma.position.y + plataforma.size.h) ||
          (player.position.y >= plataforma.position.y &&
            player.position.y <= plataforma.position.y + plataforma.size.h))
      ) {
        player.velocity.xl = 0;
        player.position.x = plataforma.position.x + plataforma.size.w;
      }

      if (player.position.x + player.width > canvas.width) {
        player.velocity.xr = 0;
        player.position.x = canvas.width - player.width;
      }

      if (player.position.x < 0) {
        player.velocity.xl = 0;
        player.position.x = 0;
      }
    });
  }
}

function Levels(nivel) {
  switch (nivel) {
    case 0:
      Level0();
      break;
    case 1:
      Level1();
      break;

    case 2:
      Level2();
      break;

    case 3:
      Level3();
      break;

    case 4:
      Level4();
      break;

    case 5:
      Level5();
      break;

    default:
      text3.style.display = "block";
      break;
  }
}

//função que pega numa cor aleatória gerada por uma API
async function getColor() {
  var response = await fetch("https://x-colors.yurace.pro/api/random?number=3");
  var data = await response.json();
  //console.log(data[0].hex);
  //console.log(response.status);
  //const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  done = true;
  //return "#" + randomColor;
  return data[0].hex;
}
