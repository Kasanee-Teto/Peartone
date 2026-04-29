class BaseService {
  success(data, message = "OK") {
    return { success: true, message, data };
  }
}

export default BaseService;