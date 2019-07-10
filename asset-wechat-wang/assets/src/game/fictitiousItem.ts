import { pb } from "../asset.pb";
import StringUtils from "../until/StringUtils";
import Tips from "../until/Tips";
import { GameEvent, EventType } from "../lib/GameEvent";
import { RemoteImage } from "../lib/component/remoteImage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class fictitiousItem extends cc.Component {
	@property([cc.Label])
	contentNum: cc.Label[] = [];

	@property([cc.Label])
	contentTxt: cc.Label[] = [];

	@property(cc.Sprite)
	contnetImg: cc.Sprite = null;

	@property(cc.Label)
	titleTxt: cc.Label = null;

	@property(cc.Toggle)
	btSelcet: cc.Toggle = null;

	@property(cc.Button)
	btReduce: cc.Button = null;

	@property(cc.Button)
	btAdd: cc.Button = null;

	@property(cc.Label)
	sellCount: cc.Label = null;

	@property(cc.Button)
	auctionNumLeft: cc.Button = null;

	@property(cc.Button)
	auctionNumMiddle: cc.Button = null;

	@property(cc.Button)
	auctionNumRight: cc.Button = null;

	@property(cc.Node)
	iconPrice: cc.Node = null;

	@property(cc.Label)
	txtPrice: cc.Label = null;

	@property(cc.EditBox)
	countEdit: cc.EditBox = null;

	data: pb.common.IPlayerAsset;
	isNetAeest: boolean;
	isStock: boolean;
	num: number = 0;
	onLoad() {}

	clearData() {
		this.data = null;
		this.isNetAeest = false;
		this.isStock = false;
		this.num = 0;
	}

	setData(data: pb.common.IPlayerAsset, isNetAeest: boolean) {
		this.clearData();
		this.data = data;
		// let contentBgHeight = this.node.height
		let self: fictitiousItem = this;
		this.isNetAeest = isNetAeest;
		this.isStock = StringUtils.searchString(data.code, "STOCK:");

		//网络资产与实体判断
		if (this.isNetAeest) {
			//理财与股票判断
			this.btSelcet.isChecked = false;
			this.btReduce.node.getChildByName("txt").active = this.isStock;
			this.btAdd.node.getChildByName("txt").active = this.isStock;

			this.node.height = 500;
			this.btReduce.node.active = true;
			this.btAdd.node.active = true;
			this.node.getChildByName("auctioncionBg").active = true;
			this.iconPrice.active = false;
			this.txtPrice.node.active = false;
			this.auctionNumLeft.node.active = true;
			this.auctionNumMiddle.node.active = true;
			this.auctionNumRight.node.active = true;

			this.contentTxt[0].string = "买入价格";
			this.contentTxt[1].string = "持有股数";
			this.contentTxt[2].string = "卖出价格";
			this.contentTxt[3].string = "售出总价";

			this.contentNum[0].string = "¥" + StringUtils.ConvertInt2(data.unitPrice);
			this.contentNum[1].string = "" + data.quantity;
			this.contentNum[2].string = "¥" + StringUtils.ConvertInt2(data.sellPrice);
			this.updateContentNum(this.num);
		} else {
			this.btSelcet.isChecked = true;
			this.node.height = 500 - 160;
			this.btReduce.node.active = false;
			this.btAdd.node.active = false;
			this.node.getChildByName("auctioncionBg").active = false;
			this.iconPrice.active = true;
			this.txtPrice.node.active = true;
			this.auctionNumLeft.node.active = false;
			this.auctionNumMiddle.node.active = false;
			this.auctionNumRight.node.active = false;

			this.txtPrice.string = StringUtils.ConvertInt2(data.profit);

			this.contentTxt[0].string = "资产总价";
			this.contentTxt[1].string = "贷款总额";
			this.contentTxt[2].string = "首期支付";
			this.contentTxt[3].string = "月现金流";

			this.contentNum[0].string =
				"¥" + StringUtils.ConvertInt2(data.totalPrice);
			this.contentNum[1].string =
				"" + StringUtils.ConvertInt2(data.liabilities);
			this.contentNum[2].string =
				"¥" + StringUtils.ConvertInt2(data.totalPrice - data.liabilities);
			this.contentNum[3].string =
				"¥" + StringUtils.ConvertInt2(data.income - data.expense) + "/月";
			this.updateContentSelect();
		}

		this.titleTxt.string = data.name;

		// cc.loader.load(data.imgFile, function(err, texture) {
		// 	let spriteFrame = new cc.SpriteFrame(texture);
		// 	self.contnetImg.spriteFrame = spriteFrame;
		// });
		let remoteImage = this.getComponent(RemoteImage);
		remoteImage.getImageForScenario(data.imgFile).then((tex: cc.Texture2D) => {
			remoteImage.setImage(tex);
		});

		this.addEvent();
	}

	addEvent() {
		let self: fictitiousItem = this;
		this.btAdd.node.on("click", this.onAdd, this);
		this.btReduce.node.on("click", this.onReduce, this);

		this.auctionNumLeft.node.on("click", this.onBtLeft, this);
		this.auctionNumMiddle.node.on("click", this.onBtMiddle, this);
		this.auctionNumRight.node.on("click", this.onBtRight, this);
		this.btSelcet.node.on("toggle", this.updateContentSelect, this);

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
			if (this.num + 100 > this.data.quantity) {
				Tips.show("不能再多了");
			} else {
				this.updateContentNum(100);
			}
		} else {
			if (this.num + 1 > this.data.quantity) {
				Tips.show("不能再多了");
			} else {
				this.updateContentNum(1);
			}
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
		this.updateContentNum(Math.floor(this.data.quantity * 0.1), true);
	}

	onBtMiddle() {
		this.updateContentNum(Math.floor(this.data.quantity * 0.5), true);
	}

	onBtRight() {
		this.updateContentNum(this.data.quantity, true);
	}

	updateContentNum(num: number, isPercent?: boolean) {
		if (isPercent) {
			this.num = num;
		} else {
			this.num += num;
		}
		if (this.num > 0) {
			this.btSelcet.isChecked = true;
		}
		this.sellCount.string = "" + this.num;
		this.contentNum[3].string =
			"¥" + StringUtils.ConvertInt2(this.num * this.data.sellPrice);
		this.updateContentSelect();
	}

	updateContentSelect() {
		let data: pb.common.SellAssetsReq.Iitem = {
			assetID: this.data.id,
			quantity: this.isNetAeest ? this.num : 1
		};
		console.log(
			this.btSelcet.isChecked,
			data,
			"----------------->updateContentSelect"
		);
		if (this.btSelcet.isChecked) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.GAME_SELL_MSG, data)
			);
		}
		else {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.GAME_CANCEL_SELL, data)
			);
		}
	}

	onDestroy() {
		this.clearData();
	}
}
