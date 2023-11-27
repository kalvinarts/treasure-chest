import './TemplateRow.css';
import React from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from 'mobx';
import { IProductRow } from "../../Stores/Template";
import { EAlign } from '../../Stores/Template';
import { useMainStore } from "../Providers/MainStoreProvider";
import { Product } from "../Product/Product";

interface ITemplateRowProps extends React.ComponentProps<"div">, IProductRow {}

const TemplateRow = observer(function TemplateRow(props: ITemplateRowProps) {
  const mainStore = useMainStore();

  const showDropZone = () => runInAction(() => {
    if (props.products.length) {
      return '';
    } else {
      return (
        <div className="template-row-product-placeholder">        
          <h3>Drop products here</h3>
        </div>
      )
    }
  });

  const setAlign = (e: React.ChangeEvent<HTMLSelectElement>) => runInAction(() =>
    mainStore.currentTemplate.setProductRowAlign(props.id || "", e.target.value as EAlign)
  );

  const handleDropOnRow = (e: React.DragEvent<HTMLDivElement>) => runInAction(() => {
    e.preventDefault();
    
    const dataS = e.dataTransfer.getData("application/json");
    if (!dataS) return;
    const data = JSON.parse(dataS);

    const row = mainStore.currentTemplate.getProductRow(props.id || "");

    const product = data.id && mainStore.productsStore.products.find((product) => product.id === data.id);

    if (
      (data.origin === "product-list" && (row!.products.length >= 3))
      || data.origin !== "product-list"
      || data.type !== "product"
      || !data.id
      || (row && row.products.find((p) => p.id === data.id))
      || !product
    ) return;

    mainStore.currentTemplate.addProductToRow(props.id || "", product);
  });

  const deleteRow = () => runInAction(() =>
    mainStore.currentTemplate.removeProductRow(props.id)
  );

  const handleRemoveProduct = (productId: string) => runInAction(() =>
    mainStore.currentTemplate.removeProductFromRow(props.id || "", productId)
  );

  const getHandleProductStart = (index: number, productId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent row's drag event from being fired

    e.dataTransfer.setData("application/json", JSON.stringify({
      type: "product",
      origin: "template-row",
      rowId: props.id || "",
      id: productId || "",
      draggedItemIndex: index.toString()
    }));

    console.log('row product drag start', JSON.parse(e.dataTransfer.getData("application/json")));
  }

  const getHandleDropOnProduct = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const dataS = e.dataTransfer.getData("application/json");
    if (!dataS) return;

    const data = JSON.parse(dataS);

    console.log('reorder', 'dataType:', data.type, 'origin:', data.origin)
    
    if (data.rowId !== props.id || data.type !== "product" || data.origin !== "template-row") return;
      
    runInAction(() =>
      mainStore.currentTemplate.reorderProduct(data.rowId, data.draggedItemIndex, index)
    );
  }

  return (
    <div className="template-row"
      draggable
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
    >
      <div className="template-row-settings">
        <div className="template-row-align-setting">
          Alignment:
          <select onChange={setAlign} defaultValue="center">
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="center">Center</option>
          </select>
        </div>
      </div>
      <div
        onDrop={handleDropOnRow}
        onDragOver={(e) => e.preventDefault()}
        className={`template-row-products ${props.products.length ? `template-row-align-${props.align}` : ''}`}
      >
        {showDropZone()}
        {
          props.products.map((product, index) => (
            <div
              key={product.id}
              className="product-container"
            >
              <Product
                {...product}
                draggable="true"
                onDragOver={(e) => e.preventDefault()}
                onDragStart={getHandleProductStart(index, product.id || "")}
                onDrop={getHandleDropOnProduct(index)}
              />
              <button className="remove-button" onClick={() => handleRemoveProduct(product.id || "")}>X</button>
            </div>
          ))
        }
      </div>
      <button className="delete-row-button" onClick={deleteRow}>X</button>
    </div>
  );
})

export default TemplateRow;