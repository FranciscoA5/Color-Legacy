class Porta {
  constructor({ x, y, w, h }) {
    //define a posição da porta
    this.position = {
      x,
      y,
    };

    this.size = {
      w,
      h,
    };
  }

  //função para desenhar a porta
  async draw(doorcolor) {
    d.fillStyle = await doorcolor;
    this.fillStyle = await doorcolor;
    d.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
    p.lineWidth = "2";
    p.strokeRect(this.position.x, this.position.y, this.size.w, this.size.h);
  }
}
