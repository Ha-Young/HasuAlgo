export default class Model {
  "use strict";

  /**
   * Creates a new Model instance
   *
   * @constructor
   */
  constructor() {
    this.sortType = null;
    this.numberArray = null;
    this.data = [];
  }

  getSortType = () => this.sortType;

  getData = () => this.data;

  reset = () => {
    this.data = this.initialData;
    this.numberArray = this.initialNumberArray;
    delete this.initialData;
    delete this.initialNumberArray;
  }

  create = (selection, input, callback) => {
    this.data = [];
    this.sortType = selection;
    this.numberArray = input.split(",").map(element => parseInt(element, 10));

    const maxNum = this._findMaxNum(this.numberArray);
    const maxHeight = this._findMaxHeight(this.sortType);
    const standard = this._setStandard(maxNum, maxHeight);

    this.numberArray.forEach((element, index) => {
      const datum = {
        defaultClass: "number-block",
        colorState: "normal",
        height: standard * element,
        numberSpan: "number-span",
        blockNumber: element
      };
      this.data.push(datum);
    });

    this.initialData = [...this.data];
    this.initialNumberArray = [...this.numberArray];

    callback(this.data);
  }

  bubbleSort = async ({
    changePickedBlocksColor,
    swapBlocks,
    revertBlocksColor,
    decideSorted,
    disableInputs,
    enableInputs }) => {
    disableInputs();

    for (let i = 0; i < this.numberArray.length; i++) {
      for (let j = 0; j < this.numberArray.length - i - 1; j++) {
        await changePickedBlocksColor(j, j + 1);

        if (this.numberArray[j] > this.numberArray[j + 1]) {
          await this._swap(j, j + 1, swapBlocks);
        }

        await revertBlocksColor(j, j + 1);
      }

      await decideSorted(this.numberArray.length - i - 1);
    }

    enableInputs();
  }

  quickSort = async (view) => {
    view.disableInputs();
    const i = await this._partition(0, this.numberArray.length - 1, view);
    await view.partitionBlocks(i);
    await this._quickSort(0, i - 1, view);
    //view.gatherBlocks(0, i);
    await this._quickSort(i + 1, this.numberArray.length - 1, view);
    //view.gatherBlocks(i, this.numberArray.length - 1);
  }

  _quickSort = async (low, high, view) => {
    if (low < high) {
      const i = await this._partition(low, high, view);
      await view.partitionBlocks(i);
      await this._quickSort(low, i - 1, view);
      //view.gatherBlocks(low, i - 1);
      await this._quickSort(i + 1, high, view);
      //view.gatherBlocks(i + 1, high);
    }

    if (low === high) await view.decideSorted(low);
    if (low === this.numberArray.length - 1) view.enableInputs();
  }

  _partition = async (low, high, {
    changePivotBlockColor,
    changePickedBlocksColor,
    swapBlocks,
    revertBlocksColor,
    removePivotPointer,
    decideSorted }) => {
    const pivot = this.numberArray[high];
    let i;
    let index = low;

    await changePivotBlockColor(high);

    for (i = low; i < high; i++) {
      let areEqualBlocks = (i === index || this.numberArray[i] >= pivot)

      await changePickedBlocksColor(i, areEqualBlocks ? null : index);

      if (this.numberArray[i] < pivot) {
        await this._swap(index, i, swapBlocks);
        index++;
      }

      await revertBlocksColor(i, areEqualBlocks ? null : index - 1);
    }

    await this._swap(index, high, swapBlocks);
    await revertBlocksColor(high, index);
    await decideSorted(index);

    return index;
  }

  _setStandard = (maxNum, maxHeight) => {
    if (maxNum > maxHeight) {
      return (maxHeight / maxNum);
    } else if (maxNum < 100) {
      return 5;
    }

    return 1;
  }

  _findMaxHeight = (sortType) => {
    return sortType === "Merge Sort" ? 20 : 800;
  }

  _findMaxNum = (numberArray) => {
    let max = 0;

    for (let i = 0; i < numberArray.length; i++) {
      if (numberArray[i] > max) {
        max = numberArray[i];
      }
    }

    return max;
  }

  _swap = (fromIndex, toIndex, callback) => {
    const temp = this.numberArray[fromIndex];
    this.numberArray[fromIndex] = this.numberArray[toIndex];
    this.numberArray[toIndex] = temp;

    return callback(fromIndex, toIndex);
  }
}
