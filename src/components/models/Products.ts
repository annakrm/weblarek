import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  // Сохранение массива товаров
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("catalog:changed");
  }

  // Получение массива товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Получение одного товара по его id
  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Сохранение товара для подробного отображения
  setSelectedItem(id: string): void {
    this.selectedItem = this.getItem(id) || null;
    this.events.emit("card:selected");
  }

  // Получение товара для подробного отображения
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
