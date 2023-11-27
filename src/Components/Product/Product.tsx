import React from 'react';
import './Product.css';
import { IProduct } from '../../Stores/Products';

interface IProductProps extends React.ComponentProps<"div">, IProduct { }

export const Product: React.FC<IProductProps> = (props: IProductProps) => {
  return (
    <div className="product" {...props}>
      <div className="product__image_container">
        <img className="product__image" src={props.image} alt={props.name} />
      </div>
      <div className="product__name">
        {props.name}
      </div>
      <div className="product__price">{props.price} €</div>
    </div>
  );
}

export default Product;