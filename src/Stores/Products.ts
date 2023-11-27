import { makeAutoObservable, action, runInAction } from "mobx";

export interface IProduct {
  id?: string;
  name: string;
  image: string;
  price: number;
}

export interface IProducts {
  products: IProduct[];
}

export class ProductsStore implements IProducts {
  products: IProduct[] = [];

  constructor() {
    makeAutoObservable(this, {
      loadProducts: action,
    });
    runInAction(() => {
      this.loadProducts();
    });
  }

  async loadProducts() {
    const res = await fetch("/products.json")
    if (res.ok) {
      this.products = await res.json();
    }
  }

  async getProducts(ids: string[]) {
    if (!this.products.length) {
      await this.loadProducts();
    }
    return this.products.filter(product => ids.includes(product.id || ""));
  }

  async getProduct(id: string) {
    if (!this.products.length) {
      await this.loadProducts();
    }
    return this.products.find(product => product.id === id);
  }
}

export const productsStore = new ProductsStore();
