import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;
  protected emptyElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.emptyElement = document.createElement("p");
    this.emptyElement.textContent = "Корзина пуста";

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  protected set items(items: HTMLElement[]) {
    this.orderButton.disabled = items.length === 0;
    if (items.length > 0) {
      this.listElement.replaceChildren(...items);
    } else {
      this.listElement.replaceChildren(this.emptyElement);
    }
  }

  protected set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
