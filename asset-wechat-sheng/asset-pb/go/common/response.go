package common

func ResponseOk() *BaseRsp {
	return &BaseRsp{Code: int32(ErrorCode_SUCC), Msg: ""}
}
