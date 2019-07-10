import WxHttpControl from "../netWork/http/WxHttpControl";
import Popup from "../until/Popup";
import { PopupType } from "../until/PopupType";
import AvatarContainer from "../lib/component/avatarContainer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class rankItem extends cc.Component {
	@property(cc.Sprite)
	rankIcon: cc.Sprite = null;

	@property(cc.Label)
	rankTxt: cc.Label = null;

	@property(cc.Node)
	rankTxt2: cc.Node = null;

	@property(cc.Node)
	headIcon: cc.Node = null;

	@property(cc.Label)
	nameLabel: cc.Label = null;

	@property(cc.Label)
	gradeLabel: cc.Label = null;

	@property(cc.Label)
	assetLabel: cc.Label = null;

	@property([cc.SpriteFrame])
	rankIconSpriteFrame: cc.SpriteFrame[] = [];

	data: any;

	onLoad() {}

	getData(data: any, idx: number) {
		this.data = data;
		// this.headIcon
		// .getChildByName("headDefault")
		// .getComponent(cc.Sprite).spriteFrame = this.defaultHead;

		let avatarContainer = this.headIcon.getComponent(AvatarContainer);
		avatarContainer.setAvatarImageFromUrl(this.data.avatar);

		this.nameLabel.string = this.data.nickname;
		this.gradeLabel.string = this.data.asset_level;
		this.assetLabel.string = this.data.asset_score;
		if (idx) {
			if (idx > 2) {
				this.rankIcon.node.active = false;
			} else {
				this.rankIcon.node.active = true;
				this.rankIcon.spriteFrame = this.rankIconSpriteFrame[idx];
			}
			this.rankTxt.string = "" + (idx + 1);
			this.rankTxt2.active = false;
		} else {
			if (idx == 0) {
				this.rankIcon.node.active = true;
				this.rankIcon.spriteFrame = this.rankIconSpriteFrame[idx];
				this.rankTxt.string = "" + (idx + 1);
				this.rankTxt2.active = false;
			} else {
				this.rankIcon.node.active = false;
				this.rankTxt.node.active = false;
				this.rankTxt2.active = true;
			}
		}
	}
}
