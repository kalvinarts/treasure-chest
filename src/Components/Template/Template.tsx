import './Template.css';
import React from 'react';
import { observer } from "mobx-react-lite";
import { runInAction } from 'mobx';
import TemplateRow from "./TemplateRow";
import { useMainStore } from "../Providers/MainStoreProvider";

// interface ITemplateProps extends React.ComponentProps<"div">, ITemplateStore { }

const Template = observer(function Template() {
  const mainStore = useMainStore();

  const setTemplateName = (e: React.ChangeEvent<HTMLInputElement>) => runInAction(() =>
    mainStore.currentTemplate.name = e.target.value
  );

  const addProductRow = () => runInAction(() =>
    mainStore.currentTemplate.addProductRow()
  );

  const getHandleRowStart = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      type: "template-row",
      origin: "template",
      index
    }));
  };

  const getHandleDropOnRow = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const dataS = e.dataTransfer.getData("application/json");
    if (!dataS) return;
    const data = JSON.parse(dataS);

    if (data.origin !== "template" || data.type !== "template-row") return;

    // Reorder the rows
    runInAction(() => {
      mainStore.currentTemplate.reorderRow(data.index, index);
    });
  };

  // Zoom
  const [zoom, setZoom] = React.useState(1);
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  return (
    <div className="template">
      <div className="template-settings">
        <div className="template-title">
          <label>Template name:</label><input name="template-name" onInput={setTemplateName} type="text" />
        </div>
        <div className="spacer"></div>
        <div className="zoom-control">
          <label>Zoom:</label>
          <input type="range" min="0.1" max="1" step="0.1" value={zoom} onChange={handleZoomChange} />
        </div>
        <div className="spacer"></div>
        <div className="template-actions">
          <button onClick={addProductRow} >Add Row</button>
          <button>Save</button>
        </div>
      </div>
      <div className="template-rows" style={{ transform: `scale(${zoom})` , transformOrigin: 'top' }}>
        {
          mainStore.currentTemplate.productRows.map((row, index) => (
            <TemplateRow
              key={row.id}
              {...row}
              onDragStart={getHandleRowStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={getHandleDropOnRow(index)}
            />
          ))
        }
      </div>
    </div>
  );
});

export default Template;
