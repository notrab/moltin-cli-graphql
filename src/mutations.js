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
