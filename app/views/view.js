export const View = function() {
  this.$visualFrame = document.querySelector('.visual-frame');
  this.$visual = document.querySelector('.visual');
  this.$form = document.querySelector('form');
  this.$userValue = document.querySelector('.user-value');
  this.$deleteBtn = document.querySelector('.delete');
  this.$startBtn = document.querySelector('.start');
  this.$resetBtn = document.querySelector('.reset');
}

View.prototype.create = function(v, n) {
  const $box = document.createElement('div');
  
  $box.className = 'sort-box';
  $box.innerText = v;
  $box.style.height = `${v * 15}px`;
  $box.style.transform = `translateX(${(n -1) * 25}px)`;
  
  this.$visual.appendChild($box);
};

View.prototype.delete = function() {
  this.$visual.removeChild(this.$visual.lastChild);
};

View.prototype.clear = function(n) {
  for (let i = 0; i < n; i++) {
    this.$visual.removeChild(this.$visual.lastChild);
  }
};

View.prototype.set = function(n, array) {
  for (let i = 0; i < n; i++) {
    this.$visual.removeChild(this.$visual.lastChild);
  }
  
  for (let i = 0; i < n; i++) {
    this.create(array[i], i + 1);
  }
};
// bubble sort 전용 methods..
View.prototype.swap = function(a, b) {
  const $target = document.querySelector('.visual');
  const $boxs = document.querySelectorAll('.sort-box');

  return new Promise(resolve => {
    const styleA = window.getComputedStyle($boxs[a]);
    const styleB = window.getComputedStyle($boxs[b]);
    
    const transformA = styleA.getPropertyValue('transform');
    const transformB = styleB.getPropertyValue('transform');

    $boxs[a].style.transform = transformB;
    $boxs[b].style.transform = transformA;
    
    window.requestAnimationFrame(function() {
      setTimeout(() => {
        $target.insertBefore($boxs[b], $boxs[a]);
        resolve();
      }, 500);
    });
  });
};

View.prototype.paint = function(a, b, n) {
  const $boxs = document.querySelector('.sort-box');

  $boxs[a].style.backgroundColor = "#58B7FF";
  $boxs[b].style.backgroundColor = "#58B7FF"; // 비교중 색칠
  $boxs[$boxs.length -n -1].style.backgroundColor = "#13CE66"; // 완료됨 색칠
};
