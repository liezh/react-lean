/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, {useEffect, useState} from 'react';
import { Link, useIntl, connect, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
// import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/logo.svg';
import AuthTabs from "@/components/AuthTabs";


/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 蚂蚁金服体验技术部出品`}
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const TabsLayout = (props) => {

  const {
    dispatch,
    // children,
    settings,
    tabs,
  } = props;

  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const {formatMessage} = useIntl();

  const handleMenuItemClick = (tab) => {
    dispatch({
      type: 'tabs/add',
      payload: tab,
    });
    dispatch({
      type: 'tabs/setActivityKey',
      payload: tab.key,
    });
    console.log("aaaaaaa", tabs.list);
  };

  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        const tab = {
          key: menuItemProps.key,
          content: menuItemProps.component,
          title: menuItemProps.name,
        };
        return <Link to={menuItemProps.path} onClick={() => handleMenuItemClick(tab)}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent/>}
      {...props}
      {...settings}
    >
      {console.log("www", Array.isArray(tabs))}
      <AuthTabs tabs={tabs.list} route={props.route} activeKey={tabs.activityKey}/>
    </ProLayout>
  )
};

export default connect(({ global, user, settings, tabs }) => ({
  collapsed: global.collapsed,
  user,
  settings,
  tabs
}))(TabsLayout);
