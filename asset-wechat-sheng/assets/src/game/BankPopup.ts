import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import C2S from "../netWork/socket/C2S";
import { GameEvent, EventType } from "../lib/GameEvent";
import { pb } from "../asset.pb";
import Tips from "../until/Tips";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";
import StringUtils from "../until/StringUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BankPopup extends Popup {
	@property(cc.Button)
	btLoan: cc.Button = null;

	@property(cc.Button)
	btReapy: cc.Button = null;

	@property([cc.Label])
	tabtxt: cc.Label[] = [];

	@property([cc.RichText])
	tabNum: cc.RichText[] = [];

	@property(cc.Label)
	tabNum2: cc.Label = null;

	@property(cc.Sprite)
	iconLoan: cc.Sprite = null;

	@property(cc.Toggle)
	toggleLoan: cc.Toggle = null;

	@property(cc.Sprite)
	tipsBank: cc.Sprite = null;

	@property([cc.Button])
	btSelectArr: cc.Button[] = [];

	@property(cc.Sprite)
	titleSprite: cc.Sprite = null;

	@property([cc.SpriteFrame])
	titleSpriteFrame: cc.SpriteFrame[] = [];

	@property([cc.SpriteFrame])
	btOkSpriteFrame: cc.SpriteFrame[] = [];

	@property(cc.Button)
	btOk: cc.Button = null;

	@property(cc.EditBox)
	moneyEditBox: cc.EditBox = null;

	loanData: pb.common.GetLoanQualificationRsp;
	rePayData: pb.common.GetPlayerLoanAssetRsp;
	isShowLoan: boolean = true;
	num: number = 0;
	selectNumArr = [];
	startNum: number = 0;
	onLoad() {
		super.onLoad();
	}

	setData(data: any) {
		if (data) {
			this.startNum = data;
		}

		C2S.GetLoanQualificationReq();

		this.addEvent();
		this.BtEvent();
	}

	addEvent() {
		super.addEvent();

		GameEvent.event.on(
			EventType.SOCKET_LOAN_QUALIFICATION,
			this.getLoanInfo,
			this
		);
		GameEvent.event.on(EventType.SOCKET_LOAN_ASSET, this.getLoanAsset, this);
		GameEvent.event.on(EventType.SOCKET_LOAN, this.onLoan, this);
		GameEvent.event.on(EventType.SOCKET_REPAY_LOAN, this.onRepayLoan, this);
	}

	BtEvent() {
		let self: BankPopup = this;
		for (let i = 0; i < this.btSelectArr.length; i++) {
			this.btSelectArr[i].node.on(
				"click",
				function() {
					self.updateNum(self.selectNumArr[i]);
				},
				this
			);
		}

		this.btLoan.node.on("click", this.onBtLoan, this);
		this.btReapy.node.on("click", this.onBtReapy, this);

		this.moneyEditBox.node.on(
			"text-changed",
			function(params: any) {
				if (Number(self.moneyEditBox.string)) {
					self.updateNum(Number(self.moneyEditBox.string), true);
				}
			},
			this
		);

		this.tabNum[0].node.on("click", this.onBtTabNum, this);
	}

	getLoanInfo(res: any) {
		this.isShowLoan = true;
		this.loanData = res.userData;
		console.log(this.loanData, "this.loanData------------->");

		this.num = 0;
		if (this.startNum > 0) {
			this.updateNum(this.startNum, true);
		} else {
			this.updateNum(this.num, true);
		}

		this.titleSprite.spriteFrame = this.titleSpriteFrame[0];
		this.btOk.node
			.getChildByName("butIcon")
			.getComponent(cc.Sprite).spriteFrame = this.btOkSpriteFrame[0];

		this.iconLoan.node.active = true;
		this.tipsBank.node.active = false;
		this.toggleLoan.isChecked = false;

		this.tabtxt[0].string = "贷款上限";
		this.tabtxt[1].string = "月利率";

		if (this.loanData.amount < 0) {
			this.loanData.amount = 0;
		}
		this.tabNum[0].string = "<u><color=#EEB026>¥" + this.loanData.amount + "</color></u>";
		this.tabNum2.string = this.loanData.loanRatePCT + "%";
		this.tabNum[0].node.color = cc.color(238, 176, 38, 1);

		for (let i = 0; i < this.btSelectArr.length; i++) {
			this.selectNumArr.push(this.loanData.recList[i].amount);
			this.btSelectArr[i].node
				.getChildByName("money")
				.getComponent(cc.Label).string = "+¥" + this.loanData.recList[i].amount;
			this.btSelectArr[i].node
				.getChildByName("Interest")
				.getComponent(cc.Label).string =
				"月利息¥" + Math.floor(this.loanData.recList[i].interest);
		}
	}

	getLoanAsset(res: any) {
		this.isShowLoan = false;
		this.rePayData = res.userData;
		console.log(this.rePayData, "this.rePayData------------->");
		this.num = 0;
		this.updateNum(this.num, true);

		this.titleSprite.spriteFrame = this.titleSpriteFrame[1];
		this.btOk.node
			.getChildByName("butIcon")
			.getComponent(cc.Sprite).spriteFrame = this.btOkSpriteFrame[1];

		this.iconLoan.node.active = false;
		this.tipsBank.node.active = false;
		this.toggleLoan.isChecked = false;

		this.tabtxt[0].string = "贷款金额";
		this.tabtxt[1].string = "月利息";

		this.tabNum[0].string =
			"<u>¥" + this.rePayData.data[0].liabilities + "</u>";
		this.tabNum2.string =
			"¥" +
			Math.floor(
				(this.rePayData.data[0].liabilities * this.loanData.loanRatePCT) / 100
			) +
			"/月";
		this.tabNum[0].node.color = cc.color(254, 158, 142, 1);

		let selectNumArr = [10000, 50000, 100000];
		this.selectNumArr = selectNumArr;
		for (let i = 0; i < this.btSelectArr.length; i++) {
			this.btSelectArr[i].node
				.getChildByName("money")
				.getComponent(cc.Label).string = "+¥" + selectNumArr[i];
			this.btSelectArr[i].node
				.getChildByName("Interest")
				.getComponent(cc.Label).string =
				"月利息¥" +
				Math.floor((selectNumArr[i] * this.loanData.loanRatePCT) / 100);
		}
	}

	onBtTabNum() {
		if (this.isShowLoan) {
			this.updateNum(this.loanData.amount, true);
		} else {
			this.updateNum(this.rePayData.data[0].liabilities, true);
		}
	}

	onShowTips() {
		this.tipsBank.node.active = this.toggleLoan.isChecked;
	}

	updateNum(num: number, isEdit?: boolean) {
		if (isEdit) {
			this.num = num;
		} else {
			this.num += num;
		}
		this.moneyEditBox.string = "" + this.num;
		this.moneyEditBox.node.getChildByName("txt").getComponent(cc.Label).string =
			"月利息¥" + Math.floor((this.num * this.loanData.loanRatePCT) / 100);
		this.startNum = 0;
	}

	onBtOk() {
		console.log("------------------------------>onBtOk");
		if (this.num > 0) {
			if (this.isShowLoan) {
				C2S.LoanReq(this.num);
			} else {
				C2S.RepayLoanReq(this.rePayData.data[0].id, this.num);
			}
		} else {
			Tips.show("请输入大于0的金额");
		}
	}

	onBtLoan() {
		C2S.GetLoanQualificationReq();
	}

	onBtReapy() {
		C2S.GetPlayerLoanAssetReq();
	}

	onLoan(res) {
		this.hide();
		Tips.show("贷款成功");
		RemoteAudio.getAudioByName(SoundName.SELL).then(clip => {
			cc.audioEngine.playEffect(clip, false);
		});
	}

	onRepayLoan(res: any) {
		this.hide();
		Tips.show("还款成功");
		C2S.SyncStateReq();
		RemoteAudio.getAudioByName(SoundName.LOAN_SUCCESS).then(clip => {
			cc.audioEngine.playEffect(clip, false);
		});
	}

	onShowA() {
		console.log("-------------->点击输入框");
		this.moneyEditBox.string = "" + this.num;
	}

	hidekeyBord() {
		this.hide();
		console.log("-------------->隐藏键盘");
		wx.hideKeyboard({
			success(res) {
				console.log("-------------->隐藏键盘成功");
			}
		});
	}

	onDestroy() {
		GameEvent.event.off(
			EventType.SOCKET_LOAN_QUALIFICATION,
			this.getLoanInfo,
			this
		);
		GameEvent.event.off(EventType.SOCKET_LOAN_ASSET, this.getLoanAsset, this);
		GameEvent.event.off(EventType.SOCKET_LOAN, this.onLoan, this);
		GameEvent.event.off(EventType.SOCKET_REPAY_LOAN, this.onRepayLoan, this);
	}
}
