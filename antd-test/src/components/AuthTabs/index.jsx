import React from 'react';
import {Button, Result, Tabs} from "antd";
import Authorized from "@/utils/Authorized";
import {connect, Link} from "umi";
import {getAuthorityFromRouter} from "@/utils/utils";

const {TabPane} = Tabs;

class AuthTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.activeKey,
      // location: {
      //   pathname: '/',
      // }
    };
  }

  onChange = activeKey => {
    this.setState({activeKey});
  };

  noMatch = () => {
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

  authorized = getAuthorityFromRouter(this.props.route.routes,  '/') || {
    authority: undefined,
  };

  render() {
    return (
      <div>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {console.log("==", this.props.tabs)}
          {console.log("--", this.props.activeKey)}
          {
            this.props.tabs && this.props.tabs.map(t => {
              const Component = t.content;
              return <TabPane tab={t.title} key={t.key}>
                <Authorized authority={this.authorized.authority} noMatch={this.noMatch}>
                  <Component/>
                </Authorized>
              </TabPane>
            })
          }
        </Tabs>
      </div>
    );
  }

}
export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(AuthTabs)
