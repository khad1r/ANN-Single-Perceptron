class layer {
  constructor(weight, learning_rate) {
    this.weight = weight;
    this.learning_rate = learning_rate;
    this.threshold = 0;
  }
  activations(v) {
    return v >= this.threshold ? 1 : 0;
  }
  fit(feature, label) {
    this.feature = feature;
    this.label = label;
  }
  train(iterations) {
    let iterations_error;
    console.log("initial weight: " + this.weight);
    for (var i = 0; i < iterations; i++) {
      iterations_error = false;
      let y = [];
      let iterations_summary = [];
      for (var j = 0; j < this.feature.length; j++) {
        let v = 0;
        for (var k = 0; k < this.feature[j].length; k++) {
          var x = this.feature[j][k] * this.weight[k];
          v = v + x;
        }
        y[j] = this.activations(v);
        var error = this.label[j] - y[j];
        var delta_weight = new Array(this.weight.length).fill(0);
        if (error != 0) {
          iterations_error = true;
          delta_weight = this.delta_weight(error, this.feature[j]);

          this.new_weight(delta_weight);
        }
        iterations_summary[j] = {
          masukan: this.feature[j],
          v: v,
          "keluaran y'": y[j],
          "target d": this.label[j],
          error: error,
          delta: delta_weight,
          new_weight: [...this.weight],
        };
      }
      console.log("iterasi: " + i);
      console.table(iterations_summary);
      this.report(iterations_summary);
      if (this.sumOfSquareError(y, this.label)) {
        console.log("stop reason: SSE reached");
        return;
      }
      if (!iterations_error) {
        console.log("stop reason: no data error");
        return;
      }
    }
    console.log("stop reason: max iterations reached");
    console.log("final weight: " + this.weight);
  }
  sumOfSquareError(y, d) {
    let x = 0;
    for (let i = 0; i < d.length; i++) {
      x = x + (d[i] - y[i]) * (d[i] - y[i]);
    }
    let SSE = x / 2;
    if (SSE < 0.001) return true;
    else return false;
  }
  delta_weight(error, data) {
    let x = this.learning_rate * error;
    var delta_weight = [];
    for (let i = 0; i < data.length; i++) {
      delta_weight[i] = data[i] * x;
    }
    return delta_weight;
  }
  new_weight(delta_weight) {
    for (let i = 0; i < this.weight.length; i++) {
      this.weight[i] = this.weight[i] + delta_weight[i];
    }
  }
  predict(input) {
    var v = 0;
    for (var i = 0; i < input.length; i++) {
      v = v + input[i] * this.weight[i];
    }
    let y = this.activations(v);
    return y;
  }
  on(func, handler) {
    this[func] = handler;
  }
  report(iterations_summary) {}
}

module.exports = layer;
