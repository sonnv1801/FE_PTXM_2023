import Carousel from "react-bootstrap/Carousel";

function UncontrolledExample() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://img.webike.net/gcm/vn/shopping/banners/weekly_sale/20211105_OEM_pointback_1280x345.jpg"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://global-fs.webike-cdn.net/gcm/net/banner/20220715_global_point_earn_1280_345.png"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://img.webike.net/gcm/vn/shopping/banners/weekly_sale/20230623_sale_1280x345.jpg"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;
