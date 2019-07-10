// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        year_account_num: {
            type: cc.Label,
            default: null,
            tooltip: '年度结账文字'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable () {
        
    },

    on_node_ctrl: function (num) {
        this.node.opacity = 255
        this.year_account_num.string = num + ''
        this.node.active = true

        this.scheduleOnce(function () {
            var action = cc.fadeOut(0.8)
            this.node.runAction(action)
        }.bind(this), 1 )

        this.scheduleOnce(function () {
            this.node.active = false
            this.node.opacity = 255
        }.bind(this), 5)
    }

    // update (dt) {},
});
