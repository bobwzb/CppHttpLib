import { pb } from "../asset.pb";
import StringUtils from "../until/StringUtils";
import Tips from "../until/Tips";
import C2S from "../netWork/socket/C2S";
import gameScene from "./gameScene";
import { GameEvent, EventType } from "../lib/GameEvent";
import cardCtrl from "./cardCtrl";
import { RemoteImage } from "../lib/component/remoteImage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class fictitiousBuy extends cc.Component {
	@property([cc.Label])
	contentNum: cc.Label[] = [];

	@property(cc.Sprite)
	contnetImg: cc.Sprite = null;

	@property(cc.Label)
	titleTxt: cc.Label = null;

	@property(cc.Button)
	btReduce: cc.Button = null;

	@property(cc.Button)
	btAdd: cc.Button = null;

	@property(cc.Button)
	auctionNumLeft: cc.Button = null;

	@property(cc.Button)
	auctionNumMiddle: cc.Button = null;

	@property(cc.Button)
	auctionNumRight: cc.Button = null;

	@property(cc.Label)
	buyCount: cc.Label = null;

	@property(cc.Button)
	btOk: cc.Button = null;

	@property(cc.Button)
	btBack: cc.Button = null;

	@property(cc.EditBox)
	countEdit: cc.EditBox = null;

	data: pb.common.ChooseChanceMsg;
	isStock: boolean;
	num: number = 0;
	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}

	clearData() {
		this.data = null;
		this.isStock = false;
		this.num = 0;
	}

	setData(data: pb.common.ChooseChanceMsg) {
		cardCtrl.cardNodes[cardCtrl.cardNodes.length - 1].active = false;
		cardCtrl.cardNodes.push(this.node);
		this.clearData();

		let remoteImage = this.getComponent(RemoteImage);
		remoteImage
			.getImageForScenario(data.scenario.imgFile)
			.then((tex: cc.Texture2D) => {
				remoteImage.setImage(tex);
			});

		this.data = data;
		// let contentBgHeight = this.node.getChildByName("auctionNumBg").height
		let self: fictitiousBuy = this;

		if (StringUtils.searchString(data.scenario.Code, "STOCK:")) {
			console.log("--------------->购买股票");
			this.node.getChildByName("auctionNumBg").height = 469;
			this.isStock = true;
		} else {
			console.log("--------------->购买理财");
			this.node.getChildByName("auctionNumBg").height = 469 - 72;
			this.isStock = false;
		}

		this.auctionNumLeft.node.active = this.isStock;
		this.auctionNumMiddle.node.active = this.isStock;
		this.auctionNumRight.node.active = this.isStock;
		this.btReduce.node.getChildByName("txt").active = this.isStock;
		this.btAdd.node.getChildByName("txt").active = this.isStock;

		this.titleTxt.string = data.scenario.Name;

		this.contentNum[0].string =
			"¥" + StringUtils.ConvertInt2(data.scenario.C_Price);

		// cc.loader.load(data.imgFile, function(err, texture) {
		// 	let spriteFrame = new cc.SpriteFrame(texture);
		// 	self.contnetImg.spriteFrame = spriteFrame;
		// });

		this.addEvent();
		this.updateContentNum(this.num);
	}

	addEvent() {
		let self: fictitiousBuy = this;
		this.btAdd.node.on("click", this.onAdd, this);
		this.btReduce.node.on("click", this.onReduce, this);

		this.auctionNumLeft.node.on("click", this.onBtLeft, this);
		this.auctionNumMiddle.node.on("click", this.onBtMiddle, this);
		this.auctionNumRight.node.on("click", this.onBtRight, this);

		this.btOk.node.on("click", this.onBuy, this);

		this.btBack.node.on("click", this.onBtBack, this);

		this.countEdit.node.on(
			"text-changed",
			function(params: any) {
				self.updateContentNum(Number(self.countEdit.string), true);
			},
			this
		);
	}

	onAdd() {
		if (this.isStock) {
			this.updateContentNum(100);
		} else {
			this.updateContentNum(1);
		}
	}

	onReduce() {
		if (this.isStock) {
			if (this.num >= 100) {
				this.updateContentNum(-100);
			} else {
				Tips.show("不能再少了!");
			}
		} else {
			if (this.num >= 1) {
				this.updateContentNum(-1);
			} else {
				Tips.show("不能再少了!");
			}
		}
	}

	onBtLeft() {
		this.updateContentNum(1000);
	}

	onBtMiddle() {
		this.updateContentNum(5000);
	}

	onBtRight() {
		this.updateContentNum(10000);
	}

	updateContentNum(num: number, isAppoint?: boolean) {
		console.log(this.num);
		if (isAppoint) {
			this.num = num;
		} else {
			this.num += num;
		}
		this.buyCount.string = "" + this.num;
		this.contentNum[1].string =
			"¥" + StringUtils.ConvertInt2(this.num * this.data.scenario.C_Price);
	}

	onBuy() {
		if (this.num > 0) {
			let data = {
				count: this.num
			};
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.GAME_PAY_COUNT, data)
			);
			C2S.TryPayReq(this.num);
		} else {
			Tips.show("请至少购买一个哦");
		}
	}

	onBtBack(evt: any) {
		this.hide();
		cardCtrl.cardNodes.pop();
		cardCtrl.cardNodes[cardCtrl.cardNodes.length - 1].active = true;
	}

	onDestroy() {
		this.clearData();
	}
}
