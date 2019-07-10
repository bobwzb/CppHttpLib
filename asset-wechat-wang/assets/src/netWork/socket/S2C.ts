import { INetHandler } from "./INetHandler";
import { Message } from "../../lib/mars/mars";
import { pb } from "../../asset.pb";
import Tips from "../../until/Tips";
import { GameEvent, EventType } from "../../lib/GameEvent";
import { MsgEvent, MsgEventType } from "../../lib/MsgEvent";

export default class S2C implements INetHandler {
	name(): string {
		return "S2C";
	}

	handle(cmd: number, body: any): boolean {
		switch (cmd) {
			case pb.common.CmdID.START_MATCHING:
				this.StartMatchingMsg(body);
				return true;
			case pb.common.CmdID.MATCHING:
				this.MatchMsg(body);
				return true;
			case pb.common.CmdID.PREPARE:
				this.PrepareMsg(body);
				return true;
			case pb.common.CmdID.ANYONE_TIMEOUT:
				this.AnyoneTimeoutMsg(body);
				return true;
			case pb.common.CmdID.ALL_READY:
				this.AllReadyMsg(body);
				return true;
			case pb.common.CmdID.SELECT_ROLE:
				this.SelectRoleMsg(body);
				return true;
			case pb.common.CmdID.PLAYERS_ALL_SELECTED_ROLE:
				this.PlayerAllSelectedRoleMsg(body);
				return true;
			case pb.common.CmdID.ROLL:
				this.RollMsg(body);
				return true;
			case pb.common.CmdID.NEXT_ROLL:
				this.NextRollMsg(body);
				return true;
			case pb.common.CmdID.WAGE_HIKE_ROLL:
				this.WageHikeMsg(body);
				return true;
			case pb.common.CmdID.PAY_ACCIDENT_CONSUME:
				this.PayAccidentConsumeMsg(body);
				return true;
			case pb.common.CmdID.RE_CONNECT:
				this.PlayerReconnectMsg(body);
				return true;
			case pb.common.CmdID.QUIT:
				this.PlayerQuitGameMsg(body);
				return true;
			case pb.common.CmdID.CHOOSE_CHANCE:
				this.ChooseChanceMsg(body);
				return true;
			case pb.common.CmdID.BUY:
				this.BuyMsg(body);
				return true;
			case pb.common.CmdID.SELL_ASSETS:
				this.SellAssetsMsg(body);
				return true;
			case pb.common.CmdID.GIVEUP_CHANCE:
				this.GiveUpChanceMsg(body);
				return true;
			case pb.common.CmdID.PLAYER_OUT:
				this.PlayerOutMsg(body);
				return true;
			case pb.common.CmdID.GAME_OVER:
				this.GameOverMsg(body);
				return true;
			case pb.common.CmdID.LOAN:
				this.LoanMsg(body);
				return true;
			case pb.common.CmdID.START_AUCTION:
				this.StartAuctionMsg(body);
				return true;
			case pb.common.CmdID.GIVEUP_AUCTION:
				this.GiveUpAuctionMsg(body);
				return true;
			case pb.common.CmdID.OFFER_AUCTION_BID:
				this.AuctionBidMsg(body);
				return true;
			case pb.common.CmdID.AUCTION_RESULT:
				this.AuctionResultMsg(body);
				return true;
			case pb.common.CmdID.AFK:
				this.PlayerAFKMsg(body);
				return true;
		}
		return false;
	}

	private StartMatchingMsg(body: any) {
		let msg = pb.common.StartMatchingMsg.decode(body.content);
		console.log(msg, "StartMatchingMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_START_MATCHING_MSG, msg)
		);
	}

	private MatchMsg(body: any) {
		let msg = pb.common.MatchMsg.decode(body.content);
		console.log(msg, "MatchMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_MatchMsg, msg)
		);
	}

	private PrepareMsg(body: any) {
		let msg = pb.common.PrepareMsg.decode(body.content);
		console.log(msg, "PrepareMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_PrepareMsg, body)
		);
	}

	private AnyoneTimeoutMsg(body: any) {
		let msg = pb.common.AnyoneTimeoutMsg.decode(body.content);
		console.log(msg, "AnyoneTimeoutMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_AnyoneTimeoutMsg, msg)
		);
	}

	private AllReadyMsg(body: any) {
		let msg = pb.common.AllReadyMsg.decode(body.content);
		console.log(msg, "AllReadyMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_AllReadyMsg, msg)
		);
	}

	private SelectRoleMsg(body: any) {
		let msg = pb.common.SelectRoleMsg.decode(body.content);
		console.log(msg, "SelectRoleMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_SelectRoleMsg, msg)
		);
	}

	private PlayerAllSelectedRoleMsg(body: any) {
		let msg = pb.common.PlayerAllSelectedRoleMsg.decode(body.content);
		console.log(msg, "PlayerAllSelectedRoleMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_PlayerAllSelectedRoleMsg, msg)
		);
	}

	private RollMsg(body: any) {
		let msg = pb.common.RollMsg.decode(body.content);
		console.log(msg, "RollMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_RollMsg, msg)
		);
	}

	private NextRollMsg(body: any) {
		let msg = pb.common.NextRollMsg.decode(body.content);
		console.log(msg, "NextRollMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_NextRollMsg, msg)
		);
	}

	private WageHikeMsg(body: any) {
		let msg = pb.common.WageHikeMsg.decode(body.content);
		console.log(msg, "WageHikeMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_WageHikeMsg, msg)
		);
	}

	private PayAccidentConsumeMsg(body: any) {
		let msg = pb.common.PayAccidentConsumeMsg.decode(body.content);
		console.log(msg, "PayAccidentConsumeMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_PayAccidentConsumeMsg, msg)
		);
	}

	private PlayerReconnectMsg(body: any) {
		let msg = pb.common.PlayerReconnectMsg.decode(body.content);
		console.log(msg, "PlayerReconnectMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_PlayerReconnectMsg, msg)
		);
	}

	private PlayerQuitGameMsg(body: any) {
		let msg = pb.common.PlayerQuitGameMsg.decode(body.content);
		console.log(msg, "PlayerQuitGameMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_PlayerQuitGameMsg, msg)
		);
	}

	private ChooseChanceMsg(body: any) {
		let msg = pb.common.ChooseChanceMsg.decode(body.content);
		console.log(msg, "ChooseChanceMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_ChooseChanceMsg, msg)
		);
	}

	private BuyMsg(body: any) {
		let msg = pb.common.BuyMsg.decode(body.content);
		console.log(msg, "BuyMsg");
		MsgEvent.event.dispatchEvent(new MsgEvent(MsgEventType.SOCKET_BuyMsg, msg));
	}

	private SellAssetsMsg(body: any) {
		let msg = pb.common.SellAssetsMsg.decode(body.content);
		console.log(msg, "SellAssetsMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_SellAssetsMsg, msg)
		);
	}

	private GiveUpChanceMsg(body: any) {
		let msg = pb.common.GiveUpChanceMsg.decode(body.content);
		console.log(msg, "GiveUpChanceMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_GiveUpChanceMsg, msg)
		);
	}

	private PlayerOutMsg(body: any) {
		let msg = pb.common.PlayerOutMsg.decode(body.content);
		console.log(msg, "PlayerOutMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_PlayerOutMsg, msg)
		);
	}

	private GameOverMsg(body: any) {
		let msg = pb.common.GameOverMsg.decode(body.content);
		console.log(msg, "GameOverMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_GameOverMsg, msg)
		);
	}

	private LoanMsg(body: any) {
		let msg = pb.common.LoanMsg.decode(body.content);
		console.log(msg, "LoanMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_LoanMsg, msg)
		);
	}

	private StartAuctionMsg(body: any) {
		let msg = pb.common.StartAuctionMsg.decode(body.content);
		console.log(msg, "StartAuctionMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_StartAuctionMsg, msg)
		);
	}

	private GiveUpAuctionMsg(body: any) {
		let msg = pb.common.GiveUpAuctionMsg.decode(body.content);
		console.log(msg, "GiveUpAuctionMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_GiveUpAuctionMsg, msg)
		);
	}

	private AuctionBidMsg(body: any) {
		let msg = pb.common.AuctionBidMsg.decode(body.content);
		console.log(msg, "AuctionBidMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_AuctionBidMsg, msg)
		);
	}

	private AuctionResultMsg(body: any) {
		let msg = pb.common.AuctionResultMsg.decode(body.content);
		console.log(msg, "AuctionResultMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_AuctionResultMsg, msg)
		);
	}

	private PlayerAFKMsg(body: any) {
		let msg = pb.common.PlayerAFKMsg.decode(body.content);
		console.log(msg, "PlayerAFKMsg");
		MsgEvent.event.dispatchEvent(
			new MsgEvent(MsgEventType.SOCKET_PlayerAFKMsg, msg)
		);
	}
}
