import React from 'react';
import { connect } from 'react-redux';
import { selectSeries } from '@store/series';

const mapStateToProps = state => ({
  series: selectSeries(state),
});

const mapDispatchToProps = {};

function Browse() {
  return (
    <React.Fragment>
      Browse...
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Browse);
