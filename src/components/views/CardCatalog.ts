import { ICardActions } from "../../types";
import { CardMedia, ICardMedia } from "./CardMedia";

export type ICardCatalog = ICardMedia;

// Дочерний класс от CardMedia — карточка товара в каталоге
export class CardCatalog extends CardMedia<ICardCatalog> {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
}
