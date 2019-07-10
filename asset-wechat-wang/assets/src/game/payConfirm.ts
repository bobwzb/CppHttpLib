import gameScene from "./gameScene";
import C2S from "../netWork/socket/C2S";
import { EventType } from "../lib/GameEvent";
import cardCtrl from "./cardCtrl";
import StringUtils from "../until/StringUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class payConfirm extends cc.Component {
	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Label)
	payTxt: cc.Label = null;

	@property(cc.Label)
	shopNameTxt: cc.Label = null;

	@property(cc.Sprite)
	titleImg: cc.Sprite = null;

	@property(cc.Node)
	payIng: cc.Node = null;

	@property(cc.Node)
	paySucess: cc.Node = null;

	@property(cc.Button)
	btKnow: cc.Button = null;

	data: any;
	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
		this.paySucess
			.getChildByName("blueLoading")
			.getComponent(cc.Animation)
			.setCurrentTime(0);
	}

	clearData() {
		this.data = null;
	}

	setData(data: any) {
		if (data.isPayIng) {
			cardCtrl.cardNodes[cardCtrl.cardNodes.length - 1].active = false;
			cardCtrl.cardNodes.push(this.node);
		}
		this.clearData();
		this.data = data;
		let self = this;

		this.payIng.active = data.isPayIng;
		this.paySucess.active = !data.isPayIng;

		if (!data.isPayIng) {
			let anim = this.paySucess
				.getChildByName("blueLoading")
				.getComponent(cc.Animation);
			anim.play("blueLoading");
		}

		this.btKnow.node.on("click", this.onBtKnow, this);
		this.btKnow.node.active = data.isPayIng;
		if (data.isPayIng) {
			this.moneyNum.string = "¥" + StringUtils.ConvertInt2(data.num);
			this.payTxt.string = "现金";
			this.shopNameTxt.string = data.shopNameTxt;
		}
	}

	onBtBack(evt: any) {
		this.hide();
		cardCtrl.cardNodes.pop();
		cardCtrl.cardNodes[cardCtrl.cardNodes.length - 1].active = true;
	}

	onBtKnow() {
		if (this.data.type == EventType.GAME_SHOW_ACCIDENT_PAY_CONFIRM) {
			C2S.PayAccidentConsumeReq();
		} else if (this.data.type == EventType.GAME_SHOW_PAY_CONFIRM) {
			C2S.BuyReq(this.data.payCount);
		}
	}

	onDestroy() {
		this.clearData();
	}
}
