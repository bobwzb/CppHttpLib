import { pb } from "../../asset.pb";
import GameSocket from "./GameSocket";
import { Message, Header } from "../../lib/mars/mars";
import { GameEvent, EventType } from "../../lib/GameEvent";
import Tips from "../../until/Tips";
import UserData from "../../data/userData";
import * as Long from "long";
import { RemoteImage } from "../../lib/component/remoteImage";
import * as Sentry from "@sentry/browser";

const { ccclass, property } = cc._decorator;

/**
 * 客户端发送给服务端的消息
 */
@ccclass
export default class C2S {
	/**
	 * 发送心跳包
	 */
	public static sendHeartBeat() {
		GameSocket.instance.wsConn.sendHeartBeat();
	}

	/**
	 * 登录到游戏server
	 * @param uid
	 */
	public static GameLoginReq() {
		var msg: pb.common.GameLoginReq = new pb.common.GameLoginReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.token = UserData.token;
		let buffer: Uint8Array = pb.common.GameLoginReq.encode(msg).finish();
		let cmd = pb.common.CmdID.LOGIN;
		console.log(msg, "GameLoginReq-------------->");

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp: pb.common.GameLoginRsp = pb.common.GameLoginRsp.decode(
					msg.body
				);
				console.log(Rsp, "GameLoginReq");
				if (Rsp.rsp.code) {
					console.log("server登录失败");
					Sentry.captureException(
						new Error("checkSessionsuccess" + Rsp.rsp.msg)
					);
					GameEvent.event.dispatchEvent(
						new GameEvent(EventType.SOCKET_LOGIN_FAIL, Rsp)
					);
				} else {
					console.log("server登录成功");
					GameEvent.event.dispatchEvent(
						new GameEvent(EventType.SOCKET_LOGIN_SUCESS, Rsp)
					);
					// C2S.CheckPlayingReq()
				}
			})
			.catch();
	}

	public static CheckPlayingReq() {
		var msg: pb.common.CheckPlayingReq = new pb.common.CheckPlayingReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.CheckPlayingReq.encode(msg).finish();
		let cmd = pb.common.CmdID.CHECK_PLAYING;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.CheckPlayingRsp.decode(msg.body);
				console.log("CHECK_PLAYING", new Date().toLocaleString(), Rsp);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_CHECK_PLAYING, Rsp)
				);
			})
			.catch();
	}

	public static GetAvailableRoomSizeReq(matchType: number) {
		console.log("GetAvailableRoomSizeReq");
		var msg: pb.common.GetAvailableRoomSizeReq = new pb.common.GetAvailableRoomSizeReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.matchType = matchType;
		let buffer: Uint8Array = pb.common.GetAvailableRoomSizeReq.encode(
			msg
		).finish();
		let cmd = pb.common.CmdID.GET_AVAILABLE_ROOM_SIZE;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GetAvailableRoomSizeRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_GET_AVAILABLE_ROOM_SIZE, Rsp)
				);
			})
			.catch();
	}

	public static CreateRoomReq(
		size: number,
		matchType: number,
		isABTester: boolean
	) {
		console.log("GetAvailableRoomSizeReq");
		var msg: pb.common.CreateRoomReq = new pb.common.CreateRoomReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.size = size;
		msg.matchType = matchType;
		msg.isABTester = isABTester;
		let buffer: Uint8Array = pb.common.CreateRoomReq.encode(msg).finish();
		let cmd = pb.common.CmdID.CREATE_ROOM;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.CreateRoomRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_CREATE_ROOM, Rsp)
				);
			})
			.catch();
	}

	public static StartMatchingReq(roomId: string) {
		var msg: pb.common.StartMatchingReq = new pb.common.StartMatchingReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.roomId = roomId;
		let buffer: Uint8Array = pb.common.StartMatchingReq.encode(msg).finish();
		let cmd = pb.common.CmdID.START_MATCHING;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.StartMatchingRsp.decode(msg.body);
				console.log(Rsp, "StartMatchingReq");
				if (Rsp.Rsp.code) {
					// Tips.show(Rsp.Rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_START_MATCHING, Rsp)
				);
			})
			.catch();
	}

	public static MatchReq() {
		console.log("MatchReq");
		var msg: pb.common.MatchReq = new pb.common.MatchReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.MatchReq.encode(msg).finish();
		let cmd = pb.common.CmdID.MATCHING;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.MatchRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_MATCHING, Rsp)
				);
			})
			.catch();
	}

	public static PrepareReq() {
		console.log("PrepareReq");
		var msg: pb.common.PrepareReq = new pb.common.PrepareReq();

		let buffer: Uint8Array = pb.common.PrepareReq.encode(msg).finish();
		let cmd = pb.common.CmdID.PREPARE;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.PrepareRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				// GameEvent.event.dispatchEvent(new GameEvent(EventType.SOCKET_MATCHING, Rsp))
			})
			.catch();
	}

	public static ExitRoomReq() {
		console.log("ExitRoomReq");
		var msg: pb.common.ExitRoomReq = new pb.common.ExitRoomReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.ExitRoomReq.encode(msg).finish();
		let cmd = pb.common.CmdID.EXIT_ROOM;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.ExitRoomRsp.decode(msg.body);
				console.log(Rsp, "ExitRoomReq");
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_EXIT_ROOM, Rsp)
				);
			})
			.catch();
	}

	public static ExitMatchReq(roomId?: string) {
		console.log("ExitMatchReq");
		var msg: pb.common.ExitMatchReq = new pb.common.ExitMatchReq();
		msg.roomId = roomId;
		let buffer: Uint8Array = pb.common.ExitMatchReq.encode(msg).finish();
		let cmd = pb.common.CmdID.EXIT_MATCH;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.ExitMatchRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_EXIT_MATCH, Rsp)
				);
			})
			.catch();
	}

	public static GetRolesReq() {
		console.log("GetRolesReq");
		var msg: pb.common.GetRolesReq = new pb.common.GetRolesReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.GetRolesReq.encode(msg).finish();
		let cmd = pb.common.CmdID.GET_ROLES;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GetRolesRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_GET_ROLES, Rsp)
				);
			})
			.catch();
	}

	public static SelectRoleReq(roleId: Long) {
		console.log("SelectRoleReq");
		var msg: pb.common.SelectRoleReq = new pb.common.SelectRoleReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.roleId = roleId;
		let buffer: Uint8Array = pb.common.SelectRoleReq.encode(msg).finish();
		let cmd = pb.common.CmdID.SELECT_ROLE;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.SelectRoleRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_SELECT_ROLE, Rsp)
				);
			})
			.catch();
	}

	public static SyncStateReq() {
		console.log("SyncStateReq");
		var msg: pb.common.SyncStateReq = new pb.common.SyncStateReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.SyncStateReq.encode(msg).finish();
		let cmd = pb.common.CmdID.SYNC_STATE;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.SyncStateRsp.decode(msg.body);
				console.log(
					"收到SyncState--------------->",
					new Date().toLocaleString(),
					Rsp
				);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_SYNC_STATE, Rsp)
				);
			})
			.catch();
	}

	public static getScenarioImgs() {
		var msg: pb.common.SyncStateReq = new pb.common.GetUniqueScenarioImgNameReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.GetUniqueScenarioImgNameReq.encode(
			msg
		).finish();
		GameSocket.instance.wsConn
			.sendRequest(pb.common.CmdID.GET_UNIQUE_SCENARIO_IMG_NAME, buffer)
			.then((msg: Message) => {
				let rsp = pb.common.GetUniqueScenarioImgNameRsp.decode(msg.body);
				console.log("scenario imgs", rsp.imgFiles);
				for (let i = 0; i < rsp.imgFiles.length; i++) {
					let rImg = new RemoteImage();
					rImg.getImageForScenario(rsp.imgFiles[i]);
				}
			});
	}

	//game
	public static RollReq() {
		console.log("RollReq");
		var msg: pb.common.RollReq = new pb.common.RollReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.RollReq.encode(msg).finish();
		let cmd = pb.common.CmdID.ROLL;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.RollRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_ROLL, Rsp)
				);
			})
			.catch();
	}

	public static UnemploymentAckReq() {
		console.log("UnemploymentAckReq");
		var msg: pb.common.UnemploymentAckReq = new pb.common.UnemploymentAckReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.UnemploymentAckReq.encode(msg).finish();
		let cmd = pb.common.CmdID.UNEMPLOYMENT_ACK;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.UnemploymentAckRsp.decode(msg.body);
				console.log(
					"---------------->UnemploymentAckReq",
					new Date().toLocaleString(),
					Rsp
				);
				if (Rsp.rsp.code) {
					// Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_UNEMPLOYMENT_ACK, Rsp)
				);
			})
			.catch();
	}

	public static PassReq() {
		console.log("PassReq");
		var msg: pb.common.PassReq = new pb.common.PassReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.PassReq.encode(msg).finish();
		let cmd = pb.common.CmdID.PASS;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.PassRsp.decode(msg.body);
				if (Rsp.Rsp.code) {
					// Tips.show(Rsp.Rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_PASS, Rsp)
				);
			})
			.catch();
	}

	public static WageHikeRollReq() {
		console.log("WageHikeRollReq");
		var msg: pb.common.WageHikeRollReq = new pb.common.WageHikeRollReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.WageHikeRollReq.encode(msg).finish();
		let cmd = pb.common.CmdID.WAGE_HIKE_ROLL;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.WageHikeRollRsp.decode(msg.body);
				console.log(
					"---------------->WageHikeRollReq",
					new Date().toLocaleString(),
					Rsp
				);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				// GameEvent.event.dispatchEvent(new GameEvent(EventType.SOCKET_PASS, Rsp))
			})
			.catch();
	}

	public static PayAccidentConsumeReq() {
		console.log("PayAccidentConsumeReq");
		var msg: pb.common.PayAccidentConsumeReq = new pb.common.PayAccidentConsumeReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.PayAccidentConsumeReq.encode(
			msg
		).finish();
		let cmd = pb.common.CmdID.PAY_ACCIDENT_CONSUME;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.PayAccidentConsumeRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_PAY_ACCIDENT_CONSUME, Rsp)
				);
			})
			.catch();
	}

	public static PlayerReConnectReq() {
		console.log("PlayerReConnectReq");
		var msg: pb.common.PlayerReConnectReq = new pb.common.PlayerReConnectReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.PlayerReConnectReq.encode(msg).finish();
		let cmd = pb.common.CmdID.RE_CONNECT;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.PlayerReconnectRsp.decode(msg.body);
				console.log(Rsp, "-------------------->收到重连");
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_RE_CONNECT, Rsp)
				);
			})
			.catch();
	}

	public static GameQuitReq() {
		console.log("GameQuitReq");
		var msg: pb.common.GameQuitReq = new pb.common.GameQuitReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.GameQuitReq.encode(msg).finish();
		let cmd = pb.common.CmdID.QUIT;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GameQuitRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_QUIT, Rsp)
				);
			})
			.catch();
	}

	public static ChooseChanceReq(chanceType: number) {
		console.log("ChooseChanceReq");
		var msg: pb.common.ChooseChanceReq = new pb.common.ChooseChanceReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.chanceType = chanceType;
		let buffer: Uint8Array = pb.common.ChooseChanceReq.encode(msg).finish();
		let cmd = pb.common.CmdID.CHOOSE_CHANCE;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.ChooseChanceRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
			})
			.catch();
	}

	public static BuyReq(quantity: number) {
		console.log("BuyReq");
		setTimeout(() => {
			var msg: pb.common.BuyReq = new pb.common.BuyReq();
			msg.req = {};
			msg.req.userId = UserData.uid;
			msg.quantity = quantity;
			let buffer: Uint8Array = pb.common.BuyReq.encode(msg).finish();
			let cmd = pb.common.CmdID.BUY;

			GameSocket.instance.wsConn
				.sendRequest(cmd, buffer)
				.then((msg: Message) => {
					let Rsp = pb.common.BuyRsp.decode(msg.body);
					if (Rsp.rsp.code) {
						//Tips.show(Rsp.rsp.msg);
						return;
					}
					GameEvent.event.dispatchEvent(
						new GameEvent(EventType.SOCKET_BUY, Rsp)
					);
				})
				.catch();
		}, 0);
	}

	public static SellAssetsReq(items: pb.common.SellAssetsReq.Iitem[]) {
		console.log("SellAssetsReq");
		var msg: pb.common.SellAssetsReq = new pb.common.SellAssetsReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.items = items;
		let buffer: Uint8Array = pb.common.SellAssetsReq.encode(msg).finish();
		let cmd = pb.common.CmdID.SELL_ASSETS;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.SellAssetsRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_SELL_ASSETS, Rsp)
				);
			})
			.catch();
	}

	public static GetCanSellPlayerAssetReq() {
		console.log("GetCanSellPlayerAssetReq");
		var msg: pb.common.GetCanSellPlayerAssetReq = new pb.common.GetCanSellPlayerAssetReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.GetCanSellPlayerAssetReq.encode(
			msg
		).finish();
		let cmd = pb.common.CmdID.GET_CAN_SELL_PLAYER_ASSET;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GetCanSellPlayerAssetRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_GET_CAN_SELL_PLAYER_ASSET, Rsp)
				);
			})
			.catch();
	}

	public static TryPayReq(quantity: number) {
		console.log("TryPayReq");
		var msg: pb.common.TryPayReq = new pb.common.TryPayReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.quantity = quantity;
		let buffer: Uint8Array = pb.common.TryPayReq.encode(msg).finish();
		let cmd = pb.common.CmdID.TRY_PAY;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.TryPayRsp.decode(msg.body);
				console.log(Rsp, "TryPayRsp");
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					// Tips.show("金额不足,无法购买");
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_TRY_PAY, Rsp)
				);
			})
			.catch();
	}

	public static GiveUpChanceReq() {
		console.log("GiveUpChanceReq");
		var msg: pb.common.GiveUpChanceReq = new pb.common.GiveUpChanceReq();
		msg.base = {};
		msg.base.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.GiveUpChanceReq.encode(msg).finish();
		let cmd = pb.common.CmdID.GIVEUP_CHANCE;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GiveUpChanceRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_GIVEUP_CHANCE, Rsp)
				);
			})
			.catch();
	}

	public static ConfirmMarketChangeReq() {
		console.log("ConfirmMarketChangeReq");
		var msg: pb.common.ConfirmMarketChangeReq = new pb.common.ConfirmMarketChangeReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.ConfirmMarketChangeReq.encode(
			msg
		).finish();
		let cmd = pb.common.CmdID.CONFIRM_MARKET_CHANGE;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.ConfirmMarketChangeRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_CONFIRM_MARKET_CHANGE, Rsp)
				);
			})
			.catch();
	}

	public static ConfirmBankruptReq() {
		console.log("ConfirmBankruptReq");
		var msg: pb.common.ConfirmBankruptReq = new pb.common.ConfirmBankruptReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.ConfirmBankruptReq.encode(msg).finish();
		let cmd = pb.common.CmdID.CONFIRM_BANKRUPT;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.ConfirmBankruptRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_CONFIRM_BANKRUPT, Rsp)
				);
			})
			.catch();
	}

	public static GetLoanQualificationReq() {
		console.log("GetLoanQualificationReq");
		var msg: pb.common.GetLoanQualificationReq = new pb.common.GetLoanQualificationReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.GetLoanQualificationReq.encode(
			msg
		).finish();
		let cmd = pb.common.CmdID.LOAN_QUALIFICATION;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GetLoanQualificationRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_LOAN_QUALIFICATION, Rsp)
				);
			})
			.catch();
	}

	public static GetPlayerLoanAssetReq() {
		console.log("GetPlayerLoanAssetReq");
		var msg: pb.common.GetPlayerLoanAssetReq = new pb.common.GetPlayerLoanAssetReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.GetPlayerLoanAssetReq.encode(
			msg
		).finish();
		let cmd = pb.common.CmdID.GET_PLAYER_LOAN_ASSET;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GetPlayerLoanAssetRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_LOAN_ASSET, Rsp)
				);
			})
			.catch();
	}

	public static LoanReq(amount: number) {
		console.log("LoanReq");
		var msg: pb.common.LoanReq = new pb.common.LoanReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.amount = amount;
		let buffer: Uint8Array = pb.common.LoanReq.encode(msg).finish();
		let cmd = pb.common.CmdID.LOAN;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.LoanRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_LOAN, Rsp)
				);
			})
			.catch();
	}

	public static RepayLoanReq(playerAssetId: number | Long, amount: number) {
		console.log("RepayLoanReq");
		var msg: pb.common.RepayLoanReq = new pb.common.RepayLoanReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.playerAssetId = playerAssetId;
		msg.amount = amount;
		let buffer: Uint8Array = pb.common.RepayLoanReq.encode(msg).finish();
		let cmd = pb.common.CmdID.REPAY_LOAN;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.RepayLoanRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_REPAY_LOAN, Rsp)
				);
			})
			.catch();
	}

	public static GetStatements(userId: Long) {
		console.log(
			new Date().toLocaleString(),
			"------------------->StatementsRsp"
		);
		var msg = new pb.common.GetStatementReq();
		msg.req = { userId: userId };

		let buffer = pb.common.GetStatementReq.encode(msg).finish();
		console.log("before send GetStatementReq");
		GameSocket.instance.wsConn
			.sendRequest(pb.common.CmdID.GET_STATEMENT, buffer)
			.then((msg: Message) => {
				console.log(
					new Date().toLocaleString(),
					"------------------->StatementsRsp"
				);
				let rsp = pb.common.GetStatementRsp.decode(msg.body);
				console.log(
					"-------------->GetStatements",
					new Date().toLocaleString(),
					rsp
				);
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_GET_FINANCIAL_REPORTS, rsp)
				);
			});
	}

	public static StartAuctionReq(floorPrice: number) {
		console.log("StartAuctionReq");
		var msg: pb.common.StartAuctionReq = new pb.common.StartAuctionReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.floorPrice = floorPrice;

		let buffer: Uint8Array = pb.common.StartAuctionReq.encode(msg).finish();
		let cmd = pb.common.CmdID.START_AUCTION;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.StartAuctionRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_START_AUCTION, Rsp)
				);
			})
			.catch();
	}

	public static GiveUpAuctionReq(auctionId: number | Long) {
		console.log("GiveUpAuctionReq");
		var msg: pb.common.GiveUpAuctionReq = new pb.common.GiveUpAuctionReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.auctionId = auctionId;

		let buffer: Uint8Array = pb.common.GiveUpAuctionReq.encode(msg).finish();
		let cmd = pb.common.CmdID.GIVEUP_AUCTION;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GiveUpAuctionRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_GIVEUP_AUCTION, Rsp)
				);
			})
			.catch();
	}

	public static AuctionBidReq(auctionId: number | Long, amount: number) {
		console.log("AuctionBidReq");
		var msg: pb.common.AuctionBidReq = new pb.common.AuctionBidReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.auctionId = auctionId;
		msg.amount = amount;

		let buffer: Uint8Array = pb.common.AuctionBidReq.encode(msg).finish();
		let cmd = pb.common.CmdID.OFFER_AUCTION_BID;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.AuctionBidRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_OFFER_AUCTION_BID, Rsp)
				);
			})
			.catch();
	}

	public static PlayerAFKReq() {
		console.log("PlayerAFKReq");
		var msg: pb.common.PlayerAFKReq = new pb.common.PlayerAFKReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.PlayerAFKReq.encode(msg).finish();
		let cmd = pb.common.CmdID.AFK;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.PlayerAFKRsp.decode(msg.body);
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(new GameEvent(EventType.SOCKET_AFK, Rsp));
			})
			.catch();
	}

	public static GetAvailableMapsReq() {
		console.log("GetAvailableMapsReq");
		var msg: pb.common.GetAvailableMapsReq = new pb.common.GetAvailableMapsReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		let buffer: Uint8Array = pb.common.GetAvailableMapsReq.encode(msg).finish();
		let cmd = pb.common.CmdID.GET_AVAILABLE_MAPS;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.GetAvailableMapsRsp.decode(msg.body);
				console.log(Rsp, "GetAvailableMapsRsp");
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_GET_AVAILABLE_MAPS, Rsp)
				);
			})
			.catch();
	}

	public static UpdateRoomChoicesReq(
		roomId: string,
		opt: pb.common.IRoomOption
	) {
		console.log("UpdateRoomChoicesReq", roomId, opt);
		var msg: pb.common.UpdateRoomChoicesReq = new pb.common.UpdateRoomChoicesReq();
		msg.req = {};
		msg.req.userId = UserData.uid;
		msg.roomID = roomId;
		msg.opt = opt;
		let buffer: Uint8Array = pb.common.UpdateRoomChoicesReq.encode(
			msg
		).finish();
		let cmd = pb.common.CmdID.UPDATE_ROOM_OPTION;

		GameSocket.instance.wsConn
			.sendRequest(cmd, buffer)
			.then((msg: Message) => {
				let Rsp = pb.common.UpdateRoomChoicesRsp.decode(msg.body);
				console.log(console.log(Rsp, "UpdateRoomChoicesRsp"));
				if (Rsp.rsp.code) {
					//Tips.show(Rsp.rsp.msg);
					return;
				}
				GameEvent.event.dispatchEvent(
					new GameEvent(EventType.SOCKET_UPDATE_ROOM_OPTION, Rsp)
				);
			})
			.catch();
	}
}
