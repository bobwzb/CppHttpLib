import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import WxHttpControl from "../netWork/http/WxHttpControl";
import { GameEvent, EventType } from "../lib/GameEvent";
import Tips from "../until/Tips";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyPopup extends Popup {
	@property(cc.Sprite)
	headIcon: cc.Sprite = null;

	@property(cc.Label)
	nameLabel: cc.Label = null;

	@property(cc.Label)
	coinLabel: cc.Label = null;

	data: any;
	onLoad() {
		this.addEvent();
		super.onLoad();
	}

	public setData(data: any) {
		this.data = data;

		let self: any = this;
		cc.loader.load(this.data.thumb, function(err, texture) {
			let spriteFrame = new cc.SpriteFrame(texture);
			self.headIcon.spriteFrame = spriteFrame;
		});
		this.nameLabel.string = this.data.name;
		this.coinLabel.string = "" + this.data.coin;
	}

	private onBtnBuy() {
		WxHttpControl.getBuyProfession(this.data.goods_type, this.data.id, 1);
	}

	public addEvent() {
		super.addEvent();
		GameEvent.event.on(EventType.HTTP_BUY_PROFESSION, this.getBuyData, this);
	}

	private getBuyData(res: any) {
		WxHttpControl.getStoreProfession();
		this.hide();
		if (res.userData.data.success) {
			Tips.show("购买成功");
			WxHttpControl.getUserInfo();
		} else {
			Tips.show("购买失败");
		}
	}

	onDestroy() {
		GameEvent.event.off(EventType.HTTP_BUY_PROFESSION, this.getBuyData, this);
	}
}
