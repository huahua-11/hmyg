//同时发送的ajax 的次数
let ajaxTimea = 0;
export const request = (params)=>{
    //发送的请求的个数
    ajaxTimea++;
    //显示真正的等在图标
    wx.showLoading({title:"加载中"});  
    const baseUrl = 'https://api.zbztb.cn/api/public/v1'
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseUrl+params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {reject(err)},
            complete: () => {
                ajaxTimea--;
                if(ajaxTimea===0){
                    //最后一个请求回来
                    //关闭正在等待的图标
                wx.hideLoading();
                }
            }
        });
          
    })
}