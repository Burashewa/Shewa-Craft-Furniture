import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { OrdersPage } from '../components/orders/OrdersPage';

export default function Orders() {
  return (
    <>
      <Header />
      <OrdersPage />
      <Footer />
    </>
  );
}
