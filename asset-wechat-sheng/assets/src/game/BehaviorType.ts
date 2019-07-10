export enum BehaviorType {
	B_PB_FIRST_MUST_ZORE = 0,
	B_INIT = 1, // 初始化
	B_CHOOSE_ROLE = 2,
	B_ROLL = 3, // 扔骰子
	B_PAYDAY = 4,
	B_CHOICE_CHANCE = 5, // 选择机会(大买卖/小生意)

	B_BUY = 6, // 买
	B_SELL = 7, // 卖
	B_TRADE = 8, // 股票交易
	B_LOAN = 9, // 贷款
	B_REPAY_LOAN = 10, // 还贷款
	B_STOCK_TRANSACTION = 11, // 股票交易

	B_BABY = 12, // 生小孩
	B_RED_PACKET = 13, // 生小孩发红包

	B_ACCIDENT = 14, // 意外花费

	B_UNEMPLOYMENT = 15, // 失业
	B_WAGE_HIKE = 16 // 加薪
}
