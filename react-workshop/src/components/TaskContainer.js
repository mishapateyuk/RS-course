import React from 'react';

class TaskContainer extends React.Component {
    render() {
        const task = this.props.task;
        return (
                <div className="task-container">
                    <h2>{task.name}</h2>
                    <div>{task.hours}</div>
                    <a className="left" onClick={() => this.props.toLeft(task)}></a>
                    <a className="right" onClick={() => this.props.toRight(task)}></a>
                </div>
            );
    }
}


export {TaskContainer};