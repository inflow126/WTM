import { Button, Col, Divider, Drawer, Modal, Row, Spin } from 'antd';
import { ColProps } from 'antd/lib/col';
import { DrawerProps } from 'antd/lib/drawer';
import { ModalProps } from 'antd/lib/modal';
import { DesError } from 'components/decorators';
import GlobalConfig from 'global.config';
import lodash from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import './style.less';
/**
 *  详情 窗口 
 *  根据 类型 显示不同的 窗口
 */
@DesError
export class InfoShell extends React.Component<DrawerProps | ModalProps, any> {
    render() {
        if (GlobalConfig.infoType === "Modal") {
            const onClose = (this.props as DrawerProps).onClose
            const onCancel = (e) => { onClose && onClose(e) }
            return <Modal
                width={GlobalConfig.infoTypeWidth}
                destroyOnClose
                onCancel={onCancel}
                {...this.props as any}
                footer={<div className="data-view-modal-footer"></div>}
                className={`data-view-modal ${this.props.className}`}>
                {this.props.children}
            </Modal>
        }
        return <Drawer
            width={GlobalConfig.infoTypeWidth}
            destroyOnClose
            {...this.props as any}
            className={`data-view-drawer ${this.props.className}`}>
            {this.props.children}
        </Drawer>
    }
}

/**
 * Items 外壳
 */
@DesError
@observer
export class InfoShellFooter extends React.Component<{ loadingEdit: boolean, onCancel?: () => void, submit?: boolean }, any> {
    render() {
        const childrens = React.Children.toArray(this.props.children).map((node: any) => {
            try {
                // 没有嵌套 col 的自动添加 嵌套的 解除
                if (lodash.isEqual(lodash.toLower(node.type.name), lodash.toLower("FormItem"))) {
                    return <InfoShellCol key={node.key}>
                        {node}
                    </InfoShellCol>
                }
                return node
            } catch (error) {
                return node
            }
        });
        return <>
            <div className="data-view-form-item">
                <Spin tip="Loading..." spinning={this.props.loadingEdit}>
                    <Row type="flex">
                        {childrens}
                    </Row>
                </Spin>
            </div>
            <div className="data-view-form-btns" >
                <Button onClick={() => this.props.onCancel && this.props.onCancel()} >取消 </Button>
                {this.props.submit && <>
                    <Divider type="vertical" />
                    <Button loading={this.props.loadingEdit} type="primary" htmlType="submit"  >提交 </Button>
                </>}
            </div>
        </>
    }
}
/**
 * Items 外壳
 */
export class InfoShellCol extends React.Component<ColProps, any> {
    columnCount = GlobalConfig.infoColumnCount || 1;
    render() {
        const colSpan = 24 / this.columnCount;//每列 值
        return <Col span={colSpan} {...this.props}>
            {this.props.children}
        </Col>
    }
}

/**
* 转换 value 值
* @param value value 值
* @param showType 转换类型 span 情况下 非基础类型。需要格式为字符串。不然 react 会报错
*/
export function toValues(value: any, showType: "value" | "span" = "value") {
    // 检查 value 是否是 null 或者 undefined。
    if (lodash.isNil(value)) {
        return
    }
    // 检查数字类型 
    // if (lodash.isNumber(value)) {
    //     return lodash.toString(value)
    // }
    // 检查其他
    if (lodash.isArray(value) || lodash.isObject(value)) {
        return lodash.toString(value)
    }
    return value
}