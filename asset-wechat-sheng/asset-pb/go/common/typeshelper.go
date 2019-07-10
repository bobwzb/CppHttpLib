package common

const (
	DEFAULT_PAGE     = 1
	DEFAULT_PER_PAGE = 10
	// 随便定的一个
	DEFAULT_MAX_PER_PAGE = 100
)

func (p *PaginationReq) ReadPage() int {
	if p == nil {
		return DEFAULT_PAGE
	}
	if p.Page <= 0 {
		return DEFAULT_PAGE
	}
	return int(p.Page)
}

func (p *PaginationReq) ReadPerPage(maxPerPage int) int {
	var perPage int
	if p == nil {
		return DEFAULT_PER_PAGE
	}
	if p.PerPage <= 0 {
		perPage = DEFAULT_PER_PAGE
	} else {
		perPage = int(p.PerPage)
	}
	if perPage > maxPerPage {
		return maxPerPage
	}
	return perPage
}

func (p *PaginationReq) ToPaginationRsp() PaginationRsp {
	rsp := PaginationRsp{
		Page:    int32(p.GetPage()),
		PerPage: int32(p.GetPerPage()),
	}
	return rsp
}

func (p *PaginationReq) Offset(maxPerPage int) int {
	return (p.ReadPage() - 1) * p.ReadPerPage(maxPerPage)
}

func GetDefaultPagination() *PaginationReq {
	return &PaginationReq{Page: DEFAULT_PAGE, PerPage: DEFAULT_PER_PAGE}
}
