import { pb } from "../asset.pb";
import C2S from "../netWork/socket/C2S";

const { ccclass, property } = cc._decorator;

@ccclass
export default class broke extends cc.Component {
	@property(cc.Label)
	payNum: cc.Label = null;

	@property(cc.Label)
	myAssetNum: cc.Label = null;

	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Label)
	loanNum: cc.Label = null;

	@property(cc.Label)
	accountsNum: cc.Label = null;

	@property(cc.Label)
	accountsTxt: cc.Label = null;

	@property(cc.Button)
	btOk: cc.Button = null;

	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
		this.node.opacity = 255;
	}

	setData(data: any, isCashFlow: boolean) {
		console.log(data, isCashFlow, "------------------>broke");
		if (isCashFlow) {
			let msg: pb.common.RollMsg.ISalaryInfo = data;
			this.payNum.string = "¥" + msg.salary;
			this.myAssetNum.string = "¥" + (msg.cash + msg.loanQuota);
			this.moneyNum.string = "¥" + msg.cash;
			this.loanNum.string = "¥" + msg.loanQuota;
			this.accountsTxt.string = "年度结账";
			this.accountsNum.string = "-¥" + msg.salary;
		} else {
			let msg: pb.common.PlayerOutMsg = data;
			this.payNum.string = "¥" + msg.expense;
			this.myAssetNum.string = "¥" + (msg.cash + msg.loanQuota);
			this.moneyNum.string = "¥" + msg.cash;
			this.loanNum.string = "¥" + msg.loanQuota;
			this.accountsTxt.string = msg.reason;
			this.accountsNum.string = "-¥" + msg.expense;
			this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeOut(0.3)));
		}

		this.btOk.node.active = isCashFlow;
		this.btOk.node.on("click", this.onBtOk, this);
	}

	onBtOk() {
		this.hide();
		C2S.ConfirmBankruptReq();
	}

	onDestroy() {}
}
