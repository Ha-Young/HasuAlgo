let count = 0;

export default class Controller {
  constructor(view, model) {
    this._temp = {};
    this.view = view;
    this.model = model;
    this.isRunning = false;
    view.addEvent(
      "$inputNumber",
      "input",
      this.handleEventForUserTypingValue.bind(this)
    );
    view.addEvent(
      "$selectSort",
      "input",
      this.handleEventForUserSortInput.bind(this)
    );
    view.addEvent(
      "$buttonRun",
      "click",
      this.handleEventForUserRunClick.bind(this)
    );
  }

  handleEventForUserTypingValue(event) {
    const typedValue = event.target.value;
    const isValid = this.checkValidTypedValue(typedValue);

    if (isValid) {
      this.writeInstantValue("value", typedValue);
      return;
    }

    event.target.value = typedValue.slice(0, typedValue.length - 1);
  }

  handleEventForUserSortInput(event) {
    const sortType = event.target.value;
    this.writeInstantValue("sortType", sortType);
  }

  handleEventForUserRunClick(event) {
    try {
      this.checkValidInputLength();
      this.checkSortType();
    } catch (error) {
      alert(error.message);
      return;
    }

    const sortType = this._temp.sortType;
    this.model.setProperty(sortType, "value", this._temp.value);
    this.model.setValueToCollection(sortType);
    const $article = this.view.makeElement("article", "article-" + sortType);
    this.view.appendChild("$mainAnimationContainer", $article);
    const sortedCollection = this.model
      .getProperty(sortType, "collection")
      .slice()
      .sort((a, b) => a.value - b.value);
    const stickElements = [];

    for (let i = 0; i < sortedCollection.length; i++) {
      const stick = this.view.makeElement("div", "stick");
      stickElements.push(
        this.view.manufactureStick(sortType, stick, i, sortedCollection)
      );
    }

    stickElements.sort((a, b) => +a.getAttribute("data-index") - +b.getAttribute("data-index"));
    stickElements.forEach(stick => this.view.appendChild("$article-" + sortType, stick));

    this.view.setCaches(sortType, stickElements);
    this.initiateAnimation(sortType);
  }

  initiateAnimation(sortType) {
    const ARTICLE_TRANSITION = 1000;
    setTimeout(() => {
      this.view.render("init", sortType);
      this.handleAnimation(sortType);
    }, ARTICLE_TRANSITION);
  }

  handleAnimation(sortType) {
    const STICK_TRANSITION = 1000;
    this.model[sortType]((act, sortType, index) => {
        setTimeout(() => {
          this.view.render(act, sortType, index);
          if (act === "finished") return;
          this.handleAnimation(sortType);
        }, STICK_TRANSITION);
      }
    );
  }

  checkValidTypedValue(value) {
    const typedValue = value.slice(-1);
    const isNumber = typeof +typedValue === "number" && !Number.isNaN(+typedValue);
    const isCommaOrSpace = typedValue === "," || typedValue === " ";

    if (isNumber || isCommaOrSpace) return true;
    return false;
  }

  checkValidInputLength() {
    const userValue = this._temp.value + ",";
    let shouldBeDivided = false;
    let count = 0;
    for (const character of userValue) {
      if (!shouldBeDivided && typeof +character === "number") {
        shouldBeDivided = true;
        continue;
      }

      if (shouldBeDivided && character === "," || character === " ") {
        count++;
        shouldBeDivided = false;
      }
    }

    if (count < 5 || 10 < count) {
      throw new Error("should type length of numbers between 5 and 10");
    }
  }

  checkSortType() {
    const hasSortType = !!this._temp.sortType;
    if (!hasSortType) throw new Error("should select sort type");
  }

  writeInstantValue(category, value) {
    this._temp[category] = value;
  }
}
