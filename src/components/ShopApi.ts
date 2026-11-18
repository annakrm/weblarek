import {
  IApi,
  IProductListResponse,
  IOrderRequest,
  IOrderResult,
} from "../types";

export class ShopApi {
  protected base: IApi;

  constructor(baseApi: IApi) {
    this.base = baseApi;
  }

  getProductList(): Promise<IProductListResponse> {
    return this.base.get<IProductListResponse>("/product/");
  }

  orderProducts(order: IOrderRequest): Promise<IOrderResult> {
    return this.base.post<IOrderResult>("/order/", order);
  }
}
