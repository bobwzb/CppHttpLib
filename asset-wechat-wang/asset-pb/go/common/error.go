package common

const (
	defaultErrorMessage = "Internal Error"
)

type GameError struct {
	message string
	code    ErrorCode
}

func NewGameError(msg string, code ErrorCode) *GameError {
	return &GameError{message: msg, code: code}
}

func (ge *GameError) SetMessage(msg string) *GameError {
	ge.message = msg
	return ge
}

func (ge *GameError) SetCode(code ErrorCode) *GameError {
	ge.code = code
	return ge
}

func (ge *GameError) ToBaseRsp() *BaseRsp {
	return &BaseRsp{
		Code: int32(ge.code),
		Msg:  ge.message,
	}
}

func (ge *GameError) Error() string {
	return ge.message
}

func ErrorToBaseRsp(err error) *BaseRsp {
	switch v := err.(type) {
	case *GameError:
		return v.ToBaseRsp()
	default:
		return &BaseRsp{
			Code: int32(ErrorCode_INTERNAL_EXCEPTION),
			Msg:  defaultErrorMessage,
		}
	}
}

func ErrInternal() *GameError {
	return &GameError{message: defaultErrorMessage, code: ErrorCode_INTERNAL_EXCEPTION}
}
