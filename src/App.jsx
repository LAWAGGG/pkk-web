import { useState } from 'react';
import Stories from './components/Stories';
import ProductPage from './components/ProductPage';
import './index.css';

function App() {
  const [showProduct, setShowProduct] = useState(false);

  const handleStoriesComplete = () => {
    setShowProduct(true);
  };

  return (
    <>
      {!showProduct ? (
        <Stories onComplete={handleStoriesComplete} />
      ) : (
        <ProductPage />
      )}
    </>
  );
}

export default App;
