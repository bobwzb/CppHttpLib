import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import { GameEvent, EventType } from "../lib/GameEvent";
import professionItem from "./professionItem";
import C2S from "../netWork/socket/C2S";
import { pb } from "../asset.pb";
import BasicScene from "../lib/BasicScene";
import Tips from "../until/Tips";
import UserData from "../data/userData";
import GameSocket from "../netWork/socket/GameSocket";
import { Message } from "../lib/mars/mars";
import ServerLoading from "./ServerLoadingPopup";
import { MsgEvent, MsgEventType } from "../lib/MsgEvent";
import Config from "../config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class professionScene extends BasicScene {
	@property(cc.Label)
	timeLabel: cc.Label = null;

	@property(cc.Sprite)
	lineSprite: cc.Sprite = null;

	@property(cc.Prefab)
	professionItem: cc.Prefab = null;

	@property(cc.Node)
	professionContent: cc.Node = null;

	@property(cc.Label)
	okLabel: cc.Label = null;

	@property(cc.Button)
	btOk: cc.Button = null;

	itemNodeArr: cc.Node[] = [];
	data: any;
	index: number = 0;
	timeCallBack: any;
	onLoad() {
		this.addEvent();
		C2S.SyncStateReq();
		C2S.GetRolesReq();
		this.setTime();
		ServerLoading.show();
	}

	setTime() {
		let self: professionScene = this;
		let timeNum: number = 0;
		this.timeCallBack = function() {
			timeNum++;
			if (timeNum == 20) {
				self.unschedule(self.timeCallBack);
			}
			self.timeLabel.string = "(" + (20 - timeNum) + ")";
		};
		this.schedule(this.timeCallBack, 1);
	}

	addEvent() {
		let self = this;
		GameEvent.event.on(EventType.SOCKET_GET_ROLES, this.onSetItem, this);
		GameEvent.event.on(EventType.SOCKET_SELECT_ROLE, this.onSelectSucess, this);
		// MsgEvent.event.on(MsgEventType.SOCKET_SelectRoleMsg, this.onStartLoading, this)
		MsgEvent.event.on(
			MsgEventType.SOCKET_PlayerAllSelectedRoleMsg,
			this.onStartLoading,
			this
		);
		GameEvent.event.on(EventType.SOCKET_ON_CLOSED, this.onClose, this);
		GameEvent.event.on(EventType.SOCKET_LOGIN_SUCESS, this.onLoginSucess, this);
	}

	onLoginSucess() {
		let self: professionScene = this;
		console.log("------------------->SOCKET_LOGIN_SUCESS");
		var msg: pb.common.CheckPlayingReq = new pb.common.CheckPlayingReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.CheckPlayingReq.encode(msg).finish();
		let cmd = pb.common.CmdID.CHECK_PLAYING;
		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.CheckPlayingRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					Tips.show(Rsp.rsp.msg);
					return;
				}
				UserData.checkData = Rsp;
				self.getCheckLogin();
			})
			.catch();
	}

	onSetItem(res: any) {
		console.log("------------------->SOCKET_GET_ROLES", res.userData);
		this.professionContent.removeAllChildren();
		let lineNode: cc.Node = new cc.Node();
		lineNode.setContentSize(710, 8);
		this.professionContent.addChild(lineNode);
		let self: professionScene = this;

		let msg: pb.common.GetRolesRsp = res.userData;

		this.data = msg.data;
		let isHasLine: boolean = false;
		this.data.sort(function(a, b) {
			if (a.purchased && !b.purchased) {
				return -1;
			} else if (!a.purchased && b.purchased) {
				return 1;
			} else {
				if (a.Free && !b.Free) {
					return -1;
				} else if (!a.Free && b.Free) {
					return 1;
				} else {
					return 0;
				}
			}
		});

		for (let i = 0; i < this.data.length; i++) {
			let node: cc.Node = cc.instantiate(this.professionItem);

			if (!this.data[i].Free && !this.data[i].purchased && !isHasLine) {
				isHasLine = true;
				let lineNotTop: cc.Node = new cc.Node();
				lineNotTop.setContentSize(710, 16);

				let lineNot: cc.Node = new cc.Node();
				lineNot.addComponent(cc.Sprite);
				let sp = lineNot.getComponent(cc.Sprite);
				sp.spriteFrame = self.lineSprite.spriteFrame;

				let lineNotBottom: cc.Node = new cc.Node();
				lineNotBottom.setContentSize(710, 12);

				self.professionContent.addChild(lineNotTop);
				self.professionContent.addChild(lineNot);
				self.professionContent.addChild(lineNotBottom);
			}

			node.getComponent(professionItem).getData(this.data[i]);

			this.professionContent.addChild(node);

			this.itemNodeArr.push(node);
			node.on(
				"click",
				function(evt: any) {
					self.onItemSelect(i);
				},
				this
			);
		}
		ServerLoading.hide();
	}

	onItemSelect(idx: number) {
		this.index = idx;
		for (let i = 0; i < this.itemNodeArr.length; i++) {
			this.itemNodeArr[i].getComponent(professionItem).setItemFrame(false);
			if (i === idx) {
				this.itemNodeArr[i].getComponent(professionItem).setItemFrame(true);
			}
		}
	}

	onBtOk() {
		C2S.SelectRoleReq(this.data[this.index].ID);
	}

	onSelectSucess(res: any) {
		this.btOk.interactable = false;
		this.okLabel.string = "已锁定";
		if (Config.GAME_PLAYER_NUM !== 1) {
			Tips.show("选择职业成功， 等待其他玩家");
		}
	}

	onStartLoading(res: any) {
		let msg: pb.common.PlayerAllSelectedRoleMsg = res.userData;
		if (msg) {
			cc.director.loadScene("loadingScene");
		}
	}

	getCheckLogin() {
		let self = this;
		if (UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_BEGIN) {
			self.enterGame("hallScene");
			// self.enterGame("testScene")
		} else if (
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_IN_ROOM ||
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_MATCHED ||
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_MATCHING ||
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_READY
		) {
			self.enterGame("readyScene");
		} else if (
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_PLAYING
		) {
			self.enterGame("gameScene");
		}
	}

	private enterGame(scene?: string) {
		cc.director.preloadScene(scene, function() {
			console.log("-------------->enterGame1");
			cc.director.loadScene(scene);
		});
	}

	onClose() {
		this.unscheduleAllCallbacks();
	}

	onDestroy() {
		let self = this;
		GameEvent.event.off(EventType.SOCKET_GET_ROLES, this.onSetItem, this);
		GameEvent.event.off(
			EventType.SOCKET_SELECT_ROLE,
			this.onSelectSucess,
			this
		);
		// MsgEvent.event.off(MsgEventType.SOCKET_SelectRoleMsg, this.onStartLoading, this)
		MsgEvent.event.off(
			MsgEventType.SOCKET_PlayerAllSelectedRoleMsg,
			this.onStartLoading,
			this
		);
		GameEvent.event.off(EventType.SOCKET_ON_CLOSED, this.onClose, this);
		GameEvent.event.off(
			EventType.SOCKET_LOGIN_SUCESS,
			this.onLoginSucess,
			this
		);
	}
}
