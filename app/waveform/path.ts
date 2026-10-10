export class Path {
  #path = "";

  static create() {
    return new Path();
  }

  moveTo(x: number, y: number) {
    this.#path += `M ${round(x)} ${round(y)} `;
  }

  lineTo(x: number, y: number) {
    this.#path += `L ${round(x)} ${round(y)} `;
  }

  vlineTo(y: number) {
    this.#path += `V ${round(y)} `;
  }

  end(close?: boolean) {
    if (close) {
      this.#path += "Z";
    }
    return this.#path;
  }
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
