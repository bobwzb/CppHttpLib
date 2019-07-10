import UserData from "../data/userData";
import storeItem from "./storeItem";
import detailsShow from "./detailsShow";
import { GameEvent, EventType } from "../lib/GameEvent";
import WxHttpControl from "../netWork/http/WxHttpControl";
import ServerLoading from "./ServerLoadingPopup";
import BasicScene from "../lib/BasicScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class storeScene extends BasicScene {
	@property(cc.Prefab)
	storeItem: cc.Prefab = null;

	@property(cc.Prefab)
	detailsShow: cc.Prefab = null;

	@property(cc.Node)
	storeContent: cc.Node = null;

	@property(cc.Label)
	coinLabel: cc.Label = null;

	prevAction: cc.Action = null;
	nextAction: cc.Action = null;

	nodeDetArr = [];
	nodePool: cc.NodePool = new cc.NodePool();
	nodeDetPool: cc.NodePool = new cc.NodePool();
	onLoad() {
		this.coinLabel.string = "" + UserData.userCoin;

		WxHttpControl.getStoreProfession();
		// ServerLoading.show()
		// this.scheduleOnce(function() {
		// 	ServerLoading.hide()
		// },1)
		this.addEvent();

		// this.enemyPool = new cc.NodePool();
		// let initCount = 7;
		// for (let i = 0; i < initCount; ++i) {
		// 	let node: cc.Node = cc.instantiate(this.storeItem);

		// 	let nodeDet: cc.Node = cc.instantiate(this.detailsShow);
		// 	this.nodePool.put(node); // 通过 put 接口放入对象池
		// 	this.nodeDetPool.put(nodeDet); // 通过 put 接口放入对象池
		// }
		this.node.getChildByName("contentView").height =
			(cc.winSize.height / 1334) * 1136;
		this.node.getChildByName("contentView").getChildByName("view").height =
			(cc.winSize.height / 1334) * 1136;
	}

	private onBtBack() {
		console.log("onBtBack----------->");
		cc.director.loadScene("hallScene");
	}

	public addEvent() {
		GameEvent.event.on(
			EventType.HTTP_STORE_PROFESSION_LIST,
			this.setItemData,
			this
		);
		GameEvent.event.on(EventType.HTTP_GET_USERINFO, this.getUserInfo, this);
	}

	// createEnemy(): cc.Node {
	// 	let enemy = null;
	// 	if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
	// 		enemy = this.enemyPool.get();
	// 	} else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
	// 		enemy = cc.instantiate(this.enemyPrefab);
	// 	}
	// 	return
	// }

	private setItemData(res: any) {
		console.log("----------------------------->");
		this.storeContent.removeAllChildren();
		let lineNode: cc.Node = new cc.Node();
		lineNode.setContentSize(710, 16);
		this.storeContent.addChild(lineNode);
		this.nodeDetArr = [];
		for (let i = 0; i < res.userData.data.length; i++) {
			let node: cc.Node = cc.instantiate(this.storeItem);

			let nodeDet: cc.Node = cc.instantiate(this.detailsShow);
			console.log(res.userData.data[i]);

			node.getComponent(storeItem).tag = i;
			nodeDet.getComponent(detailsShow).tag = i;
			node.getComponent(storeItem).getData(res.userData.data[i]);
			if (res.userData.data[i].extra) {
				nodeDet.getComponent(detailsShow).getData(res.userData.data[i].extra);
			}

			nodeDet.active = false;
			this.nodeDetArr.push(nodeDet);

			this.storeContent.addChild(node);
			this.storeContent.addChild(nodeDet);
		}
		ServerLoading.hide();
	}

	getUserInfo(event: any) {
		let playerInfo = event.userData.data;
		UserData.userCoin = playerInfo.gold;
		this.coinLabel.string = "" + UserData.userCoin;
	}

	onDestroy() {
		GameEvent.event.off(
			EventType.HTTP_STORE_PROFESSION_LIST,
			this.setItemData,
			this
		);
		GameEvent.event.off(EventType.HTTP_GET_USERINFO, this.getUserInfo, this);
	}
}
