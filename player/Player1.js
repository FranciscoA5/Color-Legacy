class Player {
  constructor() {
    //define a posição do player
    this.position = {
      x: 100,
      y: 0,
    };

    //define as dimensões do player
    this.width = 50;
    this.height = 50;

    //define a velocidade do player
    this.velocity = {
      xr: 0,
      xl: 0,
      y: 20,
    };
  }

  //função para desenhar o quadrado do player
  draw() {
    //tenho de ver isto melhor , o que acontecia é que criava o quadrado preto e só depois mudava de cor
    //com o done só vai criar o quadrado quando o api tiver a cor

    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  //função para dar update da posição do jogador
  update() {
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.xr;
    this.position.x += this.velocity.xl;

    //colisao com o chão
    if (this.position.y + this.height <= canvas.height - 10) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
      c.clearRect(0, 0, canvas.width, canvas.height);
      grounded = true;
      death = true;
      text.style.display = "block";
      text2.style.display = "block";
      particles.style.visibility = "visible";
    }
    this.draw();
  }
}

class Face {
  constructor() {
    //define a posição do player
    this.position = {
      x: 100,
      y: 0,
    };

    //define as dimensões do player
    this.width = 50;
    this.height = 50;

    //define a velocidade do player
    this.velocity = {
      xr: 0,
      xl: 0,
      y: 20,
    };
  }

  //função para desenhar o quadrado do player
  draw() {
    //tenho de ver isto melhor , o que acontecia é que criava o quadrado preto e só depois mudava de cor
    //com o done só vai criar o quadrado quando o api tiver a cor

    f.fillStyle = "white";
    f.fillRect(player.position.x + 10, player.position.y + 10, 10, 10);
    f.fillRect(player.position.x + 30, player.position.y + 10, 10, 10);
    f.fillRect(player.position.x + 10, player.position.y + 30, 30, 5);
    f.rect(player.position.x + 10, player.position.y + 10, 10, 10);
    f.rect(player.position.x + 30, player.position.y + 10, 10, 10);
    f.rect(player.position.x + 10, player.position.y + 30, 30, 5);

    f.lineWidth = "2";
    f.strokeRect(player.position.x + 10, player.position.y + 10, 10, 10);
    f.strokeRect(player.position.x + 30, player.position.y + 10, 10, 10);
    f.strokeRect(player.position.x + 10, player.position.y + 30, 30, 6);
    f.strokeRect(player.position.x, player.position.y, 50, 50);
  }

  //função para dar update da posição do jogador
}
