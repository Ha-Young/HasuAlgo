import { initialTemplate } from "./templates/initialTemplate";

function Controller(model, view) {
  const self = this;
  self.model = model;
  self.view = view;

  self.bindHandleSubmit = self.handleSubmit.bind(self);
  self.bindHandlePaintSortItems = self.handlePaintSortItems.bind(self);
  self.bindHandleStartSort = self.handleStartSort.bind(self);
  self.bindResetSort = self.resetSort.bind(this);

  self.view.$sortForm.addEventListener("submit", self.bindHandleSubmit);
  self.view.$paintButton.addEventListener("click", self.bindHandlePaintSortItems);
}

Controller.prototype.handleSubmit = function (event) {
  event.preventDefault();

  this.model.getSortList(this.view.$sortInput.value);
  this.view.printNumbers(this.model.sortList);
  this.view.$resetButton.addEventListener("click", this.bindResetSort);
};

Controller.prototype.handlePaintSortItems = function () {
  this.view.clickButtonEffect(this.view.$paintButton);

  if (this.model.sortList.length < 5) {
    alert("min 5 number!!");
    return;
  }

  this.view.$sortForm.style.visibility = "hidden";

  this.view.paintSortItems(this.model.sortList);
  this.view.makeSelectorDisable();

  this.view.$sortButton.addEventListener("click", this.bindHandleStartSort);

  this.view.$sortForm.removeEventListener("submit", this.bindHandleSubmit);
  this.view.$paintButton.removeEventListener("click", this.bindHandlePaintSortItems);
};

Controller.prototype.handleStartSort = function () {
  this.view.clickButtonEffect(this.view.$sortButton);

  if (this.model.sortList.length < 5) {
    alert("min 5 number!!");
    return;
  }

  this.view.$sortButton.removeEventListener("click", this.bindHandleStartSort);

  if (this.view.$sortOptionSelector.value === this.view.sortOptions.bubble) {
    this.bubbleSort.call(this);
  } else {
    this.mergeSort.call(this);
  }
};

Controller.prototype.ascendingSortTwoItem = async function(left, right, index) {
  if (right.classList.contains("sorted")) {
    left.classList.add("sorted");
    return;
  }

  const self = this;
  const itemList  = [left, right];

  left.classList.add(self.view.classList.sort);
  await self.view.setDelay(50);
  right.classList.add(self.view.classList.sort);

  if (Number(left.textContent) > Number(right.textContent)) {
    await self.view.changeSortItemPosition(left, right);

    self.model.changeListOrder(index, index + 1);

    itemList.forEach(function (item) {
      self.view.resetTranslate(item);
    });
    itemList.forEach(function (item) {
      item.classList.remove(self.view.classList.moving);
    });
    right.classList.remove(self.view.classList.sort);

    self.view.swapDomPosition(left, right);
  }

  if (Number(left.textContent) <= Number(right.textContent)) {
    if(!right.classList.contains("sorted")) {
      await self.view.setDelay(0);

      left.classList.remove(self.view.classList.sort);
    }
  }

  return Promise.resolve();
};

Controller.prototype.bubbleSort = async function () {
  const item = this.view.$allItem;

  for (let i = 1; i < item.length + 1; i++) {
    for (let j = 0; j < item.length - 1; j++) {
        await this.ascendingSortTwoItem.call(this, item[j], item[j + 1], j);
    }

    await this.view.setDelay(0);
    item[item.length - i].classList.add("sorted");
  }
};

Controller.prototype.resetSort = function () {
  this.view.clickButtonEffect(this.view.$resetButton);

  this.view.$resetButton.removeEventListener("click", this.bindResetSort);

  this.view.changeTemplate(this.view.viewBox, initialTemplate());

  this.view.$sortForm.addEventListener("submit", this.bindHandleSubmit);
  this.view.$paintButton.addEventListener("click", this.bindHandlePaintSortItems);
  //reset후, input을 submit하면 refresh되는 에러가 있습니다.
};

Controller.prototype.mergeSort = async function () {
  const self = this;
  const items = Array.from(this.view.$allItem);

  items.forEach(function (item) {
    item.classList.add(self.view.classList.moving);
  });

  await this.splitItems.call(this, items, -350);
};

Controller.prototype.splitItems = async function (items, y) {
  const self = this;

  items.forEach(function (item) {
    self.view.translate(item, 0, y);
  });

  await self.view.setDelay(self.view.transitionDelayTime);

  items.forEach(function (item) {
    item.style.margin = "20px";
  });

  this.sliceItems(items);
};

Controller.prototype.sliceItems = function (items) {
  const result = [];

  const middleIndex = Math.floor(items.length / 2);
  const left = items.slice(0, middleIndex);
  const right = items.slice(middleIndex);

  if (right.length > 1) {
    this.sliceItems(right);
  }
  if (left.length > 1) {
    this.sliceItems(left);
  }

  if (Number(left.textContent) > Number(right.textContent), 0) {
    this.ascendingSortTwoItem(left, right);
  }

  return;
}

export default Controller;
