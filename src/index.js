const fs = require("fs");
const layer = require("./layer_perception");

let rawdata = fs.readFileSync("./src/data_train.json");
let data = JSON.parse(rawdata);
console.table(Object.values(data));

let x_train = [];
let y_train = [];
let status = [];
predict_text = (predict) => {
  return status[predict];
};

data.forEach((object, i) => {
  y_train[i] = object["STATUS"];
  status[object["STATUS"]] = object["STATUS TEXT"];
  delete object["STATUS"];
  delete object["STATUS TEXT"];
  x_train[i] = Object.values(object);
});

console.table(x_train);
console.table(y_train);

let ann_single_perceptron = new layer([-1.7, 0.9, 2], 0.5);
ann_single_perceptron.fit(x_train, y_train);
ann_single_perceptron.train(3);

// console.log(ann_single_perceptron);

var predict = ann_single_perceptron.predict([0.8, 0.1, 0.5]);
console.log(predict_text(predict));
