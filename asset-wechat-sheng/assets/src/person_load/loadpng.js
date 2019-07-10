// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var UserData = require('UserData')

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        sprite: {
            type: cc.Sprite,
            default: null,
            tooltip: ''
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 加载远程的图片
        // cc.loader.load("https://static.leapthinking.com/avatars/user/8814779036722589443-bjuvdnl3k47mc1piqcog.jpeg", function(err, ret) {
        cc.loader.load("https://img1.3lian.com/2015/a1/50/d/151.jpg", function(err, ret) {
            if(err) {
                console.log('错误是', err);
                return;
            }

            // ret is cc.Texture2D这样对象
            this.sprite.spriteFrame.setTexture(ret);
            // this.sprite.node.setContentSize(ret.getContentSize()); // 使用这个图片的大小
            // end 
        }.bind(this));

        this.scheduleOnce(function () {
            // console.log('XXXX====== ', UserData)
            // this.sprite.spriteFrame = UserData.avatarFrame

            var playerInfo = cc.sys.localStorage.getItem('playerInfo')
            console.log('XXXX====== ', playerInfo.avatar)
            cc.loader.load(playerInfo.avatar, function(err, ret) {
                if(err) {
                    console.log('错误是', err);
                    return;
                }

                // ret is cc.Texture2D这样对象
                this.sprite.spriteFrame.setTexture(ret);
                // this.sprite.node.setContentSize(ret.getContentSize()); // 使用这个图片的大小
                // end 
            }.bind(this));
        }.bind(this), 2)
       
    },

    on_go_test: function () {
        cc.director.loadScene("testScene");
    }

    // update (dt) {},
});
