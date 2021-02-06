import { delay } from './utils/commonUtils';
import { swapNodes, onHighlightNode, offHighlightNode, onHighlightAllNodes } from './utils/uiUtils';
import { colorChart } from './constants/themeColor';

export class View {
  constructor() {
    this.form = document.querySelector('form');
    this.submitButton = document.querySelector('.content-form-submitButton');
    this.input = document.querySelector('.content-form-input');
    this.selector = document.querySelector('select');
    this.startButton = document.querySelector('.content-startButton');
    this.contentField = document.querySelector('.content-field');
    this.warningZone = document.querySelector('.content-warning');
  }

  get nodeList() {
    return this.input.value;
  }

  resetInput() {
    this.input.value = '';
  }

  bindInputNumbersAndValidate(handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!this.nodeList) {
        this.warningZone.textContent = 'Please enter numbers';
        return;
      }

      const MIN_LIST_LENGTH = 5;
      const MAX_LIST_LENGTH = 10;

      const MIN_NUMBER_RANGE = 0;
      const MAX_NUMBER_RANGE = 100;

      const listArray = this.nodeList.split(',').map(item => Number(item));
      const isNumbers = listArray.every(item => typeof item === 'number' && !isNaN(item));
      const withinRange = listArray.every(item => item > MIN_NUMBER_RANGE && item < MAX_NUMBER_RANGE);

      if (listArray.length < MIN_LIST_LENGTH || listArray.length > MAX_LIST_LENGTH) {
        this.warningZone.textContent = 'Please enter number 5 to 10';
        return;
      } else if (!isNumbers) {
        this.warningZone.textContent = 'Please enter only number';
        return;
      } else if (!withinRange) {
        this.warningZone.textContent = 'Please enter number in 50 to 100';
        return;
      }

      this.warningZone.textContent = '';
      this.submitButton.disabled = true;

      handler(listArray);
      this.resetInput();
    });
  }

  bindStartSort(handler) {
    this.startButton.addEventListener('click', () => {
      if (this.selector.value === '') {
        this.warningZone.textContent = 'Please choose sort type';
        return;
      }

      this.warningZone.textContent = '';
      handler();
      this.startButton.disabled = true;
    });
  }

  displayNodes(nodeLists) {
    const DEFAULT_HEIGHTS = 4.5;

    for (let i = 0; i < nodeLists.length; i++) {
      const newNode = document.createElement('div');

      newNode.classList.add('content-field-node');
      newNode.style.height = `${DEFAULT_HEIGHTS * nodeLists[i]}px`;
      newNode.textContent = nodeLists[i];

      this.contentField.appendChild(newNode);
    }
  }

  render = async (stateInfo) => {
    const copiedStateInfo = stateInfo.slice();
    const stateType = copiedStateInfo.shift();

    const viewCommands = {
      startSort: () => {
        onHighlightAllNodes();
      },
      onLightNode: (index) => {
        onHighlightNode(index[0]);
      },
      changeNodes: (index) => {
        swapNodes(this.contentField.children, index[0], index[1]);
      },
      offLightNode: (index) => {
        offHighlightNode(index[0]);
      },
      checkSortedNode: (index) => {
        offHighlightNode(index[0], colorChart.LIGHT_PINK);
      },
      finishAllSort: () => {
        onHighlightAllNodes();
      },
    };

    await delay(500);
    await viewCommands[stateType](copiedStateInfo);
    await delay(500);
  }
}
