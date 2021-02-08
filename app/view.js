export default function View() {
  this.HEIGHT_PERCENT = 90;

  this.$inputBox = document.getElementById('inputBox');
  this.$sortBox = document.getElementById('sortBox');
  this.$commentBox = document.getElementById('commentBox');

  this.canPaint = true;
  this.styleClassName = {
    TRANSITION: 'transition',
    SELECT: 'selected',
    NONE: 'none',
    BLOCK: 'block'
  };
}

View.prototype.createBlock = function (sortList) {
  const highestValue = Math.max(...sortList);

  this.canPaint = true;

  for (let i = 0; i < sortList.length; i++) {
    const $block = document.createElement('div');
    const $label = document.createElement('b');

    $block.classList.add(this.styleClassName.BLOCK);

    $block.style.height = `${sortList[i] / highestValue * this.HEIGHT_PERCENT}%`;
    $label.textContent = `${sortList[i]}`;
    $label.style.height = `${sortList[i] / highestValue * this.HEIGHT_PERCENT}%`;

    $block.appendChild($label);
    this.$sortBox.appendChild($block);
  }
};

View.prototype.swapElements = function (rightElement, leftElement, swappedArray, delay) {
  return new Promise(resolve => {
    const rightElementLocationX = this._getTargetTranslateX(rightElement);
    const leftElementLocationX = this._getTargetTranslateX(leftElement);

    this.changeBlockStyle(this.styleClassName.TRANSITION, [rightElement, leftElement]);
    this.changeBlockStyle(this.styleClassName.SELECT, [rightElement, leftElement]);

    rightElement.style.transform = `translateX(${leftElementLocationX - rightElementLocationX}px)`;
    leftElement.style.transform = `translateX(${rightElementLocationX - leftElementLocationX}px)`;

    setTimeout(() => {
      rightElement.style.transform = this.styleClassName.NONE;
      leftElement.style.transform = this.styleClassName.NONE;

      this.changeBlockStyle(this.styleClassName.SELECT, [rightElement, leftElement]);

      this.$sortBox.textContent = '';

      if (this.canPaint) {
        this.createBlock(swappedArray);
      }

      resolve();
    }, delay);
  });
};

View.prototype.changeBlockStyle = function (className, elementList) {
  for (let i = 0; i < elementList.length; i++) {
    elementList[i].classList.toggle(className);
  }
};

View.prototype._getTargetTranslateX = function (target) {
  return target.getBoundingClientRect().x;
};

View.prototype.showText = function (text) {
  this.$commentBox.textContent = text;
};

View.prototype.clearText = function () {
  this.$inputBox.value = '';
  this.$sortBox.textContent = '';
};
