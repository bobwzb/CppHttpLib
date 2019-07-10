package common

import (
	"database/sql/driver"
)

// 允许我们直接在模型上使用 SCENARIO_TYPE 类型，避免代码中的强制类型转换
func (s *SCENARIO_TYPE) Scan(src interface{}) error {
	switch value := src.(type) {
	default:
		return ErrInvalidType
	case int64:
		*s = SCENARIO_TYPE(value)
	}
	return nil
}

func (s SCENARIO_TYPE) Value() (driver.Value, error) {
	return int64(s), nil
}

func (m *MatchType) Scan(src interface{}) error {
	switch value := src.(type) {
	default:
		return ErrInvalidType
	case int64:
		*(*int32)(m) = int32(value)
	}
	return nil
}

func (m MatchType) Value() (driver.Value, error) {
	return int64(m), nil
}
