package common

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

const testErrorMsg = "failed"
const testErrorCode = ErrorCode_FAILED

func createTestError() *GameError {
	return NewGameError(testErrorMsg, testErrorCode)
}

func TestNewGameError(t *testing.T) {
	ge := NewGameError(testErrorMsg, testErrorCode)
	assert.Equal(t, testErrorMsg, ge.message)
	assert.Equal(t, testErrorCode, ge.code)
}

func TestGameError_SetCode(t *testing.T) {
	const testCode = ErrorCode_UNDER_MAINTENANCE
	ge := createTestError()
	_ = ge.SetCode(testCode)
	assert.Equal(t, testCode, ge.code)
}

func TestGameError_SetMessage(t *testing.T) {
	const testMsg = "456"
	ge := createTestError()
	_ = ge.SetMessage(testMsg)
	assert.Equal(t, testMsg, ge.message)
}

func TestGameError_Error(t *testing.T) {
	ge := createTestError()
	assert.Equal(t, testErrorMsg, ge.Error())
}

func TestGameError_ToBaseRsp(t *testing.T) {
	ge := createTestError()
	rsp := ge.ToBaseRsp()
	assert.Equal(t, int32(testErrorCode), rsp.Code)
	assert.Equal(t, rsp.Msg, ge.message)
}

func TestErrorToBaseRsp_WithGameError(t *testing.T) {
	ge := createTestError()
	rsp := ErrorToBaseRsp(ge)
	assert.Equal(t, ge.ToBaseRsp(), rsp)
}

func TestErrorToBaseRsp_WithNormalError(t *testing.T) {
	err := errors.New("this is a test error")
	rsp := ErrorToBaseRsp(err)
	assert.Equal(t, defaultErrorMessage, rsp.Msg)
	assert.Equal(t, int32(ErrorCode_INTERNAL_EXCEPTION), rsp.Code)
}

func TestErrInternal(t *testing.T) {
	err := ErrInternal()
	assert.Equal(t, ErrorCode_INTERNAL_EXCEPTION, err.code)
	assert.Equal(t, defaultErrorMessage, err.message)
}
