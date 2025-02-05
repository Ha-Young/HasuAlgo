import {
  $on,
  qs,
  getByClassName,
  qsAll,
  changeDOMOrder,
} from "./utils/domHelper";
import Templates from "./utils/templates";
import { SortItemList } from "../common/typeDef";
import { fromToTranslatePosition, positionFactory } from "./utils/animate";
import { ITEM, ARROW, STATUS_TYPE, ARROW_TYPE } from "../common/constant";

export default class View {
  constructor() {
    this.template = new Templates();
    this.$container = qs(".container");
    this.$themeSwitch = qs("#theme-switch");
    this.$sortTypeBtns = qs(".sort-kinds-btns");
    this.$inputNumbers = qs(".input-numbers");
    this.$setBtn = qs(".set-btn");
    this.$vizCanvas = qs("#viz-canvas");
    this.$sortBtn = qs(".sort-btn");
    this.$randomBtn = qs(".random-btn");
    this.$infoMsg = qs(".info-msg");
  }

  bindOnClickSortTypeBtns(handler) {
    $on(this.$sortTypeBtns, "click", ({ currentTarget, target }) => {
      target.classList.add(STATUS_TYPE.SELECTED);
      for (const childNode of currentTarget.childNodes) {
        if (childNode !== target) {
          childNode.classList && childNode.classList.remove(STATUS_TYPE.SELECTED);
        }
      }

      handler(target.dataset.btnName);
    });
  }

  bindOnClickSetBtn(handler) {
    $on(this.$setBtn, "click", () => {
      handler(this.$inputNumbers.value);
    });
  }

  bindOnClickThemeSwitch(handler) {
    $on(this.$themeSwitch, "change", () => {
      handler();
    });
  }

  bindOnClickSortBtns(handler) {
    $on(this.$sortBtn, "click", () => {
      handler();
    });
  }

  bindOnClickRandomBtns(handler) {
    $on(this.$randomBtn, "click", () => {
      handler();
    });
  }

  setTheme(theme) {
    this.$container.className = `container ${theme}`;
  }

  writeRandomNum(randomNumbers) {
    this.$inputNumbers.value = randomNumbers;
  }

  setErrorMsg(error) {
    this.$infoMsg.textContent = error;
    this.$infoMsg.className = 'info-msg error';
  }

  setInfoMsg(info) {
    this.$infoMsg.textContent = info;
    this.$infoMsg.className = 'info-msg info';
  }

  initInfoMsg() {
    this.$infoMsg.textContent = '';
  }

  // SortItem 관련 (SVG)
  startView() {
    this.$vizCanvas.innerHTML = this.template.init();
  }

  getSortItemListsOnView() {
    return qsAll("g", this.$vizCanvas);
  }

  getLiveSortItemListsOnView() {
    return getByClassName("sort-item", this.$vizCanvas);
  }

  getSortItemElement(nth) {
    return this.getSortItemListsOnView()[nth];
  }

  getSortItemRectHeight(sortItemElement) {
    const rectElement = sortItemElement.querySelector("rect");
    return +rectElement.getAttribute("height");
  }

  clearSortItemStatus(sortItemElement, exceptClassList = ["sort-item"]) {
    const _classList = Array.from(sortItemElement.classList);

    for (const className of _classList) {
      sortItemElement.classList.remove(className);
    }

    for (const exceptClassName of exceptClassList) {
      sortItemElement.classList.add(exceptClassName);
    }
  }

  getSVGItemPosition(sortItemElement) {
    const svgTransFormMatrix = sortItemElement.transform.baseVal.getItem(0)
      .matrix; // An SVGTransformList
    return [svgTransFormMatrix.e, svgTransFormMatrix.f];
  }

  swapOnDomList(aIndex, bIndex) {
    const sortItemList = this.getLiveSortItemListsOnView();
    const [smallIndex, largeIndex] =
      aIndex >= bIndex ? [bIndex, aIndex] : [aIndex, bIndex];

    changeDOMOrder(this.$vizCanvas, sortItemList, smallIndex, largeIndex);
  }

  addArrowDefSVG() {
    this.$vizCanvas.insertAdjacentHTML('beforeend', this.template.arrowDef());
  }

  makeArrowDOM(target, arrowType, xPos, yPos) {
    target.insertAdjacentHTML('beforeend', this.template.arrow(arrowType, xPos, yPos));
  }

  setSortItemColorFromStatus(sortItemElement, status) {
    this.clearSortItemStatus(sortItemElement);
    switch (status) {
      case STATUS_TYPE.SORTED:
        sortItemElement.classList.add(STATUS_TYPE.SORTED);
        break;
      case STATUS_TYPE.SELECTED:
        sortItemElement.classList.add(STATUS_TYPE.SELECTED);
        break;
      case STATUS_TYPE.CHECK:
        sortItemElement.classList.add(STATUS_TYPE.CHECK);
        break;
      case STATUS_TYPE.PIVOT:
        sortItemElement.classList.add(STATUS_TYPE.PIVOT);
        break;
      case STATUS_TYPE.SMALL:
        sortItemElement.classList.add(STATUS_TYPE.SMALL);
        break;
      case STATUS_TYPE.LARGE:
        sortItemElement.classList.add(STATUS_TYPE.LARGE);
        break;
      default:
        throw new Error('Undefined Status Type Error');
    }
  }

  /**
   * Format the contents of a sort list.
   *
   * @param {SortItemList} items sort list items
   *
   */
  showSortItems(sortItemList) {
    this.$vizCanvas.innerHTML = this.template.sortItemList(sortItemList);
  }

  // sort 비동기 관련
  setSortItemStatusSorted(index, duration) {
    if (index < 0) return;
    const sortItemElement = this.getSortItemElement(index);
    const sortItemRectHeight = this.getSortItemRectHeight(sortItemElement);
    this.setSortItemColorFromStatus(sortItemElement, STATUS_TYPE.SORTED);

    if (duration) {
      const [currentXPos, currentYPos] = this.getSVGItemPosition(
        sortItemElement
      );
      const fromPosition = positionFactory(currentXPos, currentYPos);
      const toPosition = positionFactory(
        currentXPos,
        ITEM.MAX_HEIGHT - sortItemRectHeight
      );

      fromToTranslatePosition(
        sortItemElement,
        fromPosition,
        toPosition,
        duration
      );
    }
  }

  setSortItemStatusSelected(index, isMoveDown, duration) {
    if (index < 0) return;
    const sortItemElement = this.getSortItemElement(index);

    if (sortItemElement.classList.contains(STATUS_TYPE.PIVOT)) return;

    const sortItemRectHeight = this.getSortItemRectHeight(sortItemElement);
    this.setSortItemColorFromStatus(sortItemElement, STATUS_TYPE.SELECTED);

    if (isMoveDown && duration) {
      const [currentXPos, currentYPos] = this.getSVGItemPosition(
        sortItemElement
      );
      const fromPosition = positionFactory(currentXPos, currentYPos);
      const toPosition = positionFactory(
        currentXPos,
        currentYPos + sortItemRectHeight
      );

      fromToTranslatePosition(
        sortItemElement,
        fromPosition,
        toPosition,
        duration
      );
    }
  }

  setSortItemStatusCheck(index) {
    if (index < 0) return;
    const sortItemElement = this.getSortItemElement(index);
    this.setSortItemColorFromStatus(sortItemElement, STATUS_TYPE.CHECK);
  }

  setSortItemStatusClear(index) {
    if (index < 0) return;
    const sortItemElement = this.getSortItemElement(index);
    if (sortItemElement.classList.contains(STATUS_TYPE.PIVOT)) return;
    this.clearSortItemStatus(sortItemElement);
  }

  setSortItemStatusClaerAllIgnoreSorted(sortedIndexs) {
    const sortItemElements = this.getSortItemListsOnView();

    if (!sortItemElements || sortItemElements.length === 0) return;

    for (let i = 0; i < sortItemElements.length; i++) {
      const sortItemElement = sortItemElements[i];
      if (sortedIndexs.includes(i)) {
        if (!sortItemElement.classList.contains(STATUS_TYPE.SORTED)) {
          this.setSortItemColorFromStatus(sortItemElement, STATUS_TYPE.SORTED);
        }
        continue;
      }

      this.clearSortItemStatus(sortItemElement);
    }
  }

  changeSortItem(aIndex, bIndex, duration) {
    const aSortItemElement = this.getSortItemElement(aIndex);
    const bSortItemElement = this.getSortItemElement(bIndex);

    const [aXPos, aYPos] = this.getSVGItemPosition(aSortItemElement);
    const [bXPos, bYPos] = this.getSVGItemPosition(bSortItemElement);

    const aFromPosition = positionFactory(aXPos, aYPos);
    const aToPosition = positionFactory(bXPos, aYPos);

    const bFromPosition = positionFactory(bXPos, bYPos);
    const bToPosition = positionFactory(aXPos, bYPos);

    fromToTranslatePosition(
      aSortItemElement,
      aFromPosition,
      aToPosition,
      duration
    );
    fromToTranslatePosition(
      bSortItemElement,
      bFromPosition,
      bToPosition,
      duration
    );
  }

  setSortItemStatusPivot(index) {
    if (index < 0) return;
    const sortItemElement = this.getSortItemElement(index);
    this.setSortItemColorFromStatus(sortItemElement, STATUS_TYPE.PIVOT);
  }

  setSortItemStatusSmall(index) {
    if (index < 0) return;
    const sortItemElement = this.getSortItemElement(index);
    if (sortItemElement.classList.contains(STATUS_TYPE.PIVOT)) return;
    if (sortItemElement.classList.contains(STATUS_TYPE.SORTED)) return;

    this.setSortItemColorFromStatus(sortItemElement, STATUS_TYPE.SMALL);
  }

  setSortItemStatusLarge(index) {
    if (index < 0) return;
    const sortItemElement = this.getSortItemElement(index);
    if (sortItemElement.classList.contains(STATUS_TYPE.PIVOT)) return;
    if (sortItemElement.classList.contains(STATUS_TYPE.SORTED)) return;

    this.setSortItemColorFromStatus(sortItemElement, STATUS_TYPE.LARGE);
  }

  addArrow(index, arrowType) {
    if (index < 0) return;

    const sortItemElement = this.getSortItemElement(index);
    const sortItemRectHeight = this.getSortItemRectHeight(sortItemElement);
    const [sortItemXPos, sortItemYPos] = this.getSVGItemPosition(
      sortItemElement
    );

    if (arrowType === STATUS_TYPE.PIVOT) {
      const arrowXPos = ARROW.DISTANCE_XPOS;
      const arrowYPos = sortItemRectHeight + ARROW.DISTANCE_YPOS;
      this.makeArrowDOM(sortItemElement, arrowType, arrowXPos, arrowYPos);
      return;
    }

    const arrowXPos = sortItemXPos + ARROW.DISTANCE_XPOS;
    const arrowYPos = sortItemYPos + sortItemRectHeight + ARROW.DISTANCE_YPOS;

    this.makeArrowDOM(this.$vizCanvas, arrowType, arrowXPos, arrowYPos);
  }

  removeArrow(arrowType) {
    const arrowElement = qs(`.${arrowType}-arrow`);
    arrowElement.parentNode.removeChild(arrowElement);
  }

  moveArrowNext(arrowType, duration) {
    const arrowElement = qs(`.${arrowType}-arrow`);
    const [arrowItemXPos, arrowItemYPos] = this.getSVGItemPosition(
      arrowElement
    );

    const mX =
      arrowType === ARROW_TYPE.LEFT ? ITEM.DISTANCE_X_POS : ITEM.DISTANCE_X_POS * -1;

    const fromPosition = positionFactory(arrowItemXPos, arrowItemYPos);
    const toPosition = positionFactory(arrowItemXPos + mX, arrowItemYPos);

    fromToTranslatePosition(arrowElement, fromPosition, toPosition, duration);
  }
}
