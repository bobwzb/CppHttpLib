import { pb } from "../asset.pb";
import UserData from "../data/userData";
import C2S from "../netWork/socket/C2S";
import { GameEvent, EventType } from "../lib/GameEvent";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class offerLeft extends cc.Component {
	@property(cc.Button)
	btAuction: cc.Button = null;

	@property(cc.Button)
	btDetail: cc.Button = null;

	@property(cc.Button)
	btGiveUp: cc.Button = null;

	data: pb.common.StartAuctionMsg;
	onLoad() {}

	show() {
		let self = this;
		self.node.active = true;
		self.node.setPosition(124, 0);
		this.node.stopAllActions();
		this.node.runAction(cc.moveTo(0.4, 0, 0));
	}

	hide(isShow?: boolean) {
		let self = this;
		self.node.setPosition(0, 0);
		this.node.stopAllActions();
		this.node.runAction(cc.moveTo(0.4, 124, 0));
	}

	setData(data: pb.common.StartAuctionMsg) {
		this.clearData();
		this.data = data;

		if (data.base.userId.equals(UserData.uid)) {
			this.btAuction.node.active = false;
			this.btGiveUp.node.active = false;
		} else {
			this.btAuction.node.active = true;
			this.btGiveUp.node.active = true;
		}
		this.addEvent();
	}

	addEvent() {
		this.btAuction.node.on("click", this.onBtAuction, this);
		this.btDetail.node.on("click", this.onBtDetail, this);
		this.btGiveUp.node.on("click", this.onBtGiveUp, this);
	}

	onBtAuction() {
		GameEvent.event.dispatchEvent(
			new GameEvent(EventType.GAME_CHANCE_AUCT_OFFER)
		);
	}

	onBtDetail() {
		GameEvent.event.dispatchEvent(new GameEvent(EventType.GAME_CHANCE_DETAIL));
	}

	onBtGiveUp() {
		C2S.GiveUpAuctionReq(this.data.auctionId);
	}

	clearData() {
		this.data = null;
	}

	onDestroy() {
		this.clearData();
	}
}
