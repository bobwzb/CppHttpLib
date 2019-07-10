package common

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSCENARIO_TYPE_Scan(t *testing.T) {
	type testcase struct {
		value    interface{}
		err      error
		expected SCENARIO_TYPE
	}
	cases := []testcase{
		{int64(1), nil, SCENARIO_TYPE(1)},
		{int(1), ErrInvalidType, SCENARIO_TYPE(0)},
	}
	for _, c := range cases {
		var v SCENARIO_TYPE
		err := v.Scan(c.value)
		assert.Equal(t, c.err, err)
		assert.Equal(t, c.expected, v)
	}
}

func TestSCENARIO_TYPE_Value(t *testing.T) {
	type testcase struct {
		value    SCENARIO_TYPE
		expected int64
	}
	cases := []testcase{
		{SCENARIO_TYPE(0), 0},
		{SCENARIO_TYPE(1), 1},
	}
	for _, c := range cases {
		value, err := c.value.Value()
		assert.NoError(t, err)
		assert.Equal(t, c.expected, value)
	}
}

func TestMatchType_Scan(t *testing.T) {
	type testcase struct {
		value    interface{}
		err      error
		expected MatchType
	}
	cases := []testcase{
		{int64(1), nil, MatchType(1)},
		{int(1), ErrInvalidType, MatchType(0)},
	}
	for _, c := range cases {
		var v MatchType
		err := v.Scan(c.value)
		assert.Equal(t, c.err, err)
		assert.Equal(t, c.expected, v)
	}
}

func TestMatchType_Value(t *testing.T) {
	type testcase struct {
		value    MatchType
		expected int64
	}
	cases := []testcase{
		{MatchType(0), 0},
		{MatchType(1), 1},
	}
	for _, c := range cases {
		value, err := c.value.Value()
		assert.NoError(t, err)
		assert.Equal(t, c.expected, value)
	}
}
