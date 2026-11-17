import "./scss/styles.scss";

import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { apiProducts } from "./utils/data";

import { Api } from "./components/base/Api";
import { ShopApi } from "./components/ShopApi";
import { API_URL } from "./utils/constants";

// Проверка модели 1: Products
const productsModel = new Products();

// Сохранение моковых данные
productsModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getItems());

// Проверка получения одного товара по id
const firstProductId = apiProducts.items[0].id;
console.log(
  `Товар с ID ${firstProductId}:`,
  productsModel.getItem(firstProductId),
);

// Проверка выбор товара для просмотра его в карточке
productsModel.setSelectedItem(firstProductId);
console.log("Выбранный товар:", productsModel.getSelectedItem());

// Проверка модели 2: Basket
const basketModel = new Basket();

// Добавление двух товаров из каталога в корзину
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);

console.log("Товары в корзине:", basketModel.getItems());
console.log("Количество товаров:", basketModel.getCount());
console.log("Общая стоимость товаров:", basketModel.getTotalPrice());

// Проверка, есть ли в наличии товар по id
console.log(basketModel.hasItem(apiProducts.items[0].id));

// Удаление товара
basketModel.removeItem(apiProducts.items[0]);
console.log("Товары в корзине после удаления:", basketModel.getItems());
console.log("Новое количество:", basketModel.getCount());

// Проверка очистки корзины
basketModel.clearBasket();
console.log("Товары в корзине после очистки:", basketModel.getItems());
console.log("Количество после очистки:", basketModel.getCount());

// Проверка модели 3: Buyer
const buyerModel = new Buyer();

// Проверка валидацию пустых данных, получение ошибок
console.log("Результат валидации:", buyerModel.validate());
console.log("Ошибки валидации:", buyerModel.getErrors());

// Заполнение части данных
buyerModel.setPayment("card");
buyerModel.setAddress("г. Иваново, пр. Текстильщиков, д. 1");

console.log("Данные после частичного заполнения:", buyerModel.getBuyerData());

// Проверка валидации
console.log(
  "Результат валидации после частичного заполнения:",
  buyerModel.validate(),
);
console.log(
  "Ошибки валидации, должны остаться только для email и phone:",
  buyerModel.getErrors(),
);

// Заполнение оставшихся полей
buyerModel.setEmail("test@test.com");
buyerModel.setPhone("+79123456789");

// Проверка валидации полностью заполненных данных
console.log("Результат валидации:", buyerModel.validate());
console.log(
  "Ошибки валидации, так как их нет -  то должен вернуться пустой объект:",
  buyerModel.getErrors(),
);

// Проверка очистки данных покупателя
buyerModel.clearBuyerData();
console.log("Данные покупателя после очистки:", buyerModel.getBuyerData());

// Проверка запроса к серверу
const baseApi = new Api(API_URL);
const api = new ShopApi(baseApi);

api
  .getProductList()
  .then((res) => {
    productsModel.setItems(res.items);
    console.log(
      "Каталог товаров с сервера в модели:",
      productsModel.getItems(),
    );
  })
  .catch((err) => {
    console.error("Ошибка при загрузке:", err);
  });
