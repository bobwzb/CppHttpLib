import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import { GameEvent, EventType } from "../lib/GameEvent";
import C2S from "../netWork/socket/C2S";
import { pb } from "../asset.pb";
import UserData from "../data/userData";
import Tips from "../until/Tips";
import WxHttpControl from "../netWork/http/WxHttpControl";
import StringUtils from "../until/StringUtils";
import AvatarContainer from "../lib/component/avatarContainer";
import BasicScene from "../lib/BasicScene";
import ServerLoading from "./ServerLoadingPopup";
import GameSocket from "../netWork/socket/GameSocket";
import { Message } from "../lib/mars/mars";
import { MsgEvent, MsgEventType } from "../lib/MsgEvent";
import Config from "../config";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class readyScene extends BasicScene {
	@property(cc.Node)
	readBg: cc.Node = null;

	@property(cc.Node)
	readMask: cc.Node = null;

	@property(cc.Node)
	loadingHead: cc.Node = null;

	@property(cc.Label)
	loadingName: cc.Label = null;

	@property(cc.Label)
	loadingWin: cc.Label = null;

	@property(cc.Label)
	loadingGrade: cc.Label = null;

	@property(cc.Label)
	loadingasset: cc.Label = null;

	@property(cc.Label)
	readTime: cc.Label = null;

	@property([cc.Node])
	matchHead: cc.Node[] = [];

	@property([cc.Label])
	matchName: cc.Label[] = [];

	@property(cc.Label)
	matchTime: cc.Label = null;

	@property(cc.Node)
	sucessContent: cc.Node = null;

	@property(cc.Button)
	btEnter: cc.Button = null;

	@property(cc.Node)
	cityNode: cc.Node = null;

	@property(cc.Node)
	loadingNode: cc.Node = null;

	@property(cc.Node)
	contentNode: cc.Node = null;

	@property(cc.ScrollView)
	scrollView: cc.ScrollView = null;

	@property(cc.Prefab)
	contentItem0: cc.Prefab = null;

	@property(cc.Prefab)
	contentItem1: cc.Prefab = null;

	@property(cc.Prefab)
	contentItem2: cc.Prefab = null;

	@property(cc.Prefab)
	contentItem3: cc.Prefab = null;

	@property(cc.Node)
	commonNode: cc.Node = null;

	timeCallback;
	timeCount: number = 20;

	readTimeCallback;
	readTimeCount: number = 0;

	createRoomId: string;
	matchUserData: pb.common.CheckPlayingRsp;
	matchMsgRoomId: string;
	itemNode: cc.Node[] = [];
	opt: pb.common.IRoomOption = new pb.common.RoomOption();
	mapsData: pb.common.GetAvailableMapsRsp;
	BegaX: number;
	endX: number;
	mapIndex: number = 0;
	onLoad() {
		WxHttpControl.getGameRatio();

		this.addEvent();
		this.init();
		if (Config.GAME_PLAYER_NUM === 1) {
			this.loadingNode.active = false;
			this.cityNode.active = true;
			this.commonNode.y = 280;
		} else if (Config.GAME_PLAYER_NUM === 2) {
			this.loadingNode.active = true;
			this.cityNode.active = false;
			this.commonNode.y = 0;
		}
		this.scrollView.node.on("scroll-began", this.onScrollBegan, this);
	}

	onScrollBegan() {
		this.BegaX = Math.floor(this.contentNode.x);
	}

	onScrollEnd(event) {
		this.endX = Math.floor(this.contentNode.x);

		console.log("begin:",this.BegaX,"  end",this.endX);

		if (this.endX < this.BegaX) {
			this.mapIndex++;
			console.log("left");
		} else  if(this.endX > this.BegaX){
			this.mapIndex--;
			console.log("right");
		}else{
			//Nothing
		}
		if (this.mapIndex < 0) {
			this.mapIndex = 0;
		} else if (this.mapIndex > this.mapsData.maps.length - 1) {
			this.mapIndex = this.mapsData.maps.length - 1;
		}
		console.log(this.mapIndex);
		this.contentNode.x = -375 - 350 * this.mapIndex;
	}

	init() {
		this.readBg.active = false;
		this.readMask.active = false;
		this.sucessContent.active = false;
		UserData.checkPlayNum = 0;
		this.setData();

		this.readMask.opacity = 0;
		this.readBg.y = 742;
		ServerLoading.hide();
	}

	setData() {
		let res = { userData: null };
		res.userData = UserData.checkData;
		console.log(UserData.checkData, "setData------------->");
		if (
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_IN_ROOM
		) {
			this.onLoading(res);
		} else if (
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_MATCHED
		) {
			this.onCheckPlay(res, true);
		} else if (
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_MATCHING
		) {
			this.onSendReady(res);
		} else if (
			UserData.checkData.state == pb.common.PlayerState.PLAYER_STATE_READY
		) {
		} else {
			C2S.GetAvailableRoomSizeReq(2);
		}
	}

	onBtOk() {
		if (this.createRoomId) {
			if (Config.GAME_PLAYER_NUM === 1) {
				this.opt.roomSize = 0;
				this.opt.playDuration = 600;
				this.opt.mapId = this.mapsData.maps[this.mapIndex].id;
				C2S.UpdateRoomChoicesReq(this.createRoomId, this.opt);
			} else {
				C2S.StartMatchingReq(this.createRoomId);
			}
		}
	}

	addEvent() {
		let self = this;
		GameEvent.event.on(EventType.SOCKET_LOGIN_SUCESS, this.onLoginSucess, this);
		GameEvent.event.on(
			EventType.SOCKET_GET_AVAILABLE_ROOM_SIZE,
			this.onGetAvailableRoomSize,
			this
		);
		GameEvent.event.on(
			EventType.HTTP_GET_GAME_RATIO,
			this.onGetGameRatio,
			this
		);
		GameEvent.event.on(EventType.SOCKET_CREATE_ROOM, this.onLoading, this);
		GameEvent.event.on(EventType.SOCKET_START_MATCHING, this.onSendReady, this);
		// MsgEvent.event.on(MsgEventType.SOCKET_START_MATCHING_MSG, this.onSendReady, this)
		// GameEvent.event.on(EventType.SOCKET_MATCHING, this.onMatchReq, this)
		MsgEvent.event.on(MsgEventType.SOCKET_MatchMsg, this.onSendMatch, this);
		// GameEvent.event.on(EventType.SOCKET_PREPARE, this.onMatchData, this)
		MsgEvent.event.on(MsgEventType.SOCKET_PrepareMsg, this.onMatchData, this);
		GameEvent.event.on(EventType.SOCKET_CHECK_PLAYING, this.onCheckPlay, this);
		GameEvent.event.on(EventType.SOCKET_EXIT_ROOM, this.onExitRoom, this);
		GameEvent.event.on(EventType.SOCKET_EXIT_MATCH, this.onExitMatch, this);
		MsgEvent.event.on(MsgEventType.SOCKET_AllReadyMsg, this.onAllReady, this);
		MsgEvent.event.on(
			MsgEventType.SOCKET_AnyoneTimeoutMsg,
			this.onTimeOut,
			this
		);
		GameEvent.event.on(
			EventType.SOCKET_GET_AVAILABLE_MAPS,
			this.onGetAvailableMaps,
			this
		);
		GameEvent.event.on(
			EventType.SOCKET_UPDATE_ROOM_OPTION,
			this.onUpdateRoomChoices,
			this
		);
	}

	onGetAvailableMaps(res: any) {
		this.scrollView.node.on("scroll-ended", this.onScrollEnd, this);
		let msg: pb.common.GetAvailableMapsRsp = res.userData;
		this.mapsData = msg;

		console.log(this.mapsData,"onGetAvailableMaps---------------->");

		for (let i = 0; i < msg.maps.length; i++) {
			if(i == 0) {
				let node: cc.Node = cc.instantiate(this.contentItem0);
				node.getChildByName("cityTxt").getComponent(cc.Label).string = "广州";
				this.contentNode.addChild(node);
				this.itemNode.push(node);
			}else if(i == 1) {
				let node: cc.Node = cc.instantiate(this.contentItem1);
				node.getChildByName("cityTxt").getComponent(cc.Label).string = "上海";
				this.contentNode.addChild(node);
				this.itemNode.push(node);
			}else if(i == 2) {
				let node: cc.Node = cc.instantiate(this.contentItem2);
				node.getChildByName("cityTxt").getComponent(cc.Label).string = "深圳";
				this.contentNode.addChild(node);
				this.itemNode.push(node);
			}else if(i == 3) {
				let node: cc.Node = cc.instantiate(this.contentItem3);
				node.getChildByName("cityTxt").getComponent(cc.Label).string = "北京";
				this.contentNode.addChild(node);
				this.itemNode.push(node);
			}
		}

		this.scrollView.node.on("scroll-ended", this.onScrollEnd, this);
	}

	onUpdateRoomChoices(res: any) {
		let msg: pb.common.UpdateRoomChoicesRsp = res.userData;
		C2S.StartMatchingReq(this.createRoomId);
	}

	onLoginSucess() {
		let self: readyScene = this;
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
				self.init();
			})
			.catch();
	}

	onGetAvailableRoomSize(res: any) {
		// console.log(res.userData, "onGetAvailableRoomSize")
		C2S.CreateRoomReq(Config.GAME_PLAYER_NUM, 2, false);
	}

	onGetGameRatio(res: any) {
		this.loadingWin.string =
			"胜率：" + res.userData.data.rank_winning_ratio + "%";
	}

	onLoading(res: any) {
		let msg: pb.common.CreateRoomRsp | pb.common.CheckPlayingRsp = res.userData;
		let self: readyScene = this;
		this.createRoomId = msg.room.roomId;
		let playerInfo: pb.common.IPlayerInfo = msg.room.members[0];

		let avatarContainer = this.loadingHead.getComponent(AvatarContainer);
		if (UserData.avatarFrame) {
			avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
		} else {
			if (
				typeof playerInfo.avatar !== "undefined" &&
				playerInfo.avatar !== null &&
				playerInfo.avatar.length > 5
			) {
				UserData.avatarUrl = playerInfo.avatar;
				avatarContainer.setAvatarImageFromUrl(playerInfo.avatar);
			}
		}

		this.loadingName.string = playerInfo.nickname;
		this.loadingGrade.string = playerInfo.assetLevel;
		this.loadingasset.string = "资产：" + playerInfo.assetScore;
		if (Config.GAME_PLAYER_NUM === 1) {
			C2S.GetAvailableMapsReq();
		}
	}

	onSendReady(res: any) {
		let data: any = res.userData;
		let self: readyScene = this;
		this.readTimeCount = 0;
		self.readTime.string = StringUtils.doInverseTime(self.readTimeCount);
		this.readBg.active = true;
		this.readMask.active = true;
		let action: cc.FiniteTimeAction = cc.moveBy(0.5, cc.v2(0, -188));
		let action2: cc.FiniteTimeAction = cc.fadeTo(0.5, 125);
		this.readMask.runAction(action2);
		this.readBg.runAction(action);
		this.sucessContent.active = false;

		this.readTimeCallback = function() {
			self.readTime.string = StringUtils.doInverseTime(self.readTimeCount);
			self.readTimeCount++;
		};

		this.schedule(this.readTimeCallback, 1);
		if (Config.GAME_PLAYER_NUM === 1) {
			ServerLoading.show();
			return;
		}

		this.schedule(this.readTimeCallback, 1);
		// C2S.MatchReq()
	}

	onMatchReq(res: any) {
		if (res.userData.status == 1) {
		} else {
			Tips.show("匹配失败");
			this.readBg.active = false;
			this.readBg.y = 742;
			this.readMask.opacity = 0;
			this.readMask.active = false;
			this.readTimeCount = 0;
			this.unschedule(this.readTimeCallback);
		}
	}

	onSendMatch(res: any) {
		let msg: pb.common.MatchMsg = res.userData;
		let self: readyScene = this;
		if (msg.status == 1) {
			UserData.checkPlayNum = 1;
			this.matchMsgRoomId = msg.roomId;
			C2S.CheckPlayingReq();
		} else {
			Tips.show("匹配失败");
		}

		this.readBg.active = false;
		this.readMask.active = false;

		this.readBg.y = 742;
		this.readMask.opacity = 0;

		this.readTimeCount = 0;
		this.unschedule(this.readTimeCallback);
		this.node.stopAllActions();
	}

	onCheckPlay(res: any, isConn: boolean) {
		if (Config.GAME_PLAYER_NUM === 1) {
			C2S.PrepareReq();
			return;
		}
		let msg: pb.common.CheckPlayingRsp = res.userData;
		let self: readyScene = this;

		if (UserData.checkPlayNum == 1 || isConn) {
			this.timeCount = 20;
			self.matchTime.string = "" + self.timeCount + "s";
			this.matchUserData = msg;
			this.sucessContent.active = true;
			this.readMask.active = true;
			this.readMask.opacity = 125;
			for (let i = 0; i < this.matchName.length; i++) {
				let data: pb.common.IPlayerInfo = msg.players[i];

				let avatarContainer = this.matchHead[i].getComponent(AvatarContainer);
				avatarContainer.setAvatarImageFromUrl(data.avatar);
				self.matchHead[i].opacity = 50;

				this.matchName[i].string = data.nickname;
				this.matchName[i].node.opacity = 50;
			}

			this.timeCallback = function() {
				self.matchTime.string = "" + self.timeCount + "s";
				self.timeCount--;
			};

			this.schedule(this.timeCallback, 1);
			this.btEnter.interactable = true;
		}
	}

	onBtStart() {
		C2S.PrepareReq();
	}

	onBtExitRoom() {
		C2S.ExitRoomReq();
	}

	onBtExitMatch() {
		C2S.ExitMatchReq(this.matchMsgRoomId);
	}

	onMatchData(res: any) {
		if (Config.GAME_PLAYER_NUM === 1) {
			return;
		}
		let msg: pb.common.Payload = res.userData;
		let self: readyScene = this;

		let playerNum: number = 2;

		let uidLong = UserData.uid;

		for (let i = 0; i < this.matchName.length; i++) {
			if (msg.userId.equals(this.matchUserData.players[i].userId)) {
				self.matchHead[i].opacity = 255;
				self.matchName[i].node.opacity = 255;

				if (msg.userId.equals(uidLong)) {
					self.btEnter.interactable = false;
					self.btEnter.node
						.getChildByName("Background")
						.getChildByName("Label")
						.getComponent(cc.Label).string = "已准备...";
				}
			}
		}
	}

	onExitRoom(res: any) {
		// this.hide();
		cc.director.loadScene("hallScene");
	}

	onExitMatch(res: any) {
		this.readBg.active = false;
		this.readMask.active = false;
		this.readBg.y = 742;
		this.readMask.opacity = 0;
		this.sucessContent.active = false;
		this.timeCount = 20;
		this.unschedule(this.timeCallback);
	}

	onAllReady(res: any) {
		// this.hide();
		ServerLoading.hide();
		cc.director.loadScene("professionScene");
	}

	onTimeOut(res: any) {
		this.readBg.active = false;
		this.readMask.active = false;
		this.readBg.y = 742;
		this.readMask.opacity = 0;
		this.sucessContent.active = false;
		this.timeCount = 20;
		this.unschedule(this.timeCallback);
	}

	onDestroy() {
		let self = this;
		this.unschedule(this.timeCallback);
		this.unschedule(this.readTimeCallback);
		GameEvent.event.off(
			EventType.SOCKET_GET_AVAILABLE_ROOM_SIZE,
			this.onGetAvailableRoomSize,
			this
		);
		GameEvent.event.off(
			EventType.HTTP_GET_GAME_RATIO,
			this.onGetGameRatio,
			this
		);
		GameEvent.event.off(EventType.SOCKET_CREATE_ROOM, this.onLoading, this);
		GameEvent.event.off(
			EventType.SOCKET_START_MATCHING,
			this.onSendReady,
			this
		);
		// MsgEvent.event.off(MsgEventType.SOCKET_START_MATCHING_MSG, this.onSendReady, this)
		// GameEvent.event.off(EventType.SOCKET_MATCHING, this.onMatchReq, this)
		MsgEvent.event.off(MsgEventType.SOCKET_MatchMsg, this.onSendMatch, this);
		// GameEvent.event.off(EventType.SOCKET_PREPARE, this.onMatchData, this)
		MsgEvent.event.off(MsgEventType.SOCKET_PrepareMsg, this.onMatchData, this);
		GameEvent.event.off(EventType.SOCKET_CHECK_PLAYING, this.onCheckPlay, this);
		GameEvent.event.off(EventType.SOCKET_EXIT_ROOM, this.onExitRoom, this);
		GameEvent.event.off(EventType.SOCKET_EXIT_MATCH, this.onExitMatch, this);
		MsgEvent.event.off(MsgEventType.SOCKET_AllReadyMsg, this.onAllReady, this);
		MsgEvent.event.off(
			MsgEventType.SOCKET_AnyoneTimeoutMsg,
			this.onTimeOut,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_LOGIN_SUCESS,
			this.onLoginSucess,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_GET_AVAILABLE_MAPS,
			this.onGetAvailableMaps,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_UPDATE_ROOM_OPTION,
			this.onUpdateRoomChoices,
			this
		);
	}
}
