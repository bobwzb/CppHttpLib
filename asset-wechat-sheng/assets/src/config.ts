const { ccclass, property } = cc._decorator;

@ccclass
export default class Config {
	//public static HTTP_ADDRESS: string = "https://test.leapthinking.com/"; // 测试http地址

	//public static SOCKET_ADDRESS: string = "test.leapthinking.com"; // 测试socket地址

	//public static CDN_BASE_URL: string = "https://static-testing.leapthinking.com"; //测试cdn地址

	public static HTTP_ADDRESS: string = "https://wxgame.leapthinking.com/"; // 线上http地址

	public static SOCKET_ADDRESS: string = "wxgame.leapthinking.com"; // 线上socket地址

	public static CDN_BASE_URL: string = "https://static.leapthinking.com"; //线上cdn地址

	public static SOCKET_PORT: number = 10083;
	//

	public static getEndpoint(path: string): string {
		return this.HTTP_ADDRESS + path;
	}

	public static getCDNUrl(key: string): string {
		return encodeURI(this.CDN_BASE_URL + "/" + key);
	}

	public static SHARE_CONFIG: AnyArray = [
		{
			img: "1.png",
			txt: "终于知道实现财富自由的秘密，悄悄的告诉你。"
		}
	];

	// 游戏玩家数量
	public static GAME_PLAYER_NUM: number = 1;
}
