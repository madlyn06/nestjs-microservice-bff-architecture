enum INVOICE {
  CREATE = 'invoice.create',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_ALL = 'product.getAll',
}

enum USER {
  CREATE = 'user.create',
  GET_ALL = 'user.getAll',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE: INVOICE,
  PRODUCT: PRODUCT,
  USER: USER,
};
