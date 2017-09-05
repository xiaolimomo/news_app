import React,{Component} from 'react'
import {Modal,Tabs,Form,Input,Icon,message,Button} from 'antd'
import {Link} from 'react-router'
import logo from '../images/logo.png'

import axios from 'axios'



const TabPane = Tabs.TabPane
const  FormItem = Form.Item
 class MobileHeader extends Component {
  state={
    username:null,
    visible:false
  }

  componentWillMount = ()=>{
    //读取保存的数据
    const username = localStorage.getItem('username')
    if(username){
      this.setState({username})
    }
  }

  handleModal = ()=>{
    this.setState({visible:false})
  }

   handleSubmit=(isRegist, event)=>{
    /*阻止表单的默认行为*/
    event.preventDefault()
     //搜集输入的证据，准备url
     const {username,password,r_username,r_password,r_confirmPassword}=this.props.form.getFieldsValue()
     const action = isRegist?'register':'login'
     const url = `http://newsapi.gugujiankong.com/Handler.ashx?action=${action}&username=${username}&password=${password}&r_userName=${r_username}&r_password=${r_password}&r_confirmPassword=${r_confirmPassword}`


 //发送ajax请求
     axios.get(url)
       .then(response=>{
         const result = response.data
         if(isRegist){
           message.success('注册成功')
         }else{
           if(!result){
             message.error('登录失败')
           }else{
             message.success('登录成功')
             const userId = result.UserId
             const username = result.NickUserName
             //更新状态
             this.setState({username})
             //保存到localstorage中
             localStorage.setItem('username',username)
             localStorage.setItem('userId',userId)
           }
         }
       })
     this.setState({visible:false})
 }

  render() {
    const {username,visible} = this.state
    const {getFieldDecorator} = this.props.form

    const userItem = username
    ? <Link to="/user_center">
        <Icon type="inbox"/>
      </Link>
     : <Icon type="setting"/>

    return (
      <div id="mobileheader">
        <header>
          <div>
            <Link to="/">
              <img src={logo} alt="logo"/>
              <span>ReactNews2</span>
            </Link>
            {userItem}
          </div>
        </header>
        <Modal
          title="用户中心"
          visible={visible}
          onOk={this.handleModal}
          onCancel={this.handleModal}
        >
          <Tabs  type="card" onChange={() => this.props.form.resetFields()}>
            <TabPane tab="登录" key="1">
              <Form onSubmit={this.handleSubmit.bind(this,false)}>
                <FormItem label="用户名">
                  {getFieldDecorator('username')(
                    <Input placeholder="请输入用户名"/>
                  )
                  }
                </FormItem>
                <FormItem label="密码">
                  {getFieldDecorator('password')(
                    <Input type="password" placeholder="请输入密码"/>
                  )
                  }
                </FormItem>
                <Button type="primary" htmlType="submit">登录</Button>
              </Form>
            </TabPane>
            <TabPane tab="注册" key="2">

              <Form onSubmit={this.handleSubmit.bind(this,true)}>
                <FormItem label="用户名">
                  {getFieldDecorator('r_username')(
                    <Input placeholder="请输入用户名"/>
                  )
                  }
                </FormItem>
                <FormItem label="密码">
                  {getFieldDecorator('r_password')(
                    <Input type="password" placeholder="请输入密码"/>
                  )
                  }
                </FormItem>
                <FormItem label="确认密码">
                  {getFieldDecorator('r_confirmPassword')(
                    <Input type='password' placeholder="请再次输入密码"/>
                  )
                  }
                </FormItem>
                <Button type="primary" htmlType="submit">登录</Button>
              </Form>
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(MobileHeader)