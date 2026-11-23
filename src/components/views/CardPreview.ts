import { CategoryKey, IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

export interface ICardPreview extends Pick<
  IProduct,
  "image" | "category" | "description"
> {
  buttonText: string;
  buttonDisabled: boolean;
}

// 1-ый дочерний класс от Card — карточка товара подробная в модальном окне
export class CardPreview extends Card<ICardPreview> {
  protected cardButton: HTMLButtonElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
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

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.cardButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.events.emit("preview:toggle-basket");
    });
  }

  protected set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  protected set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
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
