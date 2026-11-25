import { categoryMap } from "../utils/constants";

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "card" | "cash";

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
}
export interface IOrderResult {
  id: string;
  total: number;
}

export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

export type CategoryKey = keyof typeof categoryMap;

export interface ICardActions {
  onClick: () => void;
}

export type TFormChangeEvent =
  | { field: "payment"; value: TPayment }
  | { field: "address"; value: string }
  | { field: "email"; value: string }
  | { field: "phone"; value: string };
