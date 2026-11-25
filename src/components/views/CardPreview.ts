import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CardMedia, ICardMedia } from "./CardMedia";

export interface ICardPreview extends ICardMedia {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

// Дочерний класс от CardMedia — подробная карточка товара в модальном окне
export class CardPreview extends CardMedia<ICardPreview> {
  protected cardButton: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.cardButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.events.emit("preview:button-clicked");
    });
  }

  protected set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  protected set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

  protected set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}
