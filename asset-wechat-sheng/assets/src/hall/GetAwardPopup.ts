import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import WxHttpControl from "../netWork/http/WxHttpControl";
import { GameEvent, EventType } from "../lib/GameEvent";
import Tips from "../until/Tips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GetAwardPopup extends Popup {
	@property([cc.Sprite])
	coinView: cc.Sprite[] = [];

	@property([cc.Label])
	cionNum: cc.Label[] = [];

	data: any;
	onLoad() {
		super.onLoad();
	}

	public setData(data: any) {
		this.data = data;
		console.log(this.data, "----------------->");
		for (let i = 0; i < 2; i++) {
			this.coinView[i].node.active = false;
			if (this.data[i]) {
				this.coinView[this.data[i].type - 1].node.active = true;
				this.cionNum[this.data[i].type - 1].string =
					"+" + this.data[this.data[i].type - 1].value;
				if (this.data.length < 2) {
					this.coinView[this.data[i].type - 1].node.setPosition(0, 11);
				}
			}
		}
	}

	onBtnOk() {
		this.hide();
	}

	onDestroy() {}
}
