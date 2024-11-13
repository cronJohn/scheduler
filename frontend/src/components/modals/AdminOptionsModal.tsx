import Modal from "@lutaok/solid-modal";
import { Component, createSignal} from "solid-js";
import { getDateISO } from "../../utils/helper";
import { fmtDate } from "../../utils/conv";
import { deleteAllSchedules, deleteSchedulesBefore, shiftAllSchedules } from "../../utils/api";
import { useNavigate } from "@solidjs/router";


export const AdminOptionsModal: Component<{
    isModalOpen: () => boolean;
    closeModal: () => void;
    refetchFn: () => void;
}> = (props) => {

    const navigate = useNavigate();

    const [isConfirmModalOpen, setIsConfirmModalOpen] = createSignal(false);
    const [confirmationText, setConfirmationText] = createSignal("");

    const [shiftDays, setShiftDays] = createSignal<number>(7);
    const [deleteBeforeDate, setDeleteBeforeDate] = createSignal<string>(getDateISO());

    const [currentAction, setCurrentAction] = createSignal<string>();

    const callbackMap: { [key: string]: () => void } = {
        "shift": () => {
            shiftAllSchedules(`${shiftDays() < 0 ? '' : '+' }${shiftDays()} days`, navigate)
            props.refetchFn();
            props.closeModal();
        },
        "deleteAll": () => {
            deleteAllSchedules(navigate);
            props.refetchFn();
            props.closeModal();
        },
        "deleteBefore": () => {
            deleteSchedulesBefore(deleteBeforeDate(), navigate);
            props.refetchFn();
            props.closeModal();
        },
    }

    const alertUser = (displayText: string) => {
        setConfirmationText(displayText);
        setIsConfirmModalOpen(true);
    }

    return (
        <Modal
            isOpen={props.isModalOpen()}
            onCloseRequest={props.closeModal}
            closeOnOutsideClick
            overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}
        >
            <h1 class="font-norm text-3xl text-center">Admin functions</h1>
            <div class="flex flex-col gap-4">
                {/* Shift all schedules by */}
                <div class="flex gap-2" onMouseEnter={() => setCurrentAction("shift")}>
                    <button class="font-norm text-xl flex-grow-1 rounded bg-dark px-4 py-2 bb-primary bt"
                    onClick={() => {alertUser(`Are you sure you want to shift all schedules by ${shiftDays() || ""} days?`)}}>Shift all schedules by</button>
                    <input type="number" value={shiftDays()} class="py-4 px-2 h-48px max-w-65px bb-primary rounded bg-offDark text-2xl text-white text-center"
                    onChange={(e) => setShiftDays(Number(e.currentTarget.value))} />
                    <span class="font-norm my-auto text-xl text-light">days</span>
                </div>

                {/* Delete entire DB */}
                <button class="font-norm text-xl rounded bg-dark px-4 py-2 bb-primary bt" onMouseEnter={() => setCurrentAction("deleteAll")}
                onClick={() => {alertUser(`Are you sure you want to delete all schedules?`)}}>Delete entire DB</button>

                {/* Delete all schedules before */}
                <div class="flex gap-2" onMouseEnter={() => setCurrentAction("deleteBefore")}>
                    <button class="font-norm text-xl rounded bg-dark px-4 py-2 bb-primary bt"
                    onClick={() => {alertUser(`Are you sure you want to delete all schedules before ${fmtDate(deleteBeforeDate() || "")}?`)}}>Delete all schedules before</button>
                    <input type="date" value={deleteBeforeDate()} class="py-4 px-2 h-48px bb-primary rounded bg-offDark text-2xl text-white text-center"
                    onChange={(e) => setDeleteBeforeDate(e.currentTarget.value)} />
                </div>
            </div>
            {/* Confirmation Modal */}
            <Modal isOpen={isConfirmModalOpen()} onCloseRequest={() => setIsConfirmModalOpen(false)} closeOnOutsideClick overlayStyle={{ "background-color": 'rgba(14, 14, 14, 0.7)' }}>
                <div class="w-360px">
                    <h2 class='font-norm font-medium text-3xl text-light text-center'>Confirm</h2>
                    <p class="font-norm text-xl text-center">{confirmationText()}</p>
                    <div class="flex justify-center items-center gap-4 text-2xl text-light color-light text-center">
                        <button class="font-norm text-primary text-xl rounded bg-dark px-4 py-2 bb-primary bt" onClick={() => {callbackMap[currentAction() || ""](); setIsConfirmModalOpen(false)}}>Yes</button>
                        <button class="font-norm text-xl rounded bg-dark px-4 py-2 bb-primary bt" onClick={() => setIsConfirmModalOpen(false)}>No</button>
                    </div>
                </div>
            </Modal>
        </Modal>
    );
};


