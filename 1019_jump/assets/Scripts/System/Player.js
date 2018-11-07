
var game_Control = require("GameContorl");

var Init = require("Init");

var Box = require("Box");

cc.Class({
    extends: cc.Component,

    properties: {

        y_radio: 0.5560472,

        x_dis: 50,

        game_manager:{
            type: game_Control,
            default: null,
        },
        
        InputColor: "",

        AllBoxIndex: -1,

        CurBox:
        {
            type: cc.Node,
            default:null,
        },

        IsCanJump: true,

        GameingState: "Gameing",

        JumpCool:0.2,
        
        MySprite:
        {
            type:cc.Sprite,
            default:null,
        },

        MySpriteList:
        {
            type:cc.SpriteFrame,
            default:[],
        }
    },

    Clear()
    {
        this.ResurtCount = 0;
        this.InputColor = "";
        this.AllBoxIndex = -1;

        this.CurBox = null;
        this.IsCanJump = true;
        this.GameingState = "Gameing";
        this.JumpCool = 0.2;
    },


    onLoad()
    {
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyDown,this);
        this.ResurtCount = 0;
        this.direction = 1;
    },
    // LIFE-CYCLE CALLBACKS:

    keyDown(event)
    {
        if(this.IsCanJump==false||this.GameingState != "Gameing")
            return;

        if(Init.Instance.IsSoundPlay)
            this.game_manager.AllBoxs[this.AllBoxIndex+1].getComponent(cc.AudioSource).play();

        this.direction =  this.game_manager.AllBoxs[this.AllBoxIndex+1].getComponent("Box").Direction;
        var isNeedjump = true;
        
        switch(event.keyCode||event)
        {
            case cc.KEY.a:
                this.InputColor = "紫色";
                break;
            case cc.KEY.s:
                this.InputColor = "黄色";
                break;
            case cc.KEY.d:
                this.InputColor = "红色";
                break;
            case cc.KEY.f:
                this.InputColor = "蓝色";
                break;
            default:
                isNeedjump = false;
                break;
        }
        if(isNeedjump)
            this.playerjump();
        isNeedjump = false;
    },

    BtnA()
    {
        this.keyDown(cc.KEY.a);
    },

    BtnS()
    {
        this.keyDown(cc.KEY.s);
    },

    BtnD()
    {
        this.keyDown(cc.KEY.d);
    },

    BtnF()
    {
        this.keyDown(cc.KEY.f);
    },


    playerjump()
    {
        this.JumpCool=0.2,
        this.game_manager.coolTime = 0.8,
        this.game_manager.StopUpdate = false;
        this.IsCanJump = false;
        var x_distance = this.x_dis * this.direction;
        var y_distance = this.x_dis * this.y_radio;

        var target_pos = this.node.getPosition();
        target_pos.x += x_distance;
        target_pos.y += y_distance;

        var j = cc.jumpTo(0.1,target_pos,200,1);
        var w_pos = this.node.parent.convertToWorldSpaceAR(target_pos);
        var end_func = cc.callFunc(function() {
            /*
            if(this.direction == 1)
                this.game_manager.move_Map(183-w_pos.x,-y_distance);
            else
                this.game_manager.move_Map(567-w_pos.x,-y_distance);
            */
            this.game_manager.move_Map(380-w_pos.x,-y_distance);
        }.bind(this));

        var seq =cc.sequence(j,end_func);
        this.node.runAction(seq);
        
    },
    onEnable()
    {
        this.node.instance = this;
    },


    start () 
    {
        this.rot_node = this.node.getChildByName("rot_node");
    },

     update (dt) {
        this.JumpCool-=dt;
        if(this.JumpCool<=0)
        {
            this.IsCanJump = true;
            return;
        }
     },
});