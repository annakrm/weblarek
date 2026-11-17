import {
  IApi,
  IProductListResponse,
  IOrderRequest,
  IOrderResult,
} from "../types";

export class ShopApi {
  base: IApi;

  constructor(baseApi: IApi) {
    this.base = baseApi;
  }

  async getProductList(): Promise<IProductListResponse> {
    return await this.base.get<IProductListResponse>("/product/");
  }

  async orderProducts(order: IOrderRequest): Promise<IOrderResult> {
    return await this.base.post<IOrderResult>("/order/", order);
  }
}
