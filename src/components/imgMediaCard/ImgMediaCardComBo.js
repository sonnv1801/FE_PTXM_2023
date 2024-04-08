import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import numeral from "numeral";
import "./style.css";
export default function ImgMediaCardComBo({ item }) {
  return (
    <Card
      className="sm-card-combo"
      sx={{ maxWidth: 345 }}
      style={{ padding: "0", marginBottom: "1rem", borderRadius: "0.6rem" }}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        height="250"
        image={item?.image}
        className="product-image"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="title-prd"
        >
          {item?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <p className="code-product">{item?.type}</p>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <div id="priceandstatus">
            <p className="code-product">{`${numeral(item.newPrice).format(
              "0,0"
            )}đ`}</p>
            <span className="code-product">
              {item?.quantity === 0 ? `Hết Hàng` : `Còn ${item?.quantity} Cái`}
            </span>
          </div>
        </Typography>
      </CardContent>
    </Card>
  );
}
