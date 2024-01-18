class ApiError extends Error {
  public location: string;
  public message: string;

constructor(location?: string, message: string = "") {
    super(message);

    this.location = location || '';
    this.message = message;
  }
}

class ErrorRedirect extends Error {
  public path: string;
  public message: string;

constructor(path?: string, message: string = "") {
    super(message);

    this.path = path || '';
    this.message = message;
  }
}

export { ApiError, ErrorRedirect };
