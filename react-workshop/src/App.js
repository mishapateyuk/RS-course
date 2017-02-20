import React, { Component } from 'react';
import './App.css';
import {TodoContainer} from './components/TodoContainer.js';
import {DoneContainer} from './components/DoneContainer.js';
import {InProgressContainer} from './components/InProgressContainer.js';
import {TestingContainer} from './components/TestingContainer.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.toLeft = this.toLeft.bind(this);
    this.toRight = this.toRight.bind(this);
    this.state = {
      toDoTasks: [
        {
          name: 'First-task',
          hours: 'Need 2 hours',
          status: 'doing'
        }
      ],
      progressTasks: [
        {
          name: 'Second-task',
          hours: 'Need 17 hours',
          status: 'progress'
        }
      ],
      testingTasks: [
        {
          name: 'Third-task',
          hours: 'Need 3 hours',
          status: 'testing'
        }
      ],
      doneTasks: [
        {
          name: 'Fourth-task',
          hours: 'Need 6 hours',
          status: 'done'
        }
      ],
    }
  }

  toLeft(item) {
    if (item.status === 'progress') {
      const index =  this.state.progressTasks.indexOf(item);
      const currentState = this.state;
      item.status = 'doing';
      currentState.toDoTasks.push(currentState.progressTasks.splice(index, 1)[0]);
      this.setState(currentState);
      this.render();
      return;
    }
    if (item.status === 'testing') {
      const index =  this.state.testingTasks.indexOf(item);
      const currentState = this.state;
      item.status = 'progress';
      currentState.progressTasks.push(currentState.testingTasks.splice(index, 1)[0]);
      this.setState(currentState);
      this.render();
      return;
    }
    if (item.status === 'done') {
      const index =  this.state.doneTasks.indexOf(item);
      const currentState = this.state;
      item.status = 'testing';
      currentState.testingTasks.push(currentState.doneTasks.splice(index, 1)[0]);
      this.setState(currentState);
      this.render();
      return;
    }
  }

  toRight(item) {
    if (item.status === 'doing') {
      const index =  this.state.toDoTasks.indexOf(item);
      const currentState = this.state;
      item.status = 'progress';
      currentState.progressTasks.push(currentState.toDoTasks.splice(index, 1)[0]);
      this.setState(currentState);
      this.render();
      return;
    }
    if (item.status === 'progress') {
      const index =  this.state.progressTasks.indexOf(item);
      const currentState = this.state;
      item.status = 'testing';
      currentState.testingTasks.push(currentState.progressTasks.splice(index, 1)[0]);
      this.setState(currentState);
      this.render();
      return;
    }
    if (item.status === 'testing') {
      const index =  this.state.testingTasks.indexOf(item);
      const currentState = this.state;
      item.status = 'done';
      currentState.doneTasks.push(currentState.testingTasks.splice(index, 1)[0]);
      this.setState(currentState);
      this.render();
      return;
    }
  }

  render() {
    return (
      <div>
        <TodoContainer toRight={this.toRight} tasks={this.state.toDoTasks}/>
        <InProgressContainer toRight={this.toRight} toLeft={this.toLeft} tasks={this.state.progressTasks}/>
        <TestingContainer toRight={this.toRight} toLeft={this.toLeft} tasks={this.state.testingTasks}/>
        <DoneContainer toLeft={this.toLeft} tasks={this.state.doneTasks}/>
      </div>
    );
  }
}

export default App;
