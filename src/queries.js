export const getStores = `query getStores {
  stores {
    id
    noneUuid
    name
  }
}`

export const getStoreById = `query getStore($storeId: ID!) {
  store(id: $storeId) {
    id: noneUuid
    name
    users {
      name
    }
  }
}`

export const getGateways = `query getGateways {
  gateways {
    ... on Stripe {
      name
      enabled
    }
    ... on Braintree {
      name
      enabled
    }
    ... on CardConnect {
      name
      enabled
    }
    ... on Adyen {
      name
      enabled
    }
    ... on Manual {
      name
      enabled
    }
  }
}`

export const getKeys = `query getKeys($storeId: ID!) {
  keys(storeId: $storeId) {
    client_id
    client_secret
  }
}`
