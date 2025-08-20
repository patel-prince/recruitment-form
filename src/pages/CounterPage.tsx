import { incremented } from '../app/counter/counterSlide'
import { useAppDispatch, useCounterState } from '../app/hooks'

const CounterPage = () => {
  const dispatch = useAppDispatch()
  const { count } = useCounterState()

  return <button onClick={() => dispatch(incremented())}>Count: {count}</button>
}
export default CounterPage
