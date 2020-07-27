import React from 'react';
import {Button, Result, Tabs} from "antd";
import Authorized from "@/utils/Authorized";
import {connect, Link} from "umi";
import {getAuthorityFromRouter} from "@/utils/utils";

const {TabPane} = Tabs;

const AuthTabs = (props) => {
  const {
    dispatch,
    tabs,
    route
  } = props;

  const onChange = activeKey => {
    dispatch({
      type: 'tabs/setActivityKey',
      payload: activeKey,
    });
  };

  const noMatch = () => {
    <Result
      status={403}
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary">
          <Link to="/user/login">Go Login</Link>
        </Button>
      }
    />
  };

  const authorized = getAuthorityFromRouter(route.routes,  '/') || {
    authority: undefined,
  };

  return (
    <div>
      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={tabs.activeKey}
        type="editable-card"
        // onEdit={onEdit}
      >
        {console.log(tabs.activityKey)}
        {
          tabs.list && tabs.list.map(t => {
            const Component = t.content;
            return <TabPane tab={t.title} key={t.key}>
              <Authorized authority={authorized.authority} noMatch={noMatch}>
                <Component/>
              </Authorized>
            </TabPane>
          })
        }
      </Tabs>
    </div>
  );
}

export default connect(({ global, settings, tabs }) => ({
  collapsed: global.collapsed,
  settings,
  tabs,
}))(AuthTabs)
