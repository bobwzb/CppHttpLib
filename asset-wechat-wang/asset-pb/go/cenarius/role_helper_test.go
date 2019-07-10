package cenarius

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestRole_ToNextPosition(t *testing.T) {
	promotions := []string{"工人", "生产组长", "车间主任", "厂长"}
	role := Role{Name: "工人", Promotions: promotions}

	cases := [4][2]string{
		{"工人", "生产组长"},
		{"生产组长", "车间主任"},
		{"车间主任", "厂长"},
		{"厂长", "厂长"},
	}

	for _, v := range cases {
		actual := role.ToNextPosition(v[0])
		assert.Equal(t, v[1], actual, fmt.Sprintf("src: %s", v[0]))
	}
}
