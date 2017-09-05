/**
 * 用户中心路由组件
 */
import React, {Component} from 'react'
import {Tabs,Row,Col,Card,Icon,Upload,Modal} from 'antd'
import axios from 'axios'


const TabPane = Tabs.TabPane

export default class UserCenter extends Component {

  state = {
    userCollections:[],
    userComments:[],
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  }

  componentDidMount(){
    //搜集用户收藏列表数据
    const userId = localStorage.getItem('userId')
    let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getuc&userid=${userId}`
    axios.get(url)
      .then(response=>{
        const userCollections = response.data
        this.setState({userCollections})
      })

    //获取用户评论列表
    url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getusercomments&userid=${userId}`
    axios.get(url)
      .then(response=>{
        const userComments = response.data
        this.setState({userComments})
      })
  }

  handleCancel = () => this.setState({ previewVisible: false })
  // 显示预览图片(显示 modal)
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // 选择上传图片
  handleChange = ({ fileList }) => this.setState({ fileList })

  render () {
    const {userCollections,userComments} = this.state

    const userCollectionsList = userCollections.length
      ? userCollections.map((uc,index)=>(
        <Card key={index} title={uc.uniqueKey}
              extra={<a href={`/#/news_detail/${uc.uniqueKey}`}>查看</a>}>
          <p>{uc.Title}</p>
        </Card>
      ))
      : '您还没有收藏任何的新闻，快去收藏一些新闻吧。'



    const userCommentsList = userComments.length
    ?userComments.map((getusercomments,index)=>(
        <Card key={index} title={`于${getusercomments.datatime}评论了文章${getusercomments.uniqueKey}`}
              extra={<a href="#">查看</a>} >
          <p>userCommentsList.comments </p>

        </Card>
      ))
      :'您还没有发表过任何评论。'

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div>
        <Row>
          <Col span={1}></Col>
          <Col sapn={22}>
            <Tabs defaultActiveKey="1" >
              <TabPane tab="我的收藏列表" key="1">
                {userCollectionsList}
              </TabPane>
              <TabPane tab="我的评论列表" key="2">
                {userCommentsList}
              </TabPane>
              <TabPane tab="图像设置" key="3">
                <div className="clearfix">
                  <Upload
                    action="http://jsonplaceholder.typicode.com/photos"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}>
                    {fileList.length >= 3 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </TabPane>
            </Tabs>
          </Col>
          <Col sapn={1}>

          </Col>
        </Row>
      </div>

    )
  }
}