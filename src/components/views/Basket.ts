import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
  items: HTMLElement[];
  total: number;
  orderButtonDisabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

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

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order-clicked");
    });
  }

  protected set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  protected set orderButtonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }

  protected set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
