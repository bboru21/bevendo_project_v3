import Layout from '../../hocs/Layout';
import FavoriteSwiper from "../../components/swipers/FavoriteSwiper";
import { Container } from "react-bootstrap";

const Examples = () => {
  // TODO replace with proper react redirect
  if (process.env.NODE_ENV !== "development") {
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
    return null;
  }

  return (
    <Layout
        title='Examples'
        content='Component Examples'
    >
      <Container>
        <h1>Examples</h1>
        <h2 className="mb-2">Favorite Swiper</h2>
        <FavoriteSwiper />
      </Container>
    </Layout>
  )
}

export default Examples;