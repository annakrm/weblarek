import { CategoryKey, IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export interface ICardMedia extends Pick<IProduct, "image" | "category"> {
  alt?: string;
}

// Промежуточный абстрактный класс карточки товара с изображением и категорией
export abstract class CardMedia<T extends ICardMedia> extends Card<T> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
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

  protected set alt(value: string) {
    this.imageElement.alt = value;
  }

  protected set image(value: string) {
    this.setImage(this.imageElement, value);
  }
}
