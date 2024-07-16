import React, { useState } from 'react';

function TrelloWebsite() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Startup Ipsilon Spring',
      date: '4 Jun',
      status: 'Doing'
    },
    {
      id: 2,
      title: 'Board Invite',
      date: '3 Jun',
      status: 'To Do'
    },
    {
      id: 3,
      title: 'Create Pitch Deck',
      date: '3 Jun',
      status: 'To Do'
    },
    {
      id: 4,
      title: 'Ask Client X',
      date: '3 Jun',
      status: 'To Do'
    },
    {
      id: 5,
      title: 'Link',
      date: '3 Jun',
      status: 'To Do'
    },
    {
      id: 6,
      title: 'Develop a Tic toc tac app',
      status: 'Done'
    },
    {
      id: 7,
      title: 'Stay healthy',
      status: 'Done'
    },
    {
      id: 8,
      title: 'Finish Design course',
      status: 'Done'
    },
    {
      id: 9,
      title: 'New e-commerce for desi',
      date: '27 Jun',
      status: 'Ideas'
    }
  ]);

  return (
    <div>
      <div className="navbar">
        <div className="title">Trello</div>
        <div className="buttons">
          <button>Board Invite</button>
          <button>Board Update</button>
          <button>Board Delete</button>
          <button>Board Create</button>
        </div>
      </div>

      <div className="container">
        <div className="column">
          <h3>Doing</h3>
          {tasks.filter(task => task.status === 'Doing').map(task => (
            <div key={task.id} className="task">
              <h4>{task.title}</h4>
              <p>{task.date}</p>
            </div>
          ))}
        </div>
        <div className="column">
          <h3>To Do</h3>
          {tasks.filter(task => task.status === 'To Do').map(task => (
            <div key={task.id} className="task">
              <h4>{task.title}</h4>
              <p>{task.date}</p>
            </div>
          ))}
        </div>
        <div className="column">
          <h3>Done</h3>
          {tasks.filter(task => task.status === 'Done').map(task => (
            <div key={task.id} className="task">
              <h4>{task.title}</h4>
              <p>{task.date}</p>
            </div>
          ))}
        </div>
        <div className="column">
          <h3>Ideas</h3>
          {tasks.filter(task => task.status === 'Ideas').map(task => (
            <div key={task.id} className="task">
              <h4>{task.title}</h4>
              <p>{task.date}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="calendar">
        <h3>Calendar</h3>
        <div> {/* 달력 위젯을 여기에 추가할 수 있습니다 */}</div>
      </div>
    </div>
  );
}

export default TrelloWebsite;
