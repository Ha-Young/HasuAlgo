function View() {
  this.$sortForm = document.querySelector(".sorting__form");
  this.$sortInput = document.querySelector(".sorting__input");
  this.$sortNumbers = document.querySelector(".sorting__numbers");
  this.$sortButton = document.querySelector(".sortButton");

  this.$sortDisplay = document.querySelector(".display-container");
  this.$sortLists = document.querySelector(".sorting__lists");
  this.$allItem = this.$sortLists.childNodes;

  this.TranslateDelayTime = 500;
}

View.prototype.printNumbers = function (sortList) {
  this.$sortNumbers.textContent = sortList.join(", ");
  this.$sortInput.value = "";
};

View.prototype.createNumbers = function (number) {
  const $number = document.createElement("li");

  $number.textContent = number;
  $number.classList.add("sorting__item");
  this.setNumbersHeigth($number, number);

  return $number;
};

View.prototype.setNumbersHeigth = function (targetNumber, height) {
  targetNumber.style.height = `${height}px`;
};

View.prototype.paintSortList = function (sortList) {
  for (let i = 0; i < sortList.length; i++) {
    const item = this.createNumbers(sortList[i]);
    this.$sortLists.appendChild(item);
  }
};

View.prototype.chageSortItemPosition = function (left, right) {
  return new Promise(function (resolve) {
    const temp1 = left.getBoundingClientRect().x;
    const temp2 = right.getBoundingClientRect().x;

    view.addMovingClass(left, right);

    left.style.transform = `translateX(${temp2 - temp1}px)`;
    right.style.transform = `translateX(${temp1 - temp2}px)`;

    setTimeout(function () {
      resolve();
    }, view.TranslateDelayTime);
  })
};

View.prototype.addMovingClass = function (...items) {
  items.forEach(function (item) {
    item.classList.add("moving");
  });
};

View.prototype.removeMovingClass = function (...items) {
  items.forEach(function (item) {
    item.classList.remove("moving");
  });
};

View.prototype.resetTranslate = function (...items) {
  items.forEach(function (item) {
    item.style.transform = null;
  });
}

View.prototype.changeDomPosition = function (left, right) {
  this.$sortLists.insertBefore(right, left);
};

export const view = new View();
