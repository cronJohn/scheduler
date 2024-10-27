import { Component } from 'solid-js';
import { mtr } from '../utils/conv';
import { createStore } from 'solid-js/store';
import { getColorFromString } from '../utils/helper';
import { Schedule } from '../utils/types';

export const TimeSlot: Component<{
    openModal: () => void;
    getStateFn: () => Schedule;
    updateFn: (data: Schedule) => void;
}> = (props) => {
    const [state] = createStore<Schedule>({
        scheduleId: props.getStateFn().scheduleId,
        userId: props.getStateFn().userId,
        role: props.getStateFn().role,
        day: props.getStateFn().day,
        clockIn: props.getStateFn().clockIn,
        clockOut: props.getStateFn().clockOut,
    });

    return (
        <div class='relative nm rounded group flex flex-col'>
            {/* Role section */}
            <div>
                <p class={'text-xl text-dark font-500 m-0 rounded text-center font-norm'} 
                style={{"background-color": getColorFromString(state.role)}}>
                {state.role.toUpperCase()}
                </p>
            </div>
            {/* Time section */}
            <div class='px-3 py-2'>
                <p class='text-lg my-0'>{mtr(state.clockIn)} - {mtr(state.clockOut)}</p>
            </div>
            <button
                onClick={() => { props.openModal(); props.updateFn(state); }}
                class='absolute top-1 right-1 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-600 transition opacity-0 group-hover:opacity-100'
            >
                <span>✏️</span>
            </button>
        </div>
    );
};

