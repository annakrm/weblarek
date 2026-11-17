import { IProduct } from "../../types";

export class Basket {
  protected _items: IProduct[] = [];

  // Получение массива товаров, которые находятся в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавление товара
  addItem(item: IProduct): void {
    this._items.push(item);
  }

  // Удаление товара
  removeItem(item: IProduct): void {
    this._items = this._items.filter((i) => i.id !== item.id);
  }

  // Очистка корзины
  clearBasket(): void {
    this._items = [];
  }

  // Получение количества товаров в корзине
  getCount(): number {
    return this._items.length;
  }

  // Получение стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  // Проверка наличия товара в корзине по id
  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
