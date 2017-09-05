
 import React ,{Component} from 'react'
 import NewsFooter from "./news_footer";
import MobileHeader from "./MobileHeader"
 import '../componentsCss/mobile.css'
 export default class MobileApp extends Component{

 render(){
 return(
   <div>
     <MobileHeader />
     {this.props.children}
     <NewsFooter/>
   </div>
 )
 }
 }
