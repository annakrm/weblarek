import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export interface ICardBasket {
  index: number;
}

export interface ICardBasketActions {
  onClick: () => void;
}

// 3-ий дочерний класс от Card — карточка товара в корзине
export class CardBasket extends Card<ICardBasket> {
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardBasketActions) {
    super(container);

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );

    if (actions?.onClick) {
      this.deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        actions.onClick();
      });
    }
  }

  protected set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
