import React from "react";
import { useReactToPrint } from "react-to-print";

const PrintButton = ({ contentRef }) => {
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  return <button onClick={handlePrint}>In Đơn Hàng</button>;
};

export default PrintButton;
