/**
 * 新闻评论组件
 */
import React,{Component,PropTypes} from 'react'
import {Form,Button,input,Card,notification} from 'antd'
import axios from 'axios'

const FormItem = Form.Item

class NewsComments extends Component{
  static propTypes = {
    uniquekey: PropTypes.string.isRequired
  }

  state = {
    comments:[]
  }
/*初始化显示执行*/
  componentDidMount() {
    const {uniquekey} = this.props
    this.showComments(uniquekey)
  }

  // 切换新闻时执行
  componentWillReceiveProps (newProps) {
    this.showComments(newProps.uniquekey)
  }


  showComments(uniquekey) {

    let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getcomments&uniquekey=${uniquekey}`
  /*发送ajax请求*/
  axios.get(url)
    .then(response=>{
       const comments = response.data
      this.setState({comments})
    })

  }




/*取消表单的默认提交行为，如果不取消就会页面跳转，而不是更新页面*/
handleSubmit = (event)=>{
  event.preventDefault()
  /*取出登录注册时产生的保存在localsto中的userId*/
  const userId = localStorage.getItem('userId')
  /*判断如果不存在请登录，并且不在执行下面的操作*/
  if(!userId){
    alert("请先登录")
    return
  }
  const {uniquekey} = this.props
  // 获取输入数据
  const content = this.props.form.getFieldValue('content')
  const url = `http://newsapi.gugujiankong.com/Handler.ashx?action=comment&userid=${userId}&uniquekey=${uniquekey}&commnet=${content}`
   /*发送ajax请求*/
   axios.get(url)
     .then(response=>{
       // 更新评论列表
       this.componentDidMount()
       // 提示
       notification.success({
         message: '提交评论成功'
       })
       // 清除输入数据
       this.props.form.resetFields()
     })
}
/*收藏文章*/
handleClick = ()=>{
  const  userId = localStorage.getItem('userId')
  if(!userId){
    alert('请先登录')
    return
  }
  const {uniquekey} = this.props
  const url = `http://newsapi.gugujiankong.com/Handler.ashx?action=uc&userid=${userId}&uniquekey=${uniquekey}`
  axios.get(url)
    .then(response=>{
      // 提示
      notification.success({
        message: '收藏文章成功'
    })

    })
}



render(){
  const commentList = this.state.comments.map((comment,index)=>(
    <Card key={index} title={comment.UserName} extra={`发布于${comment.datatime}`}>
      <p>{comment.Components}</p>
    </Card>
  ))
  const {getFieldDecorator} = this.props.form
  return(
    <div style={{padding:'10px'}}>
      {commentList}
      <Form onSubmit={this.handleSubmit}>
         <FormItem label="您的评论">
           {
             getFieldDecorator('comments')(<input type="textarea" placeholder="随便写点什么" />)
           }
         </FormItem>
        <Button htmlType='submit' type='primary'>提交评论</Button>
        <Button htmlType='button' type='primary' onClick={this.handleClick}>收藏该文章 </Button>
      </Form>
    </div>
  )
}
}
export default Form.create()(NewsComments)
