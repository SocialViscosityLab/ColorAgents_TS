
export class Lattice{
  xLables: Map<string, number>;
  yLables: Map<string, number>;

  constructor(rowLables: string[], colLabels: string[], cellSize: number){
    this.xLables = this.setColCoords(colLabels, cellSize);
    this.yLables = this.setRowCoords(rowLables, cellSize);
  }

  setColCoords(labels: string[], cellSize: number): Map<string, number>{
    let xCoords: Map<string, number> = new Map();
    for (var i = 0; i < labels.length; i++) {
      xCoords.set(labels[i]!, i*cellSize);
    }
    return xCoords;
  }

  setRowCoords(labels: string[], cellSize: number): Map<string, number>{
    let yCoords: Map<string, number> = new Map();
    for (var i = 0; i < labels.length; i++) {
      yCoords.set(labels[i]!, i*cellSize);
    }
    return yCoords;
  }

  getXFor(label: string): number | undefined{
    return this.xLables.get(label);
  }

  getYFor(label: string): number | undefined{
    return this.yLables.get(label);
  }
}
