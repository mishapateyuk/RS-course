import React from 'react';
import {TaskContainer} from './TaskContainer.js';

class DoneContainer extends React.Component {

    render() {
        const tasks = this.props.tasks;
        return (
                <div className="task-wrapper">
                    {
                        tasks.map((item)=>{
                            return <TaskContainer toRight={this.props.toRight} toLeft={this.props.toLeft} task={item}/>
                        })
                    }
                </div>
            );
    }
}


export {DoneContainer};