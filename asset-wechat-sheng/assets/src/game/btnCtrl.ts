import C2S from "../netWork/socket/C2S";
import { pb } from "../asset.pb";
import GameSocket from "../netWork/socket/GameSocket";
import { Message } from "../lib/mars/mars";
import { GameEvent, EventType } from "../lib/GameEvent";
import gameScene from "./gameScene";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class btnCtrl extends cc.Component {
	@property([cc.Node])
	btChildNode: cc.Node[] = [];

	@property(cc.Button)
	btKnow: cc.Button = null;

	@property(cc.Button)
	btQuit: cc.Button = null;

	@property(cc.Button)
	btThreeLeft: cc.Button = null;

	@property(cc.Button)
	btThreeMiddle: cc.Button = null;

	@property(cc.Button)
	btThreeRight: cc.Button = null;

	@property(cc.Button)
	btTwoLeft: cc.Button = null;

	@property(cc.Button)
	btTwoRight: cc.Button = null;

	@property([cc.SpriteFrame])
	btSpriteFrame: cc.SpriteFrame[] = [];

	idx: number;
	btEvent: number;
	data: any;
	onLoad() {}

	addEvent() {
		this.btKnow.node.on("click", this.onBtKnow, this);
		this.btQuit.node.on("click", this.onBtQuit, this);
		this.btThreeLeft.node.on("click", this.onBtThreeLeft, this);
		this.btThreeMiddle.node.on("click", this.onBtThreeMiddle, this);
		this.btThreeRight.node.on("click", this.onBtThreeRight, this);
		this.btTwoLeft.node.on("click", this.onBtTwoLeft, this);
		this.btTwoRight.node.on("click", this.onBtTwoRight, this);
	}

	onBtKnow(evt: any) {
		console.log("--------------->onBtKnow");
		let self: btnCtrl = this;
		if (this.btEvent == 1) {
			// C2S.UnemploymentAckReq()
		} else if (this.btEvent == 5) {
			C2S.BuyReq(1);
		} else if (this.btEvent == 6) {
			C2S.SellAssetsReq(this.data.msg);
		} else if (this.btEvent == 7) {
			let data: any = {
				idx: 1,
				titleIcon: 3,
				btEvent: 8
			};
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.GAME_SHOW_PAY_CONFIRM, data)
			);
		} else if (this.btEvent == 8) {
			// C2S.BuyReq(1)
		}
	}

	onBtQuit(evt: any) {}

	onBtThreeLeft(evt: any) {
		if (this.data.btEvent.event1 == 1) {
			GameEvent.event.dispatchEvent(new GameEvent(EventType.GAME_CHANCE_BUY));
		}
	}

	onBtThreeMiddle(evt: any) {
		if (this.data.btEvent.event2 == 1) {
			console.log("拍卖");
		} else if (this.data.btEvent.event2 == 2) {
			C2S.GetCanSellPlayerAssetReq();
		}
	}

	onBtThreeRight(evt: any) {}

	onBtTwoLeft(evt: any) {
		if (this.data.btEvent.event1 == 1) {
			GameEvent.event.dispatchEvent(new GameEvent(EventType.GAME_SHOW_BUY_NET));
		}
	}

	onBtTwoRight(evt: any) {
		if (this.data.btEvent.event1 == 1) {
			// GameEvent.event.dispatchEvent(new GameEvent(EventType.GAME_SHOW_BUY_NET))
		}
	}

	hide() {
		this.node.active = false;
	}

	show() {
		this.node.active = true;
	}

	setData(data: any) {
		this.idx = data.idx;

		this.btEvent = data.btEvent;

		this.data = data;

		this.addEvent();

		for (let i = 0; i < this.btChildNode.length; i++) {
			this.btChildNode[i].active = false;
		}
		if (data.idx == 1) {
			this.btChildNode[data.idx - 1].active = true;
			this.setBt0(data.content);
		} else if (data.idx == 2) {
			this.btChildNode[data.idx - 1].active = true;
			this.setBt1(data.content);
		} else if (data.idx == 3) {
			this.btChildNode[data.idx - 1].active = true;
			this.setBt2(data.content);
		} else if (data.idx == 4) {
			this.btChildNode[data.idx - 1].active = true;
			this.setBt3(data.content);
		}
	}

	setBt0(content: any) {
		let btLeftTxt: cc.Node = this.btThreeLeft.node.getChildByName("txt");
		let btMiddleTxt: cc.Node = this.btThreeMiddle.node.getChildByName("txt");
		let btRightTxt: cc.Node = this.btThreeRight.node.getChildByName("txt");

		let btLeftIcon: cc.Node = this.btThreeLeft.node.getChildByName("icon");
		let btMiddleIcon: cc.Node = this.btThreeMiddle.node.getChildByName("icon");
		let btRightIcon: cc.Node = this.btThreeRight.node.getChildByName("icon");

		if (content.txt1) {
			btLeftTxt.active = true;
			btLeftTxt.getComponent(cc.Label).string = content.txt1;
		} else {
			btLeftTxt.active = false;
		}

		if (content.txt2) {
			btMiddleTxt.active = true;
			btMiddleTxt.getComponent(cc.Label).string = content.txt2;
		} else {
			btMiddleTxt.active = false;
		}

		if (content.txt3) {
			btRightTxt.active = true;
			btRightTxt.getComponent(cc.Label).string = content.txt3;
		} else {
			btRightTxt.active = false;
		}

		if (content.icon1) {
			btLeftIcon.active = true;
			btLeftIcon.getComponent(cc.Sprite).spriteFrame = this.btSpriteFrame[
				content.icon1 - 1
			];
		} else {
			btLeftIcon.active = false;
		}

		if (content.icon2) {
			btMiddleIcon.active = true;
			btMiddleIcon.getComponent(cc.Sprite).spriteFrame = this.btSpriteFrame[
				content.icon2 - 1
			];
		} else {
			btMiddleIcon.active = false;
		}

		if (content.icon3) {
			btRightIcon.active = true;
			btRightIcon.getComponent(cc.Sprite).spriteFrame = this.btSpriteFrame[
				content.icon3 - 1
			];
		} else {
			btRightIcon.active = false;
		}
	}

	setBt1(content: any) {
		let btLeftTxt: cc.Node = this.btTwoLeft.node.getChildByName("txt");
		let btRightTxt: cc.Node = this.btTwoRight.node.getChildByName("txt");

		let btLeftIcon: cc.Node = this.btTwoLeft.node.getChildByName("icon");
		let btRightIcon: cc.Node = this.btTwoRight.node.getChildByName("icon");

		if (content.txt1) {
			btLeftTxt.active = true;
			btLeftTxt.getComponent(cc.Label).string = content.txt1;
		} else {
			btLeftTxt.active = false;
		}

		if (content.txt2) {
			btRightTxt.active = true;
			btRightTxt.getComponent(cc.Label).string = content.txt2;
		} else {
			btRightTxt.active = false;
		}

		if (content.icon1) {
			btLeftIcon.active = true;
			btLeftIcon.getComponent(cc.Sprite).spriteFrame = this.btSpriteFrame[
				content.icon1 - 1
			];
		} else {
			btLeftIcon.active = false;
		}

		if (content.icon2) {
			btRightIcon.active = true;
			btRightIcon.getComponent(cc.Sprite).spriteFrame = this.btSpriteFrame[
				content.icon2 - 1
			];
		} else {
			btRightIcon.active = false;
		}
	}

	setBt2(content: any) {
		let btKnowTxt: cc.Node = this.btKnow.node.getChildByName("txt");

		let btKnowIcon: cc.Node = this.btKnow.node.getChildByName("icon");

		if (content.txt1) {
			btKnowTxt.active = true;
			btKnowTxt.getComponent(cc.Label).string = content.txt1;
		} else {
			btKnowTxt.active = false;
		}

		if (content.icon1) {
			btKnowIcon.active = true;
			btKnowIcon.getComponent(cc.Sprite).spriteFrame = this.btSpriteFrame[
				content.icon1 - 1
			];
		} else {
			btKnowIcon.active = false;
		}
	}

	setBt3(content: any) {
		let btQuitTxt: cc.Node = this.btQuit.node.getChildByName("txt");

		let btQuitIcon: cc.Node = this.btQuit.node.getChildByName("icon");

		if (content.txt1) {
			btQuitTxt.active = true;
			btQuitTxt.getComponent(cc.Label).string = content.txt1;
		} else {
			btQuitTxt.active = false;
		}

		if (content.icon1) {
			btQuitIcon.active = true;
			btQuitIcon.getComponent(cc.Sprite).spriteFrame = this.btSpriteFrame[
				content.icon1 - 1
			];
		} else {
			btQuitIcon.active = false;
		}
	}
}
