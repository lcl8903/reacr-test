import {useState} from 'react';
import {Form, Row, Col, Card, Button} from 'antd';
import {ModalContent, FormItem, Content} from '@ra-lib/components';
import {validateRules} from '@ra-lib/util';
import {useDebounceValidator} from '@ra-lib/hooks';
import config from 'src/commons/config-hoc';
import RoleSelectTable from 'src/pages/role/RoleSelectTable';
import {IS_MOBILE} from 'src/config';

export default config({
    modal: {
        title: props => {
            if (props?.record?.isDetail) return '查看用户';

            return props.isEdit ? '编辑用户' : '创建用户';
        },
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const {record, isEdit, onOk, onCancel} = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const isDetail = record?.isDetail;

    // 编辑时，查询详情数据
    props.ajax.useGet('/users/:id', {id: record?.id}, [], {
        mountFire: isEdit,
        setLoading,
        formatResult: res => {
            if (!res) return;
            form.setFieldsValue(res);
        },
    });
    const {run: save} = props.ajax.usePost('/users', null, {setLoading, successTip: '创建成功！'});
    const {run: update} = props.ajax.usePut('/users', null, {setLoading, successTip: '修改成功！'});
    const {run: fetchUserByAccount} = props.ajax.useGet('/userByAccount');

    async function handleSubmit(values) {
        const params = {
            ...values,
        };

        if (isEdit) {
            await update(params);
        } else {
            await save(params);
        }

        onOk();
    }

    const checkAccount = useDebounceValidator(async (rule, value) => {
        if (!value) return;

        const user = await fetchUserByAccount({account: value});
        if (!user) return;

        const id = form.getFieldValue('id');
        if (isEdit && user.id !== id && user.account === value) throw Error('账号不能重复！');
        if (!isEdit && user.account === value) throw Error('账号不能重复！');
    });

    const disabled = isDetail;
    const layout = {
        labelCol: {flex: '100px'},
        disabled,
    };
    const colLayout = {
        xs: {span: 24},
        sm: {span: 12},
    };
    return (
        <ModalContent
            loading={loading}
            okText="保存"
            onOk={() => form.submit()}
            cancelText="重置"
            onCancel={() => form.resetFields()}
            fullScreen={IS_MOBILE}
            footer={disabled ? <Button onClick={onCancel}>关闭</Button> : undefined}
        >
            <Form
                form={form}
                name="roleEdit"
                onFinish={handleSubmit}
            >
                {isEdit ? <FormItem hidden name="id"/> : null}
                <Row gutter={8}>
                    <Col {...colLayout} style={{marginBottom: IS_MOBILE ? 16 : 0}}>
                        <Card title="基础信息">
                            <Content fitHeight={!IS_MOBILE} otherHeight={160}>
                                <FormItem
                                    {...layout}
                                    label="账号"
                                    name="account"
                                    required
                                    noSpace
                                    rules={[
                                        {validator: checkAccount},
                                    ]}
                                />
                                <FormItem
                                    {...layout}
                                    label="密码"
                                    name="password"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="姓名"
                                    name="name"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="邮箱"
                                    name="email"
                                    rules={[validateRules.email()]}
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="手机号"
                                    name="mobile"
                                    rules={[validateRules.mobile()]}
                                    required
                                    noSpace
                                />
                            </Content>
                        </Card>
                    </Col>
                    <Col {...colLayout}>
                        <Card title="角色配置" bodyStyle={{padding: 0}}>
                            <FormItem
                                {...layout}
                                name="roleIds"
                            >
                                <RoleSelectTable
                                    fitHeight={!IS_MOBILE}
                                    otherHeight={200}
                                    getCheckboxProps={() => ({disabled})}
                                />
                            </FormItem>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </ModalContent>
    );
});
