import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./Form";

export interface IContactsForm extends Pick<IBuyer, "email" | "phone">, IForm {}

// 1-ый дочерний View от Form: форма контактных данных
export class ContactsForm extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    // Поле email
    this.emailInput.addEventListener("input", () => {
      this.events.emit("form:changed", {
        field: "email",
        value: this.emailInput.value,
      });
    });

    // Поле телефона
    this.phoneInput.addEventListener("input", () => {
      this.events.emit("form:changed", {
        field: "phone",
        value: this.phoneInput.value,
      });
    });
  }

  protected set email(value: string) {
    this.emailInput.value = value;
  }

  protected set phone(value: string) {
    this.phoneInput.value = value;
  }
}
