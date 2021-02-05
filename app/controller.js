import { delay, swap } from './utils/commonUtils';

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindInputNumbers(this.handleAddNumberList);
    this.model.bindNodeListDisplayed(this.onDisplayNodeList);
    this.view.bindStartSort(this.handleStartSort);
    this.model.bindStates(this.onUpdateTotalStates);
  }

  handleAddNumberList = (numberLists) => { // 코드 스타일 통일
    this.model.addList(numberLists);
  }

  handleAddState = (state) => {
    this.model.addState(state);
  }

  onDisplayNodeList = (nodes) => {
    this.view.displayNodes(nodes);
  }

  onUpdateTotalStates = async (states) => {
    for (let i = 0; i < states.length; i++) {
      if (!states[i]) {
        throw new Error ('States have error!'); // 이거 필요한가...?
      }

      await this.view.render(states[i]);
    }
  }

  handleStartSort = () => {
    switch (this.view.selector.value) {
      case 'bubble-sort': {
        this.bubbleSort();
        break;
      }
      case 'quick-sort': {
        this.quickSort();
        break;
      }
    }; // semi 붙이나 안붙이나 검색해보기
  }

  bubbleSort = async () => {
    const nodeList = this.model.lists;
    this.handleAddState(['startSort']);

    for (let i = 0; i < nodeList.length; i++) {
      for (let j = 0; j < nodeList.length - i - 1; j++) {
        this.handleAddState(['onLightNode', j]);
        this.handleAddState(['onLightNode', j + 1]);

        if (nodeList[j] > nodeList[j + 1]) {
          swap(nodeList, j, j + 1);

          this.handleAddState(['changeNodes', j, j + 1]);
        }

        if ((j + 1) === nodeList.length - i - 1) {
          this.handleAddState(['checkSortedNode', j + 1]);
        }

        this.handleAddState(['offLightNode', j]);
      }
    }

    this.handleAddState(['finishAllSort']);
    this.onUpdateTotalStates(this.model.sortState);
  }

  quickSort = async () => {
    const partition = async (arr, left, right) => {
      const middle = Math.floor((left + right) / 2);
      const pivot = arr[middle];

      this.handleAddState(['onLightNode', middle]);

      while (left <= right) {
        while (arr[left] < pivot) {
          this.handleAddState(['onLightNode', left]);
          this.handleAddState(['offLightNode', left]);

          left++;
        }

        while (arr[right] > pivot) {
          this.handleAddState(['onLightNode', right]);
          this.handleAddState(['offLightNode', right]);

          right--;
        }

        await delay(100);

        if (left <= right) {
          if (left !== right) {
            swap(arr, left, right);
            this.handleAddState(['changeNodes', left, right]);
            this.handleAddState(['checkSortedNode', middle]);
          }

          left++;
          right--;
        }
      }

      return left;
    };

    const recurseQuickSort = async (arr, left, right) => {
      const pivot = await partition(arr, left, right);

      if (left < pivot - 1) {
        await recurseQuickSort(arr, left, pivot - 1);
      }

      if (right > pivot) {
        await recurseQuickSort(arr, pivot, right);
      }

      return arr;
    };

    this.handleAddState(['startSort']);

    await recurseQuickSort(this.model.lists, 0, this.model.lists.length - 1);

    this.handleAddState(['finishAllSort']);
    this.onUpdateTotalStates(this.model.sortState);
  }
}
