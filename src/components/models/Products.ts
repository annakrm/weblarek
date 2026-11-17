import { IProduct } from "../../types";

export class Products {
  protected _items: IProduct[] = [];
  protected _selectedItem: string | null = null;

  // Сохранение массива товаров
  setItems(items: IProduct[]): void {
    this._items = items;
  }

  // Получение массива товаров
  getItems(): IProduct[] {
    return this._items;
  }

  // Получение одного товара по его id
  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  // Сохранение товара для подробного отображения
  setSelectedItem(cardId: string | null): void {
    this._selectedItem = cardId;
  }

  // Получение товара для подробного отображения
  getSelectedItem(): IProduct | null {
    if (!this._selectedItem) {
      return null;
    }
    return this.getItem(this._selectedItem) || null;
  }
}
