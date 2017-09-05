/**
 * 新闻详情路由组件
 */
import React, {Component} from 'react'
import {Row,Col,BackTop } from 'antd'
import NewsImageBlock from './news_image_block'
import NewsComments from './news_comments'

import axios from 'axios'

export default class NewsDetail extends Component {

  state = {
    news:{}
  }

  componentWillReceiveProps(newProps){
    console.log('componentWillReceiveProps() ', newProps)
    this.showNewsDetail(newProps)
  }
  componentDidMount (){
    //发送ajax请求获取新闻详情数据（注意：当我点击页面上的新闻时，新闻链接中的link就携带了
    // 该条新闻的唯一标识，他们将其存放在params中，所以我们从此对象可以取出相应的值）

    this.showNewsDetail(this.props)
  }
  /*显示新闻详情*/
  showNewsDetail(props){
    const {uniquekey} = props.params
    const url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey=${uniquekey}`
    axios.get(url)
      .then(response =>{
        const news = response.data
        this.setState({news})

        // todo 更新文档的标题（显示在搜索框中，点击哪条新闻链接就显示哪条新闻链接的标题）
        document.title = news.title
      } )
  }

  render () {
    const {pagecontent} = this.state.news
   /* const {news} = this.state
    let {type, uniquekey} = this.props.params
    // 如果没有指定, 默认指定为top
    if(!type) {
      type = 'top'
    }*/
    return (
      <div>
        <Row>
          <Col span={1}></Col>
          <Col span={16}  className='container'>
            {/*直接将接口返回的字符串数据转化为文本内容*/}
              <div dangerouslySetInnerHTML={{__html:pagecontent}}></div>
            <NewsComments uniquekey={this.props.params.uniquekey}/>
          </Col>
          <Col span={6}>
            <NewsImageBlock type="top" count={40} cardWidth='100%' imageWidth='150px' cardTitle="相关新闻"/>
          </Col>
          <Col span={1}></Col>
        </Row>
        <BackTop />
      </div>
    )
  }
}