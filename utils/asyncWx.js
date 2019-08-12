

/**
 * promise 形式的wx.openSetting 打开授权有页面
 */
export const openSetting = () => {
    return new Promise((resolve, reject) => {
      wx.openSetting({
        success: (result) => {
          resolve(result);
        },
        fail: (err) => {
          reject(err)
        }
      });
    })
  }
  
  /**
   * promise 形式的wx.getSetting 获取授权信息
   */
  export const getSetting = () => {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (result) => {
          resolve(result);
        },
        fail: (err) => {
          reject(err)
        }
      });
    })
  }
  
  /**
   * promise 形式的wx.chooseAddress 获取收货地址
   */
  export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
      wx.chooseAddress({
        success: (result) => {
          resolve(result);
        },
        fail: (err) => {
          reject(err)
        }
      });
    })
  }
  
  /**
   * promise 形式的wx.showModal 对话框
   * @param {object} param0 要传递的参数
   */
  export const showModal = ({ content }) => {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: '提示',
        content: content,
        success(res) {
          resolve(res);
        }
      })
    })
  }
  
  /**
   * promise 形式的wx.showToast 提示框
   * @param {object} param0 要传递的参数
   */
  export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
      wx.showToast({
        title: title,
        icon: 'none',
        success: (result) => {
          resolve(result);
        }
      });
    })
  }
  
  /**
   * promise 形式的wx.login 
   */
  export const login = () => {
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 10000,
        success: (result) => {
          resolve(result)
        }, fail(err) {
          reject(err);
        }
      });
    })
  }
  
  /**
   * 调用小程序内置的支付（真的会扣钱！）
   * @param {object} pay 微信支付必须的参数
   */
  export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...pay,
        success: (result) => {
          resolve(result);
        },
        fail: (err) => {
          reject(err)
        }
      });
  
    })
  }