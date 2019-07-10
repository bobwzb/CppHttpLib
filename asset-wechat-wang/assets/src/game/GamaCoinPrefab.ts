import { pb } from "../asset.pb";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamaCoinPrefab extends cc.Component {
	@property(cc.Label)
	incomeNum: cc.Label = null;

	@property(cc.Label)
	expenseNum: cc.Label = null;

	@property(cc.Label)
	cashNum: cc.Label = null;

	@property(cc.Label)
	numSettlement: cc.Label = null;

	onLoad() {}

	setData(data: pb.common.IGamePlayer) {
		console.log(data, "------------------------------------>setData");
		let incomeNum = data.playerGameData.cashFlow.monthlyIncomeExSalary.add(
			data.playerGameData.cashFlow.monthlySalary
		);
		this.incomeNum.string = incomeNum.toString();
		this.expenseNum.string = data.playerGameData.cashFlow.monthlyExpenses.toString();
		this.cashNum.string = data.playerGameData.cashFlow.monthlyCashFlow.toString();
		let numSettlement = data.playerGameData.cashFlow.monthlyCashFlow.multiply(
			24
		);
		this.numSettlement.string = numSettlement;
	}

	onBtOk() {
		console.log("------------->onBtOk");
		this.node.active = false;
		RemoteAudio.playEffect(SoundName.SELL);
	}

	onDestroy() {}
}
