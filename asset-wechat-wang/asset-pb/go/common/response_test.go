package common

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestResponseOk(t *testing.T) {
	rsp := ResponseOk()
	assert.Equal(t, int32(ErrorCode_SUCC), rsp.Code)
	assert.Equal(t, "", rsp.Msg)
}
