package consts

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_ObjectType_Scan(t *testing.T) {
	type testcase struct {
		value    interface{}
		hasError bool
		expected ObjectType_Enum
	}
	cases := []testcase{
		{int(1), true, ObjectType_UNKNOWN},
		{int64(1), false, ObjectType_MOMENT},
		{int64(2), false, ObjectType_SUMMARY},
	}
	for _, c := range cases {
		var objType ObjectType_Enum
		err := objType.Scan(c.value)
		assert.True(t, (err != nil) == c.hasError)
		assert.Equal(t, c.expected, objType)
	}
}

func Test_ObjectType_Value(t *testing.T) {
	type testcase struct {
		expected int64
		value    ObjectType_Enum
	}
	cases := []testcase{
		{0, ObjectType_UNKNOWN},
		{1, ObjectType_MOMENT},
		{2, ObjectType_SUMMARY},
	}
	for _, c := range cases {
		dv, err := c.value.Value()
		assert.NoError(t, err)
		assert.Equal(t, c.expected, dv)
	}
}

func Test_MissionTargetType_Scan(t *testing.T) {
	type testcase struct {
		value    interface{}
		hasError bool
		expected MissionTargetType_Enum
	}
	cases := []testcase{
		{int(1), true, MissionTargetType_Unknown},
		{int64(1), true, MissionTargetType_Unknown},
		{"ShareGame", false, MissionTargetType_ShareGame},
	}
	for _, c := range cases {
		var ty MissionTargetType_Enum
		err := ty.Scan(c.value)
		assert.True(t, (err != nil) == c.hasError)
		assert.Equal(t, c.expected, ty)
	}
}

func Test_MissionTargetType_Value(t *testing.T) {
	type testcase struct {
		expected string
		value    MissionTargetType_Enum
	}
	cases := []testcase{
		{"Unknown", MissionTargetType_Unknown},
		{"Login", MissionTargetType_Login},
		{"ShareGame", MissionTargetType_ShareGame},
	}
	for _, c := range cases {
		dv, err := c.value.Value()
		assert.NoError(t, err)
		assert.Equal(t, c.expected, dv)
	}
}
