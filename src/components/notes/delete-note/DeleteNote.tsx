import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import Note from "../../../interfaces/Note";
import { RootState } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { deleteNote } from "../../../store/notes/Notes.slice";
import "./DeleteNote.scss";

type DeleteNoteProps = {
    isDeleteNote: boolean;
    noteId: string;
    resetData: Function
}

const DeleteNote = ({ isDeleteNote, noteId, resetData }: DeleteNoteProps) => {
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const {notes} = useAppSelector((state: RootState) => state.notes);
    const dispatch = useAppDispatch();
    const [selectedData,setSelectedData] = useState<Note>();

    useEffect(() => {
        if(isDeleteNote) {
            const selectedNote = notes?.find((item: any) => item.id === noteId);
            setSelectedData(selectedNote);
            setIsDelete(isDeleteNote);
        }
        return () => {
            setIsDelete(false);
            setSelectedData(undefined);
        }
    }, [isDeleteNote]);

    const handleDeleteNote = () => {
        dispatch(deleteNote(noteId));
        setIsDelete(false);
        resetData();
    };
    const handleCancel = () => {
        resetData();
    }

    return (
        <>
            <Dialog open={isDelete}>
                <DialogTitle className="dialog-title">Delete Note</DialogTitle>
                <DialogContent>
                    <span>{`Are you sure want to delete this note ${selectedData?.title}?`}</span>
                </DialogContent>
                <DialogActions className="action-buttons-container">
                    <Button variant="contained" onClick={handleCancel} className='cancel-button'>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleDeleteNote} className='delete-button'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default DeleteNote;