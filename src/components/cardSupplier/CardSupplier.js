import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./style.css";
import { Link } from "react-router-dom";
import numeral from "numeral";
export default function CardSupplier({ item }) {
  return (
    <Card
      sx={{ maxWidth: 345 }}
      style={{ padding: "0", marginBottom: "1rem", borderRadius: "0.6rem" }}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        height="250"
        image={item?.image}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="title-prd"
        >
          {item?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <p className="code-product">{item?.productCode}</p>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <div id="priceandstatus">
            <p className="code-product">{`${numeral(item?.salePrice).format(
              "0,0"
            )}đ`}</p>
            <span className="code-product">Số lượng còn: {item?.quantity}</span>
          </div>
        </Typography>
      </CardContent>
    </Card>
  );
}
