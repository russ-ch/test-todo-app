import {useState, memo, useCallback} from 'react'


function Child({ onClick, value }) {
  console.log('**** Child render')
  return (
    <div onClick={onClick}>
      {value}
    </div>
  );
}

const MemoChild = memo(Child)

export default function App() {
  const [count, setCount] = useState(0)
  const [value, setValue] = useState(0)

  // const onClick = useCallback(() => {
  //   setValue(prev => prev + 1)
  // }, []);

  const onClick = useCallback(() => {
    setValue(prev => prev + 1)
  }, []);


  return (
    <div>
      <Child value={value} onClick={onClick} />

      <h1>{count}</h1>
      <button onClick={() => setCount(prev => prev + 1)}>change count</button>
    </div>
  );
}
