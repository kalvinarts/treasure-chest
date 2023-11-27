import { makeAutoObservable } from "mobx";
import { IProduct } from "./Products";

export enum EAlign {
  left = "left",
  right = "right",
  center = "center"
}

export interface IProductRow {
  id?: string;
  products: IProduct[];
  align: EAlign;
}

export interface ITemplateStore {
  id?: string;
  name: string;
  productRows: IProductRow[];
}

export interface ITemplateStoreOptions {
  id?: string;
  name?: string;
  productRows?: IProductRow[];
}

export class TemplateStore implements ITemplateStore {
  id = Date.now().toString();
  name = "";
  productRows: IProductRow[] = [];

  constructor(options?: ITemplateStoreOptions) {
    makeAutoObservable(this);
    if (options) {
      this.id = options.id || this.id;
      this.name = options.name || this.name;
      this.productRows = options.productRows || this.productRows;
    }
  }

  // Product Row
  addProductRow() {
    this.productRows.push({
      id: Date.now().toString(),
      products: [],
      align: EAlign.center
    });
  }

  removeProductRow(rowId?: string) {
    this.productRows = this.productRows
      .filter((row: IProductRow) => row.id !== rowId);
  }

  setProductRowAlign(rowId: string, align: EAlign) {
    this.productRows
      .find((row: IProductRow) => row.id === rowId)!
      .align = align;
  }

  reorderRow(fromIndex: number, toIndex: number) {
    const row = this.productRows[fromIndex];
    this.productRows.splice(fromIndex, 1);
    this.productRows.splice(toIndex, 0, row);
  }

  getProductRow(rowId: string) {
    return this.productRows.find((row: IProductRow) => row.id === rowId);
  }

  // Product
  addProductToRow(rowId: string, product: IProduct) {
    this.productRows.find((row: IProductRow) => row.id === rowId)!
      .products.push(product);
  }

  removeProductFromRow(rowId: string, productId: string) {
    this.productRows.find((row: IProductRow) => row.id === rowId)!
      .products = this.productRows
        .find((row: IProductRow) => row.id === rowId)!
        .products
        .filter((product: IProduct) => product.id !== productId);
  }
  reorderProduct(rowId: string, fromIndex: number, toIndex: number) {
    const row = this.getProductRow(rowId);
    const product = row!.products[fromIndex];
    row!.products.splice(fromIndex, 1);
    row!.products.splice(toIndex, 0, product);
  }

  moveProductToRow(rowId: string, to: number, from: number) {
    this.productRows.find((row: IProductRow) => row.id === rowId)!
      .products.splice(to, 0, this.productRows
        .find((row: IProductRow) => row.id === rowId)!
        .products.splice(from, 1)[0]);
  }
  
  // JSON
  json() {
    return {
      id: this.id,
      name: this.name,
      productRows: this.productRows.map(row => ({
        products: row.products.map(product => ({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price
        })),
        align: row.align
      }))
    };
  }

  static fromJson(json: ITemplateStore) {
    return new TemplateStore(json);
  }
}