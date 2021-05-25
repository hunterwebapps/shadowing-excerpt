import React from 'react';
import { connect } from 'react-redux';
import { selectInitFailed } from '@store/startup';

const mapStateToProps = state => ({
  initFailed: selectInitFailed(state),
});

const mapDispatchToProps = {};

function Splash({ initFailed }) {
  return (
    <div>
      {initFailed
        ? 'Failed to Initialize'
        : 'Loading...'
      }
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
