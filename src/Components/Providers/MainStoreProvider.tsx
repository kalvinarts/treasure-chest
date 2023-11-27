/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";

// Setup mobx
import { MainStore, IMainStore } from '../../Stores/MainStore';

interface IMainStoreProvider {
  children: React.ReactNode;
}

const mainStore = new MainStore();
export const MainStoreContext = createContext<IMainStore>(mainStore);

export const MainStoreProvider: React.FC<IMainStoreProvider> = ({ children }) => {
  return (
    <MainStoreContext.Provider value={mainStore}>
      {children}
    </MainStoreContext.Provider>
  );
};

export const useMainStore = () => useContext(MainStoreContext);