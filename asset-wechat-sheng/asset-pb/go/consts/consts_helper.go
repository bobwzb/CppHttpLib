package consts

import (
	"database/sql/driver"

	"gitlab.com/vectorup/asset-pb/go/common"
)

func (x ObjectType_Enum) Value() (driver.Value, error) {
	return int64(x), nil
}

func (x *ObjectType_Enum) Scan(src interface{}) error {
	switch v := src.(type) {
	default:
		return common.ErrInvalidType
	case int64:
		*x = ObjectType_Enum(v)
	}
	return nil
}

func (x MissionTargetType_Enum) Value() (driver.Value, error) {
	return x.String(), nil
}

func (x *MissionTargetType_Enum) Scan(src interface{}) error {
	switch v := src.(type) {
	default:
		return common.ErrInvalidType
	case string:
		i, ok := MissionTargetType_Enum_value[v]
		if !ok {
			return common.ErrInvalidType
		}
		*x = MissionTargetType_Enum(i)
	}
	return nil
}
