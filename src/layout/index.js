import React from 'react';
import classnames from 'classnames';
import css from './index.less';

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    const cls = classnames([css.layout]);
    return (
      <div className={cls}>
        Layout

      </div>
    );
  }
}
export default Layout;
