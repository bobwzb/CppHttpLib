import Popup from "./until/Popup";
import { PopupType } from "./until/PopupType";
import BasicScene from "./lib/BasicScene";
import AlertPopup from "./until/AlertPopup";
import UserData from "./data/userData";
import WxHttpControl from "./netWork/http/WxHttpControl";
import { GameEvent, EventType } from "./lib/GameEvent";
import HttpControl from "./netWork/http/HttpControl";
import C2S from "./netWork/socket/C2S";
import { pb } from "./asset.pb";
import ServerLoading from "./hall/ServerLoadingPopup";
import AvatarContainer from "./lib/component/avatarContainer";
import rankItem from "./hall/rankItem";
import Config from "./config";
var Long = require("long");

const { ccclass, property } = cc._decorator;

@ccclass
export default class hallScene extends BasicScene {
	@property(cc.Node)
	new_player_guide: cc.Node = null;

	@property(cc.Node)
	mainView: cc.Node = null;

	@property(cc.Node)
	noticePoint: cc.Node = null;

	@property(cc.Node)
	taskPoint: cc.Node = null;

	@property(cc.Node)
	hallHead: cc.Node = null;

	@property(cc.Label)
	hallName: cc.Label = null;

	@property(cc.Label)
	hallGroud: cc.Label = null;

	@property(cc.Label)
	hallCoin: cc.Label = null;

	@property(cc.Label)
	hallGrade: cc.Label = null;

	@property(cc.Label)
	hallBarTxt: cc.Label = null;

	@property(cc.ProgressBar)
	hallBar: cc.ProgressBar = null;

	@property(cc.Prefab)
	rankItem: cc.Prefab = null;

	@property(cc.Node)
	rankContent: cc.Node = null;

	@property(cc.Node)
	rankMyItem: cc.Node = null;

	@property([cc.Node])
	layerNode: cc.Node[] = [];

	@property(cc.Label)
	pageTxt: cc.Label = null;

	@property([cc.Node])
	pageItems: cc.Node[] = [];

	@property([cc.Node])
	story_node: cc.Node = null;

	action: cc.Action = null;
	playerInfo: any;
	pageNum: number = 1;
	pageAllNum: number = 1;
	rankData: any;
	onLoad() {
		console.log("进入到首页场景");
		
		// <新手判断> 在下面的getUserInfo()里面

		UserData.hallScene = this.mainView;
		this.action = cc.moveTo(0.5, cc.v2(-cc.winSize.width, 0));

		C2S.CheckPlayingReq();
		WxHttpControl.getUserInfo();
		WxHttpControl.getNoctice();
		WxHttpControl.getTask();
		// WxHttpControl.getAssetRank(50);
		ServerLoading.show();
		UserData.checkPlayNum = 0;

		this.addEvent();
		this.node.getChildByName("mainLayer").getChildByName("topBg").height =
			(cc.winSize.height / 1334) * 190;
		this.node.getChildByName("mainLayer").getChildByName("contentBg").height =
			(cc.winSize.height / 1334) * 1020;

		if (Config.GAME_PLAYER_NUM == 1) {
			this.layerNode[0].active = true;
			this.layerNode[1].active = false;
		} else if (Config.GAME_PLAYER_NUM == 2) {
			this.layerNode[0].active = false;
			this.layerNode[1].active = true;
		}

	}

	onBtStore() {
		ServerLoading.show();
		cc.director.preloadScene("storeScene", function() {
			cc.director.loadScene("storeScene");
		});
		// this.mainView.runAction(this.action);
	}

	onBtTask() {
		// this.mainView.runAction(this.action);
		ServerLoading.show();
		cc.director.preloadScene("taskScene", function() {
			cc.director.loadScene("taskScene");
		});
	}

	onBtNotice() {
		Popup.show(PopupType.NoticePopup);
	}

	onBtData() {
		// this.mainView.runAction(this.action);
		ServerLoading.show();
		cc.director.preloadScene("DataScene", function() {
			cc.director.loadScene("DataScene");
		});
	}

	onBtStartGame() {
		// Popup.show(PopupType.readyPopup, null, null);
		ServerLoading.show();
		cc.director.preloadScene("readyScene", function() {
			cc.director.loadScene("readyScene");
		});
	}

	// 新手引导进入职业选择场景
	onBtNewPlayerToProfession () {
		cc.director.loadScene("guide_profession");
		this.new_player_guide.active = false
	}

	onBtGuide() {
		Popup.show(PopupType.GuidePopup);
	}

	addEvent() {
		GameEvent.event.on(
			EventType.SOCKET_CHECK_PLAYING,
			this.getCheckLogin,
			this
		);
		GameEvent.event.on(EventType.HTTP_GET_NOTICE, this.getNoticeData, this);
		GameEvent.event.on(EventType.HTTP_GET_TASK, this.getTaskData, this);
		GameEvent.event.on(EventType.HTTP_GET_USERINFO, this.getUserInfo, this);
		GameEvent.event.on(EventType.HTTP_GET_ASSET_RANK, this.getAssetRank, this);
	}

	getUserInfo(event: any) {
		let self: hallScene = this;
		console.log(event, "getUserInfo");
		let playerInfo = event.userData.data;
		console.log(' ********* playerInfo', playerInfo)
		cc.sys.localStorage.setItem('playerInfo', playerInfo)

		this.playerInfo = playerInfo;
		let avatarContainer = this.hallHead.getComponent(AvatarContainer);
		if (UserData.avatarFrame) {
			console.log('AAAAAAAAAAAAAAAAAAAAA')
			avatarContainer.avatarSprite.spriteFrame = UserData.avatarFrame;
		} else {
			if (
				typeof playerInfo.avatar !== "undefined" &&
				playerInfo.avatar !== null &&
				playerInfo.avatar.length > 5
			) {
				console.log('BBBBBBBBBBBBBBBBBBBBBB')
				UserData.avatarUrl = playerInfo.avatar;
				avatarContainer.setAvatarImageFromUrl(playerInfo.avatar);
			}
		}
		UserData.userCoin = playerInfo.gold;

		this.hallName.string = playerInfo.nickname;
		this.hallGroud.string = playerInfo.asset_level;
		this.hallCoin.string = "" + playerInfo.gold;
		this.hallGrade.string = "Lv" + playerInfo.level;
		this.hallBarTxt.string = playerInfo.exp + " / " + playerInfo.max_exp;
		this.hallBar.progress = playerInfo.exp / playerInfo.max_exp;

		WxHttpControl.getAssetRank(50);

		// ************************
		// <1>. 新手判断<判断是否新手> william (asset_score 小于10000是新手且new_buf不是true) 
		let score = playerInfo.asset_score
		let new_buf = cc.sys.localStorage.getItem('player_video') // true为看过新手教程， 其他的值表示没看过
		if (score < 10000 && !new_buf) { // 新手
			cc.sys.localStorage.setItem('new_player', true) // 标记为新手
			cc.sys.localStorage.setItem('player_video', false) // 表示没看过指导
			cc.director.preloadScene("guide_profession", function() {

			});
			this.story_node.active = true
		} else { // 老手
			cc.sys.localStorage.setItem('new_player', false) // 标记为老手
			cc.sys.localStorage.setItem('player_video', true) // 表示看过指导了
			this.story_node.active = false
		}

		// // <2>. 固定是新手(正式发布要把上面的1打开， 2屏蔽)
		// let new_buf = cc.sys.localStorage.getItem('player_video') // true为看过新手教程， 其他的值表示没看过
		// console.log('============== new_buf(true为看过新手教程， 其他的值表示没看过):', new_buf)
		// if (!new_buf) { // 新手
		// 	console.log('固定是新手')
		// }
		// cc.sys.localStorage.setItem('new_player', true)
		// this.story_node.active = true
		// ***********************
	}

	getCheckLogin(event: any) {
		if (UserData.checkPlayNum !== 0) {
			ServerLoading.hide();
			return;
		}
		let self: hallScene = this;
		let msg: pb.common.CheckPlayingRsp = event.userData;
		UserData.checkData = msg;
		if (msg.state == pb.common.PlayerState.PLAYER_STATE_BEGIN) {
			console.log("PLAYER_STATE_BEGIN");
			ServerLoading.hide();
		} else if (
			msg.state == pb.common.PlayerState.PLAYER_STATE_IN_ROOM ||
			msg.state == pb.common.PlayerState.PLAYER_STATE_MATCHED ||
			msg.state == pb.common.PlayerState.PLAYER_STATE_MATCHING ||
			msg.state == pb.common.PlayerState.PLAYER_STATE_READY
		) {
			cc.director.preloadScene("readyScene", function() {
				ServerLoading.hide();
				cc.director.loadScene("readyScene");
			});
		} else if (msg.state == pb.common.PlayerState.PLAYER_STATE_PLAYING) {
			console.log("进入到gamescene---------------------->");
			C2S.getScenarioImgs();
			// cc.director.loadScene("professionScene");
			cc.director.preloadScene("gameScene", function() {
				ServerLoading.hide();
				cc.director.loadScene("gameScene");
			});
		}
	}

	getNoticeData(res: any) {
		if (!res.userData.data.length) {
			this.noticePoint.active = false;
			return;
		}
		let curId = cc.sys.localStorage.getItem("NOTICE_ID");
		if (curId) {
			if (res.userData.data.id && res.userData.data.id > curId) {
				this.noticePoint.active = true;
			} else {
				this.noticePoint.active = false;
			}
		} else {
			this.noticePoint.active = true;
		}
	}

	getTaskData(res: any) {
		for (let i = 0; i < res.userData.data.length; i++) {
			if (
				!res.userData.data[i].delivered &&
				res.userData.data[i].target == res.userData.data[i].progress
			) {
				this.taskPoint.active = true;
				break;
			} else {
				this.taskPoint.active = false;
			}
		}
	}

	getAssetRank(res: any) {
		console.log(res);
		if (!res.userData.data.length) {
			return;
		}
		this.rankData = res.userData.data;
		if (Config.GAME_PLAYER_NUM == 1) {
			this.setAssetRankOne(res);
		} else if (Config.GAME_PLAYER_NUM == 2) {
			this.setAssetRankTwo(res);
		}
	}
	setAssetRankOne(res: any) {
		this.pageAllNum = Math.ceil(this.rankData.length / 4);
		this.updatePage();
	}

	onBtPageLeft() {
		if (this.pageNum === 1) {
			return;
		}
		this.pageNum -= 1;
		this.updatePage();
	}

	onBtPageRight() {
		if (this.pageNum === this.pageAllNum) {
			return;
		}
		this.pageNum += 1;
		this.updatePage();
	}

	updatePage() {
		this.pageTxt.string = this.pageNum + "/" + this.pageAllNum;
		let rankData;
		if (this.pageNum === this.pageAllNum) {
			rankData = this.rankData.slice(
				0 + (this.pageNum - 1) * 4,
				this.rankData.length
			);
		} else {
			rankData = this.rankData.slice(
				0 + (this.pageNum - 1) * 4,
				this.pageNum * 4
			);
		}
		for (let i = 0; i < 4; i++) {
			this.pageItems[i].active = false;
		}
		for (let i = 0; i < rankData.length; i++) {
			this.pageItems[i].active = true;
			this.pageItems[i]
				.getComponent(rankItem)
				.getData(rankData[i], i + (this.pageNum - 1) * 4);
		}
	}

	setAssetRankTwo(res: any) {
		this.rankContent.removeAllChildren();
		let idx;
		for (let i = 0; i < res.userData.data.length; i++) {
			let node: cc.Node = cc.instantiate(this.rankItem);

			node.getComponent(rankItem).getData(res.userData.data[i], i);

			if (
				// res.userData.data[i].uid.toString() == UserData.uid.toString() ||
				this.playerInfo &&
				this.playerInfo.avatar &&
				res.userData.data[i].avatar == this.playerInfo.avatar
			) {
				this.playerInfo = res.userData.data[i];
				idx = i;
			}

			this.rankContent.addChild(node);
		}

		this.rankMyItem.getComponent(rankItem).getData(this.playerInfo, idx);
	}

	onDestroy() {
		GameEvent.event.off(
			EventType.SOCKET_CHECK_PLAYING,
			this.getCheckLogin,
			this
		);
		GameEvent.event.off(EventType.HTTP_GET_NOTICE, this.getNoticeData, this);
		GameEvent.event.off(EventType.HTTP_GET_TASK, this.getTaskData, this);
		GameEvent.event.off(EventType.HTTP_GET_USERINFO, this.getUserInfo, this);
		GameEvent.event.off(EventType.HTTP_GET_ASSET_RANK, this.getAssetRank, this);
	}
}
