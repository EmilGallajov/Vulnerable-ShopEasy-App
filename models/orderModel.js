const orders = [
  { orderId: 101, userId: 1, item: "iPhone 14", image: "/images/iphone14.jpg" },
  { orderId: 102, userId: 2, item: "Galaxy S23", image: "/images/galaxys23.jpg" },
  { orderId: 103, userId: 1, item: "Pixel 7", image: "/images/pixel7.jpg" },
  { orderId: 104, userId: 2, item: "OnePlus 11", image: "/images/oneplus11.jpg" },
  { orderId: 105, userId: 1, item: "Xiaomi 13", image: "/images/xiaomi13.jpg" },
  { orderId: 106, userId: 2, item: "Sony Xperia 5", image: "/images/xperia5.jpeg" },
  { orderId: 107, userId: 1, item: "Huawei P60", image: "/images/xperia5.jpeg" },
  { orderId: 108, userId: 2, item: "Motorola Edge 40", image: "/images/motoedge40.jpg" },
  { orderId: 109, userId: 1, item: "Nokia X30", image: "/images/nokiax30.jpg" },
  { orderId: 110, userId: 2, item: "Asus Zenfone 9", image: "/images/zenfone9.jpg" }
];

module.exports = {
  getAllOrders: () => orders,
  getOrderById: (id) => orders.find(o => o.orderId == id)
}; 