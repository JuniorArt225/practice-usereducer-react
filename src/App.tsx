import { useEffect, useReducer } from 'react'
import './App.css'

interface State {
  pause : boolean,
  play : boolean,
  stop : boolean,
  time : number
}

type ChronoAction = {type : "stop"} | {type : "pause"} | {type : "play"} | {type : "inc"}

const initial = {
  pause : true,
  play : false,
  stop : true,
  time : 0
}

function reducer(state : State,action : ChronoAction) : State {
  switch(action.type){
    case "stop":
      return initial;
    case "pause":
      return {...state,pause : true, play:false};
    case "play":
      return {...state,play: true, pause :false, stop:false}
    case "inc":
      return {...state,time : state.time + 1}
    default : 
      throw new Error("Action inconnue");
  }
}

const formater = (value : number) : string => value.toString().padStart(2,"0");

function App() {
  const [timer,dispatch] = useReducer(reducer,initial)

  const minute = formater(Math.floor((timer.time % 360000) / 6000));
  const seconde = formater(Math.floor((timer.time % 6000) / 100));
  const milliseconde = formater(timer.time % 100);

  useEffect(()=>{
    let inter : number | null = null
    if(timer.play){
      inter = setInterval(()=>{
        dispatch({type:"inc"});
      },10)
    }
    return ()=>{
      clearInterval(inter ?? 0)
    }
  },[timer.play])

  return (
    <>
      <div>Mon super chronomètre</div>
      <div className='chrono'>{minute} : {seconde} : {milliseconde}</div>
      <div className='btn-groups'>
        <button disabled={timer.play} onClick={()=>dispatch({type:"play"})}>Start</button>
        <button disabled={timer.pause} className='btn' onClick={()=>dispatch({type:"pause"})}>Pause</button>
        <button disabled={timer.stop} onClick={()=>dispatch({type:"stop"})}>Stop</button>
      </div>
    </>
  )
}

export default App
