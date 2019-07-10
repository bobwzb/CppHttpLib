import { pb } from "../asset.pb";
import AvatarContainer from "../lib/component/avatarContainer";
import gameScene from "./gameScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class offerResult extends cc.Component {
	@property(cc.Node)
	winNode: cc.Node = null;

	@property(cc.Node)
	loseNode: cc.Node = null;

	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Label)
	headName: cc.Label = null;

	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.SpriteFrame)
	defaultHead: cc.SpriteFrame = null;

	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
		this.node.opacity = 255;
	}

	setData(data: pb.common.AuctionResultMsg, playerInfo: pb.common.IPlayerInfo) {
		let self: offerResult = this;
		console.log("拍卖结果页面", playerInfo);
		this.node.parent.getComponent(gameScene);

		if (data.playerWon) {
			this.winNode.active = true;
			this.loseNode.active = false;
			this.moneyNum.string = "¥" + data.amount;
		} else {
			this.winNode.active = false;
			this.loseNode.active = true;
		}

		this.headIcon
			.getChildByName("headDefault")
			.getComponent(cc.Sprite).spriteFrame = this.defaultHead;
		let avatarContainer = this.headIcon.getComponent(AvatarContainer);
		avatarContainer.setAvatarImageFromUrl(playerInfo.avatar);
		this.headName.string = "" + playerInfo.nickname;
		this.node.stopAllActions();
		this.node.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.3)));
	}

	onDestroy() {}
}
