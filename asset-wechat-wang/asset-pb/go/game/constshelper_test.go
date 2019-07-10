package game

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gitlab.com/vectorup/asset-pb/go/common"
)

func TestMarketChangeType_Enum_Scan(t *testing.T) {
	type testcase struct {
		value    interface{}
		err      error
		expected MarketChangeType_Enum
	}
	cases := []testcase{
		{int64(1), nil, MarketChangeType_Enum(1)},
		{int(1), common.ErrInvalidType, MarketChangeType_Enum(0)},
	}
	for _, c := range cases {
		var v MarketChangeType_Enum
		err := v.Scan(c.value)
		assert.Equal(t, c.err, err)
		assert.Equal(t, c.expected, v)
	}
}

func TestMarketChangeType_Enum_Value(t *testing.T) {
	type testcase struct {
		value    MarketChangeType_Enum
		expected int64
	}
	cases := []testcase{
		{MarketChangeType_Enum(0), 0},
		{MarketChangeType_Enum(1), 1},
	}
	for _, c := range cases {
		value, err := c.value.Value()
		assert.NoError(t, err)
		assert.Equal(t, c.expected, value)
	}
}
