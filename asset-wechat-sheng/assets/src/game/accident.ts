import { GameEvent, EventType } from "../lib/GameEvent";
import cardCtrl from "./cardCtrl";
import { RemoteImage } from "../lib/component/remoteImage";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class accident extends cc.Component {
	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Label)
	contentTxt: cc.Label = null;

	@property(cc.Label)
	titleTxt: cc.Label = null;

	@property(cc.Sprite)
	contentImg: cc.Sprite = null;

	@property(cc.Button)
	btOk: cc.Button = null;

	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}

	setData(data: any) {
		RemoteAudio.playEffect(SoundName.ACCIDENT);
		let remoteImage = this.getComponent(RemoteImage);
		remoteImage
			.getImageForScenario(data.contentImg)
			.then((tex: cc.Texture2D) => {
				remoteImage.setImage(tex);
			});
		cardCtrl.cardNodes.push(this.node);
		this.moneyNum.string = "¥" + data.num;
		this.contentTxt.string = data.contentTxt;
		this.titleTxt.string = data.titleTxt;

		let self: accident = this;
		// cc.loader.load(data.contentImg, function(err, texture) {
		// 	let spriteFrame = new cc.SpriteFrame(texture);
		// 	self.contentImg.spriteFrame = spriteFrame;
		// });

		this.btOk.node.on("click", this.onBuy, this);
		this.btOk.node.active = data.isMy;
	}

	onBuy() {
		let data: any = {
			isPayIng: true
		};
		this.hide();
		GameEvent.event.dispatchEvent(
			new GameEvent(EventType.GAME_SHOW_ACCIDENT_PAY_CONFIRM, data)
		);
		// RemoteAudio.playEffect(SoundName.CASH_REGISTER);
	}

	onDestroy() {}
}
