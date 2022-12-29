const jsonPicker = document.getElementById("jsonPicker");
const table_data = document.getElementById("table_data");
var target_select;
const initial_container = document.getElementById("initial_container");
const table_train = document.getElementById("table_train");
const predict_input = document.getElementById("predict_input");
const predict_output = document.getElementById("predict_output");
let model;
let data;
let iteration_index = 1;
clear();
function onReaderLoad(event) {
  data = JSON.parse(event.target.result);
  console.table(data);
  init();
}
jsonPicker.addEventListener("change", (event) => {
  const [file] = event.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector(".file-name").textContent = fileNameAndSize;
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
});
function generateTableData(data) {
  table_data.style.display = "block";
  var col = Object.keys(data[0]);

  var table = document.createElement("table");

  var tr = table.insertRow(-1); // table row.

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); // table header.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // add json data to the table as rows.
  for (var i = 0; i < data.length; i++) {
    tr = table.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = data[i][col[j]];
    }
  }

  // Now, add the newly created table with json data, to a container.
  table_data.appendChild(table);
  target_select = document.createElement("select");

  var el = document.createElement("option");
  el.textContent = "Target Class";
  el.disabled = true;
  el.selected = true;
  target_select.appendChild(el);
  col.forEach((item) => {
    var el = document.createElement("option");
    el.textContent = item;
    el.value = item;
    target_select.appendChild(el);
  });
}
function generateInitiator() {
  initial_container.style.display = "block";
  var div = document.createElement("div");
  div.className = "flex";
  div.appendChild(target_select);
  var input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Learning Rate";
  // input.className = "css-class-name";
  div.appendChild(input);
  var input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Iteration";
  // input.className = "css-class-name";
  div.appendChild(input);
  initial_container.appendChild(div);

  var div = document.createElement("div");
  div.className = "flex";
  for (let i = 1; i <= Object.keys(data[0]).length - 1; i++) {
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Weight " + i;
    // input.className = "css-class-name";
    div.appendChild(input);
  }
  initial_container.appendChild(div);

  var div = document.createElement("div");
  div.className = "flex";
  var button = document.createElement("button");
  button.innerHTML = "Train";
  // button.className = "css-class-name";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    train_model();
  });
  div.appendChild(button);
  initial_container.appendChild(div);
}
function get_initiator() {
  var inputElements = initial_container.getElementsByTagName("input");
  var input = [];
  input[0] = parseFloat(inputElements[0].value);
  input[1] = parseFloat(inputElements[1].value);
  input[2] = [];
  for (let i = 2; i < inputElements.length; i++) {
    input[2].push(parseFloat(inputElements[i].value));
  }

  return input;
}
function train_model() {
  table_train.innerHTML = "";
  predict_input.innerHTML = "";
  predict_output.innerHTML = "";
  iteration_index = 1;
  let x_train = [];
  let y_train = [];
  let class_target = target_select.value;
  data.forEach((object, i) => {
    var temp = { ...object };
    y_train[i] = temp[class_target];
    delete temp[class_target];
    x_train[i] = Object.values(temp);
  });
  console.table(x_train);
  console.table(y_train);
  var input = get_initiator();
  generateIterationHeadTable(input[2]);
  model = new layer(input[2], input[0]);
  model.on("report", generateIterationTable);
  model.fit(x_train, y_train);
  model.train(input[1]);
  var span = document.createElement("span");
  span.innerText = "Final Weight: [" + model.weight + "]";
  table_train.appendChild(span);
  initPredict();
}
function generateIterationHeadTable(weight) {
  table_train.style.display = "block";
  let tabelTrain = document.createElement("table");
  var tr = tabelTrain.insertRow(-1);

  var col = [
    "Iterations",
    "Input",
    "Value",
    "Output",
    "Target",
    "Error",
    "Δ Weight",
    "New Weight",
  ];

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); // table header.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }
  var tr = tabelTrain.insertRow(-1);
  var tabCell = tr.insertCell(-1);
  tabCell.innerText = "Initial Weight";
  tabCell.colSpan = 7;
  var tabCell = tr.insertCell(-1);
  tabCell.innerText = "[" + weight + "]";
  table_train.appendChild(tabelTrain);
}
function generateIterationTable(report) {
  var tabel = table_train.getElementsByTagName("table")[0];
  var tr = tabel.insertRow(-1);
  var CellIter = tr.insertCell(-1);
  CellIter.innerText = "Iteration " + iteration_index++;
  CellIter.rowSpan = report.length;
  for (let i = 0; i < report.length; i++) {
    var data = report[i];
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = "[" + data.masukan + "]";
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = data.v;
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = data["keluaran y'"];
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = data["target d"];
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = data.error;
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = "[" + data.delta + "]";
    tabCell = tr.insertCell(-1);
    tabCell.innerHTML = "[" + data.new_weight + "]";
    tr = tabel.insertRow(-1);
  }
  tabel.deleteRow(-1);
}
function clear() {
  table_data.style.display = "none";
  initial_container.style.display = "none";
  table_train.style.display = "none";
  predict_input.style.display = "none";
  predict_output.style.display = "none";
  table_data.innerHTML = "";
  initial_container.innerHTML = "";
  table_train.innerHTML = "";
  predict_input.innerHTML = "";
  predict_output.innerHTML = "";
  iteration_index = 1;
}
function init() {
  clear();
  generateTableData(data);
  generateInitiator();
}
function initPredict() {
  predict_input.style.display = "block";
  predict_output.style.display = "block";
  var div = document.createElement("div");
  div.className = "flex";
  for (let i = 1; i <= Object.keys(data[0]).length - 1; i++) {
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Input " + i;
    // input.className = "css-class-name";
    div.appendChild(input);
  }

  predict_input.appendChild(div);
  var div = document.createElement("div");
  div.className = "flex";
  var button = document.createElement("button");
  button.innerHTML = "Predict";
  // button.className = "css-class-name";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    predictInput();
  });

  div.appendChild(button);
  predict_input.appendChild(div);
}
function predictInput() {
  predict_output.innerHTML = "";
  var inputElements = predict_input.getElementsByTagName("input");
  var input = [];
  for (let i = 0; i < inputElements.length; i++) {
    input.push(parseFloat(inputElements[i].value));
  }
  var output = model.predict(input);
  predict_output.innerHTML = "Predict Output: " + output;
}
