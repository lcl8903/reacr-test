(this["webpackJsonpreact-adminv4"]=this["webpackJsonpreact-adminv4"]||[]).push([[12],{97:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return m}));var n,r=a(11),o=a(12),l=a(13),c=a(14),i=a(0),d=a.n(i),s=a(10),u=a(4),f=Object(u.B)(u.p),m=Object(s.a)({path:"/example/table-editable"})(n=function(e){Object(c.a)(a,e);var t=Object(l.a)(a);function a(){var e;Object(r.a)(this,a);for(var n=arguments.length,o=new Array(n),l=0;l<n;l++)o[l]=arguments[l];return(e=t.call.apply(t,[this].concat(o))).state={dataSource:Array.from({length:20}).map((function(e,t){return{key:"".concat(t),name:"Edward King 1",lang:"c++",address:"London, Park Lane no. 1"}}))},e.columns=[{title:"\u59d3\u540d",dataIndex:"name",width:300,formProps:{required:!0}},{title:"\u8bed\u8a00",dataIndex:"lang",width:300,formProps:{type:"select",required:!0,options:[{label:"Java",value:"java"},{label:"C++",value:"c++"}]}},{title:"\u5730\u5740",dataIndex:"address",formProps:function(e){return e.address.includes("no. 0")?{}:{disabled:!0}}},{title:"\u64cd\u4f5c",dataIndex:"operation",width:100,render:function(e,t){return d.a.createElement(u.j,{items:[{label:"\u4fdd\u5b58",onClick:function(){t._form.validateFields().then((function(e){console.log("\u6821\u9a8c\u6210\u529f\uff1a",e)})).catch((function(e){console.log(e)}))}},{label:"\u91cd\u7f6e",onClick:function(){return t._form.resetFields()}}]})}}],e}return Object(o.a)(a,[{key:"render",value:function(){var e=this.state.dataSource;return console.log("123123"),d.a.createElement(u.l,null,d.a.createElement(f,{dataSource:e,columns:this.columns}))}}]),a}(i.Component))||n}}]);
//# sourceMappingURL=12.b21079ac.chunk.js.map