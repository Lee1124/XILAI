// const Url='http://39.108.177.168:1201/api/';
const Url = getApp().globalData.url;
// const  Url='http://localhost:8088';

const url={
    planList:Url+'/xlapi/FlowScheme/Operation/WeddingDesign/GetOrderDesing',//设计方案
    DetermineDesign: Url + '/xlapi/FlowScheme/Operation/WeddingDesign/DetermineDesign',//设计方案
    addNewCase:Url+'/xlapi/Mini/Ins/Anli/insModel',//添加上传接口
    getNewCase:Url+'/xlapi/Mini/Ins/Anli/getAnli',//获取新案例列表
    addCaseImg:Url+'/xlapi/Mini/Ins/Img/SaveImg',//添加新案例对应图片
    getCaseImg:Url+'/xlapi/Mini/Ins/Anli/getImg',//获取新安里图片
    saveimagewiththum: Url + '/xlapi/Mini/Ins/Img/saveimagewiththum'//添加保存图片的接口
};





module.exports={
    url
};