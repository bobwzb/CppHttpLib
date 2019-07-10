import UserData from "../../data/userData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AvatarContainer extends cc.Component {
	@property(cc.Sprite)
	avatarSprite: cc.Sprite = null;

	// 头像容器的高度
	@property(Number)
	height: number = 48;

	// 头像容器的宽度
	@property(Number)
	width: number = 48;

	@property(cc.Mask)
	circularMask: cc.Mask = null;

	imageUrl: string = null;
	maskEnabled: boolean = true;

	public setWidth(width: number) {
		this.node.width = width;
		this.width = width;
	}

	public setHeight(height: number) {
		this.node.height = height;
		this.height = height;
	}

	public setAvatarImage(texture: cc.Texture2D) {
		this.avatarSprite.spriteFrame = new cc.SpriteFrame(texture);
	}

	public setAvatarImageFromUrl(imageUrl: string, imageType?: string) {
		if (
			typeof imageUrl == "undefined" ||
			imageUrl == null ||
			imageUrl.length < 5
		) {
			return;
		}
		interface resource {
			url: string;
			type?: string;
		}
		this.imageUrl = imageUrl;
		let res: resource = {
			url: imageUrl
		};
		if (imageType !== undefined) {
			res.type = imageType;
		}
		cc.loader.load(res, (err, tex) => {
			if (err) {
				console.error(
					"error while loading avatar, url:",
					imageUrl,
					", error:",
					err
				);
				return;
			}
			if (this.avatarSprite) {
				this.avatarSprite.spriteFrame = new cc.SpriteFrame(tex);
			}
			if (imageUrl === UserData.avatarUrl) {
				UserData.avatarFrame = new cc.SpriteFrame(tex);
			}
		});
	}

	public setUpContainer(
		height: number,
		width: number,
		imageUrl: string,
		imageType?: string
	) {
		this.setHeight(height);
		this.setWidth(width);
		this.setAvatarImageFromUrl(imageUrl, imageType);
	}

	setMaskEnabled(enabled: boolean) {
		this.maskEnabled = enabled;
		this.circularMask.node.active = enabled;
	}
	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}

	start() {}

	// update (dt) {}
}
