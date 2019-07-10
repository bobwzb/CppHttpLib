import { pb } from "../asset.pb";
import C2S from "../netWork/socket/C2S";
import AvatarContainer from "../lib/component/avatarContainer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class promoteIng extends cc.Component {
	@property(cc.Node)
	otherView: cc.Node = null;

	@property(cc.Button)
	Dice: cc.Button = null;

	@property(cc.Sprite)
	smallDice: cc.Sprite = null;

	@property(cc.Node)
	otherHead: cc.Node = null;

	@property(cc.Label)
	otherName: cc.Label = null;

	@property(cc.SpriteFrame)
	defaultHead: cc.SpriteFrame = null;

	isMy: boolean = true;
	info: pb.common.IPlayerInfo;
	onLoad() {}

	hide() {
		this.node.active = false;
		// this.Dice.node.stopAllActions()
		// this.smallDice.node.stopAllActions()
	}

	show() {
		this.node.active = true;
	}

	clearData() {
		this.isMy = false;
		this.info = null;
	}

	setView(isMy: boolean, info: pb.common.IPlayerInfo) {
		this.clearData();
		this.Dice.node.stopAllActions();
		this.smallDice.node.stopAllActions();
		this.smallDice.node.setPosition(58, -45);
		this.smallDice.node.scale = 1;
		this.smallDice.node.setContentSize(60, 60);
		this.Dice.node.setPosition(0, -134);
		this.Dice.node.scale = 1;
		this.Dice.node.setContentSize(260, 260);
		this.isMy = isMy;
		this.info = info;
		console.log("isMy" + this.isMy);
		this.otherView.active = !this.isMy;
		this.node.getChildByName("showSprite").active = false;
		this.Dice.interactable = true;
		if (this.isMy) {
			this.showMyView();
		} else {
			this.showOtherView();
		}
	}

	showMyView() {
		let self: promoteIng = this;
		this.Dice.node.active = true;
		this.Dice.node.active = true;
		let seq = cc.repeatForever(
			cc.sequence(
				cc.spawn(
					cc.moveTo(2 / 3, cc.v2(0, 10 - 134)),
					cc.scaleTo(2 / 3, 1.05, 1.05)
				),
				cc.spawn(cc.moveTo(2 / 3, cc.v2(0, -10 - 134)), cc.scaleTo(2 / 3, 1, 1))
			)
		);
		this.Dice.node.runAction(seq);
	}

	onSendDice() {
		C2S.WageHikeRollReq();
	}

	/**
	 * 播放筛子动画
	 */
	onStartDice() {
		if (!this.isMy) {
			this.otherView.active = false;
		}
		this.Dice.node.active = true;
		this.Dice.interactable = false;
		let serverLoadingCom = this.Dice.getComponent(cc.Animation);
		serverLoadingCom.play("dic2");
	}

	showOtherView() {
		let self: promoteIng = this;

		this.otherHead
			.getChildByName("headDefault")
			.getComponent(cc.Sprite).spriteFrame = this.defaultHead;
		let avatarContainer = this.otherHead.getComponent(AvatarContainer);
		avatarContainer.setAvatarImageFromUrl(this.info.avatar);
		this.Dice.node.active = false;
		this.otherName.string = this.info.nickname;
		let seq = cc.repeatForever(
			cc.sequence(
				cc.spawn(
					cc.moveTo(2 / 3, cc.v2(0 + 58, 10 - 45)),
					cc.scaleTo(2 / 3, 1.05, 1.05)
				),
				cc.spawn(
					cc.moveTo(2 / 3, cc.v2(0 + 58, -10 - 45)),
					cc.scaleTo(2 / 3, 1, 1)
				)
			)
		);
		this.smallDice.node.runAction(seq);
	}

	onDestroy() {
		this.clearData();
	}
}
