import { pb } from "../asset.pb";
import Tips from "../until/Tips";
import StringUtils from "../until/StringUtils";
import C2S from "../netWork/socket/C2S";

const { ccclass, property } = cc._decorator;

@ccclass
export default class offerBottom extends cc.Component {
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

	@property(cc.EditBox)
	countEdit: cc.EditBox = null;

	@property(cc.Label)
	titleTxt: cc.Label = null;

	data: pb.common.StartAuctionMsg;
	num: number = 0;
	onLoad() {}

	show() {
		this.node.stopAllActions();
		this.node.active = true;
		this.node.setPosition(0, (-900 * cc.winSize.height) / 1334);
		this.node.runAction(cc.moveTo(0.3, 0, (-667 * cc.winSize.height) / 1334));
	}

	hide() {
		this.node.stopAllActions();
		this.node.active = false;
		this.node.setPosition(0, (-667 * cc.winSize.height) / 1334);
		this.node.runAction(cc.moveTo(0.3, 0, (-900 * cc.winSize.height) / 1334));
	}

	setData(data: pb.common.StartAuctionMsg) {
		this.clearData();
		this.data = data;

		this.titleTxt.string =
			"最高出价:¥" + StringUtils.ConvertInt2(this.data.floorPrice);

		this.addEvent();
		this.updateContentNum(this.data.floorPrice);
	}

	addEvent() {
		let self: offerBottom = this;
		this.btAdd.node.on("click", this.onAdd, this);
		this.btReduce.node.on("click", this.onReduce, this);

		this.auctionNumLeft.node.on("click", this.onBtLeft, this);
		this.auctionNumMiddle.node.on("click", this.onBtMiddle, this);
		this.auctionNumRight.node.on("click", this.onBtRight, this);

		this.btOk.node.on("click", this.onAuction, this);

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
		if (this.num >= 1000 + this.data.floorPrice) {
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
		if (this.num >= this.data.floorPrice) {
			let data = {
				count: this.num
			};
			this.hide();
			C2S.AuctionBidReq(this.data.auctionId, this.num);
		} else {
			Tips.show("竞拍价不得低于起拍价");
		}
	}

	clearData() {
		this.data = null;
		this.num = 0;
	}

	onDestroy() {
		this.clearData();
	}
}
