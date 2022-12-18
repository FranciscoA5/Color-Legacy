class Plataforma {
  constructor({ x, y, w, h }) {
    //define a posição da plataforma
    this.position = {
      x,
      y,
    };

    this.size = {
      w,
      h,
    };
  }

  //função para desenhar a plataforma
  async draw() {
    const cor = getColor();
    p.fillStyle = await cor;
    this.fillStyle = await cor;
    p.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
    p.lineWidth = "2";
    p.strokeRect(this.position.x, this.position.y, this.size.w, this.size.h);
  }
}
