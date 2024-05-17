import formatDate from "./utils";

export const generateSummary = (headers: string[], data: string[][]) => {
  const orderIdIndex = headers.indexOf("order-id");
  const orderItemCodeIndex = headers.indexOf("order-item-code");
  const postedDateTimeIndex = headers.indexOf("posted-date");
  const depositDateIndex = headers.indexOf("deposit-date");
  const amountDescriptionIndex = headers.indexOf("amount-description");
  const amountTypeIndex = headers.indexOf("amount-type");
  const amountIndex = headers.indexOf("amount");
  const skuIndex = headers.indexOf("sku");
  const quantityPurchasedIndex = headers.indexOf("quantity-purchased");

  const orderSummary: { [key: string]: any } = {};

  data.forEach((row: string[]) => {
    const orderId = row[orderIdIndex];
    const orderItemCode = row[orderItemCodeIndex];

    if (
      orderId !== "" &&
      orderId !== undefined &&
      orderItemCode !== "" &&
      orderItemCode !== undefined
    ) {
      if (!orderSummary[orderId]) {
        orderSummary[orderId] = {};
      }

      if (!orderSummary[orderId][orderItemCode]) {
        orderSummary[orderId][orderItemCode] = {
          sku: row[skuIndex],
          orderId: orderId,
          orderItemCode: orderItemCode,
          postedDateTime: formatDate(row[postedDateTimeIndex]),
          depositDate: formatDate(row[depositDateIndex]),
          salePrice: 0.0,
          fees: 0.0,
          quantityPurchased: parseFloat(row[quantityPurchasedIndex] || "0")
        };
      }

      // Calculate the Price and Fees
      if (row[amountDescriptionIndex] === "Principal") {
        orderSummary[orderId][orderItemCode].salePrice += parseFloat(
          row[amountIndex] || "0"
        );
      }

      if (row[amountTypeIndex] === "ItemFees") {
        orderSummary[orderId][orderItemCode].fees += parseFloat(
          row[amountIndex] || "0"
        );
      }
    }
  });

  const summaryData: any[] = [];
  Object.values(orderSummary).forEach((orderItems) => {
    Object.values(orderItems).forEach((item: any) => {
      summaryData.push([
        item.sku,
        item.orderId,
        item.orderItemCode,
        item.postedDateTime,
        item.depositDate,
        parseFloat(item.salePrice.toFixed(2)),
        parseFloat((item.fees  * -1).toFixed(2)),
        item.quantityPurchased
      ]);
    });
  });

  return summaryData;
};
