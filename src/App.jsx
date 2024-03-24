import { useState, useEffect } from 'react';
import Header from './components/Header';
import Guitar from './components/Guitar';
import { db } from './data/db';

function App() {

  const initialCart = ()=>{
    const localStorageCart = localStorage.getItem('cart');

    // Retornamos el resultado de un condicional ternario
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(item){

    // findIndex si no existe un elemento retorna -1, si no retorna el primer elemento que satisfaga la condicion
    const itemExist = cart.findIndex(guitar => guitar.id === item.id)

    if(itemExist >= 0){
      // En caso de que existe algo elemento que satisfaga la condicion se detiene la ejecucion
      if(cart[itemExist].quantity >= MAX_ITEMS) return
      const updateCart = [...cart];
      updateCart[itemExist].quantity++;
      setCart(updateCart);
    }else{
      item.quantity = 1;
      setCart([...cart, item]);
    }
  }

  function removeFromCart(id){
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id) );
  }

  function increaseQuantity (id){

    const updatecart = cart.map(item =>{
      // Modifica el objeto hasta donde las condiciones lo permitan
      if(item.id === id && item.quantity < MAX_ITEMS){
        return{
          ...item,
          quantity : item.quantity + 1 
        }
      }
      // Una vez cumplida las condicones se retorna el mismo objeto para que ya no sufra mas modificaciones. Sin este return se quiebra el codigo
      return item;
    })
    setCart(updatecart);
  }

  function decreaseQuantity (id){
    const updateCart = cart.map(item=>{
      
      if(item.id === id && item.quantity > MIN_ITEMS){
        return{
          ...item,
          quantity : item.quantity - 1 
        }
      }
      return item;
    })
    setCart(updateCart);
  }

  function clearCart(){
    setCart([]);
  }

  return (
    <>
      <Header 
      cart={cart}
      removeFromCart = {removeFromCart}
      increaseQuantity = {increaseQuantity}
      decreaseQuantity = {decreaseQuantity}
      clearCart = {clearCart}
      />
      
      <main className="container-xl mt-5">
          <h2 className="text-center">Nuestra Colección</h2>
          <div className="row mt-5">
            {data.map(guitar=>(
              <Guitar key={guitar.id}  guitar = {guitar} addToCart={addToCart}/>
            ))}
          </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
          <div className="container-xl">
              <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
          </div>
      </footer>
    </>
  )
}

export default App
