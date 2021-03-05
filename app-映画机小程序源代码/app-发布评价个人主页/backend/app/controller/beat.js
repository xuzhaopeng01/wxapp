// 'use strict';

const Controller = require('egg').Controller;
//文件存储
const fs=require('fs');
let random = require('../util/random');
class BeatController extends Controller {
// 显示主题分类
async ShowTheStyle(){
    const ctx = this.ctx;
    let style = await ctx.app.model.Style.findAll()
                .then(us =>us.map(u => u.toJSON()));
    ctx.body = {
        code:200,
        data:style
    };
}
// 提交我的约拍请求
async addmyBeat(){
    let ctx = this.ctx;
    let {data}=ctx.request.body;
    let res='';
    let user=await ctx.model.User.findOne({where:{uid:data.uid}}).then(us =>us.toJSON());
    let money=user.money-2;
    let info =await ctx.model.User.update({money:money}, {
        where:{uid: data.uid}
    })
    let aid=random.getRandomString(8);
    if(info[0]==1)
    res=await ctx.model.Arrianbeat.create({
        aid:aid,
        uid:data.uid,
        bid:data.bid,
        require:data.require
        })
    if(res)
        res=1;
    else
        res=0;  

    ctx.body = {
        code:200,
        data:res
    };
}
// 添加约拍
    async addBeat(){
        let ctx = this.ctx;
        let {data}=ctx.request.body;
        let res;
        if(data.bid)
        res=await ctx.model.Beat.create(data)
        else
        res=await ctx.model.Product.create(data)
        if(res)
            res=1;
        else
            res=0;  

        ctx.body = {
            code:200,
            data:res
        };
    }
// 显示我的约拍信息列表, 显示我的作品相册
async MyBeatList(){
    const ctx = this.ctx;
    const {data}=ctx.request.body;
    console.log("data",data);
    let val;
    if(data.sort=='beat') val=ctx.app.model.Beat;
    else if(data.sort=='product')  val=ctx.app.model.Product;
    let beatlist = await val.findAll({
        where:data.uid,
    }).then(us =>us.map(u => u.toJSON()));
    beatlist.map((item)=>{
        item.beatUrl=item.imgurl;
        item.imgurl=fs.readdirSync('app/'+item.imgurl);
    })
    ctx.body = {
        code:200,
        data:beatlist
    };
}    
//推荐约拍信息或者作品相册
async showGroom(){
    let ctx = this.ctx;
    let Op = this.app.Sequelize.Op;
    let {data}=ctx.request.body;
    console.log("data",data);
    let val;
    if(data.sort=='beat') val=ctx.app.model.Beat;
    else if(data.sort=='product')  val=ctx.app.model.Product;
    let beatlist = await val.findAll({
        where:{
            style:{
            // 模糊查询
                    [Op.like]:'%' +data.style + '%'
            },
            uid:{
                $ne: data.uid
            }
        },
            include: [{model: ctx.app.model.User}]
    }).then(us =>us.map(u => u.toJSON()));
    beatlist.map((item)=>{
        item.beatUrl=item.imgurl;
        item.imgurl=fs.readdirSync('app/'+item.imgurl);
        if(item.User.headimg.indexOf("https")==-1){
        item.User.headimgUrl=item.User.headimg;
        item.User.headimg=fs.readdirSync('app/'+item.User.headimg);
        }else{
            item.User.headimgUrl=''; 
        }
    })
    ctx.body = {
        code:200,
        data:beatlist
    };
} 
// 约拍列表信息
async showBeat(){
    const ctx = this.ctx;
    let Op = this.app.Sequelize.Op;
    let {data}=ctx.request.body;
    let result,data1={},data2={};
    if(data.area){
        if(data.sex!='性别'){
                data2.sex=data.sex;
                if(data.area&&data.area!='地区'){
                    data1.area={
                        // 模糊查询
                        [Op.like]:'%' +data.area + '%'
                        }
                }
                if(data.beatrole&&data.beatrole!='类别'){
                        data1.beatrole=data.beatrole;
                }   
        }else{
            if(data.area&&data.area!='地区'){
                data1.area={
                    // 模糊查询
                    [Op.like]:'%' +data.area + '%'
                    }
            }
            if(data.beatrole&&data.beatrole!='类别'){
                    data1.beatrole=data.beatrole;
            }  
        }
        result = await ctx.app.model.Beat.findAll({
            where:data1,
            order:[['bid','DESC']],
            include: [{model: ctx.app.model.User,
                        where:data2   }]
        }).then(us =>us.map(u => u.toJSON()));
}else{
            result = await ctx.app.model.Beat.findAll({
                order:[['bid','DESC']],
                include: [{model: ctx.app.model.User}]
            }).then(us =>us.map(u => u.toJSON()));
}
    result.map((item)=>{
        item.beatUrl=item.imgurl;
        item.imgurl=fs.readdirSync('app/'+item.imgurl);
        if(item.User.headimg.indexOf("https")==-1){
            item.User.headimgUrl=item.User.headimg;
            item.User.headimg=fs.readdirSync('app/'+item.User.headimg);
            }else{
                item.User.headimgUrl=''; 
            }

    })
    ctx.body = {
        code:200,
        data:result
    };
    }
// 获取点赞数和评论数以及收到的约拍数
async getsortnum(){
    const ctx = this.ctx;
    let {data}=ctx.request.body;
    let sequelize=this.app.Sequelize;
            // 查询该约拍的点赞数
        let fullnum=await ctx.model.Full.findAll({
            where:data,
            attributes: [ [sequelize.fn('COUNT', sequelize.col('lid')), 'num']]
        }).then(us =>us.map(u => u.toJSON()));

        // 查询该约拍收到的约拍数
        let arrianum=await ctx.model.Arrianbeat.findAll({
            where:data,
            attributes: [ [sequelize.fn('COUNT', sequelize.col('aid')), 'num']]
            }).then(us =>us.map(u => u.toJSON()));

        // 查询该约拍的评论数
        let comnum=await ctx.model.Beatcomment.findAll({
            where:{
                bid:data.bid,
                parentid:'0'
            },
            attributes: [ [sequelize.fn('COUNT', sequelize.col('bcid')), 'num']]
            }).then(us =>us.map(u => u.toJSON()));

            ctx.body = {
                code:200,
                data:{
                    full:fullnum[0].num,
                    arrian:arrianum[0].num,
                    comnum:comnum[0].num
                }
            }; 
}
// 推荐作品相册
async  getProductlist(){
    const ctx = this.ctx;
    let Op = this.app.Sequelize.Op;
    let {data}=ctx.request.body;
    let model,data1={},data2={};
    if(data.beatrole=="作品相册"){
            model=ctx.app.model.Product;
                if(data.style!="全部")
                    data1.style={
                        // 模糊查询
                        [Op.like]:'%' +data.style + '%'
                        }
            }
    else{
            model=ctx.app.model.Beat;
                    if(data.style=="全部")
                        data1.beatrole=data.beatrole;
                    else{
                        data1.beatrole=data.beatrole;
                        data1.style={
                            // 模糊查询
                            [Op.like]:'%' +data.style + '%'
                            }
                    }
                    
                    if(data.area!='地区'){
                        data1.area={
                            // 模糊查询
                            [Op.like]:'%' +data.area + '%'
                            }
                    }

                    if(data.sex!='性别')
                    data2.sex=data.sex;
    }
    let list = await model.findAll({
        where:data1,
        include: [{model: ctx.app.model.User,
                    where:data2}]
    }).then(us =>us.map(u => u.toJSON()));

    list.map((item)=>{
        item.beatUrl=item.imgurl;
        item.imgurl=fs.readdirSync('app/'+item.imgurl);
        if(item.User.headimg.indexOf("https")==-1){
        item.User.headimgUrl=item.User.headimg;
        item.User.headimg=fs.readdirSync('app/'+item.User.headimg);
        }else{
            item.User.headimgUrl=''; 
        }

    })
    ctx.body = {
        code:200,
        data:list
    };
}
    // 显示约拍详情
async showBeatDetails(){
    const ctx = this.ctx;
    const {data}=ctx.request.body;
    let model;
    if(data.bid)
        model=ctx.app.model.Beat;
    else
        model=ctx.app.model.Product;
    let result = await model.findAll({
        where:data,
        include: [{model: ctx.app.model.User}]
    }).then(us =>us.map(u => u.toJSON()));

    result.map((item)=>{
        item.beatUrl=item.imgurl;
        item.imgurl=fs.readdirSync('app/'+item.imgurl);
        if(item.User.headimg.indexOf("https")==-1){
        item.User.headimgUrl=item.User.headimg;
        item.User.headimg=fs.readdirSync('app/'+item.User.headimg);
        }else{
            item.User.headimgUrl=''; 
        }

    })
    ctx.body = {
        code:200,
        data:result
    };
}
}

module.exports =BeatController;
