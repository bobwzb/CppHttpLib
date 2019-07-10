import UserData from "../data/userData";
import dataItem from "./dataItem";
import WxHttpControl from "../netWork/http/WxHttpControl";
import { GameEvent, EventType } from "../lib/GameEvent";
import ServerLoading from "./ServerLoadingPopup";
import BasicScene from "../lib/BasicScene";
import { pb } from "../asset.pb";
import { util } from "protobufjs";
const { ccclass, property } = cc._decorator;
var protobuf = require("protobufjs/minimal");

@ccclass
export default class DataScene extends BasicScene {
	@property(cc.Prefab)
	dataItem: cc.Prefab = null;

	@property(cc.Node)
	dataContent: cc.Node = null;

	@property(cc.Label)
	dataTitle: cc.Label = null;

	@property(cc.Label)
	dataNo: cc.Label = null;

	@property(cc.ScrollView)
	Scroll: cc.ScrollView = null;

	prevAction: cc.Action = null;
	nextAction: cc.Action = null;

	curPageNum: number = 1;
	isCan: boolean = true;
	nodeNo: cc.Node;
	isOver: boolean = false;
	onLoad() {
		// this.nextAction = cc.moveTo(0.25, cc.v2(0, 0));
		// this.prevAction = cc.moveTo(
		// 	0.5,
		// 	cc.v2(cc.winSize.width * 1.5, cc.winSize.height / 2)
		// );

		this.dataContent.removeAllChildren();
		let lineNode: cc.Node = new cc.Node();
		lineNode.setContentSize(710, 8);
		this.dataContent.addChild(lineNode);

		// ServerLoading.show()
		WxHttpControl.getGameRatio();
		WxHttpControl.getGameHistory(this.curPageNum);
		this.nodeNo = new cc.Node();
		this.nodeNo.addComponent(cc.Label).string = "- 没有更多数据了 -";
		this.nodeNo.getComponent(cc.Label).fontSize = 28;
		this.nodeNo.color = cc.color(153, 153, 153);
		this.nodeNo.height = 50;

		this.addEvent();
		this.node.getChildByName("contentView").height =
			(cc.winSize.height / 1334) * 1155;
		this.node.getChildByName("contentView").getChildByName("view").height =
			(cc.winSize.height / 1334) * 1155;
	}

	onBtBack() {
		cc.director.loadScene("hallScene");
	}

	public addEvent() {
		GameEvent.event.on(EventType.HTTP_GET_GAME_RATIO, this.setRatioData, this);
		GameEvent.event.on(EventType.HTTP_GET_GAME_HISTORY, this.setItemData, this);
		GameEvent.event.on(
			EventType.HTTP_GET_GAME_RESULT_PAGE,
			this.onGameResult,
			this
		);
		this.Scroll.node.on("scrolling", this.onScrollingEvent, this);
	}

	setRatioData(res: any) {
		this.dataTitle.string =
			"游戏胜率：" + res.userData.data.rank_winning_ratio + "%";
	}

	setItemData(res: any) {
		console.log(res, "res---------------------->");
		// ServerLoading.hide()
		if (res.userData.data.games.length == 0) {
			this.isOver = true;
			ServerLoading.hide();
			return;
		}
		this.dataNo.node.active = false;
		if (this.nodeNo.parent) {
			this.nodeNo.removeFromParent();
		}
		for (let i = 0; i < res.userData.data.games.length; i++) {
			console.log(res.userData.data.games[i]);
			let node: cc.Node = cc.instantiate(this.dataItem);

			node.getComponent(dataItem).getData(res.userData.data.games[i]);

			this.dataContent.addChild(node);
		}
		this.dataContent.addChild(this.nodeNo);
		ServerLoading.hide();
	}

	onScrollingEvent(event) {
		if (this.isOver) {
			this.Scroll.node.off("scrolling", this.onScrollingEvent, this);
			return;
		}
		var self = this;
		var offsetY = self.Scroll.getComponent(cc.ScrollView).getScrollOffset().y;
		let maxOffSetY = self.Scroll.getComponent(
			cc.ScrollView
		).getMaxScrollOffset().y;
		if (offsetY >= maxOffSetY) {
			this.Scroll.node.off("scrolling", this.onScrollingEvent, this);
			self.curPageNum++;
			console.log(self.curPageNum, "---------------->");
			WxHttpControl.getGameHistory(self.curPageNum);
			this.isCan = false;
		}
		this.scheduleOnce(function() {
			self.Scroll.node.on("scrolling", this.onScrollingEvent, this);
		}, 1);
	}

	onGameResult(res: any) {
		console.log(res, "onGameResult");
		let data = res.userData.data;
		data = new Uint8Array(data);
		console.log(data);
		let data3 = pb.common.GameOverMsg.decode(data);
		console.log(data3);
	}

	onDestroy() {
		GameEvent.event.off(EventType.HTTP_GET_GAME_RATIO, this.setRatioData, this);
		GameEvent.event.off(
			EventType.HTTP_GET_GAME_HISTORY,
			this.setItemData,
			this
		);
	}
}
