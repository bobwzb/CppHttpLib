import UserData from "../data/userData";
import taskItem from "./taskItem";
import { GameEvent, EventType } from "../lib/GameEvent";
import WxHttpControl from "../netWork/http/WxHttpControl";
import ServerLoading from "./ServerLoadingPopup";
import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import BasicScene from "../lib/BasicScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class taskScene extends BasicScene {
	@property(cc.Prefab)
	taskItem: cc.Prefab = null;

	@property(cc.Node)
	taskContent: cc.Node = null;

	@property(cc.Label)
	coinLabel: cc.Label = null;

	prevAction: cc.Action = null;
	nextAction: cc.Action = null;

	awardData = null;
	onLoad() {
		// this.nextAction = cc.moveTo(0.25, cc.v2(0, 0));
		// this.prevAction = cc.moveTo(
		// 	0.5,
		// 	cc.v2(cc.winSize.width * 1.5, cc.winSize.height / 2)
		// );

		this.coinLabel.string = "" + UserData.userCoin;

		WxHttpControl.getTask();
		// ServerLoading.show()

		this.addEvent();
		this.node.getChildByName("contentView").height =
			(cc.winSize.height / 1334) * 1136;
		this.node.getChildByName("contentView").getChildByName("view").height =
			(cc.winSize.height / 1334) * 1136;
	}

	onBtBack() {
		cc.director.loadScene("hallScene");
	}

	public addEvent() {
		GameEvent.event.on(EventType.HTTP_GET_TASK, this.setItemData, this);
		GameEvent.event.on(EventType.HALL_GET_TASK_MSG, this.getAwardData, this);
		GameEvent.event.on(EventType.HTTP_GET_TASK_AWARD, this.postTaskAward, this);
		GameEvent.event.on(EventType.HTTP_GET_USERINFO, this.getUserInfo, this);
		// GameEvent.event.on(EventType.SHARE_SUCESS, this.onShareSucess, this);
		GameEvent.event.on(EventType.HTTP_GET_SHARE, this.onGetShare, this);
	}

	setItemData(res: any) {
		// ServerLoading.hide()
		this.taskContent.removeAllChildren();
		let lineNode: cc.Node = new cc.Node();
		lineNode.setContentSize(710, 16);
		this.taskContent.addChild(lineNode);
		let msg = res.userData.data;
		console.log(msg);
		msg.sort(function(a, b) {
			if (a.delivered && !b.delivered) {
				return 1;
			} else if (!a.delivered && b.delivered) {
				return -1;
			} else {
				if (a.progress >= a.target && !(b.progress >= b.target)) {
					return -1;
				} else if (!(a.progress >= a.target) && b.progress >= b.target) {
					return 1;
				} else {
					if (a.target_type > b.target_type) {
						return 1;
					} else if (a.target_type < b.target_type) {
						return -1;
					}
					return 0;
				}
			}
		});
		for (let i = 0; i < msg.length; i++) {
			let node: cc.Node = cc.instantiate(this.taskItem);

			node.getComponent(taskItem).getData(res.userData.data[i]);

			this.taskContent.addChild(node);
		}
		ServerLoading.hide();
	}

	getAwardData(res: any) {
		this.awardData = res.userData;
	}

	postTaskAward() {
		Popup.show(PopupType.GetAwardPopup, null, this.awardData.bonus);
		WxHttpControl.getTask();
		WxHttpControl.getUserInfo();
	}

	getUserInfo(event: any) {
		let playerInfo = event.userData.data;
		UserData.userCoin = playerInfo.gold;
		this.coinLabel.string = "" + UserData.userCoin;
	}

	// onShareSucess(res: any) {}

	onGetShare(res: any) {
		WxHttpControl.getTask();
	}

	onDestroy() {
		GameEvent.event.off(EventType.HTTP_GET_TASK, this.setItemData, this);
		GameEvent.event.off(EventType.HALL_GET_TASK_MSG, this.getAwardData, this);
		GameEvent.event.off(
			EventType.HTTP_GET_TASK_AWARD,
			this.postTaskAward,
			this
		);
		GameEvent.event.off(EventType.HTTP_GET_USERINFO, this.getUserInfo, this);
		// GameEvent.event.off(EventType.SHARE_SUCESS, this.onShareSucess, this);
		GameEvent.event.off(EventType.HTTP_GET_SHARE, this.onGetShare, this);
	}
}
