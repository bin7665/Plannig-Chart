const addForm = document.querySelector(".addForm"),
  start = addForm.querySelector(".start"),
  end = addForm.querySelector(".end"),
  input = addForm.querySelector(".planning");

const HOURS = 24;
let DATE = new Date();
DATE = DATE.toJSON().substring(0, 10);
const calender = document.querySelector(".date");

function makeGraph(rates) {
  let graph = "";
  let values = { 0: 0, 1: 0, 2: 0 };
  const emoji = ["😀", "😐", "🙁"];
  for (let i = 0, len = rates.length; i < len; i++) {
    values[rates[i]]++;
  }
  for (let i = 0, len = emoji.length; i < len; i++) {
    graph += `${emoji[i]} <meter min="0" max="24" optimum="12" value=${values[i]}></meter> ${values[i]}<br>`;
  }

  $("#graph").html(graph);
}

function makeTable() {
  const loadedToday = localStorage.getItem(DATE);
  let plans = [],
    rates = [];

  if (loadedToday !== null) {
    const parsedToday = JSON.parse(loadedToday);
    plans = parsedToday["plan"];
    rates = parsedToday["rate"];
  }

  let table =
    "<table><thead><tr><th>시간</th><th>계획</th><th>평가</th></tr></thead></tbody>";
  for (let i = 0; i < HOURS; i++) {
    table += `<tr><td>${i < 10 ? `0${i}` : i}:00</td>`;
    table += `<td width="300px"${
      plans[i] === "(비어 있음)" ? "style='opacity:0.5'" : ""
    }>${plans[i]}</td>`;
    table += `<td><select id=${i} class='rate'><option value="0" ${
      rates[i] == 0 ? "selected" : ""
    }>😀</option><option value="1" ${
      rates[i] == 1 ? "selected" : ""
    }>😐</option><option value="2" ${
      rates[i] == 2 ? "selected" : ""
    }>🙁</option></select></tr>`;
  }
  table += "</tbody></table>";
  makeGraph(rates);
  $("#table").html(table);
}

function saveItems(item) {
  localStorage.setItem(DATE, JSON.stringify(item));
}

function loadDate() {
  const today = localStorage.getItem(DATE);
  if (today === null) {
    let plans = [];
    let rates = [];
    for (let i = 0; i < HOURS; i++) {
      plans.push("(비어 있음)");
      rates.push(1);
    }
    const planingChart = { plan: plans, rate: rates };
    saveItems(planingChart);
  }
  makeTable();
}

function handleSubmit(event) {
  event.preventDefault();
  const startValue = start.selectedIndex;
  const endValue = end.selectedIndex;
  if (endValue >= startValue) {
    const text = input.value;
    const loadedToday = localStorage.getItem(DATE);
    let plans = [];

    if (loadedToday !== null) {
      const parsedToday = JSON.parse(loadedToday);
      plans = parsedToday["plan"];
      for (let i = startValue; i <= endValue; i++) {
        plans[i] = text;
      }
      parsedToday["plan"] = plans;
      saveItems(parsedToday);
    }
    input.value = "";
    makeTable();
  }
}

function addJobs() {
  let start_times = "";
  let end_times = "";
  for (let i = 0; i < HOURS; i++) {
    start_times += `<option value=${i}>${
      i < 10 ? `0${i}:00` : `${i}:00`
    }</option>`;
    end_times += `<option value=${i}>${
      i + 1 < 10 ? `0${i + 1}:00` : `${i + 1}:00`
    }</option>`;
  }
  $(".start").append(start_times);
  $(".end").append(end_times);
  addForm.addEventListener("submit", handleSubmit);
}

function handleChange(event) {
  const target = event.target.id;

  if (target !== "") {
    const targetRate = document.querySelectorAll(".rate");
    const rateValue = Number(targetRate[target].value);
    const loadedToday = localStorage.getItem(DATE);
    let rates = [];

    if (loadedToday !== null) {
      const parsedToday = JSON.parse(loadedToday);
      rates = parsedToday["rate"];
      rates[target] = rateValue;
      parsedToday["rate"] = rates;
      saveItems(parsedToday);
      makeGraph(rates);
    }
  }
}

function changeRate() {
  const table = document.querySelector(".table");
  table.addEventListener("change", handleChange);
}

function calenderHandler(event) {
  const newDate = new Date(calender.value);
  DATE = date.toJSON().substring(0, 10);
  localStorage.setItem("DATE", DATE);
  loadDate();
}

function init() {
  calender.value = DATE;

  loadDate();
  addJobs();
  changeRate();
  calender.addEventListener("change", calenderHandler);
}

init();
