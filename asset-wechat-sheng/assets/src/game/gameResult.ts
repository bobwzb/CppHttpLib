import { pb } from "../asset.pb";
import UserData from "../data/userData";
import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import AvatarContainer from "../lib/component/avatarContainer";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameResult extends cc.Component {
	@property(cc.Label)
	nameLabel: cc.Label = null;

	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Node)
	timeOutNode: cc.Node = null;

	@property(cc.Node)
	sucessNode: cc.Node = null;

	animEndCallback;
	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}

	setData(data: pb.common.GameOverMsg, msg: pb.common.CheckPlayingRsp) {
		let self: gameResult = this;
		console.log(msg, "--------------------------------------->gameover");

		if (data.winnerId && data.typ == 0) {
			this.sucessNode.active = true;
			this.timeOutNode.active = false;
			for (let i = 0; i < msg.players.length; i++) {
				if (msg.players[i].userId.equals(data.winnerId)) {
					let avatarContainer = this.headIcon.getComponent(AvatarContainer);
					avatarContainer.setAvatarImageFromUrl(msg.players[i].avatar);
					this.nameLabel.string = msg.players[i].nickname;
					break;
				}
			}
		} else {
			this.sucessNode.active = false;
			this.timeOutNode.active = true;
			// if (data.typ == 1) {
			// 	this.sucessNode.active = false;
			// 	this.timeOutNode.active = true;
			// } else {
			// }
		}

		this.unscheduleAllCallbacks();
		this.animEndCallback = function() {
			let showdata = {
				resultData: data,
				resultMsg: msg
			};
			self.hide();
			cc.director.loadScene("resultCoinScene");
		};
		this.scheduleOnce(this.animEndCallback, 3);
	}

	onDestroy() {
		this.unscheduleAllCallbacks();
	}
}
