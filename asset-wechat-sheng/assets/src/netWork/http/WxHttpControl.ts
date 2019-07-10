import WxHttpRequest from "./WxHttpRequest";
import Config from "../../config";
import { GameEvent, EventType } from "../../lib/GameEvent";
// let JSONbig = require('json-bigint');

const { ccclass, property } = cc._decorator;

@ccclass
export default class WxHttpControl {
	/**
	 * 测试账号登录
	 */
	public static test(uid?: number): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_LOGIN_SUCCESS, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_TEST_FAIL, result)
			);
		};
		req.start(Config.HTTP_ADDRESS, WxHttpRequest.HTTP_METHOD_POST, {});
		return req;
	}

	/**
	 * 获取用户信息
	 */
	public static getUserInfo(): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {};
		req.onSuccess = function(result: any) {
			console.log(result, "onSuccess");
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_USERINFO, result)
			);
		};
		req.onFailed = function(result: any) {
			console.log(result, "onFailed");
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_USERINFO, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "user/profile",
			WxHttpRequest.HTTP_METHOD_GET,
			{}
		);
		return req;
	}

	/**
	 * 获取销售中的职业列表
	 */
	public static getStoreProfession(): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_STORE_PROFESSION_LIST, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_STORE_PROFESSION_LIST, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "store/roles",
			WxHttpRequest.HTTP_METHOD_GET,
			{}
		);
		return req;
	}

	/**
	 * 获取用户已经解锁的职业列表
	 */
	public static getHasStoreProfessionList(): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_HAS_STORE_PROFESSION_LIST, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_HAS_STORE_PROFESSION_LIST, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "purchased/roles",
			WxHttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	/**
	 * 购买商品
	 */
	public static getBuyProfession(
		goodsType: number,
		goodsId: number,
		currency: number
	): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {
			goods_type: goodsType,
			goods_id: goodsId,
			currency: currency
		};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_BUY_PROFESSION, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_BUY_PROFESSION, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "store/buy",
			WxHttpRequest.HTTP_METHOD_POST,
			obj,
			WxHttpRequest.HTTP_HEADER_IDE
		);
		return req;
	}

	/**
	 * 获取每日任务列表
	 */
	public static getTask(): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_TASK, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_TASK, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "missions/daily",
			WxHttpRequest.HTTP_METHOD_GET,
			{}
		);
		return req;
	}

	/**
	 * 领取每日任务奖励
	 */
	public static getTaskAward(id: string): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		// var obj: any = {id: id};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_TASK_AWARD, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_TASK_AWARD, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "missions/daily/" + id + "/confirm",
			WxHttpRequest.HTTP_METHOD_POST,
			{}
		);
		return req;
	}

	/**
	 * 获取游戏公告
	 */
	public static getNoctice(): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_NOTICE, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_NOTICE, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "announcement",
			WxHttpRequest.HTTP_METHOD_GET,
			{}
		);
		return req;
	}

	/**
	 * 胜率
	 */
	public static getGameRatio(): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_GAME_RATIO, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_GAME_RATIO, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "glory/ratio",
			WxHttpRequest.HTTP_METHOD_GET,
			{}
		);
		return req;
	}

	/**
	 * 历史游戏记录
	 */
	public static getGameHistory(
		page?: number,
		per_page?: number
	): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = {
			page: page ? page : 1,
			per_page: per_page ? per_page : 20
		};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_GAME_HISTORY, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_GAME_HISTORY, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "glory/game-history?",
			WxHttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	/**
	 * 游戏结果页
	 */
	public static getGameResultPage(gameId: number): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		// var obj: any = { gameId: gameId };
		var obj = {};
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_GAME_RESULT_PAGE, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_GAME_RESULT_PAGE, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "glory/game-history/" + gameId,
			WxHttpRequest.HTTP_METHOD_GET,
			obj,
			WxHttpRequest.HTTP_HEADER_PB
		);
		return req;
	}

	/**
	 * 是否已经写过总结
	 */
	public static getIsSummary(gameId: number): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = { gameId: gameId };
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_IS_SUMMARY, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_IS_SUMMARY, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "glory/game-history/10001/summary-id",
			WxHttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	/**
	 * 财富账单
	 */
	public static getWealthResult(gameId: number): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = { gameId: gameId };
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_WEATH_RESULT, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_WEATH_RESULT, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "glory/game-history/10001/wealth",
			WxHttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	/**
	 * 分享回调
	 */
	public static getShareResult(shareId: number): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = { typ: 1 };
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_SHARE, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_SHARE, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "share/complete",
			WxHttpRequest.HTTP_METHOD_POST,
			obj
		);
		return req;
	}

	/**
	 * 排行榜
	 */
	public static getAssetRank(top: number): WxHttpRequest {
		let req: WxHttpRequest = new WxHttpRequest();
		var obj: any = { top: top };
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_ASSET_RANK, result)
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_GET_ASSET_RANK, result)
			);
		};
		req.start(
			Config.HTTP_ADDRESS + "ranking/asset",
			WxHttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}
}
