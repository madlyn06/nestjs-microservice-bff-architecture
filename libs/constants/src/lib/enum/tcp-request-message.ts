enum INVOICE {
  CREATE = 'invoice.create',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_ALL = 'product.getAll',
  GET_LIST = 'product.getList',
}

enum USER {
  CREATE = 'user.create',
  GET_ALL = 'user.getAll',
  GET_BY_USER_ID = 'user.getByUserId',
}

enum AUTHORIZE {
  CREATE_KEYCLOAK_USER = 'authorize.createKeycloakUser',
  LOGIN = 'authorize.login',
  VERIFY_USER_TOKEN = 'authorize.verifyUserToken',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE: INVOICE,
  PRODUCT: PRODUCT,
  USER: USER,
  AUTHORIZE: AUTHORIZE,
};
