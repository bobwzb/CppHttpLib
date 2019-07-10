// Code generated by protoc-gen-go. DO NOT EDIT.
// source: common/consts.proto

package common

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type SCENARIO_TYPE int32

const (
	SCENARIO_TYPE_S_PB_FIRST_MUST_ZORE SCENARIO_TYPE = 0
	SCENARIO_TYPE_S_INIT               SCENARIO_TYPE = 1
	SCENARIO_TYPE_S_CHANCE             SCENARIO_TYPE = 2
	SCENARIO_TYPE_S_BIG_BUSINESS       SCENARIO_TYPE = 3
	SCENARIO_TYPE_S_SMALL_BUSINESS     SCENARIO_TYPE = 4
	SCENARIO_TYPE_S_MARKET_INFO        SCENARIO_TYPE = 5
	SCENARIO_TYPE_S_ACCIDENT           SCENARIO_TYPE = 6
	SCENARIO_TYPE_S_CHARITY            SCENARIO_TYPE = 7 // Deprecated: Do not use.
	SCENARIO_TYPE_S_UNEMPLOYMENT       SCENARIO_TYPE = 8
	SCENARIO_TYPE_S_PAYDAY             SCENARIO_TYPE = 9
	SCENARIO_TYPE_S_BABY               SCENARIO_TYPE = 10
	SCENARIO_TYPE_S_WAGE_HIKE          SCENARIO_TYPE = 11
	SCENARIO_TYPE_S_MARKET_CHANGE      SCENARIO_TYPE = 12
)

var SCENARIO_TYPE_name = map[int32]string{
	0:  "S_PB_FIRST_MUST_ZORE",
	1:  "S_INIT",
	2:  "S_CHANCE",
	3:  "S_BIG_BUSINESS",
	4:  "S_SMALL_BUSINESS",
	5:  "S_MARKET_INFO",
	6:  "S_ACCIDENT",
	7:  "S_CHARITY",
	8:  "S_UNEMPLOYMENT",
	9:  "S_PAYDAY",
	10: "S_BABY",
	11: "S_WAGE_HIKE",
	12: "S_MARKET_CHANGE",
}

var SCENARIO_TYPE_value = map[string]int32{
	"S_PB_FIRST_MUST_ZORE": 0,
	"S_INIT":               1,
	"S_CHANCE":             2,
	"S_BIG_BUSINESS":       3,
	"S_SMALL_BUSINESS":     4,
	"S_MARKET_INFO":        5,
	"S_ACCIDENT":           6,
	"S_CHARITY":            7,
	"S_UNEMPLOYMENT":       8,
	"S_PAYDAY":             9,
	"S_BABY":               10,
	"S_WAGE_HIKE":          11,
	"S_MARKET_CHANGE":      12,
}

func (x SCENARIO_TYPE) String() string {
	return proto.EnumName(SCENARIO_TYPE_name, int32(x))
}

func (SCENARIO_TYPE) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_dfd414e2c2423a2e, []int{0}
}

type PayDayType int32

const (
	PayDayType_PAYDAY_PLACEHOLDER PayDayType = 0
	// 没有经过结算日
	PayDayType_NOT_PAY_DAY PayDayType = 1
	// 停留在结算日
	PayDayType_PAY_DAY PayDayType = 2
	// 经过结算日
	PayDayType_PASS_BY_PAY_DAY PayDayType = 3
)

var PayDayType_name = map[int32]string{
	0: "PAYDAY_PLACEHOLDER",
	1: "NOT_PAY_DAY",
	2: "PAY_DAY",
	3: "PASS_BY_PAY_DAY",
}

var PayDayType_value = map[string]int32{
	"PAYDAY_PLACEHOLDER": 0,
	"NOT_PAY_DAY":        1,
	"PAY_DAY":            2,
	"PASS_BY_PAY_DAY":    3,
}

func (x PayDayType) String() string {
	return proto.EnumName(PayDayType_name, int32(x))
}

func (PayDayType) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_dfd414e2c2423a2e, []int{1}
}

// 支付类型，用来在支付意外消费时标识应如何支付
type PaymentType int32

const (
	PaymentType_PAYMENT_TYPE_PLACEHOLDER PaymentType = 0
	// 现金能够支付
	PaymentType_PAYMENT_TYPE_CASH PaymentType = 1
	// 贷款能够支付
	PaymentType_PAYMENT_TYPE_LOAN PaymentType = 2
	// 不能支付
	PaymentType_PAYMENT_TYPE_CANNOT_PAY PaymentType = 3
)

var PaymentType_name = map[int32]string{
	0: "PAYMENT_TYPE_PLACEHOLDER",
	1: "PAYMENT_TYPE_CASH",
	2: "PAYMENT_TYPE_LOAN",
	3: "PAYMENT_TYPE_CANNOT_PAY",
}

var PaymentType_value = map[string]int32{
	"PAYMENT_TYPE_PLACEHOLDER": 0,
	"PAYMENT_TYPE_CASH":        1,
	"PAYMENT_TYPE_LOAN":        2,
	"PAYMENT_TYPE_CANNOT_PAY":  3,
}

func (x PaymentType) String() string {
	return proto.EnumName(PaymentType_name, int32(x))
}

func (PaymentType) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_dfd414e2c2423a2e, []int{2}
}

type OnlineState int32

const (
	// 未知状态
	OnlineState_OnlineState_unkown OnlineState = 0
	// 在线
	OnlineState_online OnlineState = 1
	// 离线
	OnlineState_afk OnlineState = 2
	// 托管中，没用了
	OnlineState_brb OnlineState = 3 // Deprecated: Do not use.
	// 已经退出游戏(破产后玩家可能会退出游戏)
	OnlineState_quit OnlineState = 4
)

var OnlineState_name = map[int32]string{
	0: "OnlineState_unkown",
	1: "online",
	2: "afk",
	3: "brb",
	4: "quit",
}

var OnlineState_value = map[string]int32{
	"OnlineState_unkown": 0,
	"online":             1,
	"afk":                2,
	"brb":                3,
	"quit":               4,
}

func (x OnlineState) String() string {
	return proto.EnumName(OnlineState_name, int32(x))
}

func (OnlineState) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_dfd414e2c2423a2e, []int{3}
}

// 创建房间时的匹配类型
type MatchType int32

const (
	MatchType_UNKNOWN MatchType = 0
	// 匹配塞
	MatchType_STANDARD MatchType = 1
	// 排位赛
	MatchType_RANK MatchType = 2
	// 财务报表训练游戏
	MatchType_TRAINING MatchType = 3
)

var MatchType_name = map[int32]string{
	0: "UNKNOWN",
	1: "STANDARD",
	2: "RANK",
	3: "TRAINING",
}

var MatchType_value = map[string]int32{
	"UNKNOWN":  0,
	"STANDARD": 1,
	"RANK":     2,
	"TRAINING": 3,
}

func (x MatchType) String() string {
	return proto.EnumName(MatchType_name, int32(x))
}

func (MatchType) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_dfd414e2c2423a2e, []int{4}
}

func init() {
	proto.RegisterEnum("pb.common.SCENARIO_TYPE", SCENARIO_TYPE_name, SCENARIO_TYPE_value)
	proto.RegisterEnum("pb.common.PayDayType", PayDayType_name, PayDayType_value)
	proto.RegisterEnum("pb.common.PaymentType", PaymentType_name, PaymentType_value)
	proto.RegisterEnum("pb.common.OnlineState", OnlineState_name, OnlineState_value)
	proto.RegisterEnum("pb.common.MatchType", MatchType_name, MatchType_value)
}

func init() { proto.RegisterFile("common/consts.proto", fileDescriptor_dfd414e2c2423a2e) }

var fileDescriptor_dfd414e2c2423a2e = []byte{
	// 483 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x64, 0x92, 0xcd, 0x6f, 0xd3, 0x4c,
	0x10, 0xc6, 0x63, 0x3b, 0x6f, 0x3e, 0xc6, 0xfd, 0x98, 0x6c, 0xfb, 0x42, 0x05, 0x9c, 0x11, 0x8a,
	0x44, 0x73, 0xe0, 0x8e, 0xb4, 0xb6, 0xb7, 0xc9, 0x2a, 0xf6, 0xda, 0x78, 0x37, 0x8a, 0xdc, 0xcb,
	0xca, 0x89, 0x42, 0x89, 0xda, 0xd8, 0x21, 0x71, 0x8a, 0xf2, 0x97, 0x73, 0x45, 0x5e, 0x43, 0x81,
	0x72, 0x9c, 0xc7, 0xe3, 0xdf, 0x3c, 0x33, 0xfb, 0xc0, 0xc5, 0xb2, 0xdc, 0x6c, 0xca, 0x62, 0xb4,
	0x2c, 0x8b, 0x7d, 0xb5, 0xbf, 0xde, 0xee, 0xca, 0xaa, 0x24, 0xfd, 0xed, 0xe2, 0xba, 0xd1, 0x87,
	0xdf, 0x2d, 0x38, 0x95, 0x3e, 0x13, 0x34, 0xe5, 0xb1, 0x56, 0x59, 0xc2, 0xc8, 0x15, 0x5c, 0x4a,
	0x9d, 0x78, 0xfa, 0x86, 0xa7, 0x52, 0xe9, 0x68, 0x26, 0x95, 0xbe, 0x8d, 0x53, 0x86, 0x2d, 0x02,
	0xd0, 0x91, 0x9a, 0x0b, 0xae, 0xd0, 0x22, 0x27, 0xd0, 0x93, 0xda, 0x9f, 0x50, 0xe1, 0x33, 0xb4,
	0x09, 0x81, 0x33, 0xa9, 0x3d, 0x3e, 0xd6, 0xde, 0x4c, 0x72, 0xc1, 0xa4, 0x44, 0x87, 0x5c, 0x02,
	0x4a, 0x2d, 0x23, 0x1a, 0x86, 0xbf, 0xd5, 0x36, 0x19, 0xc0, 0xa9, 0xd4, 0x11, 0x4d, 0xa7, 0x4c,
	0x69, 0x2e, 0x6e, 0x62, 0xfc, 0x8f, 0x9c, 0x01, 0x48, 0x4d, 0x7d, 0x9f, 0x07, 0x4c, 0x28, 0xec,
	0x90, 0x01, 0xf4, 0x0d, 0x3a, 0xe5, 0x2a, 0xc3, 0xee, 0x2b, 0xbb, 0x67, 0x35, 0xfc, 0x99, 0x60,
	0x51, 0x12, 0xc6, 0x59, 0x54, 0xb7, 0xf5, 0x1a, 0x07, 0x09, 0xcd, 0x02, 0x9a, 0x61, 0xbf, 0xf1,
	0xe6, 0x51, 0x2f, 0x43, 0x20, 0xe7, 0xe0, 0x4a, 0x3d, 0xa7, 0x63, 0xa6, 0x27, 0x7c, 0xca, 0xd0,
	0x25, 0x17, 0x70, 0xfe, 0x34, 0xb4, 0xf6, 0x3c, 0x66, 0x78, 0x32, 0x9c, 0x03, 0x24, 0xf9, 0x31,
	0xc8, 0x8f, 0xea, 0xb8, 0x5d, 0x91, 0x17, 0x40, 0x1a, 0x96, 0x4e, 0x42, 0xea, 0xb3, 0x49, 0x1c,
	0x06, 0x2c, 0xc5, 0x56, 0xcd, 0x12, 0xb1, 0xaa, 0xe7, 0xe8, 0x7a, 0x90, 0x45, 0x5c, 0xe8, 0xfe,
	0x2a, 0xec, 0x1a, 0x9c, 0x50, 0x29, 0xb5, 0x97, 0x3d, 0x75, 0x38, 0xc3, 0x47, 0x70, 0x93, 0xfc,
	0xb8, 0x59, 0x15, 0x95, 0x21, 0xbf, 0x81, 0xab, 0x84, 0x1a, 0xd3, 0xe6, 0xbe, 0xcf, 0xf8, 0xff,
	0xc3, 0xe0, 0xaf, 0xaf, 0x3e, 0x95, 0x13, 0xb4, 0xfe, 0x91, 0xc3, 0x98, 0x0a, 0xb4, 0xc9, 0x6b,
	0x78, 0xf9, 0xac, 0x5b, 0xfc, 0x74, 0x87, 0xce, 0xf0, 0x13, 0xb8, 0x71, 0xf1, 0xb0, 0x2e, 0x56,
	0xb2, 0xca, 0x2b, 0xb3, 0xd1, 0x1f, 0xa5, 0x3e, 0x14, 0xf7, 0xe5, 0xb7, 0xa2, 0x79, 0xc5, 0xd2,
	0xe8, 0x68, 0x91, 0x2e, 0x38, 0xf9, 0xe7, 0x7b, 0xb4, 0x89, 0x0b, 0xce, 0x62, 0xb7, 0x40, 0xc7,
	0x5c, 0xbb, 0x07, 0xed, 0xaf, 0x87, 0x75, 0x85, 0xed, 0xe1, 0x47, 0xe8, 0x47, 0x79, 0xb5, 0xfc,
	0x62, 0x16, 0x71, 0xa1, 0x3b, 0x13, 0x53, 0x11, 0xcf, 0x05, 0xb6, 0xcc, 0xf5, 0x15, 0x15, 0x01,
	0x4d, 0x03, 0x34, 0x7f, 0xa4, 0x54, 0x4c, 0xd1, 0xae, 0x75, 0x95, 0x52, 0x2e, 0xb8, 0x18, 0xa3,
	0xe3, 0xbd, 0xbb, 0x7d, 0x7b, 0xb7, 0xae, 0x1e, 0x72, 0x13, 0xb7, 0xd1, 0xe3, 0x6a, 0x59, 0x95,
	0xbb, 0xc3, 0x76, 0x94, 0xef, 0xf7, 0xab, 0xea, 0xfd, 0x76, 0x31, 0xba, 0x2b, 0x47, 0x4d, 0x0e,
	0x17, 0x1d, 0x93, 0xcc, 0x0f, 0x3f, 0x02, 0x00, 0x00, 0xff, 0xff, 0x49, 0xd4, 0xd4, 0xce, 0xb0,
	0x02, 0x00, 0x00,
}
