import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import C2S from "../netWork/socket/C2S";
import UserData from "../data/userData";
import { pb } from "../asset.pb";
import { BinaryEncoder } from "../until/BinaryUtils";
import AvatarContainer from "../lib/component/avatarContainer";
import BasicScene from "../lib/BasicScene";
var Long = require("long");
var protobuf = require("protobufjs/minimal");

const { ccclass, property } = cc._decorator;

@ccclass
export default class resultCoinScene extends BasicScene {
	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Label)
	nameLabel: cc.Label = null;

	@property(cc.Label)
	professionLabel: cc.Label = null;

	@property(cc.Label)
	gradeLabel: cc.Label = null;

	@property(cc.Label)
	expNum: cc.Label = null;

	@property(cc.Label)
	coinNum: cc.Label = null;

	@property(cc.Label)
	proLabel: cc.Label = null;

	@property(cc.Label)
	proLabel2: cc.Label = null;

	@property(cc.ProgressBar)
	expProgress: cc.ProgressBar = null;

	@property(cc.Sprite)
	light: cc.Sprite = null;

	onLoad() {
		this.setData();
	}

	setData() {
		let self = this;
		let resultData1: pb.common.GameOverMsg = UserData.gameoverData;
		let resultMsg1: pb.common.CheckPlayingRsp = UserData.checkData;

		console.log(resultData1, resultMsg1, "--------------------------->");
		// for (const key in resultData1.bonus) {
		// 	console.log(key, "------------------->key未转换")
		// 	console.log(BinaryEncoder.fromString(key), "------------------->keyBinaryEncoder转换")
		// 	console.log(encodeURI(key), "------------------->encodeURI转换")
		// 	console.log(Buffer.from(key, "utf8"), "---------------->Buffer.from转换")
		// 	console.log(protobuf.util.longFromHash(key), "--------------->key未转换long")
		// }

		for (let i = 0; i < resultData1.roles.length; i++) {
			if (resultData1.roles[i].userId.equals(UserData.uid)) {
				let avatarContainer = this.headIcon.getComponent(AvatarContainer);
				if (UserData.avatarFrame) {
					avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
				} else {
					if (
						typeof resultMsg1.players[i].avatar !== "undefined" &&
						resultMsg1.players[i].avatar !== null &&
						resultMsg1.players[i].avatar.length > 5
					) {
						UserData.avatarUrl = resultMsg1.players[i].avatar;
						avatarContainer.setAvatarImageFromUrl(resultMsg1.players[i].avatar);
					}
				}
				this.nameLabel.string = resultMsg1.players[i].nickname;
				this.professionLabel.string = resultData1.roles[i].Name;
				break;
			}
		}

		for (const key in resultData1.bonus) {
			if (resultData1.bonus[key].userID.equals(UserData.uid)) {
				this.gradeLabel.string =
					"Lv" +
					resultData1.bonus[key].levels[
						resultData1.bonus[key].levels.length - 1
					].value;

				let numGold =
					resultData1.bonus[key].bonusGold + resultData1.bonus[key].extraGold;
				let numExp =
					resultData1.bonus[key].bonusExp + resultData1.bonus[key].extraExp;

				self.showNumChange(numGold, self.coinNum, 0, 100);
				self.showNumChange(numExp, self.expNum, 0, 100);
				let oldExp =
					resultData1.bonus[key].exp -
					resultData1.bonus[key].bonusExp -
					resultData1.bonus[key].extraExp;

				this.expProgress.progress =
					resultData1.bonus[key].exp /
					Number(
						resultData1.bonus[key].levels[
							resultData1.bonus[key].levels.length - 1
						].highExp.toString()
					);
				(self.proLabel2.string = resultData1.bonus[key].levels[
					resultData1.bonus[key].levels.length - 1
				].highExp.toString()),
					(self.proLabel.string = resultData1.bonus[key].exp.toString()),
					// self.showNumChange(resultData1.bonus[key].levels[resultData1.bonus[key].levels.length - 1].highExp.sub(oldExp), self.proLabel, oldExp, 100)
					// for (let j = 0; j <  resultData1.bonus[key].levels.length; j++) {
					// 	this.node.runAction(cc.sequence(cc.delayTime(j), cc.callFunc(function(){
					// 		self.proLabel2.string = resultData1.bonus[key].levels[j].highExp.toString(),
					// 		resultData1.bonus[key].levels,
					// 		self.showNumChange(resultData1.bonus[key].levels[j].highExp.sub(oldExp), self.proLabel, oldExp, 100)
					// 	})))
					// }
					this.expProgress.progress;
				console.log(
					this.expProgress.progress,
					"this.expProgress.progress---------------->"
				);
				break;
			}
		}
	}

	onBtNext() {
		cc.director.loadScene("resultExScene");
	}

	showNumChange(
		changeType: Long | number,
		txt: cc.Label,
		curLong: Long | number,
		frameNum: number
	) {
		if (typeof changeType == "number") {
			if (changeType == 0) {
				return;
			}
			changeType = Long.fromNumber(changeType);
		} else {
			if (changeType.equals(0)) {
				return;
			}
		}
		if (typeof curLong == "number") {
			curLong = Long.fromNumber(curLong);
		}
		let timeCallBack;
		let self = this;
		let changeNum;
		let oldCurLong = curLong;
		let oldchangeType = changeType;
		if (changeType.isPositive()) {
			changeNum = changeType.divide(frameNum);
			changeNum = changeNum.equals(0) ? 1 : changeNum;
			timeCallBack = function() {
				curLong = curLong.add(changeNum);
				txt.string = curLong.toString();
				changeType = changeType.sub(changeNum);
				if (changeType.compare(0) != 1) {
					txt.string = oldCurLong.add(oldchangeType).toString();
					self.unschedule(timeCallBack);
				}
			};
		} else {
			changeNum = changeType.divide(-frameNum);

			changeNum = changeNum.equals(0) ? 1 : changeNum;
			timeCallBack = function() {
				curLong = curLong.sub(changeNum);
				txt.string = curLong.toString();
				changeType = changeType.add(changeNum);
				if (changeType.compare(0) != -1) {
					txt.string = oldCurLong.add(oldchangeType).toString();
					self.unschedule(timeCallBack);
				}
			};
		}
		this.schedule(timeCallBack, 0.01);
	}

	onDestroy() {
		this.unscheduleAllCallbacks();
	}
}
