var {RemoteAudio, SoundName} = require('remoteAudio');

cc.Class({
    extends: cc.Component,

    properties: {
        shoot_line: {
            type: cc.Sprite,
            default: null,
            tooltip: '飞机喷气'
        },
        mask1: {
            type: cc.Node,
            default: null,
            tooltip: '白第一行遮罩'
        },
        mask2: {
            type: cc.Node,
            default: null,
            tooltip: '白第二行遮罩'
        },
        lab_wel: {
            type: cc.Node,
            default: null,
            tooltip: '欢迎文字'
        },
        btn_go: {
            type: cc.Node,
            default: null,
            tooltip: '出发按钮'
        },
        mouse: {
            type: cc.Node,
            default: null,
            tooltip: '鼠标'
        },
        maple_story: {
            type: cc.Node,
            default: null,
            tooltip: 'story节点'
        },
        new_player_guide: {
            type: cc.Node,
            default: null,
            tooltip: '新手指导节点'
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // // init
        // this.init()
        // // 文字 1第一行 2第二行
        // this.on_lab_show(1)
        
        // cc.director.preloadScene('hallScene', function() {
            
        // })
    },

    start () {
        
    },

    onEnable () {
        // init
        this.init()
        // 文字 1第一行 2第二行
        this.on_lab_show(1)
        
        // cc.director.preloadScene('hallScene', function() {
            
        // })
    },

    // 初始化
    init () {
        // 飞机线
        this.shoot_line.fillRange = 0
        // 白字
        this.mask1.setContentSize(0, 40)
        this.mask2.setContentSize(0, 40)
        // 欢迎
        this.lab_wel.active = false
        // 出发按钮
        this.btn_go.active = false
        // 鼠标
        this.mouse.active = false
    },

    start () {

    },

    // 文字遮罩显示
    on_lab_show: function (index) { // 1第一行 2第二行
        // 第一行显示
        if (index == 1) {
            this.mask1.setContentSize(0, 40)
            this.mask1_clock = this.schedule(function () {
                if (this.mask1.width < 480) {
                    var m1_width = this.mask1.width + 10
                    this.mask1.setContentSize(m1_width, 40)
                } else {
                    this.mask1.setContentSize(480, 40)
                    this.unschedule(this.mask1_clock)
                    this.on_lab_show(2)
                }
            }.bind(this), 0.02)
        } else {
            this.mask2.setContentSize(0, 40)
            this.mask2_clock = this.schedule(function () {
                if (this.mask2.width < 580) {
                    var m2_width = this.mask2.width + 10
                    this.mask2.setContentSize(m2_width, 40)
                } else {
                    this.mask2.setContentSize(580, 40)
                    this.unschedule(this.mask2_clock)

                    // 欢迎显示（0.3秒后）
                    this.scheduleOnce(function() {
                        this.on_welcome_show()
                    }.bind(this), 0.3)
                }
            }.bind(this), 0.02)
        }
    },

    // 欢迎显示
    on_welcome_show: function () {
        this.lab_wel.active = true

        // 出发按钮显示 (0.5秒后)
        this.scheduleOnce(function () {
            this.on_go_btn_show()
        }.bind(this), 1)
    },

    // 出发按钮显示
    on_go_btn_show: function () {
        this.btn_go.active = true

        this.scheduleOnce(function () {
            this.mouse.active = true
        }.bind(this), 0.5)
    },

    on_btn_go: function () {
        // sound
        RemoteAudio.playEffect(SoundName.CASH_REGISTER);

        // cc.director.loadScene('hallScene')
        this.maple_story.active = false
        this.new_player_guide.active = true
    },

    update (dt) {
        this.shoot_line.fillRange += dt * 0.12
    },
});
