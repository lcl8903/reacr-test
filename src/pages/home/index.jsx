// import {Redirect} from 'react-router-dom';
import config from 'src/commons/config-hoc';
import {Button} from 'antd';
import {PageContent} from '@ra-lib/components';
import styles from './style.less';

export default config({
    path: '/',
    title: '首页',
})(function Home(props) {

    // 如果其他页面作为首页，直接重定向，config中不要设置title，否则tab页中会多个首页
    // return <Redirect to="/users"/>;

    return (
        <PageContent className={styles.root}>
            <h1>首页</h1>
            {process.env.REACT_APP_MOCK ? (
                <Button onClick={() => props.ajax.post('/initDB', null, {successTip: '数据库重置成功！'})}>重置数据库</Button>
            ) : null}
        </PageContent>
    );
});
