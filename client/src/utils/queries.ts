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

export const signupQuery = `
  mutation SignUp ($username: String!, $email: String!) {
    user: signup(username: $username, email: $email) {
      ${userFields}
    }
  }
`;

//#endregion