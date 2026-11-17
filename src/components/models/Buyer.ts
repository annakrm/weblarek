import { IBuyer, TPayment } from "../../types";

export class Buyer {
  protected _buyerData: IBuyer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };

  protected _formErrors: Record<string, string> = {};

  // Сохранить способ оплаты
  setPayment(payment: TPayment): void {
    this._buyerData.payment = payment;
  }

  // Сохранить адрес
  setAddress(address: string): void {
    this._buyerData.address = address;
  }

  // Сохранить email
  setEmail(email: string): void {
    this._buyerData.email = email;
  }

  // Сохранить телефон
  setPhone(phone: string): void {
    this._buyerData.phone = phone;
  }

  // Получить все данные покупателя
  getBuyerData(): IBuyer {
    return this._buyerData;
  }

  // Очистка данных покупателя
  clearBuyerData(): void {
    this._buyerData = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
    this._formErrors = {};
  }

  // Валидация данных
  validate(): boolean {
    const errors: Record<string, string> = {};

    if (!this._buyerData.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._buyerData.address.trim()) {
      errors.address = "Не указан адрес";
    }
    if (!this._buyerData.email.trim()) {
      errors.email = "Не указан email";
    }
    if (!this._buyerData.phone.trim()) {
      errors.phone = "Не указан телефон";
    }

    this._formErrors = errors;
    return Object.keys(errors).length === 0;
  }

  // Получить ошибки валидации
  getErrors(): Record<string, string> {
    return this._formErrors;
  }
}
