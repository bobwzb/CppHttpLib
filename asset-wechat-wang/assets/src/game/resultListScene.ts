import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import C2S from "../netWork/socket/C2S";
import UserData from "../data/userData";
import { pb } from "../asset.pb";
import myAssetItem from "./myAssetItem";
import StringUtils from "../until/StringUtils";
import AvatarContainer from "../lib/component/avatarContainer";
import BasicScene from "../lib/BasicScene";
import { WX } from "../until/WX";
import ServerLoading from "../hall/ServerLoadingPopup";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class resultListScene extends BasicScene {
	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Sprite)
	headSprite: cc.Sprite = null;

	@property([cc.SpriteFrame])
	headSpriteFrame: cc.SpriteFrame[] = [];

	@property(cc.Label)
	timeLabel: cc.Label = null;

	@property(cc.Label)
	assetNum: cc.Label = null;

	@property(cc.Label)
	loanNum: cc.Label = null;

	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Label)
	incomeNum: cc.Label = null;

	@property(cc.Label)
	expenseNum: cc.Label = null;

	@property(cc.Node)
	playerNode: cc.Node = null;

	@property(cc.Prefab)
	item: cc.Prefab = null;

	onLoad() {
		this.setData();
	}

	setData() {
		let self = this;
		let resultData: pb.common.GameOverMsg = UserData.gameoverData;
		let resultMsg: pb.common.CheckPlayingRsp = UserData.checkData;
		this.timeLabel.string = StringUtils.doInverseTime(
			resultData.endedAt.seconds.sub(resultData.startedAt.seconds)
		);

		if (resultData.winnerId && resultData.typ == 0) {
			for (let i = 0; i < resultMsg.players.length; i++) {
				if (resultMsg.players[i].userId.equals(resultData.winnerId)) {
					this.headSprite.spriteFrame = this.headSpriteFrame[0];
					this.headIcon.active = true;
					let avatarContainer = this.headIcon.getComponent(AvatarContainer);
					// william
					if (
						typeof resultMsg.players[i].avatar !== "undefined" &&
						resultMsg.players[i].avatar !== null
					) {
						avatarContainer.setAvatarImageFromUrl(
							resultMsg.players[i].avatar
						);
					}
					// if (UserData.avatarFrame) {
					// 	avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
					// } else {
					// 	if (
					// 		typeof resultMsg.players[i].avatar !== "undefined" &&
					// 		resultMsg.players[i].avatar !== null &&
					// 		resultMsg.players[i].avatar.length > 5
					// 	) {
					// 		UserData.avatarUrl = resultMsg.players[i].avatar;
					// 		avatarContainer.setAvatarImageFromUrl(
					// 			resultMsg.players[i].avatar
					// 		);
					// 	}
					// }
					break;
				}
			}
		} else {
			this.headIcon.active = false;
			this.headSprite.spriteFrame = this.headSpriteFrame[1];
		}

		for (let i = 0; i < resultData.roles.length; i++) {
			if (resultData.roles[i].userId.equals(UserData.uid)) {
				// this.assetNum.string = resultData.roles[i].Name;
				// this.loanNum.string = resultData.roles[i].Name;
				// this.moneyNum.string = resultData.roles[i].Name;
				// this.incomeNum.string = resultData.roles[i].Name;
				// this.expenseNum.string = resultData.roles[i].Name;
				// this.expProgress.progress =
				// this.light.node.setPosition(this.light.node.x + 100, this.light.node.y)
				break;
			}
		}

		for (let i = 0; i < resultData.roles.length; i++) {
			let node: cc.Node = cc.instantiate(this.item);
			this.playerNode.addChild(node);
			node
				.getComponent(myAssetItem)
				.setData(resultData.data[i], resultMsg.players[i], resultData.roles[i]);
		}
	}

	onBtShare() {
		WX.getShareFriend();
	}

	onBtHome() {
		ServerLoading.show();
		cc.director.preloadScene("hallScene", function() {
			ServerLoading.hide();
			cc.director.loadScene("hallScene");
		});
	}

	onDestroy() {}
}
