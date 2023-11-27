import './App.css'
import React from 'react'
import { observer } from 'mobx-react'
import { useMainStore } from './Components/Providers/MainStoreProvider'
import ProductList from './Components/Product/ProductList'
import Template from './Components/Template/Template'

const App = observer(function App(): React.ReactElement {
  const mainStore = useMainStore()

  return (
    <div className="App">
      <div>
        <h2>Template Manager</h2>
      </div>
      <ProductList products={mainStore.productsStore.products}/>
      <Template {...mainStore.currentTemplate}/>
    </div>
  )
})

export default App