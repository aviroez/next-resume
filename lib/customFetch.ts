const customFetch = async (url: string, options: RequestInit = {}) => {
    // Determine the token type (cookie or bearer) based on the environment
    const tokenType = process.env.TOKEN_TYPE ?? "token";
  
    const headers = {
        ...options.headers
    };

    // Add the authorization header or credentials depending on the token type
    if (tokenType === "cookies") {
      // Use cookie-based authentication
      options.credentials = 'include';
    } else {
      // Use bearer token authorization
      const token = sessionStorage.getItem('bearer_token')
      if (token) {
        // headers['Authorization'] = `Bearer ${token}`;
        Object.assign(headers, {Authorization: `Bearer ${token}`})
      }
    }
  
    // Perform the fetch request
    const combineHeader = {
      ...options,
      headers,
    }
    const response = await fetch(url, combineHeader);
    console.log(url, combineHeader)
  
    // Handle the response
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
  
    return response.json();
};
  
export default customFetch;
  