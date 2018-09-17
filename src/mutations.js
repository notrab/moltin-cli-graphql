export const register = `mutation register($name: String!, $email: String!, $password: String!, $company: String) {
  register(name: $name, email: $email, password: $password, company: $company) {
    accessToken: access_token
    refreshToken: refresh_token
    user {
      name
      email
    }
  }
}`

export const login = `mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken: access_token
    refreshToken: refresh_token
    user {
      name
      email
    }
  }
}`

export const switchStore = `mutation switchStore($activeStoreId: ID!) {
  switchStore(id: $activeStoreId) {
    success
  }
}`

export const createStore = `mutation createStore($name: String!) {
  createStore(name: $name) {
    id: noneUuid
    name
  }
}`

export const renameStore = `mutation rename($storeId: ID!, $name: String!) {
  updateStore(id: $storeId, name: $name) {
    name
  }
}`

export const createToken = `mutation getToken($client_id: String!, $client_secret: String, $grant_type: GRANT_TYPE) {
  createToken(client_id: $client_id, client_secret: $client_secret, grant_type: $grant_type) {
    identifier
    access_token
    expires
    expires_in
  }
}`
