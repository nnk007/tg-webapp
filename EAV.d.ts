interface ErrorResponse {
    error:Error|any,
};
interface SuccessResponse<T> {
    result:T
};
namespace EAV {
    type Response<T=any> = ErrorResponse | SuccessResponse<T>;
}