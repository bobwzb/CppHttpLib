// Code generated by protoc-gen-go. DO NOT EDIT.
// source: events/game.proto

package events

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	any "github.com/golang/protobuf/ptypes/any"
	timestamp "github.com/golang/protobuf/ptypes/timestamp"
	common "gitlab.com/vectorup/asset-pb/go/common"
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

type GameEventType_Enum int32

const (
	GameEventType_UNKNOWN GameEventType_Enum = 0
	// 游戏开始
	GameEventType_GAME_START GameEventType_Enum = 1
	// 选择职业
	GameEventType_SELECT_ROLE GameEventType_Enum = 2
	// 买入资产
	GameEventType_BUY GameEventType_Enum = 3
	// 卖出资产
	GameEventType_SELL GameEventType_Enum = 4
	// 失业
	GameEventType_UNEMPLOYMENT GameEventType_Enum = 5
	// 升职加薪
	GameEventType_WAGE_HIKE GameEventType_Enum = 6
	// 拍卖
	GameEventType_AUCTION GameEventType_Enum = 7
	// 结算日, 结算日之后玩家年龄增加
	GameEventType_PAY_DAY GameEventType_Enum = 8
	// 生孩子
	GameEventType_BABY GameEventType_Enum = 9
	// 破产
	GameEventType_BROKE GameEventType_Enum = 10
	// 财富自由
	GameEventType_FREEDOM GameEventType_Enum = 11
	// 游戏结束
	GameEventType_GAME_END GameEventType_Enum = 12
	// 时间到
	GameEventType_GAME_TIMEOUT GameEventType_Enum = 13
	// 意外消费
	GameEventType_ACCIDENT GameEventType_Enum = 14
	// 市场变化
	GameEventType_MARKET_CHANGE GameEventType_Enum = 15
	// 玩家惩罚, 出现该事件后玩家将被轮空
	// 客户端在显示 timeline 时到了该事件后续事件可以不继续处理了
	GameEventType_DISHONORABLE_PUNISH GameEventType_Enum = 16
)

var GameEventType_Enum_name = map[int32]string{
	0:  "UNKNOWN",
	1:  "GAME_START",
	2:  "SELECT_ROLE",
	3:  "BUY",
	4:  "SELL",
	5:  "UNEMPLOYMENT",
	6:  "WAGE_HIKE",
	7:  "AUCTION",
	8:  "PAY_DAY",
	9:  "BABY",
	10: "BROKE",
	11: "FREEDOM",
	12: "GAME_END",
	13: "GAME_TIMEOUT",
	14: "ACCIDENT",
	15: "MARKET_CHANGE",
	16: "DISHONORABLE_PUNISH",
}

var GameEventType_Enum_value = map[string]int32{
	"UNKNOWN":             0,
	"GAME_START":          1,
	"SELECT_ROLE":         2,
	"BUY":                 3,
	"SELL":                4,
	"UNEMPLOYMENT":        5,
	"WAGE_HIKE":           6,
	"AUCTION":             7,
	"PAY_DAY":             8,
	"BABY":                9,
	"BROKE":               10,
	"FREEDOM":             11,
	"GAME_END":            12,
	"GAME_TIMEOUT":        13,
	"ACCIDENT":            14,
	"MARKET_CHANGE":       15,
	"DISHONORABLE_PUNISH": 16,
}

func (x GameEventType_Enum) String() string {
	return proto.EnumName(GameEventType_Enum_name, int32(x))
}

func (GameEventType_Enum) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{0, 0}
}

// 事件的类型: 升职加薪, 事业, 生孩子, 卖出房产, etc.
type GameEventType struct {
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GameEventType) Reset()         { *m = GameEventType{} }
func (m *GameEventType) String() string { return proto.CompactTextString(m) }
func (*GameEventType) ProtoMessage()    {}
func (*GameEventType) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{0}
}

func (m *GameEventType) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GameEventType.Unmarshal(m, b)
}
func (m *GameEventType) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GameEventType.Marshal(b, m, deterministic)
}
func (m *GameEventType) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GameEventType.Merge(m, src)
}
func (m *GameEventType) XXX_Size() int {
	return xxx_messageInfo_GameEventType.Size(m)
}
func (m *GameEventType) XXX_DiscardUnknown() {
	xxx_messageInfo_GameEventType.DiscardUnknown(m)
}

var xxx_messageInfo_GameEventType proto.InternalMessageInfo

// 游戏开始时发布的事件, 暂时只有年龄信息
type EventGameStart struct {
	// 游戏开始时的年龄
	Age                  int32    `protobuf:"varint,1,opt,name=age,proto3" json:"age,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *EventGameStart) Reset()         { *m = EventGameStart{} }
func (m *EventGameStart) String() string { return proto.CompactTextString(m) }
func (*EventGameStart) ProtoMessage()    {}
func (*EventGameStart) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{1}
}

func (m *EventGameStart) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_EventGameStart.Unmarshal(m, b)
}
func (m *EventGameStart) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_EventGameStart.Marshal(b, m, deterministic)
}
func (m *EventGameStart) XXX_Merge(src proto.Message) {
	xxx_messageInfo_EventGameStart.Merge(m, src)
}
func (m *EventGameStart) XXX_Size() int {
	return xxx_messageInfo_EventGameStart.Size(m)
}
func (m *EventGameStart) XXX_DiscardUnknown() {
	xxx_messageInfo_EventGameStart.DiscardUnknown(m)
}

var xxx_messageInfo_EventGameStart proto.InternalMessageInfo

func (m *EventGameStart) GetAge() int32 {
	if m != nil {
		return m.Age
	}
	return 0
}

// 职业名
type Role struct {
	Id                   int64    `protobuf:"varint,1,opt,name=id,proto3" json:"id,omitempty"`
	Flag                 string   `protobuf:"bytes,2,opt,name=flag,proto3" json:"flag,omitempty"`
	Name                 string   `protobuf:"bytes,3,opt,name=name,proto3" json:"name,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Role) Reset()         { *m = Role{} }
func (m *Role) String() string { return proto.CompactTextString(m) }
func (*Role) ProtoMessage()    {}
func (*Role) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{2}
}

func (m *Role) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Role.Unmarshal(m, b)
}
func (m *Role) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Role.Marshal(b, m, deterministic)
}
func (m *Role) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Role.Merge(m, src)
}
func (m *Role) XXX_Size() int {
	return xxx_messageInfo_Role.Size(m)
}
func (m *Role) XXX_DiscardUnknown() {
	xxx_messageInfo_Role.DiscardUnknown(m)
}

var xxx_messageInfo_Role proto.InternalMessageInfo

func (m *Role) GetId() int64 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *Role) GetFlag() string {
	if m != nil {
		return m.Flag
	}
	return ""
}

func (m *Role) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

type EventSelectRole struct {
	// 选择的职业信息
	Role                 *Role    `protobuf:"bytes,1,opt,name=role,proto3" json:"role,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *EventSelectRole) Reset()         { *m = EventSelectRole{} }
func (m *EventSelectRole) String() string { return proto.CompactTextString(m) }
func (*EventSelectRole) ProtoMessage()    {}
func (*EventSelectRole) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{3}
}

func (m *EventSelectRole) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_EventSelectRole.Unmarshal(m, b)
}
func (m *EventSelectRole) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_EventSelectRole.Marshal(b, m, deterministic)
}
func (m *EventSelectRole) XXX_Merge(src proto.Message) {
	xxx_messageInfo_EventSelectRole.Merge(m, src)
}
func (m *EventSelectRole) XXX_Size() int {
	return xxx_messageInfo_EventSelectRole.Size(m)
}
func (m *EventSelectRole) XXX_DiscardUnknown() {
	xxx_messageInfo_EventSelectRole.DiscardUnknown(m)
}

var xxx_messageInfo_EventSelectRole proto.InternalMessageInfo

func (m *EventSelectRole) GetRole() *Role {
	if m != nil {
		return m.Role
	}
	return nil
}

// 资产相关的事件在这里表示
// 购买/ 出售/ 孩子/ 拍卖/ 失业/ 意外支付
type EventAssets struct {
	// 对应资产的 code, 这个 code 在 pb 里面没有定义
	Code string `protobuf:"bytes,1,opt,name=code,proto3" json:"code,omitempty"`
	// 数量, eg. 购买 1000 股 amazon
	Quantity int32 `protobuf:"varint,2,opt,name=quantity,proto3" json:"quantity,omitempty"`
	// 现金收入
	Income int32 `protobuf:"varint,3,opt,name=income,proto3" json:"income,omitempty"`
	// 现金支出, eg. 购入 2室一厅 支出 5万
	Expense int32 `protobuf:"varint,4,opt,name=expense,proto3" json:"expense,omitempty"`
	// 售出资产的利润, eg. 售出 3室两厅获利 30 万
	Profit int32 `protobuf:"varint,5,opt,name=profit,proto3" json:"profit,omitempty"`
	// 主要是资产操作时对应的资产名
	Remark string `protobuf:"bytes,6,opt,name=remark,proto3" json:"remark,omitempty"`
	// 资产总价
	TotalPrice int32 `protobuf:"varint,7,opt,name=totalPrice,proto3" json:"totalPrice,omitempty"`
	// 买入/ 出售/ 拍卖时对应的 scenario
	Scenario *common.Scenario `protobuf:"bytes,8,opt,name=scenario,proto3" json:"scenario,omitempty"`
	// 买入和卖出时对应的 Asset, 卖出时包含有 卖出价格/数量/利润
	Asset *common.PlayerAsset `protobuf:"bytes,9,opt,name=asset,proto3" json:"asset,omitempty"`
	// 对应的月现金流变化, > 0 收入/ < 0 支出
	// eg. 生孩子月支出
	MonthCashFlow        int32    `protobuf:"varint,10,opt,name=monthCashFlow,proto3" json:"monthCashFlow,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *EventAssets) Reset()         { *m = EventAssets{} }
func (m *EventAssets) String() string { return proto.CompactTextString(m) }
func (*EventAssets) ProtoMessage()    {}
func (*EventAssets) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{4}
}

func (m *EventAssets) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_EventAssets.Unmarshal(m, b)
}
func (m *EventAssets) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_EventAssets.Marshal(b, m, deterministic)
}
func (m *EventAssets) XXX_Merge(src proto.Message) {
	xxx_messageInfo_EventAssets.Merge(m, src)
}
func (m *EventAssets) XXX_Size() int {
	return xxx_messageInfo_EventAssets.Size(m)
}
func (m *EventAssets) XXX_DiscardUnknown() {
	xxx_messageInfo_EventAssets.DiscardUnknown(m)
}

var xxx_messageInfo_EventAssets proto.InternalMessageInfo

func (m *EventAssets) GetCode() string {
	if m != nil {
		return m.Code
	}
	return ""
}

func (m *EventAssets) GetQuantity() int32 {
	if m != nil {
		return m.Quantity
	}
	return 0
}

func (m *EventAssets) GetIncome() int32 {
	if m != nil {
		return m.Income
	}
	return 0
}

func (m *EventAssets) GetExpense() int32 {
	if m != nil {
		return m.Expense
	}
	return 0
}

func (m *EventAssets) GetProfit() int32 {
	if m != nil {
		return m.Profit
	}
	return 0
}

func (m *EventAssets) GetRemark() string {
	if m != nil {
		return m.Remark
	}
	return ""
}

func (m *EventAssets) GetTotalPrice() int32 {
	if m != nil {
		return m.TotalPrice
	}
	return 0
}

func (m *EventAssets) GetScenario() *common.Scenario {
	if m != nil {
		return m.Scenario
	}
	return nil
}

func (m *EventAssets) GetAsset() *common.PlayerAsset {
	if m != nil {
		return m.Asset
	}
	return nil
}

func (m *EventAssets) GetMonthCashFlow() int32 {
	if m != nil {
		return m.MonthCashFlow
	}
	return 0
}

// 结算日事件
type EventSalary struct {
	// 对应资产的 code, 这个 code 在 pb 里面没有定义
	Code string `protobuf:"bytes,1,opt,name=code,proto3" json:"code,omitempty"`
	// 结算日的工资, 这个值 只是 role.Salary, 不包含现金流结算
	Salary int32 `protobuf:"varint,2,opt,name=salary,proto3" json:"salary,omitempty"`
	// 现金流的结算后的收入, > 0 现金流收入, < 0 支出
	CashFlow int32 `protobuf:"varint,3,opt,name=cash_flow,json=cashFlow,proto3" json:"cash_flow,omitempty"`
	// 结算日之后的年龄
	Age                  int32    `protobuf:"varint,4,opt,name=age,proto3" json:"age,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *EventSalary) Reset()         { *m = EventSalary{} }
func (m *EventSalary) String() string { return proto.CompactTextString(m) }
func (*EventSalary) ProtoMessage()    {}
func (*EventSalary) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{5}
}

func (m *EventSalary) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_EventSalary.Unmarshal(m, b)
}
func (m *EventSalary) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_EventSalary.Marshal(b, m, deterministic)
}
func (m *EventSalary) XXX_Merge(src proto.Message) {
	xxx_messageInfo_EventSalary.Merge(m, src)
}
func (m *EventSalary) XXX_Size() int {
	return xxx_messageInfo_EventSalary.Size(m)
}
func (m *EventSalary) XXX_DiscardUnknown() {
	xxx_messageInfo_EventSalary.DiscardUnknown(m)
}

var xxx_messageInfo_EventSalary proto.InternalMessageInfo

func (m *EventSalary) GetCode() string {
	if m != nil {
		return m.Code
	}
	return ""
}

func (m *EventSalary) GetSalary() int32 {
	if m != nil {
		return m.Salary
	}
	return 0
}

func (m *EventSalary) GetCashFlow() int32 {
	if m != nil {
		return m.CashFlow
	}
	return 0
}

func (m *EventSalary) GetAge() int32 {
	if m != nil {
		return m.Age
	}
	return 0
}

// 升职加薪事件
type EventWageHike struct {
	// 月薪增加
	Increment int32 `protobuf:"varint,1,opt,name=increment,proto3" json:"increment,omitempty"`
	// 升职加薪后的职业
	Role                 *Role    `protobuf:"bytes,2,opt,name=role,proto3" json:"role,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *EventWageHike) Reset()         { *m = EventWageHike{} }
func (m *EventWageHike) String() string { return proto.CompactTextString(m) }
func (*EventWageHike) ProtoMessage()    {}
func (*EventWageHike) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{6}
}

func (m *EventWageHike) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_EventWageHike.Unmarshal(m, b)
}
func (m *EventWageHike) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_EventWageHike.Marshal(b, m, deterministic)
}
func (m *EventWageHike) XXX_Merge(src proto.Message) {
	xxx_messageInfo_EventWageHike.Merge(m, src)
}
func (m *EventWageHike) XXX_Size() int {
	return xxx_messageInfo_EventWageHike.Size(m)
}
func (m *EventWageHike) XXX_DiscardUnknown() {
	xxx_messageInfo_EventWageHike.DiscardUnknown(m)
}

var xxx_messageInfo_EventWageHike proto.InternalMessageInfo

func (m *EventWageHike) GetIncrement() int32 {
	if m != nil {
		return m.Increment
	}
	return 0
}

func (m *EventWageHike) GetRole() *Role {
	if m != nil {
		return m.Role
	}
	return nil
}

// 玩家在游戏中的事件会发送到 Nats
type GameEvent struct {
	// 游戏 ID
	GameID int64 `protobuf:"varint,1,opt,name=gameID,proto3" json:"gameID,omitempty"`
	// 事件发生时间
	Timestamp *timestamp.Timestamp `protobuf:"bytes,2,opt,name=timestamp,proto3" json:"timestamp,omitempty"`
	// 事件类型
	Type GameEventType_Enum `protobuf:"varint,3,opt,name=Type,proto3,enum=pb.events.GameEventType_Enum" json:"Type,omitempty"`
	// 对应玩家的 user.hide_id
	UserID int64 `protobuf:"varint,4,opt,name=userID,proto3" json:"userID,omitempty"`
	// 事件内容, 有时候可能一个事件里面包含了多个内容, 比如一次卖出多套房产的时候可能需要当作一个事件来处理
	// 如果是游戏结束的事件(broke/freedom/gameEnd) details 可能为空
	Details              []*any.Any `protobuf:"bytes,5,rep,name=details,proto3" json:"details,omitempty"`
	XXX_NoUnkeyedLiteral struct{}   `json:"-"`
	XXX_unrecognized     []byte     `json:"-"`
	XXX_sizecache        int32      `json:"-"`
}

func (m *GameEvent) Reset()         { *m = GameEvent{} }
func (m *GameEvent) String() string { return proto.CompactTextString(m) }
func (*GameEvent) ProtoMessage()    {}
func (*GameEvent) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{7}
}

func (m *GameEvent) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GameEvent.Unmarshal(m, b)
}
func (m *GameEvent) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GameEvent.Marshal(b, m, deterministic)
}
func (m *GameEvent) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GameEvent.Merge(m, src)
}
func (m *GameEvent) XXX_Size() int {
	return xxx_messageInfo_GameEvent.Size(m)
}
func (m *GameEvent) XXX_DiscardUnknown() {
	xxx_messageInfo_GameEvent.DiscardUnknown(m)
}

var xxx_messageInfo_GameEvent proto.InternalMessageInfo

func (m *GameEvent) GetGameID() int64 {
	if m != nil {
		return m.GameID
	}
	return 0
}

func (m *GameEvent) GetTimestamp() *timestamp.Timestamp {
	if m != nil {
		return m.Timestamp
	}
	return nil
}

func (m *GameEvent) GetType() GameEventType_Enum {
	if m != nil {
		return m.Type
	}
	return GameEventType_UNKNOWN
}

func (m *GameEvent) GetUserID() int64 {
	if m != nil {
		return m.UserID
	}
	return 0
}

func (m *GameEvent) GetDetails() []*any.Any {
	if m != nil {
		return m.Details
	}
	return nil
}

type EventMarketChange struct {
	// 表示对应的市场变化类型
	ChangeType common.MarketChangeType_Enum `protobuf:"varint,1,opt,name=changeType,proto3,enum=pb.common.MarketChangeType_Enum" json:"changeType,omitempty"`
	// 收入变化，正增负减
	IncomeChange int32 `protobuf:"varint,2,opt,name=incomeChange,proto3" json:"incomeChange,omitempty"`
	// 资产变化，正加负减
	AssetChange          int32    `protobuf:"varint,3,opt,name=assetChange,proto3" json:"assetChange,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *EventMarketChange) Reset()         { *m = EventMarketChange{} }
func (m *EventMarketChange) String() string { return proto.CompactTextString(m) }
func (*EventMarketChange) ProtoMessage()    {}
func (*EventMarketChange) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{8}
}

func (m *EventMarketChange) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_EventMarketChange.Unmarshal(m, b)
}
func (m *EventMarketChange) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_EventMarketChange.Marshal(b, m, deterministic)
}
func (m *EventMarketChange) XXX_Merge(src proto.Message) {
	xxx_messageInfo_EventMarketChange.Merge(m, src)
}
func (m *EventMarketChange) XXX_Size() int {
	return xxx_messageInfo_EventMarketChange.Size(m)
}
func (m *EventMarketChange) XXX_DiscardUnknown() {
	xxx_messageInfo_EventMarketChange.DiscardUnknown(m)
}

var xxx_messageInfo_EventMarketChange proto.InternalMessageInfo

func (m *EventMarketChange) GetChangeType() common.MarketChangeType_Enum {
	if m != nil {
		return m.ChangeType
	}
	return common.MarketChangeType_UNKNOWN
}

func (m *EventMarketChange) GetIncomeChange() int32 {
	if m != nil {
		return m.IncomeChange
	}
	return 0
}

func (m *EventMarketChange) GetAssetChange() int32 {
	if m != nil {
		return m.AssetChange
	}
	return 0
}

type Dishonorable struct {
	// 惩罚原因
	Reason               common.DishonorablePunishReason_Enum `protobuf:"varint,1,opt,name=Reason,proto3,enum=pb.common.DishonorablePunishReason_Enum" json:"Reason,omitempty"`
	XXX_NoUnkeyedLiteral struct{}                             `json:"-"`
	XXX_unrecognized     []byte                               `json:"-"`
	XXX_sizecache        int32                                `json:"-"`
}

func (m *Dishonorable) Reset()         { *m = Dishonorable{} }
func (m *Dishonorable) String() string { return proto.CompactTextString(m) }
func (*Dishonorable) ProtoMessage()    {}
func (*Dishonorable) Descriptor() ([]byte, []int) {
	return fileDescriptor_550c362c9ec729ea, []int{9}
}

func (m *Dishonorable) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Dishonorable.Unmarshal(m, b)
}
func (m *Dishonorable) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Dishonorable.Marshal(b, m, deterministic)
}
func (m *Dishonorable) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Dishonorable.Merge(m, src)
}
func (m *Dishonorable) XXX_Size() int {
	return xxx_messageInfo_Dishonorable.Size(m)
}
func (m *Dishonorable) XXX_DiscardUnknown() {
	xxx_messageInfo_Dishonorable.DiscardUnknown(m)
}

var xxx_messageInfo_Dishonorable proto.InternalMessageInfo

func (m *Dishonorable) GetReason() common.DishonorablePunishReason_Enum {
	if m != nil {
		return m.Reason
	}
	return common.DishonorablePunishReason_Unknown
}

func init() {
	proto.RegisterEnum("pb.events.GameEventType_Enum", GameEventType_Enum_name, GameEventType_Enum_value)
	proto.RegisterType((*GameEventType)(nil), "pb.events.GameEventType")
	proto.RegisterType((*EventGameStart)(nil), "pb.events.EventGameStart")
	proto.RegisterType((*Role)(nil), "pb.events.Role")
	proto.RegisterType((*EventSelectRole)(nil), "pb.events.EventSelectRole")
	proto.RegisterType((*EventAssets)(nil), "pb.events.EventAssets")
	proto.RegisterType((*EventSalary)(nil), "pb.events.EventSalary")
	proto.RegisterType((*EventWageHike)(nil), "pb.events.EventWageHike")
	proto.RegisterType((*GameEvent)(nil), "pb.events.GameEvent")
	proto.RegisterType((*EventMarketChange)(nil), "pb.events.EventMarketChange")
	proto.RegisterType((*Dishonorable)(nil), "pb.events.Dishonorable")
}

func init() { proto.RegisterFile("events/game.proto", fileDescriptor_550c362c9ec729ea) }

var fileDescriptor_550c362c9ec729ea = []byte{
	// 902 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x7c, 0x54, 0xdd, 0x6e, 0xf3, 0x44,
	0x10, 0x25, 0xff, 0xf1, 0xe4, 0xa7, 0xee, 0x7e, 0x1f, 0xc5, 0x94, 0xbf, 0xc8, 0x20, 0x94, 0x0b,
	0x70, 0x44, 0x91, 0x10, 0x57, 0x08, 0x27, 0xf1, 0xd7, 0x44, 0x4d, 0x9c, 0x68, 0xe3, 0xa8, 0x0a,
	0x37, 0xd1, 0xc6, 0xdd, 0x3a, 0x56, 0x6d, 0x6f, 0xb0, 0x37, 0x85, 0xbc, 0x05, 0xf7, 0xbc, 0x0e,
	0x0f, 0xc1, 0xd3, 0x20, 0xb4, 0xeb, 0x4d, 0x9a, 0x02, 0xe2, 0x6e, 0xe7, 0xcc, 0x99, 0x9d, 0xb3,
	0xe3, 0xe3, 0x81, 0x4b, 0xfa, 0x4c, 0x13, 0x9e, 0xf5, 0x02, 0x12, 0x53, 0x6b, 0x97, 0x32, 0xce,
	0x90, 0xb6, 0xdb, 0x58, 0x39, 0x7a, 0xfd, 0xd6, 0x67, 0x71, 0xcc, 0x92, 0x5e, 0x4c, 0xb3, 0x8c,
	0x04, 0x8a, 0x70, 0xfd, 0xbe, 0x42, 0x33, 0x9f, 0x26, 0x24, 0x0d, 0x99, 0x82, 0x0d, 0x05, 0x8b,
	0xab, 0xd6, 0x3e, 0x4b, 0x32, 0x9e, 0xa9, 0xcc, 0x67, 0x01, 0x63, 0x41, 0x44, 0x7b, 0x32, 0xda,
	0xec, 0x1f, 0x7b, 0x3c, 0x8c, 0x69, 0xc6, 0x49, 0xbc, 0x53, 0x84, 0x0f, 0xff, 0x49, 0x20, 0xc9,
	0x21, 0x4f, 0x99, 0xbf, 0x15, 0xa1, 0x75, 0x4b, 0x62, 0xea, 0x08, 0x45, 0xde, 0x61, 0x47, 0xcd,
	0xbf, 0x0a, 0x50, 0x76, 0x92, 0x7d, 0x8c, 0x1a, 0x50, 0x5b, 0xba, 0x77, 0xee, 0xec, 0xde, 0xd5,
	0xdf, 0x43, 0x6d, 0x80, 0x5b, 0x7b, 0xea, 0xac, 0x17, 0x9e, 0x8d, 0x3d, 0xbd, 0x80, 0x2e, 0xa0,
	0xb1, 0x70, 0x26, 0xce, 0xc0, 0x5b, 0xe3, 0xd9, 0xc4, 0xd1, 0x8b, 0xa8, 0x06, 0xa5, 0xfe, 0x72,
	0xa5, 0x97, 0x50, 0x1d, 0xca, 0x0b, 0x67, 0x32, 0xd1, 0xcb, 0x48, 0x87, 0xe6, 0xd2, 0x75, 0xa6,
	0xf3, 0xc9, 0x6c, 0x35, 0x75, 0x5c, 0x4f, 0xaf, 0xa0, 0x16, 0x68, 0xf7, 0xf6, 0xad, 0xb3, 0x1e,
	0x8d, 0xef, 0x1c, 0xbd, 0x2a, 0x3a, 0xd8, 0xcb, 0x81, 0x37, 0x9e, 0xb9, 0x7a, 0x4d, 0x04, 0x73,
	0x7b, 0xb5, 0x1e, 0xda, 0x2b, 0xbd, 0x2e, 0x2e, 0xe9, 0xdb, 0xfd, 0x95, 0xae, 0x21, 0x0d, 0x2a,
	0x7d, 0x3c, 0xbb, 0x73, 0x74, 0x10, 0x8c, 0x77, 0xd8, 0x71, 0x86, 0xb3, 0xa9, 0xde, 0x40, 0x4d,
	0xa8, 0x4b, 0x41, 0x8e, 0x3b, 0xd4, 0x9b, 0xa2, 0x95, 0x8c, 0xbc, 0xf1, 0xd4, 0x99, 0x2d, 0x3d,
	0xbd, 0x25, 0xf2, 0xf6, 0x60, 0x30, 0x1e, 0x8a, 0xc6, 0x6d, 0x74, 0x09, 0xad, 0xa9, 0x8d, 0xef,
	0x1c, 0x6f, 0x3d, 0x18, 0xd9, 0xee, 0xad, 0xa3, 0x5f, 0xa0, 0x0f, 0xe0, 0xcd, 0x70, 0xbc, 0x18,
	0xcd, 0xdc, 0x19, 0xb6, 0xfb, 0x13, 0x67, 0x3d, 0x5f, 0xba, 0xe3, 0xc5, 0x48, 0xd7, 0x4d, 0x13,
	0xda, 0x72, 0x1a, 0x62, 0x2c, 0x0b, 0x4e, 0x52, 0x8e, 0x74, 0x28, 0x91, 0x80, 0x1a, 0x85, 0x4e,
	0xa1, 0x5b, 0xc1, 0xe2, 0x68, 0xfe, 0x00, 0x65, 0xcc, 0x22, 0x8a, 0xda, 0x50, 0x0c, 0x1f, 0x64,
	0xa2, 0x84, 0x8b, 0xe1, 0x03, 0x42, 0x50, 0x7e, 0x8c, 0x48, 0x60, 0x14, 0x3b, 0x85, 0xae, 0x86,
	0xe5, 0x59, 0x60, 0x09, 0x89, 0xa9, 0x51, 0xca, 0x31, 0x71, 0x36, 0xbf, 0x83, 0x0b, 0xd9, 0x63,
	0x41, 0x23, 0xea, 0x73, 0x79, 0xd5, 0xe7, 0x50, 0x4e, 0x59, 0x94, 0x77, 0x69, 0xdc, 0x5c, 0x58,
	0x27, 0x9b, 0x58, 0x22, 0x8d, 0x65, 0xd2, 0xfc, 0xa3, 0x08, 0x0d, 0x59, 0x68, 0x67, 0x19, 0xe5,
	0x99, 0xb8, 0xdb, 0x67, 0x0f, 0x79, 0x91, 0x86, 0xe5, 0x19, 0x5d, 0x43, 0xfd, 0xe7, 0x3d, 0x49,
	0x78, 0xc8, 0x0f, 0x52, 0x47, 0x05, 0x9f, 0x62, 0x74, 0x05, 0xd5, 0x30, 0xf1, 0x99, 0x52, 0x53,
	0xc1, 0x2a, 0x42, 0x06, 0xd4, 0xe8, 0xaf, 0x3b, 0x9a, 0x64, 0xd4, 0x28, 0xcb, 0xc4, 0x31, 0x14,
	0x15, 0xbb, 0x94, 0x3d, 0x86, 0xdc, 0xa8, 0xe4, 0x15, 0x79, 0x24, 0xf0, 0x94, 0xc6, 0x24, 0x7d,
	0x32, 0xaa, 0xb2, 0xb7, 0x8a, 0xd0, 0xa7, 0x00, 0x9c, 0x71, 0x12, 0xcd, 0xd3, 0xd0, 0xa7, 0x46,
	0x4d, 0xd6, 0x9c, 0x21, 0xa8, 0x07, 0xf5, 0xa3, 0xb1, 0x8d, 0xba, 0x7c, 0xea, 0x1b, 0xf1, 0xd4,
	0xdc, 0xdc, 0xd6, 0x42, 0xa5, 0xf0, 0x89, 0x84, 0xbe, 0x82, 0x0a, 0x11, 0x8f, 0x35, 0x34, 0xc9,
	0xbe, 0x3a, 0x63, 0xcf, 0x23, 0x72, 0xa0, 0xa9, 0x1c, 0x05, 0xce, 0x49, 0xe8, 0x0b, 0x68, 0xc5,
	0x2c, 0xe1, 0xdb, 0x01, 0xc9, 0xb6, 0xef, 0x22, 0xf6, 0x8b, 0x01, 0x52, 0xc1, 0x6b, 0xd0, 0xdc,
	0xaa, 0x29, 0x2e, 0x48, 0x44, 0xd2, 0xc3, 0x7f, 0x4e, 0xf1, 0x0a, 0xaa, 0x99, 0xcc, 0xaa, 0x19,
	0xaa, 0x08, 0x7d, 0x04, 0x9a, 0x4f, 0xb2, 0xed, 0xfa, 0x51, 0x5c, 0x9e, 0x0f, 0xb1, 0xee, 0xab,
	0x7b, 0x8f, 0x46, 0x29, 0xbf, 0x18, 0x05, 0x43, 0x4b, 0x76, 0xba, 0x27, 0x01, 0x1d, 0x85, 0x4f,
	0x14, 0x7d, 0x0c, 0x5a, 0x98, 0xf8, 0x29, 0x8d, 0x69, 0xc2, 0x95, 0xa3, 0x5e, 0x80, 0x93, 0x09,
	0x8a, 0xff, 0x67, 0x82, 0x3f, 0x0b, 0xa0, 0x9d, 0xfe, 0x59, 0x21, 0x54, 0xac, 0x84, 0xf1, 0x50,
	0xd9, 0x50, 0x45, 0xe8, 0x7b, 0xd0, 0x4e, 0x7b, 0x40, 0xdd, 0x77, 0x6d, 0xe5, 0x8b, 0xc0, 0x3a,
	0x2e, 0x02, 0xcb, 0x3b, 0x32, 0xf0, 0x0b, 0x19, 0x7d, 0x03, 0x65, 0xb1, 0x09, 0xe4, 0xeb, 0xda,
	0x37, 0x9f, 0x9c, 0x89, 0x78, 0xb5, 0x29, 0x2c, 0xb1, 0x25, 0xb0, 0xa4, 0x0a, 0x11, 0xfb, 0x8c,
	0xa6, 0xe3, 0xa1, 0x7c, 0x7b, 0x09, 0xab, 0x08, 0x59, 0x50, 0x7b, 0xa0, 0x9c, 0x84, 0x51, 0x66,
	0x54, 0x3a, 0xa5, 0x6e, 0xe3, 0xe6, 0xed, 0xbf, 0x24, 0xd8, 0xc9, 0x01, 0x1f, 0x49, 0xe6, 0xef,
	0x05, 0xb8, 0x94, 0x0d, 0xa6, 0x24, 0x7d, 0xa2, 0x7c, 0xb0, 0x25, 0x49, 0x40, 0xd1, 0x8f, 0x00,
	0xbe, 0x3c, 0x49, 0x59, 0x05, 0x29, 0xab, 0x73, 0xe6, 0x83, 0x73, 0xf2, 0x8b, 0xb2, 0xb3, 0x1a,
	0x64, 0x42, 0x33, 0x77, 0x7a, 0x4e, 0x52, 0xdf, 0xf4, 0x15, 0x86, 0x3a, 0xd0, 0x90, 0x1e, 0x52,
	0x94, 0xfc, 0xdb, 0x9e, 0x43, 0xe6, 0x1c, 0x9a, 0xc3, 0x30, 0xdb, 0xb2, 0x84, 0xa5, 0x64, 0x13,
	0x09, 0x5d, 0x55, 0x4c, 0x49, 0xc6, 0x12, 0xa5, 0xa9, 0x7b, 0xa6, 0xe9, 0x9c, 0x38, 0xdf, 0x27,
	0x61, 0xb6, 0xcd, 0xa9, 0xb9, 0x36, 0x55, 0xd7, 0xef, 0xfe, 0xf4, 0x65, 0x10, 0xf2, 0x88, 0xc8,
	0xb2, 0xde, 0x33, 0xf5, 0x39, 0x4b, 0xf7, 0xbb, 0x9e, 0x6c, 0xfa, 0xf5, 0x6e, 0xd3, 0x0b, 0x58,
	0x2f, 0x1f, 0xfd, 0xa6, 0x2a, 0x07, 0xf6, 0xed, 0xdf, 0x01, 0x00, 0x00, 0xff, 0xff, 0x3c, 0xd5,
	0x39, 0x7e, 0x52, 0x06, 0x00, 0x00,
}
