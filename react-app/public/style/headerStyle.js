/*
Credit to George Hastings:
Extracted from: https://codemyui.com/decryption-effect-click/
*/

var dictionary = "abcdefghijklmnopqrstuv".split("");

var el = document.querySelector("h2");

var ran = function () {
  return Math.floor(Math.random() * dictionary.length);
};

var ranString = function (amt) {
  var string = "";
  for (var i = 0; i < amt; i++) {
    string += dictionary[ran()];
  }
  return string;
};

var init = function (str) {
  var count = str.length;
  var delay = 10;

  el.innerHTML = "";

  var gen = setInterval(function () {
    el.setAttribute("data-before", ranString(count));
    el.setAttribute("data-after", ranString(count));
    if (delay > 0) {
      delay--;
    } else {
      if (count < str.length) {
        el.innerHTML += str[str.length - count - 1];
      }
      count--;
      if (count === -1) {
        clearInterval(gen);
      }
    }
  }, 32);
};

init("Learnify");
