package common

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestPaginationReq_ReadPage(t *testing.T) {
	type testCase struct {
		page     int32
		expected int
	}
	cases := []testCase{
		{-1, DEFAULT_PAGE},
		{0, DEFAULT_PAGE},
		{2, 2}}
	for i, c := range cases {
		req := PaginationReq{Page: c.page}
		assert.Equalf(t, c.expected, req.ReadPage(), "case %d failed.", i)
	}
}

func TestPaginationReq_ReadPage_Nil(t *testing.T) {
	var req *PaginationReq
	assert.Equal(t, DEFAULT_PAGE, req.ReadPage())
}

func TestPaginationReq_ReadPerPage2_Nil(t *testing.T) {
	var req *PaginationReq
	assert.Equal(t, DEFAULT_PER_PAGE, req.ReadPerPage(100))
}

func TestPaginationReq_ReadPerPage(t *testing.T) {
	type testCase struct {
		perPage  int
		max      int
		expected int
	}
	cases := []testCase{
		// Negative perPage
		{-1, 15, DEFAULT_PER_PAGE},
		// Zero perPage
		{0, 15, DEFAULT_PER_PAGE},
		// perPage less than max
		{5, 15, 5},
		// perPage greater than max
		{20, 15, 15}}
	for i, c := range cases {
		req := PaginationReq{PerPage: int32(c.perPage)}
		assert.Equalf(t, c.expected, req.ReadPerPage(c.max), "case %d failed", i)
	}
}

func TestPaginationReq_Offset(t *testing.T) {
	type testCase struct {
		expected int
		page     int32
		perPage  int32
		max      int
	}

	cases := []testCase{
		// first page
		{0, 1, 5, 10},
		// second page
		{5, 2, 5, 10},
		// max is less than perPage
		{10, 2, 50, 10},
	}
	for i, c := range cases {
		req := PaginationReq{Page: c.page, PerPage: c.perPage}
		assert.Equalf(t, c.expected, req.Offset(c.max), "case %d failed", i)
	}
}

func TestGetDefaultPagination(t *testing.T) {
	p := GetDefaultPagination()
	assert.Equal(t, int32(DEFAULT_PAGE), p.Page, "Page not Equal")
	assert.Equal(t, int32(DEFAULT_PER_PAGE), p.PerPage, "PerPage not Equal")
}
