const { ccclass, property } = cc._decorator;

@ccclass
export default class detailsShow extends cc.Component {
	@property(cc.Label)
	incomeLabel: cc.Label = null;

	@property(cc.Label)
	expenseLabel: cc.Label = null;

	@property(cc.Label)
	cashLabel: cc.Label = null;

	@property(cc.Label)
	salaryLabel: cc.Label = null;

	tag: number = null;
	data: any;

	onLoad() {}

	getData(data: any) {
		this.data = data;

		this.incomeLabel.string = "¥" + this.data.total_income;
		this.expenseLabel.string = "¥" + this.data.total_expense;
		this.cashLabel.string =
			"¥" + (this.data.total_income - this.data.total_expense);
		this.salaryLabel.string = "¥" + this.data.salary;

		this.node.getChildByName("detailbg2num").getComponent(cc.Label).string =
			"¥" + this.data.house_loan;
		this.node.getChildByName("detailbg2num1").getComponent(cc.Label).string =
			"¥" + this.data.car_loan;
		this.node.getChildByName("detailbg2num2").getComponent(cc.Label).string =
			"¥" + this.data.credit_card;
		this.node.getChildByName("detailbg2num3").getComponent(cc.Label).string =
			"¥" + this.data.borrow_money;

		this.node.getChildByName("detailbg3num").getComponent(cc.Label).string =
			"¥" + this.data.insurance_and_housing_fund;
		this.node.getChildByName("detailbg3num1").getComponent(cc.Label).string =
			"¥" + this.data.house_expense;
		this.node.getChildByName("detailbg3num2").getComponent(cc.Label).string =
			"¥" + this.data.car_expense;
		this.node.getChildByName("detailbg3num3").getComponent(cc.Label).string =
			"¥" + this.data.credit_card_expense;
		this.node.getChildByName("detailbg3num4").getComponent(cc.Label).string =
			"¥" + this.data.life_expense;
		this.node.getChildByName("detailbg3num5").getComponent(cc.Label).string =
			"¥" + this.data.borrow_money_expense;
		this.node.getChildByName("detailbg3num6").getComponent(cc.Label).string =
			"¥" + this.data.baby_expense;
	}
}
