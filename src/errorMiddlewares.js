const notFoundMiddleware = (err, req, res, next) => {
    if (err.status === 404) {
      res.status(404).send({ successful: false, message: err.message })
    } else {
      next(err)
    }
  }
  
  const badRequestMiddleware = (err, req, res, next) => {
    if (err.status === 400) {
      res.status(400).send(err.errorsList)
    } else {
      next(err)
    }
  }
  
  const unAuthorizedHandler = (err, req, res, next) => {
    if (err.status === 401) {
      res.status(401).send(err.message || "You are not logged in!")
    } else {
      next(err)
    }
  }
  
  const forbiddenHandler = (err, req, res, next) => {
    if (err.status === 403) {
      res.status(403).send(err.message || "You are not allowed to do that!")
    } else {
      next(err)
    }
  }
  
  const catchErrorMiddleware = (err, req, res, next) => {
    res.status(500).send("Generic Server Error")
  }
  
  export const errorMiddlewares = [
    notFoundMiddleware,
    badRequestMiddleware,
    forbiddenHandler,
    unAuthorizedHandler,
    catchErrorMiddleware,
  ]