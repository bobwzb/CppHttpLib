import WxHttpControl from "../netWork/http/WxHttpControl";
import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import storeScene from "./storeScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class storeItem extends cc.Component {
	@property(cc.Toggle)
	detailsBtn: cc.Toggle = null;

	@property(cc.Sprite)
	detailsCheck: cc.Sprite = null;

	@property(cc.Sprite)
	detailsDefault: cc.Sprite = null;

	@property(cc.Button)
	storebuyBtn: cc.Button = null;

	@property(cc.Sprite)
	headIcon: cc.Sprite = null;

	@property(cc.Label)
	nameLabel: cc.Label = null;

	@property(cc.Label)
	coinLabel: cc.Label = null;

	tag: number = null;
	data: any;

	onLoad() {}

	getData(data: any) {
		this.data = data;

		if (this.data.purchased) {
			this.storebuyBtn.node.active = false;
		}
		let self: any = this;

		cc.loader.load(this.data.thumb, function(err, texture) {
			let spriteFrame = new cc.SpriteFrame(texture);
			self.headIcon.spriteFrame = spriteFrame;
		});

		this.nameLabel.string = this.data.name;
		this.coinLabel.string = this.data.coin;

		this.storebuyBtn.node.on("click", this.onBtstorebuy, this);
	}

	onBtstorebuy() {
		Popup.show(PopupType.BuyPopup, null, this.data);
	}

	onDetails() {
		let self: storeItem = this;
		let detailsNode = this.node.parent.parent.parent.parent.getComponent(
			storeScene
		).nodeDetArr[self.tag];
		detailsNode.active = true;
		detailsNode.opacity = 0;
		if (this.detailsBtn.isChecked) {
			this.detailsCheck.node.active = true;
			this.detailsDefault.node.active = false;

			detailsNode.runAction(
				cc.sequence(
					cc.fadeIn(0.1),
					cc.callFunc(function() {
						detailsNode.active = true;
					})
				)
			);
		} else {
			this.detailsCheck.node.active = false;
			this.detailsDefault.node.active = true;

			detailsNode.runAction(
				cc.sequence(
					cc.fadeOut(0.1),
					cc.callFunc(function() {
						detailsNode.active = false;
					})
				)
			);
		}
	}
}
