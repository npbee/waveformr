export class Path {
  #path = "";

  static create() {
    return new Path();
  }

  moveTo(x: number, y: number) {
    this.#path += `M ${x} ${y} `;
  }

  lineTo(x: number, y: number) {
    this.#path += `L ${x} ${y} `;
  }

  vlineTo(y: number) {
    this.#path += `V ${y} `;
  }

  end(close?: boolean) {
    if (close) {
      this.#path += "Z";
    }
    return this.#path;
  }
}
