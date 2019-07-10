import { pb } from "../asset.pb";
import C2S from "../netWork/socket/C2S";
import AvatarContainer from "../lib/component/avatarContainer";
import UserData from "../data/userData";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class DicePrefab extends cc.Component {
	@property(cc.Node)
	myView: cc.Node = null;

	@property(cc.Node)
	otherView: cc.Node = null;

	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Button)
	Dice: cc.Button = null;

	@property(cc.Sprite)
	smallDice: cc.Sprite = null;

	@property(cc.Node)
	otherHead: cc.Node = null;

	@property(cc.Label)
	otherName: cc.Label = null;

	isMy: boolean = true;
	info: pb.common.IPlayerInfo;
	diceAnim: cc.Animation;
	onLoad() {
		let serverLoadingCom = this.Dice.getComponent(cc.Animation);
		this.diceAnim = serverLoadingCom;
	}

	hide() {
		this.node.active = false;
		// this.Dice.node.stopAllActions()
		// this.smallDice.node.stopAllActions()
	}

	clearData() {
		this.isMy = true;
		// this.info = null;
	}

	show() {
		this.node.active = true;
		this.diceAnim.setCurrentTime(0);
	}

	initHead() {
		let avatarContainer;
		for (let i = 0; i < UserData.checkData.players.length; i++) {
			if (UserData.checkData.players[i].userId.equals(UserData.uid)) {
				avatarContainer = this.headIcon.getComponent(AvatarContainer);
				if (UserData.avatarFrame) {
					avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
				} else {
					if (
						typeof UserData.checkData.players[i].avatar !== "undefined" &&
						UserData.checkData.players[i].avatar !== null &&
						UserData.checkData.players[i].avatar.length > 5
					) {
						UserData.avatarUrl = UserData.checkData.players[i].avatar;
						avatarContainer.setAvatarImageFromUrl(
							UserData.checkData.players[i].avatar
						);
					}
				}
			} else {
				avatarContainer = this.otherHead.getComponent(AvatarContainer);
				avatarContainer.setAvatarImageFromUrl(
					UserData.checkData.players[i].avatar
				);
				this.otherName.string = UserData.checkData.players[i].nickname;
			}
		}
	}

	setView(isMy: boolean) {
		this.clearData();
		this.Dice.node.stopAllActions();
		this.smallDice.node.stopAllActions();
		this.smallDice.node.setPosition(58, -45);
		this.smallDice.node.scale = 1;
		this.smallDice.node.setContentSize(60, 60);
		this.Dice.node.setPosition(0, 106);
		this.Dice.node.scale = 1;
		this.Dice.node.setContentSize(260, 260);
		this.isMy = isMy;
		// this.info = info;
		console.log("isMy" + this.isMy);
		this.myView.active = this.isMy;
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
		let self: DicePrefab = this;
		this.Dice.node.active = true;
		let seq = cc.repeatForever(
			cc.sequence(
				cc.spawn(
					cc.moveTo(2 / 3, cc.v2(0, 10 + 106)),
					cc.scaleTo(2 / 3, 1.05, 1.05)
				),
				cc.spawn(cc.moveTo(2 / 3, cc.v2(0, -10 + 106)), cc.scaleTo(2 / 3, 1, 1))
			)
		);
		// this.Dice.node.stopAllActions();
		this.Dice.node.runAction(seq);
	}

	onSendDice() {
		C2S.RollReq();
	}

	/**
	 * 播放筛子动画
	 */
	onStartDice() {
		console.log("播放筛子动画----------------------->");
		if (!this.isMy) {
			this.otherView.active = false;
		}
		this.Dice.node.active = true;
		this.Dice.interactable = false;
		this.diceAnim.play("dic");
		RemoteAudio.playEffect(SoundName.DICE);
	}

	showOtherView() {
		let self = this;

		this.Dice.node.active = false;
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
		// this.smallDice.node.stopAllActions();
		this.smallDice.node.runAction(seq);
	}

	onDestroy() {
		this.clearData();
	}
}
