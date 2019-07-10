const { ccclass, property } = cc._decorator;
/**
 * 玩家游戏数据
 */
@ccclass
export default class UserData {
	public static hallScene: cc.Node = null;

	public static uid: any = null;

	public static avatarUrl: string = null;

	public static userInfo: any = null;

	public static checkPlayNum: number = 0;

	public static gameSyncNum: number = 0;

	public static token: any = null;

	public static userCoin: any = null;

	public static checkData: any = null;

	public static gameoverData: any = null;

	public static isConnect: boolean = false;

	public static isHasSocket: boolean = true;

	public static avatarFrame: cc.SpriteFrame = null;
}
