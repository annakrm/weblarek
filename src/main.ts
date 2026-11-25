import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ShopApi } from "./components/ShopApi";

import { Products } from "./components/models/Products";
import { Basket as BasketModel } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { CardCatalog } from "./components/views/CardCatalog";
import { CardPreview } from "./components/views/CardPreview";
import { CardBasket } from "./components/views/CardBasket";
import { Basket as BasketView } from "./components/views/Basket";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { Success } from "./components/views/Success";

import {
  IBuyer,
  IOrderRequest,
  IProduct,
  TFormChangeEvent,
  TFormErrors,
} from "./types";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement, resolveImageUrl } from "./utils/utils";

// --- Вспомогательные функции ---

const getOrderFormData = (
  buyerData: IBuyer = buyerModel.getBuyerData(),
  errors: TFormErrors = buyerModel.validate(),
) => ({
  payment: buyerData.payment,
  address: buyerData.address,
  valid: !errors.payment && !errors.address,
  errors: [errors.payment, errors.address].filter(Boolean).join(", "),
});

const getContactsFormData = (
  buyerData: IBuyer = buyerModel.getBuyerData(),
  errors: TFormErrors = buyerModel.validate(),
) => ({
  email: buyerData.email,
  phone: buyerData.phone,
  valid: !errors.email && !errors.phone,
  errors: [errors.email, errors.phone].filter(Boolean).join(", "),
});

// --- Инициализация брокера событий, API, моделей и представлений ---

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);

// Модели данных
const productsModel = new Products(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);

// Статичные компоненты
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));

// Компоненты из шаблонов
const previewCard = new CardPreview(
  events,
  cloneTemplate<HTMLElement>("#card-preview"),
);
const basketView = new BasketView(
  events,
  cloneTemplate<HTMLElement>("#basket"),
);
const orderForm = new OrderForm(
  events,
  cloneTemplate<HTMLFormElement>("#order"),
);
const contactsForm = new ContactsForm(
  events,
  cloneTemplate<HTMLFormElement>("#contacts"),
);
const successView = new Success(events, cloneTemplate<HTMLElement>("#success"));

// --- Обработка событий моделей данных ---

// Изменение каталога товаров -> "catalog:changed"
events.on("catalog:changed", () => {
  const cards = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate<HTMLElement>("#card-catalog"), {
      onClick: () => events.emit("catalog:card-clicked", item),
    });

    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: resolveImageUrl(item.image),
      alt: item.title,
    });
  });

  gallery.render({ items: cards });
});

// Изменение выбранного для просмотра товара -> "card:selected"
events.on("card:selected", () => {
  const item = productsModel.getSelectedItem();
  if (!item) {
    return;
  }

  const isInBasket = basketModel.hasItem(item.id);
  const isUnavailable = item.price === null;

  modal.render({
    content: previewCard.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: resolveImageUrl(item.image),
      alt: item.title,
      description: item.description,
      buttonText: isUnavailable
        ? "Недоступно"
        : isInBasket
          ? "Удалить из корзины"
          : "Купить",
      buttonDisabled: isUnavailable,
    }),
  });
  modal.open();
});

// Изменение содержимого корзины -> "basket:changed"
events.on("basket:changed", () => {
  header.render({ counter: basketModel.getCount() });

  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), {
      onClick: () => events.emit("basket:item-delete-clicked", item),
    });

    return card.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });

  basketView.render({
    items,
    total: basketModel.getTotalPrice(),
    orderButtonDisabled: basketModel.getCount() === 0,
  });
});

// Изменение данных покупателя -> "buyer:changed"
events.on("buyer:changed", () => {
  const buyerData = buyerModel.getBuyerData();
  const errors = buyerModel.validate();

  orderForm.render(getOrderFormData(buyerData, errors));
  contactsForm.render(getContactsFormData(buyerData, errors));
});

// --- Обработка событий представлений ---

// Выбор карточки товара для подробного просмотра -> "catalog:card-clicked"
events.on("catalog:card-clicked", (item: IProduct) => {
  productsModel.setSelectedItem(item.id);
});

// Нажатие кнопки покупки/удаления в превью -> "preview:button-clicked"
events.on("preview:button-clicked", () => {
  const selected = productsModel.getSelectedItem();
  if (!selected || selected.price === null) {
    return;
  }

  if (basketModel.hasItem(selected.id)) {
    basketModel.removeItem(selected);
  } else {
    basketModel.addItem(selected);
  }
  modal.close();
});

// Удаление товара из корзины -> "basket:item-delete-clicked"
events.on("basket:item-delete-clicked", (item: IProduct) => {
  basketModel.removeItem(item);
});

// Нажатие кнопки открытия корзины -> "header:basket-clicked"
events.on("header:basket-clicked", () => {
  modal.render({ content: basketView.render() });
  modal.open();
});

// Нажатие кнопки оформления заказа -> "basket:order-clicked"
events.on("basket:order-clicked", () => {
  modal.render({ content: orderForm.render() });
  modal.open();
});

// Отправка формы заказа -> "order:submitted"
events.on("order:submitted", () => {
  modal.render({ content: contactsForm.render() });
  modal.open();
});

// Отправка формы контактов -> "contacts:submitted"
events.on("contacts:submitted", () => {
  const buyerData = buyerModel.getBuyerData();
  const basketItems = basketModel.getItems();
  const total = basketModel.getTotalPrice();

  const orderPayload: IOrderRequest = {
    ...buyerData,
    total,
    items: basketItems.map((item) => item.id),
  };

  contactsForm.render({ valid: false });

  shopApi
    .orderProducts(orderPayload)
    .then((result) => {
      if (typeof result.total !== "number") {
        throw new Error("Некорректный ответ сервера: отсутствует сумма заказа");
      }

      basketModel.clearBasket();
      buyerModel.clearBuyerData();

      modal.render({
        content: successView.render({ total: result.total }),
      });
      modal.open();
    })
    .catch((err) => {
      console.error("Ошибка при оформлении заказа:", err);
      contactsForm.render({
        ...getContactsFormData(),
        errors: "Не удалось оформить заказ. Попробуйте ещё раз",
      });
    });
});

// Изменение данных в формах -> "form:changed"
events.on("form:changed", (payload: TFormChangeEvent) => {
  switch (payload.field) {
    case "payment":
      buyerModel.setPayment(payload.value);
      break;
    case "address":
      buyerModel.setAddress(payload.value);
      break;
    case "email":
      buyerModel.setEmail(payload.value);
      break;
    case "phone":
      buyerModel.setPhone(payload.value);
      break;
  }
});

// Закрытие окна Success -> "success:close-clicked"
events.on("success:close-clicked", () => {
  modal.close();
});

// --- Первичный сброс и синхронизация состояния ---

basketModel.clearBasket();
buyerModel.clearBuyerData();

// --- Загрузка каталога с сервера ---

shopApi
  .getProductList()
  .then((res) => {
    productsModel.setItems(res.items);
  })
  .catch((err) => {
    console.error("Ошибка при загрузке каталога:", err);
    const errorEl = document.createElement("p");
    errorEl.textContent = "Не удалось загрузить каталог товаров.";
    gallery.render({ items: [errorEl] });
  });
