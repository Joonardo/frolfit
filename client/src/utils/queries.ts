const userFields = `
  id
  username
`;

//#region LOGIN

export const loginQuery = `
  query Login {
    me {
      ${userFields}
    }
  }
`;

export const signupMutation = `
  mutation SignUp ($username: String!, $email: String!) {
    user: signup(username: $username, email: $email) {
      ${userFields}
    }
  }
`;

export const sendTokenLinkMutation = `
  mutation SendTokenLink ($email: String!) {
    result: sendLoginMail(email: $email)
  }
`;

//#endregion