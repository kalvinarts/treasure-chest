import './ProductList.css';
import React from "react";
import { observer } from "mobx-react-lite";
import { IProduct } from '../../Stores/Products';
import Product from "./Product";

interface IProductListProps extends React.ComponentProps<"div"> {
  products?: IProduct[]
}

const ProductList = observer(function ProductList(props: IProductListProps) {
  function handleDragStart(e: React.DragEvent, id?: string) {
    e.dataTransfer.setData("application/json", JSON.stringify({
      type: "product",
      origin: "product-list",
      id: id || ""
    }))
    console.log('drag', JSON.parse(e.dataTransfer.getData("application/json")));
  }

  return (
    <div className="product-list">
      <div className="product-list-title">
        <h3>Products</h3>
      </div>
      <div className="horizontal-scroll">
        {props.products?.map((product) => (
          <Product
            key={product.id}
            draggable
            onDragStart={(e) => handleDragStart(e, product.id)}
            {...product}
          />
        ))}
      </div>
    </div>
  );
});

export default ProductList;
