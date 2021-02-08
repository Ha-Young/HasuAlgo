import '../assets/styles/index.less';
import View from './view.js';
import Model from './model.js';

const view = new View();
const model = new Model();

function changeViewStyle(className, ...args) {
  view.changeBlockStyle(className, args);
}

function showViewText(text) {
  view.showText(text);
}

async function swapInView(rightElement, leftElement, swapList, delay) {
  await view.swapElements(rightElement, leftElement, swapList, delay);
}

function init() {
  const SELECT_COMMNET = 'Please select sorting mode';
  const BUBBLESORT_COMMENT = 'Bubble sort';
  const QUICKSORT_COMMENT = 'Quick sort';
  const UNSELECT_COMMENT = 'You must be select the sorting mode';

  const $inputBox = document.getElementById('inputBox');
  const $submitButton = document.getElementById('submitButton');
  const $playButton = document.getElementById('playButton');
  const $reloadButton = document.getElementById('reloadButton');
  const $fastButton = document.getElementById('fastButton');
  const $slowButton = document.getElementById('slowButton');
  const $selectBox = document.getElementById('selectBox');
  const $sidebarButton = document.getElementById('sidebarButton');
  const $sideDisplay = document.getElementById('sideDisplay');
  const $guideButton = document.getElementById('guideButton');
  const $userGuide = document.getElementById('userGuide');

  const selectOptions = {
    BUBBLE_SORT: 'bubbleSort',
    QUICK_SORT: 'quickSort',
    NONE: 'none'
  };
  const styleClassName = {
    HIDDEN: 'hidden'
  };

  let sortingList;
  let sortingMethod;

  function clickEffect(event) {
    const clickElement = document.createElement('div');

    clickElement.className = 'clickEffect';
    clickElement.style.top = event.clientY + 'px';
    clickElement.style.left = event.clientX + 'px';
    document.body.appendChild(clickElement);

    clickElement.addEventListener('animationend', function () {
      clickElement.parentElement.removeChild(clickElement);
    }.bind(this));
  }

  $submitButton.addEventListener('click', function () {
    const inputValue = $inputBox.value;

    sortingList = model.checkValue(inputValue);

    if (sortingList) {
      $submitButton.disabled = true;

      view.createBlock(sortingList);
    }
  });

  $selectBox.addEventListener('change', function () {
    switch ($selectBox.options[$selectBox.selectedIndex].text) {
      case selectOptions.BUBBLE_SORT:
        view.showText(BUBBLESORT_COMMENT);

        sortingMethod = selectOptions.BUBBLE_SORT;
        break;

      case selectOptions.QUICK_SORT:
        view.showText(QUICKSORT_COMMENT);

        sortingMethod = selectOptions.QUICK_SORT;
        break;

      default:
        view.showText(UNSELECT_COMMENT);

        sortingMethod = selectOptions.NONE;
        break;
    }
  });

  $playButton.addEventListener('click', function () {
    if (sortingList) {
      $playButton.disabled = true;
      $inputBox.disabled = true;
      $selectBox.disabled = true;

      switch (sortingMethod) {
        case 'bubbleSort':
          model._bubbleSort();
          break;

        case 'quickSort':
          model._quickSort();
          break;

        default:
          view.showText(SELECT_COMMNET);

          $playButton.disabled = false;
          break;
      }
    }
  });

  $fastButton.addEventListener('click', function () {
    model._setFaster();
  });

  $slowButton.addEventListener('click', function () {
    model._setSlower();
  });

  $reloadButton.addEventListener('click', function () {
    $submitButton.disabled = false;
    $playButton.disabled = false;
    $inputBox.disabled = false;
    $selectBox.disabled = false;
    view.canPaint = false;
    model.isStop = true;

    setTimeout(() => {
      model._resetBoard();
      view.clearText();
    }, 250);
  });

  $sidebarButton.addEventListener('click', function () {
    view.changeBlockStyle(styleClassName.HIDDEN, [$sideDisplay]);
  });

  $guideButton.addEventListener('click', function () {
    view.changeBlockStyle(styleClassName.HIDDEN, [$userGuide]);
  });

  document.addEventListener('click', clickEffect);
}

init();

export { swapInView, changeViewStyle, showViewText };
