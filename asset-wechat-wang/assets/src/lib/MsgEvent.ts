const { ccclass, property } = cc._decorator;
/**
 * 游戏自定义事件
 */
@ccclass
export class MsgEvent extends cc.Event {
	public static event: cc.EventTarget = new cc.EventTarget(); // 游戏全局自定义事件target

	private _userData: any = null;
	public get userData(): any {
		return this._userData;
	}
	constructor(typeArg: string, data?: any) {
		super(typeArg, null);
		this._userData = data;
	}
}

export enum MsgEventType {
	SOCKET_START_MATCHING_MSG = "SOCKET_START_MATCHING_MSG",
	SOCKET_MatchMsg = "SOCKET_MatchMsg",
	SOCKET_PrepareMsg = "SOCKET_PrepareMsg",
	SOCKET_AnyoneTimeoutMsg = "SOCKET_AnyoneTimeoutMsg",
	SOCKET_AllReadyMsg = "SOCKET_AllReadyMsg",
	SOCKET_SelectRoleMsg = "SOCKET_SelectRoleMsg",
	SOCKET_PlayerAllSelectedRoleMsg = "SOCKET_PlayerAllSelectedRoleMsg",
	SOCKET_RollMsg = "SOCKET_RollMsg",
	SOCKET_NextRollMsg = "SOCKET_NextRollMsg",
	SOCKET_WageHikeMsg = "SOCKET_WageHikeMsg",
	SOCKET_PayAccidentConsumeMsg = "SOCKET_PayAccidentConsumeMsg",
	SOCKET_PlayerReconnectMsg = "SOCKET_PlayerReconnectMsg",
	SOCKET_PlayerQuitGameMsg = "SOCKET_PlayerQuitGameMsg",
	SOCKET_ChooseChanceMsg = "SOCKET_ChooseChanceMsg",
	SOCKET_BuyMsg = "SOCKET_BuyMsg",
	SOCKET_SellAssetsMsg = "SOCKET_SellAssetsMsg",
	SOCKET_GiveUpChanceMsg = "SOCKET_GiveUpChanceMsg",
	SOCKET_PlayerOutMsg = "SOCKET_PlayerOutMsg",
	SOCKET_GameOverMsg = "SOCKET_GameOverMsg",
	SOCKET_LoanMsg = "SOCKET_LoanMsg",
	SOCKET_StartAuctionMsg = "SOCKET_StartAuctionMsg",
	SOCKET_GiveUpAuctionMsg = "SOCKET_GiveUpAuctionMsg",
	SOCKET_AuctionBidMsg = "SOCKET_AuctionBidMsg",
	SOCKET_AuctionResultMsg = "SOCKET_AuctionResultMsg",
	SOCKET_PlayerAFKMsg = "SOCKET_PlayerAFKMsg"
}
