/**
 * 头部组件
 */
import React, {Component} from 'react'
import {Link} from 'react-router'
import  axios from 'axios'
import {
  Row, // 行
  Col, // 列,
  Menu, //菜单
  Modal, // 确认框
  Icon, //图标
  Button, //按键
  Tabs,//叶签
  Form,//表单
  Input,//输入框
message,//消息，是js标签，大写字母开头都是组件标签
} from 'antd'
import logo from '../images/logo.png'


// 菜单项组件
const MenuItem = Menu.Item
//叶签项
const TabPane = Tabs.TabPane
//表单项
const FormItem = Form.Item

class NewsHeader extends Component {
  /*简写形式的初始化，默认显示第一个菜单项,默认无用户名，对话框默认不显示*/
  state = {
    selectedKey: 'top',
    username:null,
    modalShow:false
  }

  showModal = (isShow) => {
    this.setState({modalShow: isShow})
  }

componentDidMount (){
  //读取保存到local中的username，localStorage用于持久化的本地存储，
  // 除非主动删除数据，否则数据是永远不会过期的。
  // localStorage.getItem(key):获取指定key本地存储的值
   const username = localStorage.getItem('username')
  if(username){
    //更新状态
    this.setState({username})
    console.log(username)
  }
}
// 如果点击的是'登陆/注册'就显示对话框
  clickMenu = ({key}) => {
    if(key==='logout'){
      //显示modal
      this.setState({modalShow:true})
    }// 更新状态
    this.setState({selectedKey: key})
  }

/*处理提交登录的请求,登录和注册调用的是同一个函数，所以我为它绑定bind，传入不同的实参*/
  handleSubmit = (isLogin,event) => {
    //阻止表单提交的默认行为
    event.preventDefault()
  //搜集表单输入的数据
    const {username, password, r_userName, r_password, r_confirmPassword} = this.props.form.getFieldsValue()
   //准备url
    let url = 'http://newsapi.gugujiankong.com/Handler.ashx?'
    if(isLogin) {
      url += `action=login&username=${username}&password=${password}`
    } else {
      url += `action=register&r_userName=${r_userName}&r_password=${r_password}&r_confirmPassword=${r_confirmPassword}`
    }

    //发请求
    axios.get(url)
      .then(response => {
        //清除输入的数据
        this.props.form.resetFields()
        //返回响应数据都存放的data属性中
        const result = response.data
        if(isLogin){//登录返回
          if(!result){
            message.error('登录失败，请重新登录')
          }else{//成功
            message.success('登录成功')
            // 读取返回的username/userId
            const username = result.NickUserName
            const userId = result.UserId
             //更新状态
            this.setState({username})
            // 保存username/userId
            /*localStorage.setItem("age","18");//设置age为"18"
            * 以下的作用就是将注册的username赋值给username
            * 注册时候自动产生一个userId，我们将这个userId保存到localStorage中，
            * 方便后面使用*/
            localStorage.setItem('username', username)
            localStorage.setItem('userId', userId)
          }
        }else{//注册的返回
          //提示成功
          message.success('注册成功')
        }
      })
//关闭modal
    this.setState({modalShow:false})
  }
  logout =()=>{
    //更新状态
    this.setState({username:null})
    //清除保存的用户数据
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
  }

  render () {
    /*对象的解构赋值，此常量名必须和对象中的属性同名*/
    const {selectedKey,username,modalShow} = this.state
    /*用三元运算符来判断，如果名字存在就显示已登陆，如果名字不存在就显示注册的状态*/
    const userShow = username
       ? (
        <MenuItem key="login" className = "register">
          <Button type="primary">{username}</Button>&nbsp;&nbsp;
           {/*这是一个链接，点击时会更新到个人中心界面*/}
          <Link to="/user_center"><Button type="dashed">个人中心</Button></Link>&nbsp;&nbsp;
          <Button onClick={this.logout}>退出</Button>
        </MenuItem>
         )
      :(
        <MenuItem key="logout" className="register">
          <Icon  type="appstore"/>登录/注册
        </MenuItem>
        )
   const { getFieldDecorator } = this.props.form



    return (
      <header>
        <Row>
          <Col span={1}></Col>
          <Col span={3}>
            <a href="#/" className="logo">
              <img src={logo} alt="logo"/>
              <span>ReactNews</span>
            </a>
          </Col>
          {/*由于图标是垂直排列的，所以设置mode="horizontal"，让其水平排列
           每一个菜单项目都有一个唯一的标识key*/}
          <Col span={19}>
            <Menu mode="horizontal" selectedKeys={[selectedKey]} onClick={this.clickMenu}>
              <MenuItem key="top">
                <Icon type="appstore"/>头条
              </MenuItem>
              <MenuItem key="shehui">
                <Icon type="appstore"/>社会
              </MenuItem>
              <MenuItem key="guonei">
                <Icon type="appstore"/>国内
              </MenuItem>
              <MenuItem key="guoji">
                <Icon type="appstore"/>国际
              </MenuItem>
              <MenuItem key="yule">
                <Icon type="appstore"/>娱乐
              </MenuItem>
              <MenuItem key="tiyu">
                <Icon type="appstore"/>体育
              </MenuItem>
              <MenuItem key="keji">
                <Icon type="appstore"/>科技
              </MenuItem>
              <MenuItem key="shishang">
                <Icon type="appstore"/>时尚
              </MenuItem>
              {userShow}
            </Menu>
            {/*添加最右边的菜单项 ,okText-点击确定回调,
             onCancel-点击遮罩层或右上角叉或取消按钮的回调*//*对话框是否可见，默认不可见*/}
            <Modal
                  title="用户中心"
                  visible={modalShow}
                  onOk={this.showModal.bind(this, false)}
                  onCancel={() =>this.showModal(false)}
                  okText="关闭">
              {/*标签页*/}
              <Tabs  type="card" onChange={() => this.props.form.resetFields()}>
                <TabPane tab="登录" key="1">
                  {/*表单，label属性后默认添加：*/}
                  <Form onSubmit={this.handleSubmit.bind(this,true)}>
                    <FormItem label="用户名">
                      {
                        /*运用表单的form中这个属性，注意：必填输入控件唯一标志，内部就会自动将input中的value保存在Form，
                        而不需要用其他方法获取*/
                        getFieldDecorator('username')(
                      <Input  type="text" placeholder="请输入用户名"/>
                      )}
                    </FormItem>
                    <FormItem label="密码">
                      {/*必填输入控件唯一标志*/}
                      {
                       getFieldDecorator('password')(
                       <Input  type="password" placeholder="请输入密码"/>
                       )}
                    </FormItem>
                    <Button type="primary" htmlType="submit">登录</Button>
                  </Form>
                </TabPane>
                <TabPane tab="注册" key="2">
                  <Form onSubmit={this.handleSubmit.bind(this,false)}>
                    <FormItem label="用户名">
                    {/*必填输入控件唯一标志,以前我们都是定义ref来获取input中的 value，
                    而from中给我们提供了下面一种简单的方法，其会自动把input中输入的值给username*/}
                    {
                     getFieldDecorator('r_username')(
                     <Input  type="text" placeholder="请输入用户名"/>
                     )}
                    </FormItem>
                    <FormItem label="密码">
                    {/*必填输入控件唯一标志*/}
                     {
                     getFieldDecorator('r_password')(
                     <Input  type="password" placeholder="请输入密码"/>
                     )}
                    </FormItem>
                    <FormItem label="确认密码">
                      {/*必填输入控件唯一标志*/}
                      {
                       getFieldDecorator('r_confirmPassword')(
                         <Input  type="password" placeholder="请再次输入密码"/>
                       )}
                    </FormItem>
                    <Button type="primary" htmlType="submit">注册</Button>
                  </Form>
                </TabPane>
              </Tabs>


            </Modal>
          </Col>
          <Col span={1}></Col>
        </Row>
      </header>
    )
  }
}
/*对NewsHeader组件进行包装产生一个新的组件类, 向NewsHeader传入一个属性: form*/

export default Form.create()(NewsHeader)
