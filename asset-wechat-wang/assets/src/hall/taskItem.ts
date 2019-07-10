import WxHttpControl from "../netWork/http/WxHttpControl";
import { GameEvent, EventType } from "../lib/GameEvent";
import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import StringUtils from "../until/StringUtils";
import { WX } from "../until/WX";

const { ccclass, property } = cc._decorator;

@ccclass
export default class taskItem extends cc.Component {
	@property(cc.RichText)
	titleLabel1: cc.RichText = null;

	@property(cc.Label)
	titleLabel2: cc.Label = null;

	@property(cc.Label)
	titleLabel3: cc.Label = null;

	@property([cc.Sprite])
	coinView: cc.Sprite[] = [];

	@property([cc.Label])
	cionNum: cc.Label[] = [];

	@property(cc.Button)
	btnGet: cc.Button = null;

	@property(cc.Button)
	btnGoto: cc.Button = null;

	@property(cc.Sprite)
	trueIcon: cc.Sprite = null;

	@property(cc.Label)
	progressLabel: cc.Label = null;

	@property(cc.Label)
	progressTxt: cc.Label = null;

	data: any;
	onLoad() {
		// this.addEvent();
	}

	getData(data: any) {
		this.data = data;
		// <size=30><color=green>I'm green</color></size>
		this.titleLabel1.string = this.data.title;
		let targetString = StringUtils.ConvertInt2(Number(data.target));
		if (StringUtils.searchString(this.data.title, targetString)) {
			let index = this.data.title.indexOf(targetString);
			let string1 = this.data.title.substring(0, index);
			let string2 = targetString;
			let string3 = this.data.title.substring(targetString.length + index);
			this.titleLabel1.string =
				"<color=white>" +
				string1 +
				"</color>" +
				"<color=#FFD32D>" +
				string2 +
				"</color>" +
				"<color=white>" +
				string3 +
				"</color>";
		} else {
			this.titleLabel1.string = this.data.title;
		}

		if (this.data.delivered) {
			this.trueIcon.node.active = true;
			this.btnGet.node.active = false;
			this.btnGoto.node.active = false;
		} else {
			if (this.data.progress >= this.data.target) {
				this.trueIcon.node.active = false;
				this.btnGet.node.active = true;
				this.btnGoto.node.active = false;
			} else {
				this.trueIcon.node.active = false;
				this.btnGet.node.active = false;
				this.btnGoto.node.active = true;
			}
		}

		for (let i = 0; i < this.data.bonus.length; i++) {
			this.coinView[this.data.bonus[i].type - 1].node.active = true;
			this.cionNum[this.data.bonus[i].type - 1].string =
				"+" + this.data.bonus[this.data.bonus[i].type - 1].value;
		}

		this.progressLabel.string =
			StringUtils.ConvertInt2(Number(data.progress)) + "/" + targetString;
		// this.progressTxt.node.active = false;

		this.btnGet.node.on("click", this.onbtnGet, this);
		this.btnGoto.node.on("click", this.onbtnGoto, this);
	}

	onbtnGet() {
		console.log(this.data.id, "--------------------------->");
		GameEvent.event.dispatchEvent(
			new GameEvent(EventType.HALL_GET_TASK_MSG, this.data)
		);
		WxHttpControl.getTaskAward(this.data.id);
	}

	onbtnGoto() {
		if (this.data.title == "分享1次游戏") {
			// GameEvent.event.on(EventType.SHARE_SUCESS, this.onShareSucess, this);
			WX.getShareFriend();
		} else {
			cc.director.loadScene("readyScene");
		}
	}

	// onShareSucess(res: any) {
	// 	WxHttpControl.getShareResult(1);
	// }

	onDestroy() {
		// GameEvent.event.off(EventType.SHARE_SUCESS, this.onShareSucess, this);
	}
}
