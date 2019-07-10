import HttpRequest from "./HttpRequest";
import Config from "../../config";
import { GameEvent, EventType } from "../../lib/GameEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HttpControl {
	/**
	 * test
	 */
	public static test(uid?: number): HttpRequest {
		let req: HttpRequest = new HttpRequest();
		var obj: any = {};
		obj.param = { uid: uid };
		req.onSuccess = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_LOGIN_SUCCESS, JSON.parse(result))
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_LOGIN_SUCCESS, JSON.parse(result))
			);
		};
		req.start(Config.HTTP_ADDRESS, HttpRequest.HTTP_METHOD_GET, obj);
		return req;
	}

	/**
	 * 获取销售中的职业列表
	 */
	public static getStoreProfessionList(): HttpRequest {
		let req: HttpRequest = new HttpRequest();
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
			"https://test.leapthinking.com/store/roles",
			HttpRequest.HTTP_METHOD_GET,
			{}
		);
		return req;
	}

	/**
	 * 获取用户已经解锁的职业列表
	 */
	public static getHasStoreProfessionList(): HttpRequest {
		let req: HttpRequest = new HttpRequest();
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
			"https://test.leapthinking.com/purchased/roles",
			HttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	/**
	 * 购买商品
	 */
	public static getBuyProfession(): HttpRequest {
		let req: HttpRequest = new HttpRequest();
		var obj: any = {};
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
			"https://test.leapthinking.com/store/buy",
			HttpRequest.HTTP_METHOD_POST,
			obj,
			HttpRequest.HTTP_HEADER_IDE
		);
		return req;
	}

	/**
	 * 获取每日任务列表
	 */
	public static getTask(): HttpRequest {
		let req: HttpRequest = new HttpRequest();
		var obj: any = {};
		req.onSuccess = function(result: any) {
			console.log(result);
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_LOGIN_SUCCESS, JSON.parse(result))
			);
		};
		req.onFailed = function(result: any) {
			GameEvent.event.dispatchEvent(
				new GameEvent(EventType.HTTP_TEST_FAIL, JSON.parse(result))
			);
		};
		req.start(
			"https://test.leapthinking.com/missions/daily",
			HttpRequest.HTTP_METHOD_GET,
			{}
		);
		return req;
	}

	/**
	 * 领取每日任务奖励
	 */
	public static getTaskAward(id: number): HttpRequest {
		let req: HttpRequest = new HttpRequest();
		var obj: any = { id: id };
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
			"https://test.leapthinking.com/missions/daily/qddoi99j1k2j2/confirm",
			HttpRequest.HTTP_METHOD_POST,
			obj
		);
		return req;
	}

	/**
	 * 获取游戏公告
	 */
	public static getNoctice(): HttpRequest {
		let req: HttpRequest = new HttpRequest();
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
			"https://test.leapthinking.com/announcement",
			HttpRequest.HTTP_METHOD_GET,
			{}
		);
		return req;
	}

	/**
	 * 胜率
	 */
	public static getGameRatio(): HttpRequest {
		let req: HttpRequest = new HttpRequest();
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
			"https://test.leapthinking.com/glory/rate",
			HttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	/**
	 * 历史游戏记录
	 */
	public static getGameHistory(page?: number, perPage?: number): HttpRequest {
		let req: HttpRequest = new HttpRequest();
		var obj: any = { page: page ? page : 1, perPage: perPage ? perPage : 20 };
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
			"https://test.leapthinking.com/glory/rate",
			HttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	/**
	 * 游戏结果页
	 */
	public static getGameResultPage(gameId: number): HttpRequest {
		let req: HttpRequest = new HttpRequest();
		var obj: any = { gameId: gameId };
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
			"https://test.leapthinking.com/glory/game-history/10001",
			HttpRequest.HTTP_METHOD_GET,
			obj,
			HttpRequest.HTTP_HEADER_PB
		);
		return req;
	}

	/**
	 * 是否已经写过总结
	 */
	public static getIsSummary(gameId: number): HttpRequest {
		let req: HttpRequest = new HttpRequest();
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
			"https://test.leapthinking.com/glory/game-history/10001/summary-id",
			HttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	/**
	 * 财富账单
	 */
	public static getWealthResult(gameId: number): HttpRequest {
		let req: HttpRequest = new HttpRequest();
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
			"https://test.leapthinking.com/glory/game-history/10001/wealth",
			HttpRequest.HTTP_METHOD_GET,
			obj
		);
		return req;
	}

	// 这里的 name 是 scenario 里面的 img_file 字段，不包含结尾的 @3x.png
	public static getScenarioImageUrl(name: string): string {
		return encodeURI(
			Config.getEndpoint("static/game" + "/" + name + "@3x.png")
		);
	}
}
