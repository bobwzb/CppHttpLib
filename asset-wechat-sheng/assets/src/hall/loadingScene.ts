import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import { GameEvent, EventType } from "../lib/GameEvent";
import C2S from "../netWork/socket/C2S";
import { pb } from "../asset.pb";
import UserData from "../data/userData";
import AvatarContainer from "../lib/component/avatarContainer";
import BasicScene from "../lib/BasicScene";
import GameSocket from "../netWork/socket/GameSocket";
import { Message } from "../lib/mars/mars";
import Tips from "../until/Tips";
import Config from "../config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class loadingScene extends BasicScene {
	@property([cc.Node])
	loadingHead: cc.Node[] = [];

	@property([cc.Label])
	loadingName: cc.Label[] = [];

	@property([cc.Label])
	loadingGrade: cc.Label[] = [];

	@property(cc.ProgressBar)
	loadingBar: cc.ProgressBar = null;

	@property(cc.Sprite)
	lightBar: cc.Sprite = null;

	@property([cc.Node])
	infoNode: cc.Node[] = [];

	timeCallBack: any;
	onLoad() {
		this.addEvent();
		C2S.SyncStateReq();
		C2S.CheckPlayingReq();
		UserData.checkPlayNum = 2;
		this.loadingBar.progress = 0;
		this.lightBar.node.opacity = 0;
		cc.director.preloadScene("gameScene");
	}

	addEvent() {
		let self = this;
		GameEvent.event.on(EventType.SOCKET_CHECK_PLAYING, this.onLoading, this);
		GameEvent.event.on(
			EventType.SOCKET_ON_CLOSED,
			function() {
				self.unscheduleAllCallbacks();
			},
			this
		);
		GameEvent.event.on(EventType.SOCKET_LOGIN_SUCESS, this.onLoginSucess, this);
	}

	onLoginSucess() {
		let self: loadingScene = this;
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

	onLoading(res: any) {
		let msg: pb.common.CheckPlayingRsp = res.userData;
		let self: loadingScene = this;
		console.log(msg, "CheckPlayingRsp-onLoading");
		C2S.getScenarioImgs();
		for (let i = 0; i < this.loadingHead.length; i++) {
			if (i >= Config.GAME_PLAYER_NUM) {
			} else {
				if (Config.GAME_PLAYER_NUM === 1) {
					this.infoNode[i].x = 60;
				}
				let avatarContainer = this.loadingHead[i].getComponent(AvatarContainer);
				avatarContainer.setAvatarImageFromUrl(msg.players[i].avatar);
				this.infoNode[i].active = true;

				this.loadingName[i].string = msg.players[i].nickname;
				this.loadingGrade[i].string = msg.players[i].assetLevel;
			}
		}

		this.timeCallBack = function() {
			self.loadingBar.progress = self.loadingBar.progress + 1 / 100;
			if (self.lightBar.node.x < 266) {
				self.lightBar.node.x = self.lightBar.node.x + 560 / 100;
			}
			if (self.loadingBar.progress >= 1) {
				self.unschedule(self.timeCallBack);
				cc.director.loadScene("gameScene");
			}
		};
		this.schedule(this.timeCallBack, 0.05);
		// this.lightBar.node.runAction(cc.sequence(cc.fadeIn(2/3), cc.fadeOut(1/3)))
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
			C2S.getScenarioImgs();
			self.enterGame("gameScene");
		}
	}

	private enterGame(scene?: string) {
		cc.director.preloadScene(scene, function() {
			console.log("-------------->enterGame1");
			cc.director.loadScene(scene);
		});
	}

	onDestroy() {
		let self = this;
		GameEvent.event.off(EventType.SOCKET_CHECK_PLAYING, this.onLoading, this);
		GameEvent.event.off(
			EventType.SOCKET_ON_CLOSED,
			function() {
				self.unscheduleAllCallbacks();
			},
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_LOGIN_SUCESS,
			this.onLoginSucess,
			this
		);
	}
}
