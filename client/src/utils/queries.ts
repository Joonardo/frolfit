const userFields = `
  id
  username
`;

export const loginQuery = `
  query Login {
    me {
      ${userFields}
    }
  }
`;