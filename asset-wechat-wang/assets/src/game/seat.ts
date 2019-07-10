import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import { pb } from "../asset.pb";
import StringUtils from "../until/StringUtils";
import UserData from "../data/userData";
import AvatarContainer from "../lib/component/avatarContainer";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class seat extends cc.Component {
	@property(cc.Sprite)
	timeFrame: cc.Sprite = null;

	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Label)
	nameLabel: cc.Label = null;

	@property(cc.Label)
	coinLabel: cc.Label = null;

	@property(cc.Label)
	professionLabel: cc.Label = null;

	@property(cc.ProgressBar)
	freeBar: cc.ProgressBar = null;

	@property(cc.Label)
	numincome: cc.Label = null;

	@property(cc.Label)
	numexpenditure: cc.Label = null;

	@property(cc.Label)
	numcash: cc.Label = null;

	@property(cc.Label)
	auctionNum: cc.Label = null;

	@property(cc.Label)
	accountsNum: cc.Label = null;

	@property(cc.Label)
	sellNum: cc.Label = null;

	@property(cc.Label)
	floorNum: cc.Label = null;

	@property(cc.Label)
	loanNum: cc.Label = null;

	@property(cc.Button)
	btQuit: cc.Button = null;

	@property([cc.Sprite])
	toasts: cc.Sprite[] = [];

	@property([cc.SpriteFrame])
	timeSpriteFrame: cc.SpriteFrame[] = [];

	private timeFrameWid: number; // 倒计时的宽度
	private timeFrameHalfWid: number; // 倒计时的半宽度
	private timeFrameHei: number; // 倒计时的高度
	private timeFrameHalfHei: number; // 倒计时的半高度
	private timeFrameTotalL: number; //倒计时的周长
	private timeFrameHalfL: number;
	private timeFrameL3: number;
	private timeFrameInitAngle: number;

	syncData: pb.common.IGamePlayer;
	toastIdx: number = 0;
	toastData: any;
	onLoad() {
		if (!this.timeFrame) return;
		let vec: cc.Vec2 = this.timeFrame.fillCenter;
		vec.x = 0.5;
		vec.y = 0.5;
		this.timeFrame.fillCenter = vec;
		this.timeFrameWid = this.timeFrame.node.width;
		this.timeFrameHei = this.timeFrame.node.height;
		this.timeFrameHalfL = this.timeFrameWid + this.timeFrameHei;
		this.timeFrameTotalL = this.timeFrameHalfL * 2.0;
		this.timeFrameHalfWid = this.timeFrameWid * 0.5;
		this.timeFrameHalfHei = this.timeFrameHei * 0.5;
		this.timeFrameL3 = this.timeFrameHalfL + this.timeFrameHei;
		this.timeFrameInitAngle = this.getAngle(
			this.timeFrameHalfWid,
			-this.timeFrameHalfHei
		);
		this.timeFrame.node.active = false;
	}

	private getAngle(dx: number, dy: number): number {
		var rotation: number = Math.round(Math.atan2(dy, dx) * 57.33);
		rotation = (rotation + 360) % 360;
		return rotation;
	}

	public stopClock() {
		this.timeFrame.fillRange = 0;
	}

	public setTimeRate(rate: number, type: number) {
		this.timeFrame.node.active = true;
		this.timeFrame.spriteFrame = this.timeSpriteFrame[type];
		this.timeFrame.fillRange = this.calcRate(rate);
		// this.timeFrame.node.color =  JinhuaManager.instance.getColor(100 - rate * 100);
	}

	private curPoint: cc.Vec2 = new cc.Vec2(0, 0);
	/**获取真实的rate */
	private calcRate(rate: number): number {
		if (rate <= 0.005) return rate;
		//当前长度
		let curL: number = (1 - rate) * this.timeFrameTotalL;
		//算出当前点来
		if (curL <= this.timeFrameHei) {
			this.curPoint.x = this.timeFrameHalfWid;
			this.curPoint.y = curL - this.timeFrameHalfHei;
		} else if (curL <= this.timeFrameHalfL) {
			this.curPoint.x = this.timeFrameHalfWid - (curL - this.timeFrameHei);
			this.curPoint.y = this.timeFrameHalfHei;
		} else if (curL <= this.timeFrameL3) {
			this.curPoint.x = -this.timeFrameHalfWid;
			this.curPoint.y = this.timeFrameHalfHei - (curL - this.timeFrameHalfL);
		} else {
			this.curPoint.y = -this.timeFrameHalfHei;
			this.curPoint.x = -this.timeFrameHalfWid + (curL - this.timeFrameL3);
		}

		let curAngle: number =
			(this.getAngle(this.curPoint.x, this.curPoint.y) -
				this.timeFrameInitAngle +
				360) %
			360;
		return 1 - curAngle / 360;
	}

	setPlayerSyncData(data: pb.common.IGamePlayer, isMe: boolean) {
		let isAnim = UserData.gameSyncNum > 0 && this.syncData;
		if (
			isAnim &&
			!data.playerGameData.cashFlow.totalCash.equals(
				this.syncData.playerGameData.cashFlow.totalCash
			)
		) {
			this.showNumChange(
				data.playerGameData.cashFlow.totalCash.sub(
					this.syncData.playerGameData.cashFlow.totalCash
				),
				this.coinLabel,
				this.syncData.playerGameData.cashFlow.totalCash,
				50
			);
		} else {
			this.coinLabel.string = data.playerGameData.cashFlow.totalCash.toString();
		}
		if (
			isAnim &&
			!data.playerGameData.cashFlow.monthlyIncomeExSalary.equals(
				this.syncData.playerGameData.cashFlow.monthlyIncomeExSalary
			) &&
			isAnim
		) {
			this.showAssetChange(
				data.playerGameData.cashFlow.monthlyIncomeExSalary.sub(
					this.syncData.playerGameData.cashFlow.monthlyIncomeExSalary
				),
				this.numincome,
				this.syncData.playerGameData.cashFlow.monthlyIncomeExSalary
			);
		} else {
			this.numincome.string = data.playerGameData.cashFlow.monthlyIncomeExSalary.toString();
		}
		if (
			isAnim &&
			!data.playerGameData.cashFlow.monthlyExpenses.equals(
				this.syncData.playerGameData.cashFlow.monthlyExpenses
			) &&
			isAnim
		) {
			this.showAssetChange(
				data.playerGameData.cashFlow.monthlyExpenses.sub(
					this.syncData.playerGameData.cashFlow.monthlyExpenses
				),
				this.numexpenditure,
				this.syncData.playerGameData.cashFlow.monthlyExpenses
			);
		} else {
			this.numexpenditure.string = data.playerGameData.cashFlow.monthlyExpenses.toString();
		}
		if (
			isAnim &&
			!data.playerGameData.cashFlow.monthlyCashFlow.equals(
				this.syncData.playerGameData.cashFlow.monthlyCashFlow
			) &&
			isAnim
		) {
			this.showAssetChange(
				data.playerGameData.cashFlow.monthlyCashFlow.sub(
					this.syncData.playerGameData.cashFlow.monthlyCashFlow
				),
				this.numcash,
				this.syncData.playerGameData.cashFlow.monthlyCashFlow
			);
		} else {
			this.numcash.string = data.playerGameData.cashFlow.monthlyCashFlow.toString();
		}

		this.syncData = data;
		let self: seat = this;

		console.log(data, "setPlayerSyncData");

		this.professionLabel.string = data.role.Name;
		this.freeBar.progress = data.playerGameData.degree / 100;
		this.freeBar.node.getChildByName("num").getComponent(cc.Label).string =
			Math.round(data.playerGameData.degree * 100) / 100 + "%";

		// this.numceiling.string = "";
		// this.numAmount.string = "";
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

	showAssetChange(changeType: Long, txt: cc.Label, curLong: Long | number) {
		let timeCallBack;
		let self: seat = this;
		txt.node.runAction(
			cc.sequence(cc.scaleTo(0.1, 1.2, 1.2), cc.scaleTo(0.4, 1, 1))
		);
		this.showNumChange(changeType, txt, curLong, 50);
	}

	setPlayerInfo(data: pb.common.PlayerInfo) {
		let self: seat = this;
		let avatarContainer = this.headIcon.getComponent(AvatarContainer);
		avatarContainer.setAvatarImageFromUrl(data.avatar);
		this.nameLabel.string = data.nickname;
	}

	setToast(data: any, isMe: boolean) {
		this.toastData = data;
		this.toastData.isMe = isMe;
		this.toastIdx = data.toastIdx;
		if (this.toastIdx == 0) {
			this.showfloorToast();
		} else if (this.toastIdx == 1) {
			this.showAuctionToast();
		} else if (this.toastIdx == 2) {
			this.showSellToast();
		} else if (this.toastIdx == 3) {
			this.showAccountsToast();
		} else if (this.toastIdx == 4) {
			this.showLoanToast();
		} else if (this.toastIdx == 5) {
			this.showBrokeToast();
		} else if (this.toastIdx == 6) {
			this.showOffLineToast();
		}
		if (this.toastIdx == 2 || this.toastIdx == 3 || this.toastIdx == 4) {
			this.toasts[this.toastIdx].node.runAction(
				cc.sequence(cc.delayTime(1.5), cc.fadeOut(0.3))
			);
		}
	}

	showfloorToast() {
		let self = this;
		self.toasts[this.toastIdx].node.active = true;
		self.toasts[this.toastIdx].node.scale = 0;
		this.toasts[this.toastIdx].node.runAction(
			cc.sequence(
				cc.scaleTo(0.4, 1, 1),
				cc.callFunc(function() {
					self.toasts[self.toastIdx].node.active = true;
				})
			)
		);
		this.floorNum.string = "¥" + this.toastData.amount;
	}

	hidefloorToast() {
		let self = this;
		self.toasts[0].node.active = true;
		self.toasts[0].node.scale = 1;
		this.toasts[0].node.runAction(
			cc.sequence(
				cc.scaleTo(0.2, 0, 0),
				cc.callFunc(function() {
					self.toasts[0].node.active = false;
				})
			)
		);
	}

	showAuctionToast() {
		let self = this;
		self.toasts[this.toastIdx].node.active = true;
		self.toasts[this.toastIdx].node.scale = 0;
		this.toasts[this.toastIdx].node.runAction(
			cc.sequence(
				cc.scaleTo(0.4, 1, 1),
				cc.callFunc(function() {
					self.toasts[self.toastIdx].node.active = true;
				})
			)
		);
		this.auctionNum.string = "¥" + this.toastData.amount;
	}

	hideAuctionToast() {
		let self = this;
		self.toasts[1].node.active = true;
		self.toasts[1].node.scale = 1;
		this.toasts[1].node.runAction(
			cc.sequence(
				cc.scaleTo(0.2, 0, 0),
				cc.callFunc(function() {
					self.toasts[self.toastIdx].node.active = false;
				})
			)
		);
	}

	hideOffLineToast() {
		this.toasts[6].node.active = false;
	}

	showSellToast() {
		this.toasts[this.toastIdx].node.active = true;
		this.toasts[this.toastIdx].node
			.getChildByName("txt")
			.getComponent(cc.Label).string = "售出" + this.toastData.name + ",收益:";
		this.sellNum.string = "¥" + StringUtils.ConvertInt2(this.toastData.amount);
	}

	showAccountsToast() {
		this.toasts[this.toastIdx].node.active = true;
		this.accountsNum.string =
			"¥" + StringUtils.ConvertInt2(this.toastData.amount);
	}

	showLoanToast() {
		this.toasts[this.toastIdx].node.active = true;
		this.loanNum.string = "¥" + StringUtils.ConvertInt2(this.toastData.amount);
	}

	showBrokeToast() {
		this.toasts[this.toastIdx].node.active = true;
		this.btQuit.node.active = this.toastData.isSelf;
	}

	showOffLineToast() {
		this.toasts[this.toastIdx].node.active = true;
	}

	onShowQuit() {
		Popup.show(PopupType.BrokeExitPopup);
	}

	hideAllToast() {
		for (let i = 0; i < this.toasts.length; i++) {
			this.toasts[i].node.active = false;
			this.toasts[i].node.opacity = 255;
			this.toasts[i].node.stopAllActions();
		}
	}

	hideAuctAll() {
		for (let i = 0; i < 2; i++) {
			this.toasts[i].node.active = false;
			this.toasts[i].node.opacity = 255;
			this.toasts[i].node.stopAllActions();
		}
	}

	hide() {
		this.node.active = false;
	}

	show() {
		this.node.active = true;
	}

	clearData() {
		this.syncData = null;
		this.toastIdx = 1;
	}

	onDestroy() {
		this.clearData();
		this.unscheduleAllCallbacks();
	}
}
