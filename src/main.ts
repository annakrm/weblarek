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

import { IOrderRequest, IProduct, TPayment } from "./types";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement, resolveImageUrl } from "./utils/utils";

// --- Вспомогательные функции ---

const getOrderFormData = () => {
  const { payment, address } = buyerModel.getBuyerData();
  const errors = buyerModel.validate();
  const hasAnyInput = Boolean(payment) || address.trim().length > 0;

  return {
    payment,
    address,
    valid: !errors.payment && !errors.address,
    // Чтобы как в макете - выводилась одна ошибка
    errors: hasAnyInput ? errors.payment || errors.address || "" : "",
  };
};

const getContactsFormData = () => {
  const { email, phone } = buyerModel.getBuyerData();
  const errors = buyerModel.validate();
  const hasAnyInput = email.trim().length > 0 || phone.trim().length > 0;

  return {
    email,
    phone,
    valid: !errors.email && !errors.phone,
    errors: hasAnyInput ? errors.email || errors.phone || "" : "",
  };
};

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
      onClick: () => events.emit("card:select", item),
    });

    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: resolveImageUrl(item.image), // resolveImageUrl вынесена в utils.ts
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
      description: item.description,
      buttonText: isUnavailable
        ? "Недоступно"
        : isInBasket
          ? "Удалить из корзины"
          : "Купить",
      buttonDisabled: isUnavailable,
    }),
  });
});

// Изменение содержимого корзины -> "basket:changed"
events.on("basket:changed", () => {
  header.render({ counter: basketModel.getCount() });

  const selected = productsModel.getSelectedItem();
  if (selected && selected.price !== null) {
    previewCard.render({
      buttonText: basketModel.hasItem(selected.id)
        ? "Удалить из корзины"
        : "Купить",
    });
  }

  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), {
      onClick: () => events.emit("basket:remove", item),
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
  });
});

// Изменение данных покупателя -> "buyer:changed"
events.on("buyer:changed", () => {
  orderForm.render(getOrderFormData());
  contactsForm.render(getContactsFormData());
});

// --- Обработка событий представлений ---

// Выбор карточки товара для подробного просмотра -> "card:select"
events.on("card:select", (item: IProduct) => {
  productsModel.setSelectedItem(item.id);
});

// Нажатие кнопки покупки/удаления в превью -> "preview:toggle-basket"
events.on("preview:toggle-basket", () => {
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

// Удаление товара из корзины -> "basket:remove"
events.on("basket:remove", (item: IProduct) => {
  basketModel.removeItem(item);
});

// Нажатие кнопки открытия корзины -> "basket:open"
events.on("basket:open", () => {
  modal.render({ content: basketView.render() });
});

let isContactsStep = false;
// Нажатие кнопки оформления заказа -> "basket:order"
events.on("basket:order", () => {
  isContactsStep = false;
  modal.render({ content: orderForm.render(getOrderFormData()) });
});

// Отправка формы -> "form:submit" (два шага по isContactsStep)
events.on("form:submit", () => {
  const errors = buyerModel.validate();

  // Шаг 1: нажатие кнопки перехода ко второй форме (order -> contacts)
  if (!isContactsStep) {
    if (errors.payment || errors.address) {
      return;
    }

    isContactsStep = true;
    modal.render({
      content: contactsForm.render(getContactsFormData()),
    });
    return;
  }

  // Шаг 2: нажатие кнопки оплаты/завершения заказа (contacts -> API -> окно Success)
  if (errors.email || errors.phone) {
    return;
  }

  const buyerData = buyerModel.getBuyerData();
  const basketItems = basketModel.getItems();
  const total = basketModel.getTotalPrice();

  const orderPayload: IOrderRequest = {
    ...buyerData,
    total,
    items: basketItems.map((item) => item.id),
  };

  shopApi
    .orderProducts(orderPayload)
    .then((result) => {
      basketModel.clearBasket();
      buyerModel.clearBuyerData();
      isContactsStep = false;

      modal.render({
        content: successView.render({ total: result.total ?? total }),
      });
    })
    .catch((err) => {
      console.error("Ошибка при оформлении заказа:", err);
    });
});

// Изменение данных в формах -> "form:changed"
events.on(
  "form:changed",
  ({ field, value }: { field: string; value: string }) => {
    switch (field) {
      case "payment":
        buyerModel.setPayment(value as TPayment);
        break;
      case "address":
        buyerModel.setAddress(value);
        break;
      case "email":
        buyerModel.setEmail(value);
        break;
      case "phone":
        buyerModel.setPhone(value);
        break;
    }
  },
);

// Закрытие окна Success -> "success:close"
events.on("success:close", () => {
  modal.close();
});

// --- Загрузка каталога с сервера ---

shopApi
  .getProductList()
  .then((res) => {
    productsModel.setItems(res.items);
  })
  .catch((err) => {
    console.error("Ошибка при загрузке каталога:", err);
  });
