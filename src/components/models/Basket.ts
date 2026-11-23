import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  // Получение массива товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление товара
  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  // Удаление товара
  removeItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);
    this.events.emit("basket:changed");
  }

  // Очистка корзины
  clearBasket(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  // Получение количества товаров в корзине
  getCount(): number {
    return this.items.length;
  }

  // Получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  // Проверка наличия товара в корзине по id
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
