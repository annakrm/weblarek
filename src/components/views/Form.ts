import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IForm {
  valid: boolean;
  errors: string;
}

// Базовый класс формы
export abstract class Form<T extends IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("form:submit");
    });
  }
  protected set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  protected set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
