import { IBuyer, TPayment, TFormErrors } from "../../types";

export class Buyer {
  protected buyerData: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };

  // Сохранить способ оплаты
  setPayment(payment: TPayment): void {
    this.buyerData.payment = payment;
  }

  // Сохранить адрес
  setAddress(address: string): void {
    this.buyerData.address = address;
  }

  // Сохранить email
  setEmail(email: string): void {
    this.buyerData.email = email;
  }

  // Сохранить телефон
  setPhone(phone: string): void {
    this.buyerData.phone = phone;
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
  }

  // Валидация данных
  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.buyerData.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.buyerData.address.trim()) {
      errors.address = "Не указан адрес";
    }
    if (!this.buyerData.email.trim()) {
      errors.email = "Не указан email";
    }
    if (!this.buyerData.phone.trim()) {
      errors.phone = "Не указан телефон";
    }

    return errors;
  }
}
