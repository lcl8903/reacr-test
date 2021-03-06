import React, {useState, useEffect} from 'react';
import {ConfigProvider} from 'antd';
import {Helmet} from 'react-helmet';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn'; // 解决antd日期相关组件国际化问题
import {ComponentProvider, Loading} from '@ra-lib/components';
import AppRouter from './router/AppRouter';
import {APP_NAME, CONFIG_HOC, IS_MOBILE} from 'src/config';
import {store} from 'src/models';
import {Provider} from 'react-redux';
import './App.less';
import theme from 'src/theme.less';
import {getLoginUser, setLoginUser} from 'src/commons';
import getMenus, {getPermissions} from 'src/menus';

// 设置语言
moment.locale('zh-cn');

// 设置 Modal、Message、Notification rootPrefixCls。
ConfigProvider.config({
    prefixCls: theme.antPrefix,
});

export default function App(props) {
    const {children} = props;
    const [loading, setLoading] = useState(true);
    const [menus, setMenus] = useState([]);

    // 一些初始化工作
    useEffect(() => {
        (async () => {
            try {
                const loginUser = getLoginUser();

                // 用户存在，获取菜单
                if (loginUser) {
                    const menus = await getMenus();
                    loginUser.permissions = await getPermissions();
                    setLoginUser(loginUser);
                    setMenus(menus);
                }
                setLoading(false);
            } catch (e) {
                setLoading(false);
                throw e;
            }
        })();
    }, []);

    return (
        <Provider store={store}>
            <ConfigProvider locale={zhCN} prefixCls={theme.antPrefix}>
                <Helmet title={APP_NAME}/>
                {loading ? (<Loading progress={false} spin/>) : null}

                <ComponentProvider
                    prefixCls={theme.raLibPrefix}
                    layoutPageOtherHeight={CONFIG_HOC.pageOtherHeight}
                    isMobile={IS_MOBILE}
                >
                    {children ? children : <AppRouter menus={menus}/>}
                </ComponentProvider>
            </ConfigProvider>
        </Provider>
    );
}

