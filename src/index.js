/*注意：本新闻app中将用到三个重要的属性：
   1.this.props--其属性值来自组价中传递的属性
   2.this.state--此属性在当前页面作用
   3.this.props.pramas--此属性值来自于Link标签中携带的数据（与自路由中的路径设置相关）*/
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import App from './components/app'
import NewsContainer from './components/news_container'
import NewsDetail from './components/news_detail'
import UserCenter from './components/user_center'
import MediaQuery from 'react-responsive'
import MobileNewsContainer from './components/MobileNewsContainer'
import MobileNewsDetail from './components/MobileNewsDetail'
import MobileApp from './components/MobileApp'
import MobileUserCenter from './components/MobileUserCenter'


render((
  <div>
    <MediaQuery query='(min-device-width: 1224px)'>
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={NewsContainer}></IndexRoute>
      <Route path='/news_detail/:uniquekey' component={NewsDetail}></Route>
      <Route path='/user_center' component={UserCenter}></Route>
    </Route>
  </Router>
    </MediaQuery>
    <MediaQuery query='(max-device-width: 1224px)'>
      <Router history={hashHistory}>
        <Route path='/' component={MobileApp}>
          <IndexRoute component={MobileNewsContainer}></IndexRoute>
          <Route path='/news_detail/:uniquekey/' component={MobileNewsDetail}></Route>
          <Route path='/user_center' component={MobileUserCenter}></Route>
        </Route>
      </Router>
    </MediaQuery>
  </div>
), document.getElementById('root'))