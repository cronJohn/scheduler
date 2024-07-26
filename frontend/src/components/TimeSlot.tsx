import { Component } from 'solid-js';
import { mtr } from '../utils/conv';

export const TimeSlot: Component<{
    id: number;
    clockIn: string;
    clockOut: string;
    openModal: () => void;
    onEditFn: (id: number, clockIn: string, clockOut: string) => void;
}> = (props) => {
    const handleEdit = () => {
        props.openModal();
        props.onEditFn(props.id, props.clockIn, props.clockOut);
    }

    return (
    <div class='relative nm p-4 mb-4 rounded'>
      <div class='flex justify-between items-center gap-8'>
        <div>
          <p class='text-xl my-0'>In:</p>
          <p class='text-lg my-0'>{mtr(props.clockIn)}</p>
        </div>
        <div>
          <p class='text-xl my-0'>Out:</p>
          <p class='text-lg my-0'>{mtr(props.clockOut)}</p>
        </div>
      </div>
      <button
        onClick={handleEdit}
        class='absolute top-1 right-1 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-600 transition'
      >
        <span>✏️</span>
      </button>
    </div>
  );
};

