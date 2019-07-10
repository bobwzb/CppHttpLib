import { pb } from "../asset.pb";
import fictitiousItem from "./fictitiousItem";
import { GameEvent, EventType } from "../lib/GameEvent";
import gameScene from "./gameScene";
import C2S from "../netWork/socket/C2S";
import Tips from "../until/Tips";
import cardCtrl from "./cardCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class fictitious extends cc.Component {
	@property(cc.Prefab)
	fictitiousItem: cc.Prefab = null;

	@property(cc.Node)
	contentView: cc.Node = null;

	@property(cc.Button)
	btBack: cc.Button = null;

	@property(cc.Button)
	btOk: cc.Button = null;

	data: pb.common.GetCanSellPlayerAssetRsp;
	sellData: pb.common.SellAssetsReq.Iitem[] = [];
	onLoad() {}

	show() {
		this.node.active = true;
	}

	hide() {
		this.node.active = false;
	}

	clearData() {
		this.data = null;
		this.sellData = [];
	}

	setData(data: pb.common.GetCanSellPlayerAssetRsp, isNetAeest: boolean) {
		console.log(
			isNetAeest,
			"-------------------->isNetAeestfictitious",
			data.data.length
		);
		cardCtrl.cardNodes[cardCtrl.cardNodes.length - 1].active = false;
		cardCtrl.cardNodes.push(this.node);
		this.clearData();
		this.data = data;
		GameEvent.event.on(EventType.GAME_SELL_MSG, this.onGameSellMsg, this);
		GameEvent.event.on(EventType.GAME_CANCEL_SELL, this.onGameCancelMsg, this);

		this.contentView.removeAllChildren();
		for (let i = 0; i < data.data.length; i++) {
			let node: cc.Node = cc.instantiate(this.fictitiousItem);
			this.contentView.addChild(node);

			node.getComponent(fictitiousItem).setData(this.data.data[i], isNetAeest);
		}

		if (data.data.length > 1) {
			this.node.height = 622 + 198;
			this.contentView.parent.height = 494 + 198;
			this.contentView.parent.parent.height = 494 + 198;

			this.btBack.node.y = 275 + 198 / 2;
			this.node.getChildByName("auctionTitle").y = 275 + 198 / 2;

			this.btOk.node.y = -386 - 198 / 2;
		} else {
			this.node.height = 622;
			this.contentView.parent.height = 494;
			this.contentView.parent.parent.height = 494;

			this.btBack.node.y = 275;
			this.node.getChildByName("auctionTitle").y = 275;

			this.btOk.node.y = -386;
		}

		this.btBack.node.on("click", this.onBtBack, this);
		this.btOk.node.on("click", this.onBtOk, this);
	}

	onBtBack(evt: any) {
		this.hide();
		cardCtrl.cardNodes.pop();
		cardCtrl.cardNodes[cardCtrl.cardNodes.length - 1].active = true;
	}
	onGameCancelMsg(res: any) {
		let msg: pb.common.SellAssetsReq.Iitem = res.userData;
		let isHas: boolean = false;
		let index: number=-1;
		for (let i = 0; i < this.sellData.length; i++) {
			if (msg.assetID == this.sellData[i].assetID) {
				index=i;
				break;
			}
		}
		if(index>=0){
			this.sellData.splice(index,1);
		}
	}

	onGameSellMsg(res: any) {
		let msg: pb.common.SellAssetsReq.Iitem = res.userData;
		let isHas: boolean = false;
		for (let i = 0; i < this.sellData.length; i++) {
			if (msg.assetID == this.sellData[i].assetID) {
				this.sellData[i].quantity = msg.quantity;
				isHas = true;
				break;
			}
		}
		if (!isHas) {
			this.sellData.push(msg);
		}
		console.log(this.sellData, "this.sellData");
	}

	onBtOk(evt: any) {
		console.log(this.sellData, "this.sellData2");
		if (this.sellData.length > 0) {
			C2S.SellAssetsReq(this.sellData);
		} else {
			Tips.show("请至少选中一个资产卖哦");
		}
	}

	onDestroy() {
		this.clearData();
	}
}
