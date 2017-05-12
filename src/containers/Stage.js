import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionCreators as stageActions } from '../ducks/modules/stage';

import { NameGenerator } from './Interfaces';

/**
  * Render a protocol interface based on protocol info and index
  */
class Stage extends Component {
  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }

  handleNext() {
    this.props.next();
  }

  handlePrevious() {
    this.props.previous();
  }

  render() {
    // TODO: Load dynamically based on protocol using some kind of service?
    const CurrentInterface = NameGenerator;

    const {
      handleNext,
      handlePrevious,
      props: {
        stage,
      },
    } = this;

    return (
      <div className="stage">
        <div className="stage__control">
          <button className="stage__control-button stage__control-button--back" onClick={handlePrevious}>Back</button>
        </div>
        <div className="stage__interface">
          <CurrentInterface config={stage} />
        </div>
        <div className="stage__control">
          <button className="stage__control-button stage__control-button--next" onClick={handleNext}>Next</button>
        </div>
      </div>
    );
  }
}

Stage.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  stage: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  // TODO: http://redux.js.org/docs/recipes/ComputingDerivedData.html
  const stage = state.protocol.protocolConfig.stages[state.session.stage.index];

  return {
    stage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    next: bindActionCreators(stageActions.next, dispatch),
    previous: bindActionCreators(stageActions.previous, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
