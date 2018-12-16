<template>
	<div id="app">
		<!--侧边栏-->
		<div class="slide">
			<i class="home"></i>
		</div>

		<!--功能区-->
		<div class="content">
			<!--title-->
			<div class="title_box">
				<i class="star"></i>
				<span>量化下单平台</span>
			</div>
			<!--基础部分-->
			<section class="base_model">
				<h2>基础信息</h2>
				<div class="base_content">
					<div class="input_box">
						<div class="left">
							<el-select v-model="accounts_value" clearable multiple id="price_type" class="select_txt" placeholder="账户">
								<el-option v-for="(account) in this.accounts_typeList" :key="account.value" :label=account.name+account.value
								 :value=account.value></el-option>
							</el-select>
							<el-select v-model="action_type" id="price_type" class="select_txt" placeholder="操作">
								<el-option v-for="(action,key) in this.action_typeList" :key="key" :label=action.name :value=action.value></el-option>
							</el-select>
							<el-select v-model="orders_type" v-show="action_type=='orders'" clearable id="price_type" class="select_txt"
							 placeholder="操作">
								<el-option v-for="(order,key) in this.orders_typeList" :key="key" :label=order.name :value=order.value></el-option>
							</el-select>

							<el-input v-show="action_type=='trans'" clearable class="input_txt" placeholder="公司名称或股票代码" v-on:input="getStore(myValue)"
							 v-on:compositionend="getStore(myValue)" v-model="myValue"></el-input>
							<ul class="search_list" v-if="this.storeList.length > 0 && this.myValue">
								<li @click="getCompany(obj.secuCode,obj.market,obj.secuAbbr)" v-for="(obj,i) in this.storeList" :key="'company'+i">
									<p>{{obj.secuCode}}</p>
									<p>{{obj.market}}</p>
									<p>{{obj.secuAbbr}}</p>
									<p>{{obj.py}}</p>
								</li>
							</ul>

							<el-input v-show="action_type=='trans' && trans_type=='LIMIT' " class="input_txt" placeholder="价格" id="price"
							 v-model="price"></el-input>
							<el-input v-show="action_type=='trans'" class="input_txt" placeholder="数量" id="amount" onkeyup="value=value.replace(/[^\d]/g,'')"
							 v-model="amount"></el-input>
							<el-select v-show="action_type=='trans'" v-model="trans_action" id="trans_action" class="select_txt" placeholder="交易指令">
								<el-option v-for="(type,key) in this.trans_actionList" :key="key" :label=type.name :value=type.value>
								</el-option>
							</el-select>

							<el-select v-show="action_type=='trans'" v-model="trans_type" id="trans_type" class="select_txt" placeholder="限价/市价">
								<el-option v-for="(transtype,key) in this.trans_typeList" :key="key" :label=transtype.name :value=transtype.value></el-option>
							</el-select>
							<el-select v-show="action_type=='trans'" v-model="price_type" id="price_type" class="select_txt" placeholder="价格类型">
								<el-option v-for="(pricetype,key) in this.price_typeList" :key="key" :label=pricetype.name :value=pricetype.value></el-option>
							</el-select>
							<el-input v-show="action_type=='delete' || action_type=='clients' || action_type=='change_clients' || action_type=='reports' || action_type=='adjustments'"
							 class="input_txt" placeholder="单号/其他数据" v-model="other_orders_value"></el-input>
						</div>
						<div class="right">
							<p  v-show="fileListRead.length>0">交易计划</p>
							<el-table v-show="fileListRead.length>0" ref="multipleTable" :data="fileListRead" tooltip-effect="dark" style="width: 1000px" max-height="250">
								<!--<el-table-column type="selection" width="55"> </el-table-column>-->
								<el-table-column fixed prop="StockId" label="股票" width="120"> </el-table-column>
                <el-table-column fixed prop="id" label="订单号" width="120"> </el-table-column>
                <el-table-column prop="Direction" label="方向" width="120" > </el-table-column>
                <el-table-column prop="Amount" label="数量" width="120"> </el-table-column>
								<el-table-column prop="Price" label="价格" width="120"> </el-table-column>
								<el-table-column prop="PriceType" label="价格类型" width="120"> </el-table-column>
								<el-table-column prop="MarketType" label="市场类型" width="120"> </el-table-column>
                <el-table-column prop="message" label="消息" width="120"> </el-table-column>
                <!--<el-table-column prop="source" label="端口" width="120"> </el-table-column>-->
								<!--<el-table-column fixed="right" label="操作" width="120">-->
									<!--<template slot-scope="scope">-->
										<!--<el-button @click.native.prevent="deleteRow(scope.$index, fileList)" type="text" size="small"> 移除 </el-button>-->
										<!--<el-button type="text" size="small">下单</el-button>-->
									<!--</template>-->
								<!--</el-table-column>-->
							</el-table>
							<div style="margin-top: 20px">
								<el-button @click="doReadFileRequest">查看交易计划</el-button>
								<!--<el-button @click="toggleSelection()">取消选择</el-button>-->
								<el-button @click="tradeAll(chooseAccount)">全部挂单</el-button>
								<el-button @click="soldOutToday(chooseAccount)">卖出今日到期票</el-button>

							</div>
						</div>
					</div>
					<!--<p v-for="(c,i,key2) in m.indexList">{{c.indexName}}</p>-->
					<div class="btn_box">
						<el-button type="primary" @click="choose">执行操作</el-button>
					</div>
					<div class="result">
						<div v-if="positionsList!=null">
							<p>{{positionsList.dataTable.columns}}</p>
							<p>{{positionsList.dataTable.rows}}</p>
						</div>

					</div>
				</div>
			</section>
			<!--设计部分/业务部分-->
			<section class="main_area">
				<h2>交互信息</h2>
				<el-tabs>
					<el-tab-pane class="design_model clearfix" label="设计部分" name="design">
						<div v-if="positionsList!=null">
							<p>{{positionsList.count}}</p>
						</div>

					</el-tab-pane>
					<el-tab-pane class="business_model" label="业务部分" name="business">
						<!--指标-->
						<section class="index clearfix">
							<!--文本指标-->
							<div class="txt_index">
								<h2>文本指标</h2>

							</div>
							<!--数据指标-->
							<div class="num_index">
								<h2>数据指标</h2>

							</div>
						</section>
						<div class="btn_box">
							<el-button type="primary">提交修改</el-button>
						</div>
						<!--模板修改-->

						<section class="model">

						</section>
					</el-tab-pane>
				</el-tabs>
			</section>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		name: 'App',

		data() {
			return {
				fileList: [],
				accounts_typeList: [{
					name: '姜忠坷-同花顺-',
					value: '43429990',
          file_name:'43429990',
          server_address: "http://localhost:8088",
          trans_address: "http://192.168.130.139:8888,",
				}, {
					name: '姜忠坷-东方财富-',
					value: '320400009783',
          file_name:'320400009783',
          server_address: "http://localhost:8088",
          trans_address: "http://192.168.130.139:8888,",
				}, {
					name: '姜忠坷-通达信模拟-',
					value: '18516550566',
          file_name:'18516550566',
          server_address: "http://localhost:8088",
          trans_address: "http://192.168.130.139:8888,",
				}, {
					name: '吴琴琴-实盘-',
					value: '201130022743',
          file_name:'201130022743',
          server_address: "http://localhost:8088",
          trans_address: "http://192.168.130.139:8888,",
				}, {
					name: '朱品章-实盘-',
					value: '97001528',
          file_name:'97001528',
          server_address: "http://localhost:8088",
          trans_address: "http://192.168.130.139:8888,",
				}, {
					name: '李磊-实盘-',
					value: '310500000437',
          file_name:'310500000437',
          server_address: "http://localhost:8088",
          trans_address: "http://192.168.130.139:8888,",
				}],
				price: 0,
				amount: 100,
				trans_action: 'BUY',
				trans_type: 'LIMIT',
				price_type: '0',
				accounts_value:'all',
				action_type: 'trans',
				orders_type: null,
				other_orders_value: '',
				result: '',
				positionsList: null,
				action_typeList: [{
					name: '下单',
					value: 'trans'
				}, {
					name: '撤单',
					value: 'delete'
				}, {
					name: '撤单全部',
					value: 'delete_all'
				}, {
					name: '生成调仓信号',
					value: 'adjustments'
				}, {
					name: '资金股份/投资组合',
					value: 'positions'
				}, {
					name: '查询订单',
					value: 'orders'
				}, {
					name: '查询状态',
					value: 'statuses'
				}, {
					name: '查询其他',
					value: 'reports'
				}, {
					name: '查询交易客户端状态',
					value: 'clients'
				}, {
					name: '更改交易客户端状态',
					value: 'change_clients'
				}, {
					name: '查询帐号',
					value: 'accounts'
				}],
				orders_typeList: [{
					name: '查询当日委托',
					value: null
				}, {
					name: '查询撤单',
					value: 'open'
				}, {
					name: '查询当日成交',
					value: 'filled'
				}],
				trans_actionList: [{
						name: '买入',
						value: 'BUY'
					},
					{
						name: '卖出',
						value: 'SELL'
					},
					{
						name: '打新',
						value: 'IPO'
					},
					{
						name: '融资买入',
						value: 'BUY_ON_MARGIN'
					},
					{
						name: '卖券还款',
						value: 'SELL_THEN_REPAY'
					},
				],
				trans_typeList: [{
						name: '限价单',
						value: 'LIMIT'
					},
					{
						name: '市价单',
						value: 'MARKET'
					},
				],
				price_typeList: [{
						name: '限价委托-全市场',
						value: '0'
					},
					{
						name: '五档即时成交剩余撤销-全市场',
						value: '4'
					},
					{
						name: '五档即时成交剩余转限-上海交易所',
						value: '6'
					},
					{
						name: '对手方最优价格委托-深圳交易所',
						value: '1'
					},
					{
						name: '本方最优价格委托-深圳交易所',
						value: '2'
					},
					{
						name: '即时成交剩余撤销委托-深圳交易所',
						value: '3'
					},
					{
						name: '全额成交或撤销委托-深圳交易所',
						value: '5'
					},
				],
				// server_address:"https://visual.gildata.com",
				// upload_address:"https://visual.gildata.com/zzb-server/syncFile/multifileUpload",
				server_address: "http://localhost:8088",
				// direct_address:"http://joemercy.xicp.net:25698",
				direct_address: "http://192.168.130.139:8888,",
				redis_address: "https://minfo.gildata.com",
				myValue: "",
				storeList: [],
				multipleSelection: [],
				resultArr: [],
			}
		},
		beforeShow() {},
		methods: {
			tradeAll: async function(userList) {
				//TODO:批量全部挂单
        for(let i = 0; i < userList.length; i++) {
          let account = userList[i].value;
          let file_name = userList[i].file_name;
          let server_address = userList[i].server_address;
          let trans_address = userList[i].trans_address;
          console.log("账户:" + account + "文件服务器地址:" + server_address + "实盘易地址" + trans_address);
          //TODO:加载文件
          //读取文件
          console.log("===>开始读取文件" + file_name);
          await axios.get(server_address + '/zzb-server/readCsv?fileName=' + file_name)
            .then(async res => {
              console.log("====>文件读取成功");
              let fileList = res.data;
              for (let i = 0; i < fileList.length; i++) {
                let trans_action='';
                if (fileList[i].Direction === '1') {
                  trans_action = 'BUY';
                } else {
                  trans_action = 'SELL';
                }

                let params = {
                  action: trans_action,
                  symbol: fileList[i].StockId,
                  type: 'LIMIT',
                  priceType: 0,
                  price: fileList[i].Price,
                  amount: fileList[i].Amount,
                  url: trans_address + "/api/v1.0/orders?client=*:" +account,
                };
                await axios.get(server_address + '/zzb-server/transPost', {
                  params
                })
                  .then(res => {
                    //TODO:结果保存res.data.result id,source,message
                    if(res.data.id!=null)
                      fileList[i].id=res.data.id;
                    else
                      fileList[i].id='null';
                    if(res.data.source!=null)
                      fileList[i].source=res.data.source;
                    else
                      fileList[i].source='null';
                    if(res.data.message!=null)
                      fileList[i].message=res.data.message;
                    else
                      fileList[i].message='null';
                    console.log(res.data);
                  })
                  .catch(err => {
                    return err.data;
                  })

              }

              //TODO:保存数据到csv
              let fd = new FormData();
              fd.append('fileName', userList[i].file_name);
              fd.append('fileList',  JSON.stringify(fileList));
              console.log("保存数据到服务器");
              await  axios.post(server_address + '/zzb-server/saveCsv',fd);

              console.log(fileList);
            }).catch(err => {
          })
        }

			},
			sleep: function(delay) {
				let start = (new Date()).getTime();
				while ((new Date()).getTime() - start < delay) {
					continue;
				}
			},
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			choose: function() {
				let that = this;
				console.log(that.action_type);
				//下单
				if (that.action_type === 'trans') {
					let postData;
					postData = {
						action: that.trans_action,
						symbol: that.myValue.substring(0, 6),
						type: that.trans_type,
						priceType: that.price_type,
						price: that.price,
						amount: that.amount,
						url: that.direct_address + "/api/v1.0/orders?client=*:" + that.accounts_value,
					};


					this.doPostRequest('orders', postData);
				}
				//撤单
				else if (that.action_type === 'delete') {
					this.doDeleteRequest('orders/' + this.other_orders_value);
				}
				//撤单全部
				else if (that.action_type === 'delete_all') {
					this.doDeleteRequest('orders');
				}
				//生成调仓信号
				else if (that.action_type === 'adjustments') {}
				//查询帐号
				else if (that.action_type === 'accounts') {
					this.doGetRequest('accounts');
				}
				//资金股份/投资组合
				else if (that.action_type === 'positions') {
					this.doGetRequest('positions');
				}
				//查询订单
				else if (that.action_type === 'orders') {
					//查询当日委托
					if (that.orders_type == null)
						this.doGetRequest('orders');
					//查询撤单
					else if (that.orders_type === 'open') {
						let params = {
							'client': 'account:' + this.accounts_value,
							'status': 'open'
						};
						this.doGetRequest('open', params);
					} //查询当日成交
					else if (that.orders_type === 'filled') {
						let params = {
							'client': 'account:' + this.accounts_value,
							'status': 'filled'
						};
						this.doGetRequest('open', params);
					}
				}
				//查询状态
				else if (that.action_type === 'statuses') {
					this.doGetRequest('statuses');
				}
				//查询其他
				else if (that.action_type === 'reports') {
					let params = {
						'client': 'account:' + this.accounts_value,
						'navigation': that.other_orders_value
					};
					this.doGetRequest('reports', params);
				}
				//查询交易客户端状态
				else if (that.action_type === 'clients') {
					this.doGetRequest('clients/' + that.other_orders_value);
				}
				//更改交易客户端状态
				else if (that.action_type === 'change_clients') {
					this.doPatchRequest('clients/' + that.other_orders_value)
				}

			},

			/**
			 * 加载页面就获取股票列表
			 */
			getOrgCode() {
				axios.get(this.redis_address + "/memcached/json/?AStock_secuInfo").then((res) => {
					if (res) {
						this.secuInfo = res.data;
						// console.log(this.secuInfo);
					} else {
						console.log('暂无此数据');
					}
				})
			},
			/**
			 * 获取股票
			 * @param key
			 */
			getStore: function(key) {
				let listInfo = this.secuInfo;
				let arr = [];
				this.storeList = [];
				for (let i = 0; i < listInfo.length; i++) {
					if (listInfo[i].label.toLowerCase().indexOf(key.toLowerCase()) > -1) {
						let label = listInfo[i].label.split(" ");
						// listInfo[i].label = listInfo[i].label.substring(0,12);
						listInfo[i].secuCode = label[0];
						listInfo[i].secuAbbr = label[1];
						listInfo[i].market = label[2];
						listInfo[i].py = label[3];
						arr.push(listInfo[i]);
					}
				}
				let size = arr.length > 10 ? 10 : arr.length;
				for (let i = 0; i < size; i++) {
					this.storeList.push(arr[i]);
				}
			},
			/**
			 * 股票代码
			 * @param code
			 * @param name
			 */
			getCompany: function(code, market, name) {
				this.storeList = [];
				this.myValue = code + ' ' + market + ' ' + name;
				this.secuCode = code;
				this.doGetRequest('quotes/' + code);

			},

			doReadFileRequest: function() {
				let that = this;

				axios.get(this.server_address + '/zzb-server/readCsv?fileName=' + that.accounts_value)
					.then(res => {
						console.log(res.data);
						this.fileList = res.data;
					})
					.catch(err => {
						this.result = err.data;
					})
			},
			/**
			 * POST Request
			 * action_type
			 * params
			 **/

			doPostRequest: function(action_type, params) {
				if (params == null)
					params = {
						'client': '*:' + this.accounts_value
					};
				axios.get(this.server_address + '/zzb-server/transPost', {
						params
					})
					.then(res => {

						console.log(res.data);
						this.resultArr.push(res.data);
					})
					.catch(err => {
						return err.data;
					})
			},

			/**
			 * GET Request
			 * action_type
			 * params
			 **/

			doGetRequest: function(action_type, params) {
				console.log("=============" + action_type);
				if (params == null)
					params = {
						'client': '*:' + this.accounts_value
					};
				this.$axios.get("/api/v1.0/" + action_type, {
						params: params
					})
					.then(res => {
						if (action_type === 'positions') {
							this.positionsList = res.data;
							console.log(this.positionsList);
						}
						if (action_type === 'orders') {
							this.positionsList = res.data;

						}
					})
					.catch(err => {
						console.log(err.data);
					})

			},
			/**
			 * 一键撤单卖出
			 **/
			soldOutToday:async function(userList) {
        for(let i = 0; i < userList.length; i++) {
          let account=userList[i].value;
          let file_name=userList[i].file_name;
          let server_address= userList[i].server_address;
          let trans_address = userList[i].trans_address;
          console.log("账户:" + account + "文件服务器地址:" + server_address + "实盘易地址" + trans_address);
          let params = {
            'client': '*:' + account
          };
              console.log("===>开始读取文件" + file_name);
              await axios.get(server_address + '/zzb-server/readCsv?fileName=' + file_name)
                .then(async res => {
                  console.log("====>文件读取成功");
                  let fileList = res.data;
                  for (let file in fileList) {
                    if (fileList[file].Direction == 2) {
                      //TODO:撤单
                      console.log("=>开始撤单:"+fileList[file].id);
                      await this.$axios.delete("/api/v1.0/orders/"+fileList[file].id, {
                        params: params
                      })
                        .then(async res => {
                          console.log("==>撤单成功:" + res.data);
                        })
                        .catch(err => {
                          console.log("==>撤单失败:" + err.data);
                        });
                    }
                  }
                  //查询交易结果
                  //TODO:查询今日委托
                  await this.$axios.get("/api/v1.0/orders", {
                    params: params
                  }).then(async res => {
                    console.log("======>查询今日委托成功");
                    console.log("======>委托结果转为数组");
                    let jrwt = this.getTableToArry(res.data);
                    for (let file in fileList) {
                      if (fileList[file].Direction == 2) {
                        for (let key in jrwt) {
                          if((fileList[file].id === jrwt[key].合同编号 || fileList[file].id === jrwt[key].委托编号) && jrwt[key].委托数量 - jrwt[key].成交数量 > 0  ){
                            console.log("卖出订单号="+fileList[file].id);
                            //TODO:下单卖出
                            let trans_amount = jrwt[key].委托数量 - jrwt[key].成交数量;
                            let priceType = 4;//深圳
                            if (fileList[file].MarketType === 1) { //沪市=转现
                              priceType = 6;
                            }
                            let params = {
                              action: 'trans',
                              symbol: fileList[file].StockId,
                              type: 'MARKET',
                              priceType: priceType,
                              amount: trans_amount,
                              url: trans_address + "/api/v1.0/orders?client=*:" + account,
                            };
                            await axios.get(server_address + '/zzb-server/transPost', {
                              params
                            })
                              .then(res => {
                                if (res) {
                                  console.log("重新卖出成功:" + "股票代码:" + fileList[file].StockId + "卖出数量:" + trans_amount + "返回信息:" + res.data);
                                }
                              })
                              .catch(err => {
                                console.log(err.data)
                              });
                            break;
                          }
                        }
                      }
                    }
                  })
                    .catch(err => {
                      console.log("==>查询今日委托失败:" + err.data);
                    });
                    //TODO:查询今日委托
                    // await this.$axios.get("/api/v1.0/orders", {
                    //   params: params
                    // }).then(async res => {
                    //     console.log("======>查询今日委托成功");
                    //     console.log("======>委托结果转为数组");
                    //     let jrwt = this.getTableToArry(res.data);
                    //     console.log("=======>遍历数组查找所有[操作=卖出]");
                    //     for (let key in jrwt) {
                    //       console.log("委托编号"+jrwt[key].委托编号+jrwt[key].合同编号+"证券代码:" + jrwt[key].证券代码 + "操作:" + jrwt[key].操作 + "委托数量:" + jrwt[key].委托数量 + "成交数量:" + jrwt[key].成交数量+ "委托价格:" + jrwt[key].委托价格);
                    //       //TODO:通达信和同花顺参数不一样,目前按照通达信格式
                    //       if (jrwt[key].委托数量 - jrwt[key].成交数量 > 0) {
                    //         //TODO:真实 jrwt[key].操作==='卖出'&& jrwt[key].委托数量-jrwt[key].成交数量>0
                    //         console.log("这个要注意" + jrwt[key].证券代码);
                    //         for (let file in fileList) {
                    //           //TODO: 真实条件 fileList[file].StockId===jrwt[key].证券代码&&fileList[file].Direction===2&&fileList[file].Amount===jrwt[key].委托数量
                    //           if (fileList[file].StockId === jrwt[key].证券代码 && fileList[file].Direction == 2 &&fileList[file].id==jrwt[key].委托数量) {
                    //             //TODO:撤单
                    //             console.log("=>开始撤单:"+jrwt[key].委托编号+jrwt[key].合同编号);
                    //             await this.$axios.delete("/api/v1.0/orders/"+jrwt[key].委托编号, {
                    //               params: params
                    //             })
                    //               .then(async res => {
                    //                 console.log("==>撤单成功:" + res.data);
                    //               })
                    //               .catch(err => {
                    //                 console.log("==>撤单失败:" + err.data);
                    //               });
                    //             console.log("就是它要重新卖掉" + fileList[file].StockId);
                    //             let trans_amount = jrwt[key].委托数量 - jrwt[key].成交数量;
                    //             let priceType = 4;//深圳
                    //             if (fileList[file].MarketType === 1) { //沪市=转现
                    //               priceType = 6;
                    //             }
                    //             //TODO:下单卖出
                    //             let params = {
                    //               action: 'trans',
                    //               symbol: fileList[file].StockId,
                    //               type: 'MARKET',
                    //               priceType: priceType,
                    //               amount: trans_amount,
                    //               url: trans_address + "/api/v1.0/orders?client=*:" + account,
                    //             };
                    //             await axios.get(server_address + '/zzb-server/transPost', {
                    //               params
                    //             })
                    //               .then(res => {
                    //                 if (res) {
                    //                   console.log("重新卖出成功:" + "股票代码:" + fileList[file].StockId + "卖出数量:" + trans_amount + "返回信息:" + res.data);
                    //                 }
                    //               })
                    //               .catch(err => {
                    //                 console.log(err.data)
                    //               });
                    //             break;
                    //           }
                    //         }
                    //       }
                    //     }
                    //     console.log("====>数据读取成功");
                    //   })
                    //   .catch(err => {
                    //   })

                })
                .catch(err => {
                  console.log("===>读取文件失败:" + err.data);
                })

        }
			},
      /**
       * 转为数组存储
       **/
			getTableToArry(arr) {
				let _result = [];
				let columns = arr.dataTable.columns;
				let rows = arr.dataTable.rows;
				for (let i = 0; i < rows.length; i++) {
					let _row = {};
					for (let l = 0; l < rows[i].length; l++) {
						_row[columns[l]] = rows[i][l];
					}
					_result.push(_row)
				}
				return _result;
			},
			/**
			 * 撤单
			 **/

			doDeleteRequest: function(action_type, params) {
				if (params == null)
					params = {
						'client': '*:' + this.accounts_value
					};
				this.$axios.delete("/api/v1.0/" + action_type, {
						params: params
					})
					.then(res => {
						console.log(res.data);
						this.result = res.data;
					})
					.catch(err => {
						this.result = err.data;
					})
			},
			/**
			 * 更改状态
			 **/

			doPatchRequest: function(action_type, params) {
				if (params == null)
					params = {
						'client': '*:' + this.accounts_value
					};
				this.$axios.patch("/api/v1.0/" + action_type, {
						params: params
					})
					.then(res => {
						this.result = res.data;
						this.resultArr.push(res.data);
					})
					.catch(err => {
						this.result = err.data;
					})
			},

		},
    computed:{
      chooseAccount:function () {
        let chooseAccount = [];
        for(let i=0;i<this.accounts_value.length;i++){
          for(let account in this.accounts_typeList){
            if(this.accounts_typeList[account].value===this.accounts_value[i]){
              chooseAccount.push(this.accounts_typeList[account]);
            }
          }
        }
        return chooseAccount;
      },
      fileListRead:function () {
        let that = this;
        for(let i=0;i<that.fileList.length;i++){
          if(that.fileList[i].Direction==1){
            that.fileList[i].Direction='买入';
          }else if(that.fileList[i].Direction==2){
            that.fileList[i].Direction='卖出';
          }else if(that.fileList[i].Direction==3){
            that.fileList[i].Direction='预卖';
          }
          if(that.fileList[i].PriceType==1){
            that.fileList[i].PriceType='限价';
          }else if(that.fileList[i].PriceType==2){
            that.fileList[i].PriceType='市价';
          }
          if(that.fileList[i].MarketType==1){
            that.fileList[i].MarketType='沪A';
          }else if(that.fileList[i].MarketType==2){
            that.fileList[i].MarketType='深A';
          }
        }
        return that.fileList;
      }
    },
		created() {
			this.getOrgCode();
		},
		filters: {},
	}
</script>

<style lang="less" rel="stylesheet/less">
	@import "assets/reset.css";
	@import "assets/index";

	#app {
		width: 100%;
		height: 100%;
	}
</style>
