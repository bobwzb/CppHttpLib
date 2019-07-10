import { pb } from "../asset.pb";
import StringUtils from "../until/StringUtils";
import Tips from "../until/Tips";
import C2S from "../netWork/socket/C2S";
import gameScene from "./gameScene";
import { GameEvent, EventType } from "../lib/GameEvent";
import cardCtrl from "./cardCtrl";
import investChance from "./investChance";

const { ccclass, property } = cc._decorator;

@ccclass
export default class auctionCtrl extends cc.Component {
	@property(cc.Sprite)
	contnetImg: cc.Sprite = null;

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
	auctionCount: cc.Label = null;

	@property(cc.Button)
	btOk: cc.Button = null;

	@property(cc.Button)
	btBack: cc.Button = null;

	@property(cc.EditBox)
	countEdit: cc.EditBox = null;

	data: pb.common.ChooseChanceMsg;
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
		this.num = 0;
	}

	setData(data: pb.common.ChooseChanceMsg) {
		cardCtrl.cardNodes[cardCtrl.cardNodes.length - 1].active = false;
		cardCtrl.cardNodes.push(this.node);
		this.clearData();

		this.data = data;
		let self: auctionCtrl = this;

		// cc.loader.load(data.imgFile, function(err, texture) {
		// 	let spriteFrame = new cc.SpriteFrame(texture);
		// 	self.contnetImg.spriteFrame = spriteFrame;
		// });

		this.addEvent();
		this.updateContentNum(this.num);
	}

	addEvent() {
		let self: auctionCtrl = this;
		this.btAdd.node.on("click", this.onAdd, this);
		this.btReduce.node.on("click", this.onReduce, this);

		this.auctionNumLeft.node.on("click", this.onBtLeft, this);
		this.auctionNumMiddle.node.on("click", this.onBtMiddle, this);
		this.auctionNumRight.node.on("click", this.onBtRight, this);

		this.btOk.node.on("click", this.onAuction, this);

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
		this.updateContentNum(1000);
	}

	onReduce() {
		if (this.num >= 1000) {
			this.updateContentNum(-1000);
		} else {
			Tips.show("不能再少了!");
		}
	}

	onBtLeft() {
		this.updateContentNum(10000);
	}

	onBtMiddle() {
		this.updateContentNum(50000);
	}

	onBtRight() {
		this.updateContentNum(100000);
	}

	updateContentNum(num: number, isAppoint?: boolean) {
		console.log(this.num);
		this.num += num;
		this.auctionCount.string = "" + StringUtils.ConvertInt2(this.num);
	}

	onAuction() {
		if (this.num > 0) {
			let data = {
				count: this.num
			};
			this.hide();
			C2S.StartAuctionReq(this.num);
		} else {
			Tips.show("请设置起拍价");
		}
	}

	onBtBack(evt: any) {
		this.hide();
		cardCtrl.cardNodes.pop();
		cardCtrl.cardNodes[cardCtrl.cardNodes.length - 1]
			.getComponent(investChance)
			.show();
	}

	onDestroy() {
		this.clearData();
	}
}
