package game

import (
	"database/sql/driver"
	"gitlab.com/vectorup/asset-pb/go/common"
)

func (x MarketChangeType_Enum) Value() (driver.Value, error) {
	return int64(x), nil
}

func (x *MarketChangeType_Enum) Scan(src interface{}) error {
	switch v := src.(type) {
	default:
		return common.ErrInvalidType
	case int64:
		*x = MarketChangeType_Enum(int32(v))
		return nil
	}
}
