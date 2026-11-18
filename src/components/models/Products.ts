import { IProduct } from "../../types";

export class Products {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct | null = null;

  // Сохранение массива товаров
  setItems(items: IProduct[]): void {
    this.items = items;
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
  }

  // Получение товара для подробного отображения
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
