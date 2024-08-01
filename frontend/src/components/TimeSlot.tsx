import { Component } from 'solid-js';
import { mtr } from '../utils/conv';
import { createStore } from 'solid-js/store';
import { TimeEntry } from '../utils/types';

export const TimeSlot: Component<{
    openModal: () => void;
    getStateFn: () => TimeEntry
    updateFn: (data: TimeEntry) => void;
}> = (props) => {
    const [state] = createStore<TimeEntry>({
        id: props.getStateFn().id,
        clockIn: props.getStateFn().clockIn,
        clockOut: props.getStateFn().clockOut,
    })
    return (
    <div class='relative nm p-4 rounded'>
      <div class='flex justify-between items-center gap-8'>
        <div>
          <p class='text-xl my-0'>In:</p>
          <p class='text-lg my-0'>{mtr(state.clockIn)}</p>
        </div>
        <div>
          <p class='text-xl my-0'>Out:</p>
          <p class='text-lg my-0'>{mtr(state.clockOut)}</p>
        </div>
      </div>
      <button
        onClick={() => {props.openModal(); props.updateFn(state);}}
        class='absolute top-1 right-1 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-600 transition'
      >
        <span>✏️</span>
      </button>
    </div>
  );
};

