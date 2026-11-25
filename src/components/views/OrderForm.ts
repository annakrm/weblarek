import { IBuyer, TPayment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./Form";

export interface IOrderForm
  extends Pick<IBuyer, "payment" | "address">, IForm {}

// 2-ой дочерний View от Form: форма оформления заказа
export class OrderForm extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(events, container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    // Кнопки выбора оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("form:changed", {
          field: "payment",
          value: button.name,
        });
      });
    });
  }

  protected set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  protected set address(value: string) {
    this.addressInput.value = value;
  }
}
