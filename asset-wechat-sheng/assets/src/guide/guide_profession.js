cc.Class({
    extends: cc.Component,

    properties: {
        step1: {
            type: cc.Node,
            default: null,
            tooltip: '第一幕'
        },
        step2: {
            type: cc.Node,
            default: null,
            tooltip: '第二幕'
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init()

        cc.director.preloadScene("guide_loding", function() {
			
		});
    },

    init () {
        this.step1.active = true
        this.step2.active = false
    },

    start () {

    },
    
    // 第一幕点击
    on_stepone_click: function () {
        this.step1.active = false
        this.step2.active = true
    },

    // 第二幕点击
    on_steptwo_click: function () {
        // 去下一场景
        console.log('去游戏loding界面')
        cc.director.loadScene("guide_loding");
        
    },

    // update (dt) {},
});
