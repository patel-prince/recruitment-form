import { createSlice } from '@reduxjs/toolkit'

interface CounterState {
  count: number
}

const initialState: CounterState = {
  count: 0
}

const counterSlide = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incremented(state) {
      state.count += 1
    }
  }
})

export const { incremented } = counterSlide.actions
export const counterReducer = counterSlide.reducer
