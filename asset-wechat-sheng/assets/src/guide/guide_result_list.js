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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        wealth_node: {
            type: cc.Node,
            default: null,
            tooltip: '财富'
        },
        shine: {
            type: cc.Node,
            default: null,
            tooltip: '光晕'
        },
        btn_hall_node: {
            type: cc.Node,
            default: null,
            tooltip: '首页按钮'
        },
        guide_node: {
            type: cc.Node,
            default: null,
            tooltip: '指导节点'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene("hallScene", function() {
            
        });
    },

    start () {
        this.wealth_node.active = false // 财富
        this.btn_hall_node.active = true // 首页节点
        this.guide_node.active = true

        // this.scheduleOnce(function () {
        //     this.wealth_node.active = false // 财富
        //     this.btn_hall_node.active = true // 首页节点
        //     this.guide_node.active = true
        // }.bind(this), 2)
    },

    on_btn_click: function () {
        cc.sys.localStorage.setItem('player_video', true) // true为看过新手教程， 其他的值表示没看过
        cc.sys.localStorage.setItem('new_player', false) // 老手

        cc.director.preloadScene("hallScene", function() {
            cc.director.loadScene("hallScene"); 
        });
    },

    update (dt) {
        this.shine.rotation += dt * 30
    },
});
