import C2S from "../netWork/socket/C2S";
import { pb } from "../asset.pb";
import StringUtils from "../until/StringUtils";
import { GameEvent, EventType } from "../lib/GameEvent";
import cardCtrl from "./cardCtrl";
import { RemoteImage } from "../lib/component/remoteImage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class investDetail extends cc.Component {
	@property(cc.Button)
	btClose: cc.Button = null;

	@property(cc.Label)
	titleTxt: cc.Label = null;

	@property(cc.Label)
	moneyNum: cc.Label = null;

	@property(cc.Sprite)
	contnetImg: cc.Sprite = null;

	@property([cc.Label])
	contnetNum: cc.Label[] = [];

	@property([cc.Label])
	contnetTxt: cc.Label[] = [];

	@property(cc.Label)
	detailTxt: cc.Label = null;

	@property(cc.Label)
	remindLabel: cc.Label = null;

	data: pb.common.StartAuctionMsg;
	isMy: boolean;
	isNetAeest: boolean = false;
	txtColor: cc.Color[] = [
		cc.color(255, 0, 0),
		cc.color(102, 102, 102),
		cc.color(255, 175, 0)
	];
	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
		this.onDestroy();
	}

	clearData() {
		this.data = null;
		this.isMy = false;
		this.isNetAeest = false;
	}

	setData(data: pb.common.StartAuctionMsg, idx: number, isMy: boolean) {
		this.clearData();
		// cardCtrl.cardNodes.push(this.node);
		let self: investDetail = this;
		this.data = data;
		this.isMy = isMy;
		if (idx == 1) {
			this.btClose.node.active = false;
		} else if (idx == 2) {
			this.btClose.node.active = true;
		}

		this.titleTxt.string = data.scenario.Name;
		this.moneyNum.string = "¥" + StringUtils.ConvertInt2(data.scenario.C_Price);

		// cc.loader.load(data.scenario.imgFile, function(err, texture) {
		// 	let spriteFrame = new cc.SpriteFrame(texture);
		// 	self.contnetImg.spriteFrame = spriteFrame;
		// });

		let remoteImage = this.getComponent(RemoteImage);
		remoteImage
			.getImageForScenario(data.scenario.imgFile)
			.then((tex: cc.Texture2D) => {
				remoteImage.setImage(tex);
			});

		for (let i = 0; i < this.contnetNum.length; i++) {
			this.contnetNum[i].node.active = false;
			this.contnetTxt[i].node.active = false;
		}

		if (data.scenario.Code == "HOUSE") {
			this.onShowHouse();
		} else if (data.scenario.Code == "LAND") {
			this.showLand();
		} else if (
			data.scenario.Code == "GOLD:COIN" ||
			data.scenario.Code == "GOLD"
		) {
			this.showGold();
		} else if (
			data.scenario.Code == "2BIG" ||
			data.scenario.Code == "DEPOSIT"
		) {
			this.isNetAeest = true;
			this.showAsset();
		} else if (StringUtils.searchString(data.scenario.Code, "EQUITY:")) {
			this.onShowEquity();
		} else if (StringUtils.searchString(data.scenario.Code, "CO:")) {
			if (
				data.scenario.Code == "CO:MACHINE" ||
				data.scenario.Code == "CO:SOFT"
			) {
				this.showCompany();
			} else {
				this.onShowBigCompany();
			}
		} else if (StringUtils.searchString(data.scenario.Code, "STOCK:")) {
			this.isNetAeest = true;
			this.onShowStock();
		}

		this.addEvent();
		this.detailTxt.string = this.data.scenario.Desc;
	}

	addEvent() {
		this.btClose.node.on("click", this.onBtClose, this);
	}

	onBtClose() {
		this.hide();
	}

	onShowHouse() {
		for (let i = 0; i < this.contnetNum.length; i++) {
			this.contnetNum[i].node.active = true;
			this.contnetTxt[i].node.active = true;
		}
		this.contnetNum[0].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_DownPayment);
		this.contnetNum[1].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_Loan);
		this.contnetNum[2].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_Income) + "/月";
		this.contnetNum[3].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_Interest) + "/月";
		this.contnetNum[4].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_MonthCashFlow) + "/月";
		this.contnetNum[5].string =
			this.data.scenario.C_YieldRatePCT.toFixed(2) + "%";

		this.contnetTxt[0].string = "首期支付";
		this.contnetTxt[1].string = "银行贷款";
		this.contnetTxt[2].string = "租金收入";
		this.contnetTxt[3].string = "贷款利息";
		this.contnetTxt[4].string = "月现金流";
		this.contnetTxt[5].string = "年收益率";

		this.remindLabel.string = "总价";
		this.contnetTxt[0].node.color = this.txtColor[1];
		this.contnetTxt[1].node.color = this.txtColor[1];
		this.contnetNum[0].node.color = this.txtColor[0];
		this.contnetNum[1].node.color = this.txtColor[0];

		this.contnetNum[4].node.color = this.getColor(
			this.data.scenario.C_MonthCashFlow
		);
		this.contnetNum[5].node.color = this.getColor(
			this.data.scenario.C_YieldRatePCT
		);
	}

	showLand() {
		for (let i = 0; i < 1; i++) {
			this.contnetNum[i].node.active = true;
			this.contnetTxt[i].node.active = true;
		}
		this.contnetNum[0].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_DownPayment);
		this.contnetTxt[0].string = "首期支付";
		this.contnetTxt[0].node.color = this.txtColor[1];
		this.contnetNum[0].node.color = this.txtColor[0];

		this.remindLabel.string = "总价";
	}

	showGold() {
		for (let i = 0; i < 1; i++) {
			this.contnetNum[i].node.active = true;
			this.contnetTxt[i].node.active = true;
		}
		this.contnetNum[0].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_DownPayment);
		this.contnetTxt[0].string = "首期支付";
		this.contnetTxt[0].node.color = this.txtColor[1];
		this.contnetNum[0].node.color = this.txtColor[0];

		this.remindLabel.string = "总价";
	}

	showCompany() {
		for (let i = 0; i < 1; i++) {
			this.contnetNum[i].node.active = true;
			this.contnetTxt[i].node.active = true;
		}
		this.contnetNum[0].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_DownPayment);
		this.contnetTxt[0].string = "首期支付";
		this.contnetTxt[0].node.color = this.txtColor[1];
		this.contnetNum[0].node.color = this.txtColor[0];

		this.remindLabel.string = "总价";
	}

	showAsset() {
		for (let i = 0; i < 4; i++) {
			this.contnetNum[i].node.active = true;
			this.contnetTxt[i].node.active = true;
		}
		this.contnetNum[0].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_DownPayment);
		this.contnetNum[1].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_Income) + "/月";
		this.contnetNum[2].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_MonthCashFlow) + "/月";
		this.contnetNum[3].string =
			this.data.scenario.C_YieldRatePCT.toFixed(1) + "%";

		this.contnetTxt[0].string = "首期支付";
		this.contnetTxt[1].string = "利息收入";
		this.contnetTxt[2].string = "月现金流";
		this.contnetTxt[3].string = "年收益率";

		this.remindLabel.string = "每份";
		this.contnetTxt[0].node.color = this.txtColor[1];
		this.contnetNum[2].node.color = this.getColor(
			this.data.scenario.C_MonthCashFlow
		);
		this.contnetNum[3].node.color = this.getColor(
			this.data.scenario.C_YieldRatePCT
		);
		this.contnetNum[0].node.color = this.txtColor[0];
	}

	onShowEquity() {
		for (let i = 0; i < 4; i++) {
			this.contnetNum[i].node.active = true;
			this.contnetTxt[i].node.active = true;
		}
		this.contnetNum[0].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_DownPayment);
		this.contnetNum[1].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_Income) + "/月";
		this.contnetNum[2].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_MonthCashFlow) + "/月";
		this.contnetNum[3].string =
			this.data.scenario.C_YieldRatePCT.toFixed(1) + "%";

		this.contnetTxt[0].string = "首期支付";
		this.contnetTxt[1].string = "经营收入";
		this.contnetTxt[2].string = "月现金流";
		this.contnetTxt[3].string = "年收益率";

		this.remindLabel.string = "总价";
		this.contnetTxt[0].node.color = this.txtColor[1];
		this.contnetNum[2].node.color = this.getColor(
			this.data.scenario.C_MonthCashFlow
		);
		this.contnetNum[3].node.color = this.getColor(
			this.data.scenario.C_YieldRatePCT
		);
		this.contnetNum[0].node.color = this.txtColor[0];
	}

	onShowBigCompany() {
		for (let i = 0; i < this.contnetNum.length; i++) {
			this.contnetNum[i].node.active = true;
			this.contnetTxt[i].node.active = true;
		}
		this.contnetNum[0].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_DownPayment);
		this.contnetNum[1].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_Loan);
		this.contnetNum[2].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_Income) + "/月";
		this.contnetNum[3].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_Interest) + "/月";
		this.contnetNum[4].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_MonthCashFlow) + "/月";
		this.contnetNum[5].string =
			this.data.scenario.C_YieldRatePCT.toFixed(1) + "%";

		this.contnetTxt[0].string = "首期支付";
		this.contnetTxt[1].string = "银行贷款";
		this.contnetTxt[2].string = "经营收入";
		this.contnetTxt[3].string = "贷款利息";
		this.contnetTxt[4].string = "月现金流";
		this.contnetTxt[5].string = "年收益率";

		this.remindLabel.string = "总价";
		this.contnetTxt[0].node.color = this.txtColor[1];
		this.contnetTxt[1].node.color = this.txtColor[1];
		this.contnetNum[2].node.color = this.getColor(
			this.data.scenario.C_MonthCashFlow
		);
		this.contnetNum[3].node.color = this.getColor(
			this.data.scenario.C_YieldRatePCT
		);
		this.contnetNum[0].node.color = this.txtColor[0];
		this.contnetNum[1].node.color = this.txtColor[0];
	}

	onShowStock() {
		for (let i = 0; i < 2; i++) {
			this.contnetNum[i].node.active = true;
			this.contnetTxt[i].node.active = true;
		}
		this.contnetNum[0].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_HighPrice);
		this.contnetNum[1].string =
			"¥" + StringUtils.ConvertInt2(this.data.scenario.C_LowPrice);

		this.contnetTxt[0].string = "历史最高";
		this.contnetTxt[1].string = "历史最低";

		this.remindLabel.string = "每股";
	}

	getColor(num: number) {
		if (num > 0) {
			return this.txtColor[2];
		} else {
			return this.txtColor[0];
		}
	}

	onDestroy() {
		this.clearData();
	}
}
