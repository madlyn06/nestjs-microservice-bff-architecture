enum INVOICE {
  CREATE = 'invoice.create',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_ALL = 'product.getAll',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE: INVOICE,
  PRODUCT: PRODUCT,
};
