import { IBuyer, TFormErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected buyerData: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };

  constructor(protected events: IEvents) {}

  // Сохранить способ оплаты
  setPayment(payment: TPayment): void {
    this.buyerData.payment = payment;
    this.events.emit("buyer:changed");
  }

  // Сохранить адрес
  setAddress(address: string): void {
    this.buyerData.address = address;
    this.events.emit("buyer:changed");
  }

  // Сохранить email
  setEmail(email: string): void {
    this.buyerData.email = email;
    this.events.emit("buyer:changed");
  }

  // Сохранить телефон
  setPhone(phone: string): void {
    this.buyerData.phone = phone;
    this.events.emit("buyer:changed");
  }

  // Получить все данные покупателя
  getBuyerData(): IBuyer {
    return this.buyerData;
  }

  // Очистка данных покупателя
  clearBuyerData(): void {
    this.buyerData = {
      payment: null,
      address: "",
      email: "",
      phone: "",
    };
    this.events.emit("buyer:changed");
  }

  // Валидация данных
  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.buyerData.payment) {
      errors.payment = "выберите вид оплаты";
    }
    if (!this.buyerData.address.trim()) {
      errors.address = "укажите адрес";
    }
    if (!this.buyerData.email.trim()) {
      errors.email = "укажите email";
    }
    if (!this.buyerData.phone.trim()) {
      errors.phone = "укажите телефон";
    }

    return errors;
  }
}
