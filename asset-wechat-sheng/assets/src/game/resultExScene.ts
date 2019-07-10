import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import C2S from "../netWork/socket/C2S";
import UserData from "../data/userData";
import { pb } from "../asset.pb";
import AvatarContainer from "../lib/component/avatarContainer";
import BasicScene from "../lib/BasicScene";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class resultExScene extends BasicScene {
	@property(cc.Node)
	loadingHead: cc.Node = null;

	@property(cc.Label)
	loadingName: cc.Label = null;

	@property(cc.Label)
	loadingGrade: cc.Label = null;

	@property(cc.Label)
	loadingasset: cc.Label = null;

	@property(cc.Label)
	getNum: cc.Label = null;

	@property(cc.Label)
	gameAward: cc.Label = null;

	@property(cc.Label)
	assetAward: cc.Label = null;

	onLoad() {
		this.gameAward.node.setPosition(-96, -20 - 40);
		this.assetAward.node.setPosition(96, -20 - 40);
		this.gameAward.node.opacity = 0;
		this.assetAward.node.opacity = 0;
		this.setData();
	}

	setData() {
		let self = this;
		let resultData: pb.common.GameOverMsg = UserData.gameoverData;
		let resultMsg: pb.common.CheckPlayingRsp = UserData.checkData;

		let myCheckData: pb.common.IPlayerInfo;
		for (let i = 0; i < resultData.roles.length; i++) {
			if (resultData.roles[i].userId.equals(UserData.uid)) {
				let avatarContainer = this.loadingHead.getComponent(AvatarContainer);
				if (UserData.avatarFrame) {
					avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
				} else {
					if (
						typeof resultMsg.players[i].avatar !== "undefined" &&
						resultMsg.players[i].avatar !== null &&
						resultMsg.players[i].avatar.length > 5
					) {
						UserData.avatarUrl = resultMsg.players[i].avatar;
						avatarContainer.setAvatarImageFromUrl(resultMsg.players[i].avatar);
					}
				}
				this.loadingName.string = resultMsg.players[i].nickname;
				myCheckData = resultMsg.players[i];
				break;
			}
		}

		for (const key in resultData.bonus) {
			if (resultData.bonus[key].userID.equals(UserData.uid)) {
				this.gameAward.string = resultData.bonus[
					key
				].rankBonus.assetScoreItems[0].value.toString();
				this.assetAward.string = resultData.bonus[
					key
				].rankBonus.assetScoreItems[1].value.toString();
				this.gameAward.node.runAction(
					cc.sequence(
						cc.delayTime(1 / 2),
						cc.spawn(cc.moveTo(1 / 2, -96, -20), cc.fadeIn(1 / 2))
					)
				);
				this.assetAward.node.runAction(
					cc.sequence(
						cc.delayTime(1),
						cc.spawn(cc.moveTo(1 / 2, 96, -20), cc.fadeIn(1 / 2))
					)
				);
				let getNumChange = resultData.bonus[
					key
				].rankBonus.assetScoreItems[0].value.add(
					resultData.bonus[key].rankBonus.assetScoreItems[1].value
				);
				this.getNum.node.runAction(
					cc.sequence(
						cc.delayTime(1 + 1 / 2),
						cc.callFunc(function() {
							self.showNumChange(getNumChange, self.getNum, 0, 50);
						})
					)
				);
				if (
					myCheckData.assetScore.equals(
						resultData.bonus[key].rankBonus.assetScore
					)
				) {
					this.loadingasset.string = resultData.bonus[
						key
					].rankBonus.assetScore.toString();
				} else {
					this.loadingasset.node.runAction(
						cc.sequence(
							cc.delayTime(1 + 1 / 2),
							cc.callFunc(function() {
								self.showNumChange(
									getNumChange,
									self.loadingasset,
									myCheckData.assetScore,
									50
								);
							})
						)
					);
				}

				if (
					myCheckData.assetLevel !== resultData.bonus[key].rankBonus.assetLevel
				) {
					this.loadingGrade.node.runAction(
						cc.sequence(
							cc.delayTime(1 + 1),
							cc.scaleTo(1 / 2, 1.1, 1.1),
							cc.spawn(
								cc.scaleTo(1 / 2, 1, 1),
								cc.callFunc(function() {
									self.loadingGrade.string =
										resultData.bonus[key].rankBonus.assetLevel;
								})
							)
						)
					);
				} else {
					this.loadingGrade.string = resultData.bonus[key].rankBonus.assetLevel;
				}
				break;
			}
		}
	}

	onBtNext() {
		cc.director.loadScene("resultListScene");
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
