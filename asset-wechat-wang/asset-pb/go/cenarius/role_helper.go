package cenarius

import (
	"gitlab.com/vectorup/asset-pb/go/common"
)

const PCT_VALUE = 100.0

func (r *Role) TotalIncome() int64 {
	// 总收入
	return r.Salary
}

func (r *Role) InsuranceAndHousingFund() int64 {
	// 五险一金
	return r.XInsuranceAndHousingFund
}

func (r *Role) HouseExpense() int64 {
	//住房月供/房租
	return r.XHouseExpense
}

func (r *Role) CarExpense() int64 {
	// 汽车花费
	return r.XCarExpense
}

func (r *Role) CreditCardExpense() int64 {
	// 信用卡花费
	return r.XCreditCardExpense
}

func (r *Role) LifeExpense() int64 {
	// 生活开支
	return r.Expense
}

func (r *Role) BorrowMoneyExpense() int64 {
	// 借贷花费
	return r.XBorrowMoneyExpense
}

func (r *Role) BabyExpense() int64 {
	// 孩子花费 / 每个
	return r.XBabyExpense
}

func (r *Role) BankLoanExpense() int64 {
	// 银行贷款利率
	return r.XBankLoanExpense
}

func (r *Role) TotalExpense() int64 {
	// 总花费
	return r.InsuranceAndHousingFund() +
		r.HouseExpense() +
		r.CarExpense() +
		r.CreditCardExpense() +
		r.LifeExpense() +
		r.BorrowMoneyExpense() +
		r.BankLoanExpense()
}

func CovertRoleToGetRolesRspRole(role Role) common.GetRolesRsp_Role {
	return common.GetRolesRsp_Role{
		ID:           role.ID,
		Name:         role.Name,
		MonthExpense: int32(role.TotalExpense()),
		MonthSalary:  int32(role.Salary),
		MonthFlow:    int32(role.TotalIncome() - role.TotalExpense()),
		Deposit:      int32(role.TotalIncome() - role.TotalExpense()),
		BabyExpense:  int32(role.BabyExpense()),
		WageHikePCT:  role.WageHikePCT,
		Avatar:       role.GetAvatar(),
		Free:         role.Free,
		Purchased:    false, // 是否已经购买调用放自己覆盖
		Flag:         role.GetFlag(),
	}
}

// 升职加薪,
func (r *Role) ToNextPosition(current string) (next string) {
	if current == "" {
		current = r.Name
	}

	var i int
	promotions := r.GetPromotions()
	for i = 0; i < len(promotions); i++ {
		if promotions[i] == current {
			break
		}
	}

	if n := i + 1; n < len(promotions) {
		return promotions[n]
	}

	return current
}
