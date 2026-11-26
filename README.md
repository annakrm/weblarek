# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Типы данных

В приложении используются следующие типы и интерфейсы:

Доступные HTTP-методы для отправки данных (`ApiPostMethods`):

```
type ApiPostMethods = "POST" | "PUT" | "DELETE";
```

Интерфейс базового API:

```
interface IApi {
get<T extends object>(uri: string): Promise<T>;
post<T extends object>(
uri: string,
data: object,
method?: ApiPostMethods,
): Promise<T>;
}
```

Данные товара:

```
interface IProduct {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number | null;
};
```

Тип видов оплаты:

```
type TPayment = "card" | "cash";
```

Данные покупателя:

```
interface IBuyer {
payment: TPayment | null;
email: string;
phone: string;
address: string;
};
```

Ответ сервера со списком товаров

```
interface IProductListResponse {
total: number;
items: IProduct[];
}
```

Запрос на оформление заказа

```
interface IOrderRequest extends IBuyer {
total: number;
items: string[];
}
```

Ответ сервера после оформления заказа

```
interface IOrderResult {
id: string;
total: number;
}
```

Тип для ошибок валидации полей покупателя:

```
export type TFormErrors = Partial<Record<keyof IBuyer, string>>;
```

Тип ключей категорий товаров на основе словаря `categoryMap`:

```
export type CategoryKey = keyof typeof categoryMap;
```

Интерфейс действий карточки:

```
export interface ICardActions {
onClick: () => void;
}
```

Тип события изменения поля формы:

```
export type TFormChangeEvent =
| { field: "payment"; value: TPayment }
| { field: "address"; value: string }
| { field: "email"; value: string }
| { field: "phone"; value: string };
```

### Классы слоя «Модели»

#### Класс Products

Класс для хранения и управления каталогом товаров и выбранным товаром для подробного просмотра. При обновлении каталога генерирует событие catalog:changed, а при выборе товара — card:selected.

Конструктор:

`constructor(protected events: IEvents)` — принимает брокер событий.

Поля класса:

`protected items: IProduct[]` - поле для хранения массива всех товаров,

`protected selectedItem: IProduct | null` - поле для хранения объекта товара, выбранного для подробного просмотра.

Методы класса:

`setItems(items: IProduct[]): void` - сохраняет массив товаров каталога и генерирует событие `catalog:changed`,

`getItems(): IProduct[]` - возвращает массив товаров,

`getItem(id: string): IProduct | undefined` - находит и возвращает товар по его id,

`setSelectedItem(id: string): void` - находит и сохраняет выбранный товар по его id, генерирует событие `card:selected`,

`getSelectedItem(): IProduct | null` - возвращает выбранный товар.

#### Класс Basket

Класс для хранения товаров, добавленных пользователем в корзину. При изменении состава корзины генерирует событие `basket:changed`.

Конструктор:

`constructor(protected events: IEvents)` — принимает брокер событий.

Поля класса:

`protected items: IProduct[]` - поле для хранения массива товаров, выбранных покупателем для покупки.

Методы класса:

`getItems(): IProduct[]` - возвращает список товаров в корзине,

`addItem(item: IProduct): void` - добавляет товар в корзину и генерирует событие `basket:changed`,

`removeItem(item: IProduct): void` - удаляет товар из корзины, событие `basket:changed`,

`clearBasket(): void` - очистка корзины и генерация события `basket:changed`,

`getCount(): number` - возвращает количество товаров в корзине,

`getTotalPrice(): number` - считает общую стоимость товаров,

`hasItem(id: string): boolean` - проверяет наличие товара в корзине по ID.

#### Класс Buyer

Является классом для хранения введенных пользователем данных при оформлении заказа и их валидацию. При изменении или сбросе данных покупателя генерирует событие `buyer:changed`.

Конструктор:

`constructor(protected events: IEvents)` — принимает брокер событий.

Поля класса:

`protected buyerData: IBuyer` - объект с данными покупателя (способ оплаты, адрес, email, телефон)

Методы класса:

`setPayment(payment: TPayment): void` — сохраняет выбранный способ оплаты и генерирует событие `buyer:changed`,

`setAddress(address: string): void` — сохраняет адрес доставки, событие `buyer:changed`,

`setEmail(email: string): void` — сохраняет email покупателя, событие `buyer:changed`,

`setPhone(phone: string): void` — сохраняет телефон покупателя, событие `buyer:changed`,

`getBuyerData(): IBuyer` — возвращает текущие данные покупателя,

`clearBuyerData(): void` — сбрасывает данные покупателя, событие `buyer:changed`,

`validate(): TFormErrors` — проверяет заполненность обязательных полей, возвращает объект ошибок валидации.

### Класс коммуникационного слоя

#### Класс ShopApi

Класс реализует взаимодействие с бэкендом, используя базовый класс Api.

Конструктор:

`constructor(baseApi: IApi)` — принимает экземпляр базового API-клиента.

Поля класса:

`protected base: IApi` — экземпляр базового API-клиента для выполнения запросов к серверу.

Методы класса:

`getProductList(): Promise<IProductListResponse>` — выполняет GET-запрос за получением каталога товаров,

`orderProducts(order: IOrderRequest): Promise<IOrderResult>` — выполняет POST-запрос: отправляет данные заказа и возвращает результат.

### Классы слоя «Представление»

Все компоненты слоя «Представление» наследуются от `Component`.

#### Класс Header

Компонент шапки сайта с отображением счётчика товаров в корзине и кнопкой её открытия. При клике по кнопке корзины генерирует событие `header:basket-clicked`.

Конструктор:

`constructor(protected events: IEvents, container: HTMLElement)` — принимает брокер событий и корневой элемент шапки, находит счётчик товаров и кнопку корзины, навешивает обработчик клика для открытия корзины.

Поля класса:

`protected counterElement: HTMLElement` — элемент счётчика товаров в корзине,

`protected basketButton: HTMLButtonElement` — кнопка открытия корзины

Методы класса:

`protected set counter(value: number)` — задаёт значение счётчика товаров в корзине.

#### Класс Gallery

Компонент контейнера каталога товаров на главной странице.

Конструктор:

`constructor(container: HTMLElement)` — принимает корневой DOM-элемент каталога.

Методы класса:

`protected set items(items: HTMLElement[])` — заменяет содержимое контейнера каталога переданным массивом карточек.

#### Класс Card

Базовый абстрактный класс карточки товара, реализующий отображение общих элементов (заголовка и цены).

Конструктор:

`constructor(container: HTMLElement)` — принимает корневой DOM-элемент карточки и находит элементы заголовка и цены.

Поля класса:

`protected titleElement: HTMLElement` — элемент заголовка карточки

`protected priceElement: HTMLElement` — элемент цены товара

Методы класса:

`protected set title(value: string)` — задаёт название товара

`protected set price(value: number | null)` — задаёт цену товара в синапсах или выводит «Бесценно», если цена null.

#### Класс CardBasket

Класс карточки товара внутри корзины. Это дочерний класс от Card и вызывает переданный обработчик при нажатии на кнопку удаления товара.

Конструктор:

`constructor(container: HTMLElement, actions?: ICardActions)` — принимает корневой элемент карточки и опциональный объект обработчиков, находит кнопку удаления и элемент порядкового номера, навешивает обработчик клика на кнопку удаления.

Поля класса:

`protected deleteButton: HTMLButtonElement` — кнопка удаления товара из корзины

`protected indexElement: HTMLElement` — элемент порядкового номера товара в корзине

Методы класса:

`protected set index(value: number)` — задаёт порядковый номер товара в списке корзины.

#### Класс CardMedia

Промежуточный абстрактный класс карточки товара с изображением и категорией. Объединяет общую логику работы с категорией и изображением для `CardCatalog` и `CardPreview`.

Конструктор:

`constructor(container: HTMLElement)` — принимает корневой элемент карточки, вызывает конструктор базового класса `Card`, находит элементы категории и изображения.

Поля класса:

`protected imageElement: HTMLImageElement` — элемент изображения товара

`protected categoryElement: HTMLElement` — элемент категории товара

Методы класса:

`protected set category(value: string)` — задаёт текст категории и переключает классы по `categoryMap`

`protected set image(value: string)` — задаёт путь к изображению через `setImage`

`protected set alt(value: string)` — задаёт атрибут `alt` у изображения товара.

#### Класс CardCatalog

Класс карточки товара в каталоге на главной странице. Это дочерний класс от `CardMedia`, при клике вызывает переданный обработчик для выбора товара.

Конструктор:

`constructor(container: HTMLElement, actions?: ICardActions)` — принимает корневой элемент карточки и опциональный объект обработчиков, навешивает обработчик клика на карточку.

Поля класса:

Наследует `imageElement`, `categoryElement` от `CardMedia` и базовые поля от `Card`.

Методы класса:

Наследует `category`, `image`, `alt` от `CardMedia` и сеттеры базового класса `Card`.

#### Класс CardPreview

Класс подробной карточки товара для просмотра в модальном окне. Это дочерний класс от `CardMedia`, при нажатии кнопки генерирует событие `preview:button-clicked`.

Конструктор:

`constructor(protected events: IEvents, container: HTMLElement)` — принимает брокер событий и корневой элемент карточки, находит кнопку действия, элементы категории, изображения и описания, навешивает обработчик клика на кнопку.

Поля класса:

`protected cardButton: HTMLButtonElement` — кнопка добавления или удаления товара в корзине

`protected descriptionElement: HTMLElement` — элемент описания товара

Поля `imageElement`, `categoryElement` наследуются от `CardMedia`, а базовые поля — от `Card`.

Методы класса:

`protected set description(value: string)` — задаёт текст описания товара

`protected set buttonText(value: string)` — задаёт текст кнопки действия

`protected set buttonDisabled(value: boolean)` — управляет доступностью кнопки действия.

#### Класс Form

Базовый абстрактный класс формы, реализует управление кнопкой отправки формы, отображение ошибок валидации, обработку ввода в текстовых полях (`address`, `email`, `phone`) с генерацией события `form:changed` и генерацию события `${formName}:submitted` по атрибуту `name` формы (`order:submitted`, `contacts:submitted`).

Конструктор:

`constructor(protected events: IEvents, container: HTMLElement)` — принимает брокер событий и корневой элемент формы, находит кнопку отправки и элемент вывода ошибок, навешивает обработчики ввода (`input`) и отправки формы (`submit`).

Поля класса:

`protected submitButton: HTMLButtonElement` — кнопка отправки формы

`protected errorsElement: HTMLElement` — элемент отображения текста ошибки валидации

Методы класса:

`protected set valid(value: boolean)` — включает или отключает кнопку отправки формы

`protected set errors(value: string)` — задаёт текст ошибки валидации

#### Класс OrderForm

Класс формы выбора способа оплаты и адреса доставки, первый шаг оформления заказа. Это дочерний класс от `Form`, при выборе способа оплаты генерирует событие `form:changed` (ввод адреса обрабатывается общим слушателем `input` в `Form`).

Конструктор:

`constructor(protected events: IEvents, container: HTMLElement)` — принимает брокер событий и корневой элемент формы, находит кнопки выбора оплаты и поле ввода адреса, навешивает обработчики клика на кнопки оплаты для генерации события `form:changed`.

Поля класса:

`protected paymentButtons: HTMLButtonElement[]` — кнопки выбора способа оплаты

`protected addressInput: HTMLInputElement` — поле ввода адреса доставки

Методы класса:

`protected set payment(value: TPayment | null)` — выделяет выбранную кнопку оплаты модификатором `button_alt-active`

`protected set address(value: string)` — задаёт значение поля адреса доставки

#### Класс ContactsForm

Класс формы ввода контактных данных покупателя, второй шаг оформления заказа. Это дочерний класс от `Form`, при изменении полей генерирует событие `form:changed` с именем поля и его значением (через слушатель `input` в `Form`).

Конструктор:

`constructor(protected events: IEvents, container: HTMLElement)` — принимает брокер событий и корневой элемент формы, находит поля ввода `email` и телефона.

Поля класса:

`protected emailInput: HTMLInputElement` — поле ввода электронной почты

`protected phoneInput: HTMLInputElement` — поле ввода телефона

Методы класса:

`protected set email(value: string)` — задаёт значение поля email

`protected set phone(value: string)` — задаёт значение поля телефона

#### Класс Modal

Самостоятельный компонент модального окна без дочерних классов, отвечающий за отображение переданного содержимого и управление видимостью окна.

В качестве содержимого в модальное окно могут передаваться самостоятельные компоненты представлений: CardPreview, Basket, OrderForm, ContactsForm и Success.

Конструктор:

`constructor(container: HTMLElement)` — принимает корневой элемент модального окна, находит кнопку закрытия, контейнер содержимого и окно контейнера, навешивает обработчики закрытия по клику на кнопку и фон.

Поля класса:

`protected closeButtonElement: HTMLButtonElement` — кнопка закрытия модального окна

`protected contentElement: HTMLElement` — контейнер для содержимого модального окна

`protected windowElement: HTMLElement` — контейнер содержимого модального окна внутри оверлея

Методы класса:

`protected set content(value: HTMLElement)` — вставляет переданный DOM-элемент в контейнер содержимого модального окна,

`open(): void` — открывает модальное окно, добавляя модификатор modal_active,

`close(): void` — закрывает модальное окно, убирая модификатор modal_active и очищая контейнер содержимого.

#### Класс Basket

Компонент корзины с отображением списка товаров, итоговой стоимостью, состоянием пустой корзины и кнопкой перехода к оформлению заказа. При нажатии на кнопку оформления генерирует событие `basket:order-clicked`.

Конструктор:

`constructor(protected events: IEvents, container: HTMLElement)` — принимает брокер событий и корневой элемент корзины, находит список товаров, элемент итоговой цены и кнопку оформления, навешивает обработчик клика на кнопку оформления.

Поля класса:

`protected listElement: HTMLElement` — контейнер списка элементов корзины

`protected totalElement: HTMLElement` — элемент отображения итоговой стоимости заказа

`protected orderButton: HTMLButtonElement` — кнопка оформления заказа

Методы класса:

`protected set items(items: HTMLElement[])` — обновляет список товаров в корзине

`protected set total(value: number)` — задаёт итоговую стоимость заказа в синапсах

`protected set orderButtonDisabled(value: boolean)` - управляет доступностью кнопки оформления заказа.

#### Класс Success

Компонент окна успешного оформления заказа с отображением суммы списанных средств и кнопкой закрытия. При клике по кнопке закрытия генерирует событие `success:close-clicked`.

Конструктор:

`constructor(protected events: IEvents, container: HTMLElement)` — принимает брокер событий и корневой элемент окна успеха, находит элемент описания и кнопку закрытия, навешивает обработчик клика для генерации события `success:close-clicked`.

Поля класса:

`protected descriptionElement: HTMLElement` — элемент с информацией о списанной сумме

`protected closeButton: HTMLButtonElement` — кнопка закрытия окна.

Методы класса:

`protected set total(value: number)` — задаёт текст о списанной сумме.

### Описание событий, которые генерируются в приложении

#### События моделей данных

События генерируются:

`catalog:changed` — в модели `Products` при обновлении массива товаров каталога (`setItems`). Обновляет список карточек в компоненте `Gallery`.

`card:selected` — в модели `Products` при выборе товара для подробного просмотра (`setSelectedItem`). Открывает модальное окно с компонентом `CardPreview`.

`basket:changed` — в модели `Basket` при добавлении (`addItem`), удалении (`removeItem`) или очистке (`clearBasket`) товаров. Обновляет счётчик в `Header`, список товаров, итоговую стоимость и доступность кнопки оформления в `Basket`.

`buyer:changed` — в модели `Buyer` при изменении способа оплаты (`setPayment`), адреса (`setAddress`), email (`setEmail`), телефона (`setPhone`) или очистке данных (`clearBuyerData`). Синхронизирует данные, ошибки и состояние кнопок в формах `OrderForm` и `ContactsForm`.

#### События представлений

`catalog:card-clicked` — при клике по карточке товара в каталоге (`CardCatalog`) с передачей выбранного товара (`IProduct`). Вызывает сохранение выбранного товара в модели `Products`.

`preview:button-clicked` — компонентом `CardPreview` при клике по кнопке действия в карточке товара. Уведомляет презентер для добавления товара в корзину или удаления его из модели `Basket`.

`basket:item-delete-clicked` — при клике по кнопке удаления в карточке товара в корзине (`CardBasket`) с передачей товара (`IProduct`). Удаляет товар из модели `Basket`.

`header:basket-clicked` — компонентом `Header` при клике по кнопке корзины. Открывает модальное окно с содержимым компонента `Basket`.

`basket:order-clicked` — компонентом `Basket` при нажатии кнопки оформления заказа. Открывает форму `OrderForm` в модальном окне.

`order:submitted` — генерируется формой заказа (`name="order"`) при отправке. Открывает форму `ContactsForm` в модальном окне.

`contacts:submitted` — генерируется формой контактов (`name="contacts"`) при отправке. Формирует заказ и отправляет его на сервер.

`form:changed` — компонентами `OrderForm` и `ContactsForm` с объектом `{ field, value }`. Записывает обновлённое значение в модель `Buyer`.

`success:close-clicked` — компонентом `Success` при нажатии кнопки закрытия окна успешного оформления заказа. Закрывает модальное окно.

### Презентер

Роль презентера выполняет `main.ts`, связывая модели данных, представления и API через брокер событий.

Вспомогательные функции:

- `getOrderFormData`, `getContactsFormData` — подготовка данных форм, статуса валидности и объединение всех актуальных ошибок текущей формы

Инициализация брокера событий, API, моделей и представлений:

- создание брокера событий (`EventEmitter`), базового API (`Api`) и `ShopApi`
- создание моделей данных (`Products`, `Basket`, `Buyer`), статичных компонентов (`Header`, `Gallery`, `Modal`) и компонентов из шаблонов (`CardPreview`, `Basket`, `OrderForm`, `ContactsForm`, `Success`; карточки `CardCatalog` и `CardBasket` создаются при отрисовке списков)
- первичный сброс и синхронизация начального состояния моделей (`basketModel.clearBasket()`, `buyerModel.clearBuyerData()`) после регистрации обработчиков событий и до загрузки каталога

Обработка событий моделей данных:

- `catalog:changed` — изменение каталога товаров
- `card:selected` — изменение выбранного для просмотра товара
- `basket:changed` — изменение содержимого корзины
- `buyer:changed` — изменение данных покупателя

Обработка событий представлений:

- `catalog:card-clicked` — выбор карточки для просмотра
- `preview:button-clicked` — клик по кнопке "купить/удалить" в подробной карточке товара для добавления товара в корзину или удаления
- `basket:item-delete-clicked` — нажатие кнопки удаления товара из корзины
- `header:basket-clicked` — нажатие кнопки открытия корзины в шапке
- `basket:order-clicked` — нажатие кнопки оформления заказа
- `order:submitted` — переход ко второй форме оформления заказа (`ContactsForm`)
- `contacts:submitted` — отправка заказа на сервер и открытие окна успеха (`Success`)
- `form:changed` — изменение данных в формах
- `success:close-clicked` — закрытие окна успеха

Загрузка данных с сервера:

- получение списка товаров с сервера (`ShopApi.getProductList`) и запись в модель каталога (`Products.setItems`, инициирует `catalog:changed`)
