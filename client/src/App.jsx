import { useState } from 'react'
import './App.css'
import BalloonMap from "./Components/BalloonMap.jsx";
import ProductDetails from './Components/ProductDetails.jsx';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProductDetails />
      <BalloonMap />
    </>
  )
}

export default App
