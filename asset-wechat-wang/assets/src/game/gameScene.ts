import BasicScene from "../lib/BasicScene";
import { GameEvent, EventType } from "../lib/GameEvent";
import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import DicePrefab from "./DicePrefab";
import roadLayer from "./roadLayer";
import C2S from "../netWork/socket/C2S";
import { pb } from "../asset.pb";
import seatGroup from "./seatGroup";
import UserData from "../data/userData";
import GamaCoinPrefab from "./GamaCoinPrefab";
import DiceAnim from "./DiceAnim";
import { BehaviorType } from "./BehaviorType";
import { SCENARIO_TYPE } from "./mapType";
import unemployment from "./unemployment";
import boyExpense from "./boyExpense";
import accident from "./accident";
import payConfirm from "./payConfirm";
import promoteIng from "./promoteIng";
import promoteResult from "./promoteResult";
import broke from "./broke";
import gameResult from "./gameResult";
import investSelect from "./investSelect";
import investChance from "./investChance";
import StringUtils from "../until/StringUtils";
import Tips from "../until/Tips";
import fictitious from "./fictitious";
import fictitiousBuy from "./fictitiousBuy";
import marketView from "./marketView";
import cardCtrl from "./cardCtrl";
import DiceAnim2 from "./DiceAnim2";
import yearAnim from "./yearAnim";
import auctionCtrl from "./auctionCtrl";
import offerLeft from "./offerLeft";
import offerBottom from "./offerBottom";
import offerResult from "./offerResult";
import investDetail from "./investDetail";
import { Message } from "../lib/mars/mars";
import GameSocket from "../netWork/socket/GameSocket";
import { RemoteAudio, SoundName } from "../lib/component/remoteAudio";
import ServerLoading from "../hall/ServerLoadingPopup";
import FinancialReportsPopup from "./financial_report/financialReportPopup";
import { MsgEvent, MsgEventType } from "../lib/MsgEvent";
import gameTime from "./gameTime";
import Config from "../config";
let JSONbig = require("json-bigint");
var Long = require("long");

const { ccclass, property } = cc._decorator;
const sortKeyArr: Array<string> = [
	"理财",
	"货币",
	"股票",
	"房地产",
	"股权投资",
	"企业投资"
];

@ccclass
export default class gameScene extends BasicScene {
	@property(cc.Label)
	agelabel: cc.Label = null;

	@property(cc.Sprite)
	timeIcon: cc.Sprite = null;

	@property(cc.Node)
	gameStartCoin: cc.Node = null;

	@property(cc.Button)
	toggleTime: cc.Button = null;

	@property(cc.Prefab)
	reborn: cc.Prefab = null;

	@property(cc.Prefab)
	coinAnim: cc.Prefab = null;

	@property(cc.Node)
	assetNode: cc.Node = null;

	@property(cc.Prefab)
	assItem: cc.Prefab = null;

	@property([cc.Node])
	noIcons: cc.Node[] = [];

	@property([cc.Node])
	assLayers: cc.Node[] = [];

	isMy: boolean = true;
	private DiceCtrl: DicePrefab = null; //筛子类
	private roadCtrl: roadLayer = null; //路劲类
	private seatCtrl: seatGroup = null; //左侧个人信息类
	private unemploymentCtrl: unemployment = null; //失业
	private boyExpenseCtrl: boyExpense = null; //生小孩
	private accidentCtrl: accident = null; //意外消费
	private payConfirmCtrl: payConfirm = null; //购买确认
	private promoteCtrl: promoteIng = null; //升职加薪
	private promoteResultCtrl: promoteResult = null; //升职加薪结果
	private brokeCtrl: broke = null; //破产
	private gameResultCtrl: gameResult = null; //游戏结束
	private investSelectCtrl: investSelect = null; //机会选择
	private investChanceCtrl: investChance = null; //机会卡片
	private fictitiousCtrl: fictitious = null; //股票，定期，理财可售窗口
	private fictitiousBuyCtrl: fictitiousBuy = null; //股票，定期，理财购买窗口
	private marketCtrl: marketView = null; //市场
	private yearAnimCtrl: yearAnim = null; //年龄动画
	private auctionCtrl: auctionCtrl = null; //拍卖起拍
	private offerLeftCtrl: offerLeft = null; //拍卖右边栏
	private offerBottomCtrl: offerBottom = null; //拍卖底栏
	private offerResultCtrl: offerResult = null; //拍卖结束
	private investDetailCtrl: investDetail = null; //拍卖详情
	private FinancialReportsPopupCtrl: FinancialReportsPopup = null; //财务报表
	private gameTimeCtrl: gameTime = null; //timeIcon
	public is_end: boolean=false;
	private detime: number=0;
	private go: number=0;

	private syncData: pb.common.SyncStateRsp; //syc全部数据
	private mySyncData: pb.common.IGamePlayer; //sync 玩家数据
	private mySyncPlayerRecord: pb.common.IPlayerRecord; //sync 玩家游戏数据
	private mapData: pb.common.IGameMap; //地图
	private checkData: pb.common.CheckPlayingRsp; //check数据
	private curPosid: number; //庄家id
	private otherPosid: number; //闲家id
	private curPlayerInfo: pb.common.IPlayerInfo; //庄家玩家信息
	private curRoadIdx: number; //庄家路径id
	private curRoundData: pb.common.RollMsg; //庄家当局游戏数据
	private promoteData: pb.common.WageHikeMsg; //升职加薪数据
	private chooseChanceData: pb.common.ChooseChanceMsg; //选择机会数据
	private payCount: number; //支付
	private isNetAeest: boolean; //是否网络资产
	private timeIsShow: boolean; //是否显示时间
	private coinItemList: cc.Node[] = []; //飞金币动画金币节点
	private nextRollTime: number = 0.6; //摇色子增加处理时间
	private gameStep = {}; //游戏双方步数
	private startAucionData: pb.common.StartAuctionMsg; //庄家发起拍卖数据
	private auctionNode: cc.Node; //起拍价节点
	private isHasAuct: boolean = false; //是否经历拍卖
	private isHasRoad: boolean = false; //是否已经加载路径
	private isConnent: boolean = false; //是否已经重连
	private isOnShow: boolean = false; //是否已经onshow
	private isClose: boolean = false; //是否已经onshow
	private assData: pb.common.ITopCategory[] = []; //资产数据
	private assPrefab: cc.Prefab;
	private assNodeArr = [];
	onLoad() {
		UserData.gameSyncNum = 0;
		console.log("进入到游戏场景", UserData.gameSyncNum);

		let self: gameScene = this;

		self.initCtrl();
		self.initUi();
		C2S.CheckPlayingReq();
		GameEvent.event.on(EventType.SOCKET_LOGIN_SUCESS, this.initConnect, this);
		GameEvent.event.on(EventType.SOCKET_ON_CLOSED, this.onSocketClose, this);
		GameEvent.event.on(EventType.SOCKET_SYNC_STATE, this.onSyncState, this);
		GameEvent.event.on(
			EventType.SOCKET_CHECK_PLAYING,
			this.onCheckPlaying,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_PlayerAFKMsg,
			this.onPlayerAFKMsg,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_PlayerReconnectMsg,
			this.onPlayerReconnectMsg,
			this
		);

		GameEvent.event.on(EventType.ON_HIDE, this.initHide, this);
		GameEvent.event.on(EventType.ON_SHOW, this.initOnShow, this);

		if (!this.isConnent || !this.isOnShow) {
			C2S.PlayerReConnectReq();
			C2S.SyncStateReq();
			ServerLoading.show();
			this.scheduleOnce(function() {
				ServerLoading.hide();
			}, 1);
		}
		console.log(UserData.uid.toString(), "UserData.uid");
		self.playBGM();
		// let getArrDifference = function(arr1, arr2) {

		// 	return arr1.concat(arr2).filter(function(v, i, arr) {

		// 		return arr.indexOf(v) === arr.lastIndexOf(v);

		// 	});

		// }
		// let a = [1,2,3,4,5,6]
		// let b = [3,5]
		// console.log(getArrDifference(a, b))
	}

	private playBGM() {
		RemoteAudio.getAudioByName(SoundName.GAME_BGM).then(clip => {
			// this.bgmAudio = cc.audioEngine.playMusic(clip, true);
		});
	}

	private stopBGM() {
		// if (this.bgmAudio === null) {
		// 	return
		// }
		cc.audioEngine.stopMusic();
	}

	initConnect() {
		let self = this;
		self.unscheduleAllCallbacks();
		self.hideContent();
		self.hideAuciton();
		UserData.gameSyncNum = 0;
		console.log("重连到游戏场景", UserData.gameSyncNum);
		self.seatCtrl.hideOffLineToast(self.seatCtrl.selfPosid);
		C2S.CheckPlayingReq();
		C2S.SyncStateReq();
		C2S.PlayerReConnectReq();
		// C2S.SyncStateReq();
		GameEvent.event.on(EventType.SOCKET_SYNC_STATE, this.onSyncState, this);
		GameEvent.event.on(
			EventType.SOCKET_CHECK_PLAYING,
			this.onCheckPlaying,
			this
		);
		ServerLoading.show();
		self.scheduleOnce(function() {
			ServerLoading.hide();
		}, 1);
		this.isConnent = true;
		this.isClose = false;
	}

	initOnShow() {
		// if (this.isConnent) {
		// 	return
		// }
		this.unscheduleAllCallbacks();
		this.seatCtrl.hideOffLineToast(this.seatCtrl.selfPosid);
		this.hideAuciton();
		this.hideContent();
		C2S.PlayerReConnectReq();
		C2S.SyncStateReq();
		ServerLoading.show();
		this.scheduleOnce(function() {
			ServerLoading.hide();
		}, 1);
		this.isOnShow = true;
	}

	initHide() {
		let self = this;
		let data = {
			toastIdx: 6
		};
		self.seatCtrl.setSeatToast(self.seatCtrl.selfPosid, data, self.isMy);
		self.unscheduleAllCallbacks();
		C2S.PlayerAFKReq();
		self.stopBGM();
		self.isOnShow = false;
	}

	/**
	 * 初始化逻辑
	 */
	initCtrl() {
		this.DiceCtrl = this.getComponentInChildren(DicePrefab);
		this.roadCtrl = this.getComponentInChildren(roadLayer);
		this.seatCtrl = this.getComponentInChildren(seatGroup);
		this.unemploymentCtrl = this.getComponentInChildren(unemployment);
		this.boyExpenseCtrl = this.getComponentInChildren(boyExpense);
		this.accidentCtrl = this.getComponentInChildren(accident);
		this.payConfirmCtrl = this.getComponentInChildren(payConfirm);
		this.promoteCtrl = this.getComponentInChildren(promoteIng);
		this.promoteResultCtrl = this.getComponentInChildren(promoteResult);
		this.brokeCtrl = this.getComponentInChildren(broke);
		this.gameResultCtrl = this.getComponentInChildren(gameResult);
		this.investSelectCtrl = this.getComponentInChildren(investSelect);
		this.investChanceCtrl = this.getComponentInChildren(investChance);
		this.fictitiousCtrl = this.getComponentInChildren(fictitious);
		this.fictitiousBuyCtrl = this.getComponentInChildren(fictitiousBuy);
		this.marketCtrl = this.getComponentInChildren(marketView);
		this.yearAnimCtrl = this.getComponentInChildren(yearAnim);
		this.auctionCtrl = this.getComponentInChildren(auctionCtrl);
		this.offerLeftCtrl = this.getComponentInChildren(offerLeft);
		this.offerBottomCtrl = this.getComponentInChildren(offerBottom);
		this.offerResultCtrl = this.getComponentInChildren(offerResult);
		this.investDetailCtrl = this.getComponentInChildren(investDetail);
		this.FinancialReportsPopupCtrl = this.getComponentInChildren(
			FinancialReportsPopup
		);
		this.gameTimeCtrl = this.getComponentInChildren(gameTime);
	}

	/**
	 * 初始化UI
	 */
	initUi() {
		this.DiceCtrl.hide();
		this.seatCtrl.initAllSeat();
		let self: gameScene = this;

		this.timeIsShow = true;
		// this.onTimeIcon(false, 60);

		this.toggleTime.node.on(
			"click",
			function name(params: any) {
				this.onTimeIcon(true);
			},
			this
		);

		// let timeEndCallBack = function() {
		// 	self.timeIsShow = true;
		// 	self.onTimeIcon(false, 5 * 60);
		// };
		// this.scheduleOnce(timeEndCallBack, 15 * 60);
		this.roadCtrl.node.opacity = 125;
		this.offerBottomCtrl.node.setPosition(0, (-900 * cc.winSize.height) / 1334);
		for (let i = 0; i < this.seatCtrl.playerSeats.length; i++) {
			if (i >= Config.GAME_PLAYER_NUM) {
				this.seatCtrl.playerSeats[i].node.active = false;
				this.roadCtrl.headNode[i].active = false;
			}
		}
		if (Config.GAME_PLAYER_NUM === 1) {
			this.node.getChildByName("vsIcon").active = false;
		} else {
			this.assetNode.active = false;
		}
	}

	initRoad() {
		console.log("------------------->initRoad");
		if (!this.isHasRoad) {
			this.roadCtrl.createRoad(this.mapData);
			this.isHasRoad = true;
		}
		this.roadCtrl.initHead();
		this.roadCtrl.roadHead(this.isMy);
	}

	/**
	 *获取初始资金
	 */
	showGameStartCoin(res: any) {
		this.gameStartCoin.active = true;
		this.gameStartCoin.zIndex = 999;
		this.gameStartCoin.getComponent(GamaCoinPrefab).setData(res);
	}

	/**
	 *开始回合界面
	 */
	showDice() {
		// this.DiceCtrl.show();
		this.DiceCtrl.setView(this.isMy);
		this.roadCtrl.roadHead(this.isMy);
	}

	/**
	 * 筛子动画结束
	 */
	DiceEnd() {
		this.DiceCtrl.hide();
		let seatId = this.seatCtrl.PosidToseatid(this.curPosid);
		console.log(seatId, this.curPosid, "----------------------->DiceEnd");
		this.roadCtrl.onShowItemMove(this.curRoundData.num, seatId);
	}

	/**
	 *升职加薪摇色子
	 */
	showPromote() {
		this.promoteCtrl.show();
		this.promoteCtrl.setView(this.isMy, this.curPlayerInfo);
		this.nextRollTime = 0.45 + 0.6;
	}

	/**
	 * 升职加薪筛子动画结束
	 */
	PromoteEnd() {
		console.log("---------------------->展示升职加薪结果");
		this.hideContent();
		this.promoteResultCtrl.show();
		this.promoteResultCtrl.setData(this.promoteData);
		// C2S.SyncStateReq();
		//升职动画 this.promoteData.promotion
	}

	/**
	 * 设置弹窗
	 */
	onSetting() {
		this.onShowCoinFly();
	}

	/**
	 *游戏时间动画
	 */
	onTimeIcon(isToggle: boolean, time?: number) {
		this.timeIcon.node.stopAllActions();
		if (isToggle) {
			this.timeIsShow = !this.timeIsShow;
		}
		let timeY = this.timeIsShow ? -64 : 64;
		let action: cc.Action = cc.moveBy(0.3, cc.v2(timeY, 0));
		this.timeIcon.node.runAction(action);
		// let self: gameScene = this;
		// if (this.timeIsShow) {
		// 	let delay = cc.delayTime(time ? time : 10);
		// 	let action2: cc.FiniteTimeAction = cc.moveBy(0.3, cc.v2(64, 0));
		// 	let func = cc.callFunc(function(target, data) {
		// 		self.timeIsShow = true;
		// 	}, this);
		// 	let sq = cc.sequence(delay, action2, func);
		// 	this.timeIcon.node.runAction(sq);
		// }
	}

	addEvent() {
		GameEvent.event.on(EventType.GAME_DICE_END, this.DiceEnd, this);
		GameEvent.event.on(
			EventType.SOCKET_LOAN_QUALIFICATION,
			this.onLoanData,
			this
		);
		MsgEvent.event.on(MsgEventType.SOCKET_RollMsg, this.onRollMsg, this);
		MsgEvent.event.on(
			MsgEventType.SOCKET_NextRollMsg,
			this.onNextRollMsg,
			this
		);
		GameEvent.event.on(EventType.GAME_ROAD_MOVE_END, this.onRoadMoveEnd, this);
		GameEvent.event.on(
			EventType.SOCKET_UNEMPLOYMENT_ACK,
			this.onUnemployment,
			this
		);
		GameEvent.event.on(
			EventType.GAME_SHOW_PAY_CONFIRM,
			this.onShowConfirm,
			this
		);
		GameEvent.event.on(
			EventType.GAME_SHOW_ACCIDENT_PAY_CONFIRM,
			this.onShowConfirm,
			this
		);
		GameEvent.event.on(EventType.GAME_PROMOTE_END, this.PromoteEnd, this);
		MsgEvent.event.on(MsgEventType.SOCKET_WageHikeMsg, this.onPromoteMsg, this);
		GameEvent.event.on(
			EventType.SOCKET_PAY_ACCIDENT_CONSUME,
			this.onShowConfirm,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_PlayerQuitGameMsg,
			this.onQuitGame,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_ChooseChanceMsg,
			this.onChooseChanceMsg,
			this
		);
		MsgEvent.event.on(MsgEventType.SOCKET_BuyMsg, this.onBuyMsg, this);
		GameEvent.event.on(EventType.SOCKET_BUY, this.onShowConfirm, this);
		GameEvent.event.on(
			EventType.SOCKET_GET_CAN_SELL_PLAYER_ASSET,
			this.onGetCanSell,
			this
		);
		GameEvent.event.on(
			EventType.SOCKET_SELL_ASSETS,
			this.onShowSellAssets,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_SellAssetsMsg,
			this.onShowSellAssetsMsg,
			this
		);
		GameEvent.event.on(EventType.SOCKET_TRY_PAY, this.onTryPay, this);
		GameEvent.event.on(EventType.GAME_CHANCE_BUY, this.onGameChanceBuy, this);
		GameEvent.event.on(EventType.GAME_PAY_COUNT, this.onPayCount, this);
		GameEvent.event.on(
			EventType.SOCKET_GIVEUP_CHANCE,
			this.onGiveUpChance,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_GiveUpChanceMsg,
			this.onGiveUpChanceMsg,
			this
		);
		GameEvent.event.on(
			EventType.SOCKET_CONFIRM_MARKET_CHANGE,
			this.onConfirmMarket,
			this
		);
		MsgEvent.event.on(MsgEventType.SOCKET_PlayerOutMsg, this.onBrokeView, this);
		GameEvent.event.on(
			EventType.SOCKET_CONFIRM_BANKRUPT,
			this.onConfirmBankrupt,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_GameOverMsg,
			this.onGameOverMsg,
			this
		);
		GameEvent.event.on(EventType.SOCKET_QUIT, this.onQuit, this);
		MsgEvent.event.on(MsgEventType.SOCKET_LoanMsg, this.onLoanMsg, this);
		GameEvent.event.on(EventType.GAME_CHANCE_AUCT, this.onChanceAuct, this);
		MsgEvent.event.on(
			MsgEventType.SOCKET_StartAuctionMsg,
			this.onChanceAuctMsg,
			this
		);
		GameEvent.event.on(
			EventType.GAME_CHANCE_AUCT_OFFER,
			this.onChanceAuctOffer,
			this
		);
		GameEvent.event.on(
			EventType.SOCKET_OFFER_AUCTION_BID,
			this.onChanceAuctionBidRsp,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_AuctionBidMsg,
			this.onChanceAuctionBidMsg,
			this
		);
		MsgEvent.event.on(
			MsgEventType.SOCKET_AuctionResultMsg,
			this.onChanceAuctionResultMsg,
			this
		);
		GameEvent.event.on(EventType.GAME_CHANCE_DETAIL, this.onChanceDetail, this);
		GameEvent.event.on(
			EventType.SOCKET_GET_FINANCIAL_REPORTS,
			this.onGetFinancial,
			this
		);
	}

	/**
	 * 隐藏卡片
	 */
	hideContent() {
		this.DiceCtrl.hide();
		this.unemploymentCtrl.hide();
		this.boyExpenseCtrl.hide();
		this.accidentCtrl.hide();
		this.payConfirmCtrl.hide();
		this.promoteCtrl.hide();
		this.promoteResultCtrl.hide();
		this.brokeCtrl.hide();
		this.gameResultCtrl.hide();
		this.investSelectCtrl.hide();
		this.investChanceCtrl.hide();
		this.fictitiousCtrl.hide();
		this.fictitiousBuyCtrl.hide();
		this.marketCtrl.hide();
		this.auctionCtrl.hide();
		// this.offerLeftCtrl.hide();
		// this.offerBottomCtrl.hide();
		this.offerResultCtrl.hide();
		this.investDetailCtrl.hide();
	}

	/**
	 *
	 * @param res CheckPlayingRsp
	 */
	onCheckPlaying(res: any) {
		let msg: pb.common.CheckPlayingRsp = res.userData;
		let self: gameScene = this;
		console.log(msg, "onCheckPlaying");
		this.checkData = msg;
		UserData.checkData = msg;
		if (msg.state == pb.common.PlayerState.PLAYER_STATE_BEGIN) {
			ServerLoading.show();
			cc.director.preloadScene("hallScene", function() {
				ServerLoading.hide();
				cc.director.loadScene("hallScene");
			});
		}
	}

	onSyncState(res: any) {
		let msg: pb.common.SyncStateRsp = res.userData;
		console.log(msg, "onSyncState");
		this.syncData = msg;
		if (!msg.players.length) {
			console.log(msg.rsp);
			return;
		}
		this.mapData = msg.map;
		for (let i = 0; i < Config.GAME_PLAYER_NUM; i++) {
			if (msg.players[i].userID.equals(UserData.uid)) {
				this.seatCtrl.setSelfPosid(i);
				if (UserData.gameSyncNum > 0 && this.mySyncData) {
					console.log(this.mySyncData, "this.mySyncData----------------->");
					if (
						msg.players[i].playerGameData.cashFlow.totalCash.compare(
							this.mySyncData.playerGameData.cashFlow.totalCash
						) == 1
					) {
						this.onShowCoinFly();
					}
				}
				this.mySyncData = msg.players[i];
				this.mySyncPlayerRecord = msg.state.playerRecords[i];
				break;
			}
		}

		for (let j = 0; j < Config.GAME_PLAYER_NUM; j++) {
			if (msg.state.userId.equals(msg.players[j].userID)) {
				let seatId = this.seatCtrl.PosidToseatid(j);
				this.isMy = seatId == 0;
				this.curPosid = j;
			} else {
				this.otherPosid = j;
			}
			this.gameStep[msg.state.playerRecords[j].userId.toString()] = {
				step: null,
				posid: null
			};
			this.gameStep[msg.state.playerRecords[j].userId.toString()].step =
				msg.state.playerRecords[j].currentLocation;
			this.gameStep[msg.state.playerRecords[j].userId.toString()].posid =
				msg.state.playerRecords[j].currentLocation;
		}

		this.setPlayer();
		this.gameTimeCtrl.setShowTime(this.syncData.state.globalTimer.remaining);
		if (UserData.gameSyncNum == 0) {
			console.log("第一次进入游戏界面加载场景");
			this.yearAnimCtrl.setoldNum(this.mySyncPlayerRecord.age);
			if (!this.mySyncPlayerRecord.currentLocation) {
				this.showGameStartCoin(this.mySyncData);
			}
			this.initRoad();
			this.DiceCtrl.initHead();
			this.FinancialReportsPopupCtrl.hide();
			this.FinancialReportsPopupCtrl.setHead();
			this.onShowStatus();
			this.updatePlayerCurrent();

			this.curRoadIdx = this.syncData.state.playerRecords[
				this.curPosid
			].currentLocation;
			this.roadCtrl.setCurRoad(this.curRoadIdx);
			for (let k = 0; k < Config.GAME_PLAYER_NUM; k++) {
				this.seatCtrl.setSeatChckData(k, this.checkData.players[k]);
				if (this.syncData.players[k].playerGameData.isOut) {
					let data = {
						toastIdx: 5
					};
					this.seatCtrl.setSeatToast(k, data, this.isMy);
				}
				if (
					this.syncData.players[k].onlineState === 2 &&
					!UserData.uid.equals(this.syncData.players[k].userID)
				) {
					let data = {
						toastIdx: 6
					};
					this.seatCtrl.setSeatToast(k, data, this.isMy);
				}
				let seatId = this.seatCtrl.PosidToseatid(k);
				let count: number = this.syncData.state.playerRecords[k]
					.currentLocation;
				this.roadCtrl.setPlayerPosition(count, seatId);
			}
			UserData.gameSyncNum = 1;
			this.addEvent();
			C2S.GetStatements(UserData.uid);
			ServerLoading.hide();
		}
	}

	onLoanData(res: any) {
		// let msg: pb.common.GetLoanQualificationRsp = res.userData
		// console.log(msg, "onLoanData--------------->")
		// for (let i = 0; i < Config.GAME_PLAYER_NUM; i++) {
		// 	this.seatCtrl.setSeatLoanData(i, msg)
		// }
	}

	onNextRollMsg(res: any) {
		this.unscheduleAllCallbacks();
		this.DiceCtrl.unscheduleAllCallbacks();
		// this.roadCtrl.node.stopAllActions()
		this.roadCtrl.unscheduleAllCallbacks();
		this.node.getComponentInChildren(DiceAnim).unscheduleAllCallbacks();
		this.getComponentInChildren(DiceAnim).stopAnim();
		let msg: pb.common.NextRollMsg = res.userData;
		let self: gameScene = this;
		if (msg.userId === UserData.uid) {
			RemoteAudio.playEffect(SoundName.OTHER_ROLL);
		}

		let delayTime = 0.6 + 0.2;
		this.scheduleOnce(function() {
			for (let i = 0; i < Config.GAME_PLAYER_NUM; i++) {
				if (msg.userId.equals(this.checkData.players[i].userId)) {
					let seatId = this.seatCtrl.PosidToseatid(i);
					this.isMy = seatId == 0;
					this.curPosid = i;
				} else {
					this.otherPosid = i;
				}
			}

			this.curPlayerInfo = this.checkData.players[this.curPosid];
			self.showDice();
			if (self.gameStep[msg.userId.toString()]) {
				console.log(
					self.curRoadIdx,
					self.gameStep[msg.userId.toString()].step,
					"-------------->self.gameStep[msg.userId.toString()].step"
				);
				self.curRoadIdx = self.gameStep[msg.userId.toString()].step;
				self.roadCtrl.setCurRoad(self.curRoadIdx);
			}
			self.seatCtrl.stopAllClock();
			self.seatCtrl.startClock(self.curPosid, msg.timer.remaining, 0);
			self.hideContent();
			self.DiceCtrl.show();
			cardCtrl.cardNodes = [];
			console.log("nextrollmsg逻辑完成----------------->");
		}, this.nextRollTime);
	}

	onRollMsg(res: any) {
		let msg: pb.common.RollMsg = res.userData;
		let self: gameScene = this;

		let willBankrupt = false;
		let bankruptSteps = 0;
		this.unscheduleAllCallbacks();
		this.DiceCtrl.unscheduleAllCallbacks();
		// this.roadCtrl.node.stopAllActions()
		this.roadCtrl.unscheduleAllCallbacks();
		this.node.getComponentInChildren(DiceAnim).unscheduleAllCallbacks();
		this.getComponentInChildren(DiceAnim).stopAnim();
		this.scheduleOnce(function() {
			if (
				msg.scenario.Code == "2BIG" ||
				msg.scenario.Code == "DEPOSIT" ||
				StringUtils.searchString(msg.scenario.Code, "STOCK:")
			) {
				this.isNetAeest = true;
			} else {
				this.isNetAeest = false;
			}

			this.curRoundData = msg;
			// if (msg.base.userId !== UserData.uid) {
			// 	RemoteAudio.playEffect(SoundName.DICE);
			// }

			let data: any = {
				num: this.curRoundData.num,
				idx: 1
			};
			this.roadCtrl.node.opacity = 255;
			self.getComponentInChildren(DiceAnim).setData(data);
			self.DiceCtrl.onStartDice();
			console.log("进入到rollmsg逻辑，摇筛子动画");
		}, 0);

		this.scheduleOnce(function() {
			self.getComponentInChildren(DiceAnim).onShowEnd();
			self.getComponentInChildren(DiceAnim).stopAnim();
		}, 1.2);

		let diceDalay = 1.2;
		let lineDalay = diceDalay + 0.5 + 0.1;
		let lineAnimationDalay = msg.num * 0.25 + lineDalay + 0.7;

		if (msg.isPayDay == 3 && msg.salaryInfo.length) {
			for (let i = 0; i < msg.salaryInfo.length; i++) {
				let cTime = msg.salaryInfo[i].steps * 0.25 + lineDalay;
				this.detime=cTime;
				if (msg.salaryInfo[i].willBankrupt) {
					console.log("rollMsg破产-------------->");
					console.log(cTime);
					console.log(this.detime);
					willBankrupt = true;
					bankruptSteps = msg.salaryInfo[i].steps;
					this.go=bankruptSteps;
					lineAnimationDalay = cTime;
					this.is_end=true;
					this.scheduleOnce(function() {
						self.onBrokeView(msg.salaryInfo[i]);
						self.roadCtrl.onShowItemStop();
						self.onShowYearMoney();
					}, cTime);
					if(willBankrupt==true){
						this.go=bankruptSteps;
						console.log("change------------------------------->");
						console.log(this.go);
						return;
					}
					break;
				} else {
					this.scheduleOnce(function() {
						self.onShowYearMoney();
						let curData = {
							toastIdx: 3,
							amount: msg.salaryInfo[i].salary
						};
						self.seatCtrl.setSeatToast(self.curPosid, curData, self.isMy);
					}, cTime);
				}
			}
		}

		this.scheduleOnce(function() {
			let timeLen = msg.timer.remaining;
			let tradersArray = msg.traders;
			let curRoadIdx =
				(msg.move.src.cycle - 1 + 1) * this.mapData.scenarios.length +
				msg.move.src.step;
			console.log(
				curRoadIdx,
				self.curRoadIdx,
				"------------------------->curRoadIdx,self.curRoadIdx"
			);
			//if(this.is_end==false){
			this.gameStep[msg.base.userId.toString()].step = curRoadIdx + msg.num;
			//}
			//else {
				//this.gameStep[msg.base.userId.toString()].step = curRoadIdx + this.go;
				//console.log("change------------------------------->");
				//consle.log(this.go);
			//}
			if (curRoadIdx !== self.curRoadIdx) {
				this.curRoadIdx = curRoadIdx;
				if (this.roadCtrl) {
					this.roadCtrl.setCurRoad(this.curRoadIdx);
				}
			}
			if (timeLen > 0) {
				if (msg.scenarioType == SCENARIO_TYPE.S_MARKET_INFO) {
					self.seatCtrl.startClock(
						this.curPosid,
						timeLen - lineAnimationDalay,
						0
					);
					if (Config.GAME_PLAYER_NUM === 1) {
					} else {
						for (let k = 0; k < tradersArray.length; k++) {
							if (
								tradersArray[k].equals(
									this.syncData.players[this.otherPosid].userID
								)
							) {
								self.seatCtrl.startClock(
									this.otherPosid,
									timeLen - lineAnimationDalay,
									1
								);
							}
						}
					}
				}
			}
		}, lineAnimationDalay);
	}

	onShowStatus() {
		let self: gameScene = this;
		this.curPlayerInfo = this.checkData.players[this.curPosid];
		if (!this.syncData) {
			return;
		}
		if (
			this.syncData.state.playerRecords[this.curPosid].BehaviorType ==
			BehaviorType.B_ROLL
		) {
			this.showDice();
			this.DiceCtrl.show();
			return;
		} else if (
			this.syncData.state.playerRecords[this.curPosid].BehaviorType ==
			BehaviorType.B_PAYDAY
		) {
			return;
		}
		if (!this.syncData.state.scenario) {
			return;
		}
		let lineAnimationDalay = this.syncData.state.diceNum * 0.25 + 1 + 0.75;
		this.scheduleOnce(function() {
			self.onSyncdataEnd();
		}, lineAnimationDalay);
	}

	updatePlayerCurrent() {
		let state = this.syncData.state;
		if (state.timer.remaining > 0) {
			for (let i = 0; i < state.playerRecords.length; i++) {
				if (state.playerRecords[i].userId.equals(state.userId)) {
					this.seatCtrl.startClock(i, state.timer.remaining, 0);
					break;
				}
			}
		} else {
			for (let i = 0; i < state.playerRecords.length; i++) {
				if (state.playerRecords[i].BehaviorType == 3) {
					break;
				}
			}
		}
	}

	setPlayer() {
		for (let j = 0; j < Config.GAME_PLAYER_NUM; j++) {
			this.seatCtrl.setSeatSyncData(j, this.syncData.players[j], this.isMy);
		}
	}

	onSyncdataEnd() {
		let state = this.syncData.state;
		this.hideContent();
		this.roadCtrl.node.opacity = 125;
		this.curRoundData = new pb.common.RollMsg();
		this.curRoundData.scenario = state.scenario;
		this.chooseChanceData = new pb.common.ChooseChanceMsg();
		this.chooseChanceData.base = {};
		this.curRoundData.roundData = {};
		if (!state || !state.scenario || !state.scenario.Type) {
			return;
		}
			switch (state.scenario.Type) {
				case SCENARIO_TYPE.S_CHANCE:
					console.log("投资机会");
					if (this.isMy) {
						this.investSelectCtrl.show();
					}
					break;
				case SCENARIO_TYPE.S_BIG_BUSINESS:
	
				case SCENARIO_TYPE.S_SMALL_BUSINESS:
					this.chooseChanceData.base.userId = state.userId;
					this.chooseChanceData.scenario = state.scenario;
					this.chooseChanceData.canSellCnt = state.roundData.canSellCnt;
					this.onChooseChanceMsg();
					break;
				case SCENARIO_TYPE.S_MARKET_INFO:
					console.log("市场信息");
					RemoteAudio.playEffect(SoundName.MARKET_INFO);
					this.marketCtrl.show();
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
								Tips.show(Rsp.rsp.msg);
								return;
							}
							this.curRoundData.roundData.canSellCnt = Rsp.data.length;
							this.marketCtrl.setData(
								this.curRoundData,
								this.curPlayerInfo,
								this.isMy
							);
						})
						.catch();
					break;
				case SCENARIO_TYPE.S_ACCIDENT:
					this.accidentCtrl.show();
					let data: any = {
						titleTxt: this.curRoundData.scenario.Name,
						contentImg: this.curRoundData.scenario.imgFile,
						contentTxt: this.curRoundData.scenario.Desc,
						num: this.curRoundData.scenario.A_Cash.toString(),
						isMy: this.isMy
					};
					this.accidentCtrl.setData(data);
					break;
				case SCENARIO_TYPE.S_CHARITY:
					break;
				case SCENARIO_TYPE.S_UNEMPLOYMENT:
					this.curRoundData.roundData.UnemploymentLoss =
						state.roundData.UnemploymentLoss;
					this.unemploymentCtrl.show();
					let data2: any = {
						num: this.curRoundData.roundData.UnemploymentLoss.toString(),
						isMy: this.isMy
					};
					this.unemploymentCtrl.setData(data2);
					break;
				case SCENARIO_TYPE.S_PAYDAY:
					break;
				case SCENARIO_TYPE.S_BABY:
					let data3: any = {
						num: this.curRoundData.scenario.babyExpense.toString(),
						isMy: this.isMy
					};
					this.boyExpenseCtrl.setData(data3);
					this.boyExpenseCtrl.show();
					break;
				case SCENARIO_TYPE.S_WAGE_HIKE:
					this.showPromote();
					break;
				case SCENARIO_TYPE.S_MARKET_CHANGE:
					console.log("市场变化");
					this.marketCtrl.show();
					this.marketCtrl.setData(
						this.curRoundData,
						this.curPlayerInfo,
						this.isMy
					);
					break;
				default:
					break;
			}

	}

	onRoadMoveEnd() {
		console.log("路径移动出现卡片-------------------------------->");
		let self: gameScene = this;
		this.hideContent();
		this.roadCtrl.node.opacity = 125;
		if (this.curRoundData.scenarioType == SCENARIO_TYPE.S_CHANCE) {
			console.log("投资机会");
			if (this.isMy&&this.is_end==false) {
				this.investSelectCtrl.show();
			}
			else if(this.is_end==true){
				self.onBrokeShow();
			}
		} else if (
			this.curRoundData.scenarioType == SCENARIO_TYPE.S_MARKET_INFO ||
			this.curRoundData.scenarioType == SCENARIO_TYPE.S_MARKET_CHANGE
		) {
			console.log("市场信息");
			if (this.is_end==false){
				this.marketCtrl.show();

			}
			else if(this.is_end==true){
				self.onBrokeShow();
			}
			this.marketCtrl.setData(this.curRoundData, this.curPlayerInfo, this.isMy);
		} else if (this.curRoundData.scenarioType == SCENARIO_TYPE.S_ACCIDENT) {
			if (this.is_end==false){
				this.accidentCtrl.show();
			}
			else if(this.is_end==true){
				self.onBrokeShow();
			}
			let data: any = {
				titleTxt: this.curRoundData.scenario.Name,
				contentImg: this.curRoundData.scenario.imgFile,
				contentTxt: this.curRoundData.scenario.Desc,
				num: this.curRoundData.scenario.A_Cash.toString(),
				isMy: this.isMy
			};
			this.accidentCtrl.setData(data);
		} else if (this.curRoundData.scenarioType == SCENARIO_TYPE.S_UNEMPLOYMENT) {
			if (this.is_end==false){
				this.unemploymentCtrl.show();
			}
			else if(this.is_end==true){
				self.onBrokeShow();
			}
			let data: any = {
				num: this.curRoundData.roundData.UnemploymentLoss.toString(),
				isMy: this.isMy
			};
			this.unemploymentCtrl.setData(data);
		} else if (this.curRoundData.scenarioType == SCENARIO_TYPE.S_BABY) {
			let data: any = {
				num: this.curRoundData.scenario.babyExpense.toString(),
				isMy: this.isMy
			};
			this.boyExpenseCtrl.setData(data);
			if (this.is_end==false){
				this.boyExpenseCtrl.show();
			}
			else if(this.is_end==true){
				self.onBrokeShow();
			}
		} else if (this.curRoundData.scenarioType == SCENARIO_TYPE.S_WAGE_HIKE) {
			if (this.is_end==false){
				this.showPromote();
			}
			else if(this.is_end==true){
				self.onBrokeShow();
			}
		}
		
	}

	onUnemployment(res: any) {
		C2S.SyncStateReq();
		this.unemploymentCtrl.hide();
	}

	/***
	 * isPayIng: true：支付界面 false：支付完成界面
	 */
	onShowConfirm(res: any) {
		// RemoteAudio.playEffect(SoundName.CASH_REGISTER);
		console.log(res, "----------------------->onShowConfirmres");
		if (res.userData.isPayIng) {
			if (res.type == EventType.GAME_SHOW_ACCIDENT_PAY_CONFIRM) {
				let data: any = {
					num: this.curRoundData.scenario.A_Cash.toString(),
					shopNameTxt: this.curRoundData.scenario.Name,
					isPayIng: true,
					type: res.type
				};
				this.payConfirmCtrl.setData(data);
				this.payConfirmCtrl.show();
			} else if (res.type == EventType.GAME_SHOW_PAY_CONFIRM) {
				let money;
				if (
					StringUtils.searchString(
						this.chooseChanceData.scenario.Code,
						"STOCK:"
					)
				) {
					money = (
						this.chooseChanceData.scenario.C_Price * this.payCount
					).toString();
				} else {
					money = (
						this.chooseChanceData.scenario.C_DownPayment * this.payCount
					).toString();
				}
				let data: any = {
					num: money,
					shopNameTxt: this.chooseChanceData.scenario.Name,
					isPayIng: true,
					type: res.type,
					payCount: this.payCount
				};
				this.payConfirmCtrl.setData(data);
				this.payConfirmCtrl.show();
			}
		} else {
			RemoteAudio.playEffect(SoundName.CASH_REGISTER);
			let data: any = {
				isPayIng: false
			};
			this.payConfirmCtrl.setData(data);
			this.payConfirmCtrl.show();
			C2S.SyncStateReq();
			this.nextRollTime = 0.5 + 0.6;
		}
	}

	onPromoteMsg(res: any) {
		let data: pb.common.WageHikeMsg = res.userData;
		let self: gameScene = this;
		this.promoteData = data;
		let dicedata: any = {
			num: this.promoteData.num,
			idx: 2
		};
		this.getComponentInChildren(DiceAnim2).setData(dicedata);
		this.promoteCtrl.onStartDice();
		C2S.SyncStateReq();
		RemoteAudio.playEffect(SoundName.HEARTBEAT);
		// if (data.isPromotion) {
		// 	RemoteAudio.playEffect(SoundName.PROMOTION);
		// } else {
		// 	RemoteAudio.playEffect(SoundName.PROMOTION_FAILED);
		// }
	}
	onBrokeShow(){
		this.brokeCtrl.show();
				let data = {
					toastIdx: 5
				};
				this.seatCtrl.setSeatToast(this.curPosid, data, this.isMy);
	}

	onBrokeView(res: any) {
		if (res.willBankrupt) {
			if (this.isMy) {
				this.scheduleOnce(function(){
					this.brokeCtrl.show();
			   },this.detime);
				let msg: pb.common.RollMsg.ISalaryInfo = res;
				this.brokeCtrl.setData(msg, true);
				let data = {
					toastIdx: 5
				};
				this.seatCtrl.setSeatToast(this.curPosid, data, this.isMy);
			}
		} else {
			if (
				res.userData &&
				res.userData.reasonType == 1 &&
				res.userData.userId.equals(UserData.uid)
			) {
			} else {
				this.brokeCtrl.show();
				let msg: pb.common.PlayerOutMsg = res.userData;
				this.brokeCtrl.setData(msg, false);
				let data = {
					toastIdx: 5
				};
				this.seatCtrl.setSeatToast(this.curPosid, data, this.isMy);
			}
		}
	}

	onQuitGame(res: any) {
		console.log("有玩家离开游戏");
	}

	/**
	 *
	 * @param idx 1：从选择投资机会中点出来 2:从拍卖详情中点出来
	 */
	onChooseChanceMsg(res?: any) {
		console.log("--------------------->处理机会卡片逻辑");
		this.unscheduleAllCallbacks();
		let delayTime = 0;
		if (this.isHasAuct) {
			delayTime = 2;
		}
		if (res) {
			this.chooseChanceData = res.userData;
		}
		for (let i = 0; i < this.syncData.players.length; i++) {
			if (
				this.syncData.players[i].userID.equals(
					this.chooseChanceData.base.userId
				)
			) {
				this.curPosid = i;
				let seatId = this.seatCtrl.PosidToseatid(i);
				this.isMy = seatId == 0;
			} else {
				this.otherPosid = i;
			}
		}
		if (
			this.chooseChanceData.scenario.Code == "2BIG" ||
			this.chooseChanceData.scenario.Code == "DEPOSIT" ||
			StringUtils.searchString(this.chooseChanceData.scenario.Code, "STOCK:")
		) {
			this.isNetAeest = true;
		} else {
			this.isNetAeest = false;
		}
		this.investChanceCtrl.setData(this.chooseChanceData, 1, this.isMy);
		if (this.chooseChanceData.timer) {
			let timeLen = this.chooseChanceData.timer.remaining - delayTime;
			let tradersArray = this.chooseChanceData.traders;
			if (timeLen > 0) {
				this.seatCtrl.stopAllClock();
				this.seatCtrl.startClock(this.curPosid, timeLen, 0);
				if (Config.GAME_PLAYER_NUM === 1) {
				} else {
					if (this.isNetAeest) {
						for (let k = 0; k < tradersArray.length; k++) {
							if (
								tradersArray[k].equals(
									this.syncData.players[this.otherPosid].userID
								)
							) {
								this.seatCtrl.startClock(this.otherPosid, timeLen, 1);
							}
						}
					}
				}
			}
		}
		this.scheduleOnce(function() {
			this.hideContent();
			this.investChanceCtrl.show();
			this.isHasAuct = false;
		}, delayTime);
	}

	onBuyMsg(res: any) {
		let msg: pb.common.BuyMsg = res.userData;
		C2S.SyncStateReq();
		if (msg.base.userId.equals(UserData.uid)) {
			if (Config.GAME_PLAYER_NUM === 1) {
				C2S.GetStatements(UserData.uid);
				// setTimeout(() => {
				// 	console.log(new Date().toLocaleString(), "------------------->GetStatementReq")
				// 	var msg = new pb.common.GetStatementReq();
				// 	msg.req = { userId: UserData.uid };

				// 	let buffer = pb.common.GetStatementReq.encode(msg).finish();
				// 	console.log("before send GetStatementReq");
				// 	GameSocket.instance.wsConn
				// 		.sendRequest(pb.common.CmdID.GET_STATEMENT, buffer)
				// 		.then((msg: Message) => {
				// 			console.log(new Date().toLocaleString(), "------------------->StatementsRsp")
				// 			// let rsp = pb.common.GetStatementRsp.decode(msg.body);
				// 			// console.log(
				// 			// 	"-------------->GetStatements",
				// 			// 	new Date().toLocaleString(),
				// 			// 	rsp
				// 			// );
				// 			// GameEvent.event.dispatchEvent(
				// 			// 	new GameEvent(EventType.SOCKET_GET_FINANCIAL_REPORTS, rsp)
				// 			// );
				// 		});
				// }, 0);
			}
			return;
		}
		if (msg.base.userId !== UserData.uid) {
			RemoteAudio.playEffect(SoundName.CARD_COLLAPSE_TO_AVATAR);
		}
		let action = cc.spawn(
			cc.moveTo(
				0.5,
				this.seatCtrl.playerSeats[1].node
					.getChildByName("avatarContainer")
					.getChildByName("headDefault").position
			),
			cc.scaleTo(0.5, 0)
		);
		if (cardCtrl.cardNodes.length) {
			let cardNode = cc.instantiate(cardCtrl.cardNodes[0]);
			this.node.addChild(cardNode);
			cardNode.runAction(
				cc.sequence(
					action,
					cc.callFunc(function() {
						cardNode.removeFromParent();
						cardNode.destroy();
					})
				)
			);
		}
		this.nextRollTime = 0.55 + 0.6;
	}

	onPayCount(res: any) {
		this.payCount = res.userData.count;
	}

	onGameChanceBuy(res: any) {
		if (this.isNetAeest) {
			this.fictitiousBuyCtrl.show();
			this.fictitiousBuyCtrl.setData(this.chooseChanceData);
		} else {
			this.payCount = 1;
			C2S.TryPayReq(this.payCount);
		}
	}

	onTryPay(res: any) {
		let msg: pb.common.TryPayRsp = res.userData;
		if (msg.payment == 1) {
			let data: any = {
				isPayIng: true
			};
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.GAME_SHOW_PAY_CONFIRM, data)
			);
		} else if (msg.payment == 2) {
			Popup.show(PopupType.loanTipPopup, null, msg.balance);
		} else if (msg.payment == 3) {
			Tips.show("金额不足,无法购买");
		}
	}

	onGetCanSell(res: any) {
		let msg: pb.common.GetCanSellPlayerAssetRsp = res.userData;

		this.fictitiousCtrl.show();
		this.fictitiousCtrl.setData(msg, this.isNetAeest);
	}

	onShowSellAssets(res: any) {
		RemoteAudio.playEffect(SoundName.SELL);
		// C2S.SyncStateReq();
		this.fictitiousCtrl.hide();
	}

	onShowSellAssetsMsg(res: any) {
		let msg: pb.common.SellAssetsMsg = res.userData;
		C2S.SyncStateReq();
		if (Config.GAME_PLAYER_NUM === 1) {
			C2S.GetStatements(UserData.uid);
		}
		let count = 0;
		let type;
		if (
			StringUtils.searchString(msg.assets[0].code, "2BIG") ||
			StringUtils.searchString(msg.assets[0].code, "DEPOSIT") ||
			StringUtils.searchString(msg.assets[0].code, "STOCK:")
		) {
			type = msg.assets[0].name;
			for (let k = 0; k < msg.assets.length; k++) {
				count += msg.assets[k].profit;
			}
		} else {
			if (msg.assets.length == 1) {
				type = msg.assets[0].name;
				count = msg.assets[0].profit;
			} else {
				if (
					StringUtils.searchString(msg.assets[0].code, "HOUSE") &&
					msg.assets[0].shard >= 12 &&
					msg.assets[0].mark == 0
				) {
					type = msg.assets.length + "栋公寓楼";
				} else if (StringUtils.searchString(msg.assets[0].code, "HOUSE")) {
					type = msg.assets.length + "套房产";
				} else if (
					StringUtils.searchString(msg.assets[0].code, "LAND") &&
					msg.assets[0].shard >= 12 &&
					msg.assets[0].mark == 0
				) {
					type = msg.assets.length + "块土地";
				} else if (
					StringUtils.searchString(msg.assets[0].code, "EQUITY") &&
					msg.assets[0].shard >= 12 &&
					msg.assets[0].mark == 0
				) {
					type = msg.assets.length + "份股权";
				} else if (
					StringUtils.searchString(msg.assets[0].code, "CO:") &&
					msg.assets[0].shard >= 12 &&
					msg.assets[0].mark == 0
				) {
					type = msg.assets.length + "套房产";
				} else if (
					StringUtils.searchString(msg.assets[0].code, "GOLD") &&
					msg.assets[0].shard >= 12 &&
					msg.assets[0].mark == 0
				) {
					type = msg.assets.length + "个" + msg.assets[0].name;
				} else {
					type = msg.assets[0].name;
				}

				for (let j = 0; j < msg.assets.length; j++) {
					count += msg.assets[j].profit;
				}
			}
		}

		for (let i = 0; i < Config.GAME_PLAYER_NUM; i++) {
			if (this.checkData.players[i].userId.equals(msg.base.userId)) {
				let curData = {
					toastIdx: 2,
					amount: count,
					name: type
				};
				this.seatCtrl.setSeatToast(i, curData, this.isMy);
			}
		}
	}

	onShowYearMoney() {
		C2S.SyncStateReq();
		if (this.isMy) {
			this.yearAnimCtrl.onShowStart();
		}
	}

	onGiveUpChance() {
		this.hideContent();
	}

	onGiveUpChanceMsg(res: any) {
		let msg: pb.common.GiveUpChanceMsg = res.userData;
		for (let i = 0; i < this.syncData.players.length; i++) {
			if (msg.base.userId.equals(this.syncData.players[i].userID)) {
				this.seatCtrl.stopClock(i);
				break;
			}
		}
	}

	onConfirmMarket() {
		this.hideContent();
		C2S.GetStatements(UserData.uid);
	}

	onConfirmBankrupt() {
		this.brokeCtrl.hide();
	}

	onGameOverMsg(res: any) {
		let self: gameScene = this;
		UserData.gameoverData = res.userData;

		// let animEndCallback = function() {
		// 	// this.hide()
		// 	self.hideContent();
		// 	self.gameResultCtrl.show();
		// 	let data: pb.common.GameOverMsg = res.userData;
		// 	self.gameResultCtrl.setData(data, UserData.checkData);
		// 	self.clearData();
		// };
		// this.scheduleOnce(animEndCallback, 1);
		this.unscheduleAllCallbacks();
		self.hideContent();
		self.gameResultCtrl.show();
		let data: pb.common.GameOverMsg = res.userData;
		if (data.winnerId && data.typ === pb.common.GameOverMsg.endType.normal) {
			RemoteAudio.playEffect(SoundName.GAME_FREEDOM);
		} else if (data.typ === pb.common.GameOverMsg.endType.timeout) {
			RemoteAudio.playEffect(SoundName.GAME_TIMEOUT);
		}

		self.gameResultCtrl.setData(data, UserData.checkData);
		self.clearData();
	}

	onQuit() {
		ServerLoading.show();
		cc.director.preloadScene("hallScene", function() {
			ServerLoading.hide();
			cc.director.loadScene("hallScene");
		});
		this.node.active = false;
		this.onDestroy();
	}

	onBtBank() {
		Popup.show(PopupType.BankPopup);
	}

	onLoanMsg(res: any) {
		let msg: pb.common.LoanMsg = res.userData;
		for (let i = 0; i < this.checkData.players.length; i++) {
			if (msg.base.userId.equals(this.checkData.players[i].userId)) {
				let curData = {
					toastIdx: 4,
					amount: msg.amount
				};
				this.seatCtrl.setSeatToast(i, curData, this.isMy);
			}
		}
		C2S.SyncStateReq();
	}

	onShowCoinFly() {
		for (let j = 0; j < 20; j++) {
			let node = cc.instantiate(this.coinAnim);
			node.active = false;
			this.coinItemList.push(node);
			this.node.addChild(node);
		}
		let formWorldPoint: cc.Vec2 = this.seatCtrl.playerSeats[0].node.position;
		let len = this.coinItemList.length;
		let tempNode: cc.Node;
		let toPoint: cc.Vec2;
		let rotate: number = 0;
		let self: gameScene = this;
		for (let i = 0; i < len; i++) {
			tempNode = this.coinItemList[i];
			tempNode.active = true;
			tempNode.stopAllActions();
			toPoint = new cc.Vec2(Math.random() * 300, Math.random() * 100 - 50);
			tempNode.position = toPoint;
			rotate = Math.random() * 90 - 45;
			tempNode.runAction(
				cc.spawn(
					cc.moveTo(1, formWorldPoint),
					cc.rotateTo(1, rotate),
					cc.scaleTo(1, 0)
				)
			);
			tempNode.runAction(
				cc.sequence(
					cc.delayTime(1.1),
					cc.callFunc(function() {
						tempNode.removeFromParent();
						tempNode.destroy();
						self.coinItemList = [];
					})
				)
			);
		}
	}

	onChanceAuct() {
		if (
			cardCtrl.cardNodes.length &&
			cardCtrl.cardNodes[0] &&
			cardCtrl.cardNodes[0].getComponent(investChance)
		) {
			cardCtrl.cardNodes[0].getComponent(investChance).hideAllBtn();
			this.auctionNode = cc.instantiate(cardCtrl.cardNodes[0]);
			this.auctionNode.setPosition(0, 64);
			this.auctionNode.scale = 0.391;
			this.auctionCtrl.node.addChild(this.auctionNode);
		}
		this.hideContent();
		this.auctionCtrl.show();
		this.auctionCtrl.setData(this.chooseChanceData);
	}

	onChanceAuctMsg(res: any) {
		RemoteAudio.playEffect(SoundName.BID_START);
		let msg: pb.common.StartAuctionMsg = res.userData;
		this.startAucionData = msg;
		this.hideContent();
		if (this.auctionNode) {
			this.auctionNode.removeFromParent();
			this.auctionNode.destroy();
		}
		this.offerLeftCtrl.show();
		this.offerLeftCtrl.setData(msg);
		let timeLen = msg.timer.remaining;
		let otherTimeLen = msg.raiseTimeout;
		this.seatCtrl.stopAllClock();
		for (let i = 0; i < this.checkData.players.length; i++) {
			if (msg.base.userId.equals(this.checkData.players[i].userId)) {
				let curData = {
					toastIdx: 0,
					amount: msg.floorPrice
				};
				this.seatCtrl.setSeatToast(i, curData, this.isMy);
				if (timeLen > 0) {
					this.seatCtrl.startClock(i, timeLen, 0);
				}
			} else {
				this.seatCtrl.startClock(i, otherTimeLen, 1);
			}
		}
	}

	onChanceAuctOffer() {
		this.hideContent();
		this.offerBottomCtrl.show();
		this.offerBottomCtrl.setData(this.startAucionData);
	}

	onChanceAuctionBidRsp(res: any) {}

	onChanceAuctionBidMsg(res: any) {
		let msg: pb.common.AuctionBidMsg = res.userData;
		this.offerBottomCtrl.hide();
		let otherTimeLen = msg.raiseTimeout;
		RemoteAudio.playEffect(SoundName.BID_RAISE);
		let auctId;
		for (let i = 0; i < this.checkData.players.length; i++) {
			if (msg.base.userId.equals(this.checkData.players[i].userId)) {
				let curData = {
					toastIdx: 1,
					amount: msg.amount
				};
				this.seatCtrl.setSeatToast(i, curData, this.isMy);
				auctId = i;
				// this.seatCtrl.startClock(i, otherTimeLen, 1);
			} else {
				this.seatCtrl.hidefloorToast(i);
			}
		}
		if (this.isHasAuct || auctId) {
			this.seatCtrl.hideAuctionToast(auctId);
		}
	}

	onChanceAuctionResultMsg(res: any) {
		let msg: pb.common.AuctionResultMsg = res.userData;
		// this.hideContent()
		this.isHasAuct = true;
		// this.seatCtrl.hideAllToast()
		this.offerLeftCtrl.hide();
		this.offerBottomCtrl.hide();
		let playerInfo;
		C2S.SyncStateReq();
		for (let i = 0; i < this.checkData.players.length; i++) {
			if (msg.playerWon) {
				if (msg.winnerId.equals(this.checkData.players[i].userId)) {
					playerInfo = this.checkData.players[i];
					this.seatCtrl.hideAuctionToast(i);
					break;
				}
			} else {
				if (
					this.startAucionData.base.userId.equals(
						this.checkData.players[i].userId
					)
				) {
					playerInfo = this.checkData.players[i];
					this.seatCtrl.hidefloorToast(i);
					break;
				}
			}
		}
		this.offerResultCtrl.show();
		this.offerResultCtrl.setData(msg, playerInfo);
		if (msg.playerWon) {
			RemoteAudio.playEffect(SoundName.BID_SUCCESS);
		} else {
			RemoteAudio.playEffect(SoundName.BID_FAILED);
		}
	}

	onChanceDetail() {
		this.investDetailCtrl.show();
		this.investDetailCtrl.setData(this.startAucionData, 2, this.isMy);
	}

	onBtFina() {
		ServerLoading.show();
		this.FinancialReportsPopupCtrl.show();
	}

	onGetFinancial(res: any) {
		let msg: pb.common.GetStatementRsp = res.userData;
		let data: pb.common.IAssetStatement = msg.assetStatement;
		for (let j = 0; j < sortKeyArr.length; j++) {
			this.assLayers[j].removeAllChildren();
			this.assLayers[j].setContentSize(216,-20);
		}
		let addAsset: pb.common.ITopCategory[] = [];
		addAsset = data.assetLiability.assets;
		for (let j = 0; j < sortKeyArr.length; j++){
			this.noIcons[j].active = true;
		}

		for (let i = 0; i < addAsset.length; i++) {
			this.assetNode[i] = [];
			for (let j = 0; j < sortKeyArr.length; j++) {
				if (data.assetLiability.assets[i].category === sortKeyArr[j]) {
					if (this.noIcons[j].active) {
						this.noIcons[j].active = false;
					}
					for (let k = 0; k < addAsset[i].details.length; k++) {
						if (this.assetNode[i][k]) {
						} else {
							if (this.assPrefab) {
								let node: cc.Node = cc.instantiate(this.assPrefab);
								node.getChildByName("txt").getComponent(cc.Label).string =
									addAsset[i].details[k].name;
								node.getChildByName("num").getComponent(cc.Label).string =
									"¥" + StringUtils.ConvertInt2(addAsset[i].details[k].value);
								this.assLayers[j].addChild(node);
								this.assetNode[i][k] = node;
							} else {
								let path: string = "prefab/game/assItem";
								cc.loader.loadRes(path, cc.Prefab, (err, result: cc.Prefab) => {
									if (!err) {
										let node: cc.Node = cc.instantiate(result);
										this.assPrefab = result;
										node.getChildByName("txt").getComponent(cc.Label).string =
											addAsset[i].details[k].name;
										node.getChildByName("num").getComponent(cc.Label).string =
											"¥" +
											StringUtils.ConvertInt2(addAsset[i].details[k].value);
										this.assLayers[j].addChild(node);
										this.assetNode[i][k] = node;
									}
								});
							}
						}
					}
				}
			}
		}
		this.assData = data.assetLiability.assets;

	}

	onPlayerAFKMsg(res: any) {
		let msg: pb.common.PlayerAFKMsg = res.userData;
		if (msg.UserID.equals(UserData.uid)) {
			return;
		} else {
			for (let i = 0; i < this.checkData.players.length; i++) {
				if (msg.UserID.equals(this.checkData.players[i].userId)) {
					let data = {
						toastIdx: 6
					};
					this.seatCtrl.setSeatToast(i, data, this.isMy);
				}
			}
		}
	}

	onPlayerReconnectMsg(res: any) {
		let msg: pb.common.PlayerReconnectMsg = res.userData;
		if (msg.userID.equals(UserData.uid)) {
			return;
		} else {
			for (let i = 0; i < this.checkData.players.length; i++) {
				if (msg.userID.equals(this.checkData.players[i].userId)) {
					this.seatCtrl.hideOffLineToast(i);
				}
			}
		}
	}

	clearData() {
		this.seatCtrl.stopAllClock();
		this.isConnent = false;
		// var anim = this.getComponent(cc.Animation);
		// anim.pause();
		UserData.gameSyncNum = 0;
		this.syncData = null;
		this.mySyncData = null;
		this.mapData = null;
		this.checkData = null;
		this.curPosid = null;
		this.otherPosid = null;

		this.curPlayerInfo = null;
		this.curRoadIdx = null;
		this.curRoundData = null;
		this.promoteData = null;
		this.chooseChanceData = null;
		this.payCount = null;

		this.isNetAeest = null;
		this.timeIsShow = null;
		this.coinItemList = [];
		this.nextRollTime = 0.6;
		this.chooseChanceData = null;
		this.payCount = null;
		this.offEvent();
		Popup.hide(PopupType.BankPopup);
	}

	hideAuciton() {
		this.seatCtrl.hideAuctAll();
		this.offerLeftCtrl.hide();
	}

	offEvent() {
		GameEvent.event.off(EventType.GAME_DICE_END, this.DiceEnd, this);
		GameEvent.event.off(EventType.SOCKET_SYNC_STATE, this.onSyncState, this);
		GameEvent.event.off(
			EventType.SOCKET_CHECK_PLAYING,
			this.onCheckPlaying,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_LOAN_QUALIFICATION,
			this.onLoanData,
			this
		);
		MsgEvent.event.off(MsgEventType.SOCKET_RollMsg, this.onRollMsg, this);
		MsgEvent.event.off(
			MsgEventType.SOCKET_NextRollMsg,
			this.onNextRollMsg,
			this
		);
		GameEvent.event.off(EventType.GAME_ROAD_MOVE_END, this.onRoadMoveEnd, this);
		GameEvent.event.off(
			EventType.SOCKET_UNEMPLOYMENT_ACK,
			this.onUnemployment,
			this
		);
		GameEvent.event.off(
			EventType.GAME_SHOW_PAY_CONFIRM,
			this.onShowConfirm,
			this
		);
		GameEvent.event.off(
			EventType.GAME_SHOW_ACCIDENT_PAY_CONFIRM,
			this.onShowConfirm,
			this
		);
		GameEvent.event.off(EventType.GAME_PROMOTE_END, this.PromoteEnd, this);
		MsgEvent.event.off(
			MsgEventType.SOCKET_WageHikeMsg,
			this.onPromoteMsg,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_PAY_ACCIDENT_CONSUME,
			this.onShowConfirm,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_PlayerQuitGameMsg,
			this.onQuitGame,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_ChooseChanceMsg,
			this.onChooseChanceMsg,
			this
		);
		MsgEvent.event.off(MsgEventType.SOCKET_BuyMsg, this.onBuyMsg, this);
		GameEvent.event.off(EventType.SOCKET_BUY, this.onShowConfirm, this);
		GameEvent.event.off(
			EventType.SOCKET_GET_CAN_SELL_PLAYER_ASSET,
			this.onGetCanSell,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_SELL_ASSETS,
			this.onShowSellAssets,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_SellAssetsMsg,
			this.onShowSellAssetsMsg,
			this
		);
		GameEvent.event.off(EventType.SOCKET_TRY_PAY, this.onTryPay, this);
		GameEvent.event.off(EventType.GAME_CHANCE_BUY, this.onGameChanceBuy, this);
		GameEvent.event.off(EventType.GAME_PAY_COUNT, this.onPayCount, this);
		GameEvent.event.off(
			EventType.SOCKET_GIVEUP_CHANCE,
			this.onGiveUpChance,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_GiveUpChanceMsg,
			this.onGiveUpChanceMsg,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_CONFIRM_MARKET_CHANGE,
			this.onConfirmMarket,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_PlayerOutMsg,
			this.onBrokeView,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_CONFIRM_BANKRUPT,
			this.onConfirmBankrupt,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_GameOverMsg,
			this.onGameOverMsg,
			this
		);
		GameEvent.event.off(EventType.SOCKET_QUIT, this.onQuit, this);
		MsgEvent.event.off(MsgEventType.SOCKET_LoanMsg, this.onLoanMsg, this);
		GameEvent.event.off(EventType.GAME_CHANCE_AUCT, this.onChanceAuct, this);
		MsgEvent.event.off(
			MsgEventType.SOCKET_StartAuctionMsg,
			this.onChanceAuctMsg,
			this
		);
		GameEvent.event.off(
			EventType.GAME_CHANCE_AUCT_OFFER,
			this.onChanceAuctOffer,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_AuctionBidMsg,
			this.onChanceAuctionBidMsg,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_AuctionResultMsg,
			this.onChanceAuctionResultMsg,
			this
		);
		GameEvent.event.off(
			EventType.GAME_CHANCE_DETAIL,
			this.onChanceDetail,
			this
		);
		GameEvent.event.off(
			EventType.SOCKET_GET_FINANCIAL_REPORTS,
			this.onGetFinancial,
			this
		);
	}

	onSocketClose() {
		let self: gameScene = this;
		let data = {
			toastIdx: 6
		};
		self.seatCtrl.setSeatToast(this.seatCtrl.selfPosid, data, self.isMy);
		self.clearData();
		self.isClose = true;
	}
	onDestroy() {
		this.offEvent();
		GameEvent.event.off(EventType.SOCKET_LOGIN_SUCESS, this.initConnect, this);
		GameEvent.event.off(EventType.SOCKET_ON_CLOSED, this.onSocketClose, this);
		MsgEvent.event.off(
			MsgEventType.SOCKET_PlayerAFKMsg,
			this.onPlayerAFKMsg,
			this
		);
		MsgEvent.event.off(
			MsgEventType.SOCKET_PlayerReconnectMsg,
			this.onPlayerReconnectMsg,
			this
		);
		GameEvent.event.off(EventType.ON_HIDE, this.initHide, this);
		GameEvent.event.off(EventType.ON_SHOW, this.initOnShow, this);
		this.assPrefab = null;
		this.assNodeArr = [];
	}
}
